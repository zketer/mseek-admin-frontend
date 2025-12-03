/**
 * 全局错误处理工具
 * 
 * @description 统一管理应用中的错误处理逻辑，提供友好的用户提示
 * @author zlynn
 * @date 2025-11-06
 */

import { message } from 'antd';
import type { AxiosError, AxiosResponse } from 'axios';

/**
 * 错误类型枚举
 */
export enum ErrorType {
  /** 网络错误 */
  NETWORK = 'NETWORK',
  /** 认证错误（401、403） */
  AUTH = 'AUTH',
  /** 业务错误（4xx）*/
  BUSINESS = 'BUSINESS',
  /** 服务器错误（5xx） */
  SERVER = 'SERVER',
  /** 未知错误 */
  UNKNOWN = 'UNKNOWN',
}

/**
 * 错误信息接口
 */
export interface ErrorInfo {
  /** 错误类型 */
  type: ErrorType;
  /** 错误消息 */
  message: string;
  /** HTTP 状态码 */
  code?: number;
  /** 详细信息 */
  details?: any;
  /** 错误发生的上下文 */
  context?: string;
  /** 时间戳 */
  timestamp: number;
}

/**
 * 全局错误处理器类
 */
class GlobalErrorHandler {
  /**
   * 统一错误处理入口
   * @param error 错误对象
   * @param context 错误发生的上下文（如：'UserList.handleDelete'）
   * @returns 解析后的错误信息
   */
  handle(error: Error | AxiosError, context?: string): ErrorInfo {
    const errorInfo = this.parseError(error, context);
    this.logError(errorInfo);
    this.showUserFriendlyMessage(errorInfo);
    return errorInfo;
  }

  /**
   * 解析错误对象
   * @param error 错误对象
   * @param context 错误上下文
   * @returns 错误信息
   */
  private parseError(error: Error | AxiosError, context?: string): ErrorInfo {
    const timestamp = Date.now();
    const axiosError = error as AxiosError;

    // 1. 网络错误（无响应）
    if (this.isNetworkError(axiosError)) {
      return {
        type: ErrorType.NETWORK,
        message: '网络连接失败，请检查您的网络设置',
        context,
        timestamp,
      };
    }

    // 2. 认证错误（401、403）
    if (this.isAuthError(axiosError)) {
      const statusCode = axiosError.response?.status;
      return {
        type: ErrorType.AUTH,
        message: statusCode === 401 ? '登录已过期，请重新登录' : '您没有权限执行此操作',
        code: statusCode,
        context,
        timestamp,
      };
    }

    // 3. 业务错误（400-499，排除401和403）
    if (this.isBusinessError(axiosError)) {
      return {
        type: ErrorType.BUSINESS,
        message: this.getBusinessErrorMessage(axiosError),
        code: axiosError.response?.status,
        details: axiosError.response?.data,
        context,
        timestamp,
      };
    }

    // 4. 服务器错误（500-599）
    if (this.isServerError(axiosError)) {
      return {
        type: ErrorType.SERVER,
        message: '服务器异常，请稍后重试',
        code: axiosError.response?.status,
        details: axiosError.response?.data,
        context,
        timestamp,
      };
    }

    // 5. 未知错误
    return {
      type: ErrorType.UNKNOWN,
      message: error.message || '操作失败，请稍后重试',
      details: error,
      context,
      timestamp,
    };
  }

  /**
   * 判断是否为网络错误
   */
  private isNetworkError(error: AxiosError): boolean {
    return !error.response && Boolean(error.request);
  }

  /**
   * 判断是否为认证错误
   */
  private isAuthError(error: AxiosError): boolean {
    const status = error.response?.status;
    return status === 401 || status === 403;
  }

  /**
   * 判断是否为业务错误
   */
  private isBusinessError(error: AxiosError): boolean {
    const status = error.response?.status;
    return Boolean(status && status >= 400 && status < 500 && status !== 401 && status !== 403);
  }

  /**
   * 判断是否为服务器错误
   */
  private isServerError(error: AxiosError): boolean {
    const status = error.response?.status;
    return Boolean(status && status >= 500);
  }

  /**
   * 获取业务错误消息
   */
  private getBusinessErrorMessage(error: AxiosError): string {
    const response = error.response?.data as any;
    
    // 尝试从响应中提取错误消息
    if (response) {
      // 标准格式：{message: string}
      if (response.message) {
        return response.message;
      }
      // 备选格式：{msg: string}
      if (response.msg) {
        return response.msg;
      }
      // 备选格式：{error: string}
      if (response.error) {
        return response.error;
      }
    }

    // 根据状态码提供默认消息
    const status = error.response?.status;
    switch (status) {
      case 400:
        return '请求参数错误';
      case 404:
        return '请求的资源不存在';
      case 409:
        return '数据冲突，请刷新后重试';
      case 422:
        return '数据验证失败';
      case 429:
        return '请求过于频繁，请稍后重试';
      default:
        return '操作失败，请检查输入后重试';
    }
  }

  /**
   * 显示用户友好的错误提示
   */
  private showUserFriendlyMessage(errorInfo: ErrorInfo): void {
    // ✅ 白名单页面（登录页、注册页等）不显示认证错误提示
    const whiteList = ['/login', '/oauth2/callback', '/user/register', '/user/register-result'];
    const currentPath = window.location.pathname;
    
    switch (errorInfo.type) {
      case ErrorType.AUTH:
        // ✅ 认证错误不在这里显示提示，统一由 requestErrorConfig.ts 的 handleTokenExpired 处理
        // 避免显示重复的错误提示
        return;

      case ErrorType.NETWORK:
        // 网络错误使用 message.error
        message.error({
          content: errorInfo.message,
          duration: 3,
        });
        break;

      case ErrorType.SERVER:
        // 服务器错误使用 message.error
        message.error({
          content: errorInfo.message,
          duration: 3,
        });
        break;

      case ErrorType.BUSINESS:
      case ErrorType.UNKNOWN:
      default:
        // 业务错误和未知错误使用 message
        message.error({
          content: errorInfo.message,
          duration: 3,
        });
        break;
    }
  }

  /**
   * 记录错误日志
   */
  private logError(errorInfo: ErrorInfo): void {
    // 开发环境：输出到控制台
    if (process.env.NODE_ENV === 'development') {
      const logStyle = this.getLogStyle(errorInfo.type);
      console.group(
        `%c[GlobalError] ${errorInfo.type}`,
        `color: ${logStyle.color}; font-weight: bold;`
      );
      console.log('📍 Context:', errorInfo.context || 'N/A');
      console.log('💬 Message:', errorInfo.message);
      console.log('🔢 Code:', errorInfo.code || 'N/A');
      console.log('📝 Details:', errorInfo.details);
      console.log('⏰ Timestamp:', new Date(errorInfo.timestamp).toLocaleString());
      console.groupEnd();
    }

    // 生产环境：发送到监控平台（TODO: 集成 Sentry 或其他监控服务）
    if (process.env.NODE_ENV === 'production') {
      // 示例：发送到 Sentry
      // Sentry.captureException(errorInfo);
      
      // 或者发送到自己的日志服务
      // this.sendToLogService(errorInfo);
    }
  }

  /**
   * 获取日志样式
   */
  private getLogStyle(type: ErrorType): { color: string } {
    switch (type) {
      case ErrorType.NETWORK:
        return { color: '#f5222d' }; // 红色
      case ErrorType.AUTH:
        return { color: '#fa8c16' }; // 橙色
      case ErrorType.BUSINESS:
        return { color: '#faad14' }; // 黄色
      case ErrorType.SERVER:
        return { color: '#a0d911' }; // 绿黄色
      case ErrorType.UNKNOWN:
      default:
        return { color: '#999' }; // 灰色
    }
  }

  /**
   * 发送错误日志到远程服务（可选）
   * @param errorInfo 错误信息
   */
  private async sendToLogService(errorInfo: ErrorInfo): Promise<void> {
    try {
      // 远程日志服务集成（需要时取消注释）
      // await fetch('/api/logs/error', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorInfo),
      // });
    } catch (error) {
      // 静默失败，不影响用户体验
      console.warn('Failed to send error log to remote service:', error);
    }
  }

  /**
   * 处理 Promise 拒绝错误
   * @param error Promise 拒绝的原因
   * @param context 错误上下文
   */
  handlePromiseRejection(error: any, context?: string): void {
    this.handle(error, context || 'UnhandledPromiseRejection');
  }
}

/**
 * 导出全局错误处理器单例
 */
export const globalErrorHandler = new GlobalErrorHandler();

/**
 * 便捷方法：处理错误
 * @param error 错误对象
 * @param context 错误上下文
 * @returns 错误信息
 * 
 * @example
 * ```ts
 * try {
 *   await someAPI();
 * } catch (error) {
 *   handleError(error, 'UserList.handleDelete');
 * }
 * ```
 */
export const handleError = (error: Error | AxiosError, context?: string): ErrorInfo => {
  return globalErrorHandler.handle(error, context);
};

/**
 * 便捷方法：异步错误包装器
 * @param fn 异步函数
 * @param context 错误上下文
 * @returns 包装后的函数
 * 
 * @example
 * ```ts
 * const safeDeleteUser = withErrorHandler(
 *   async (id: number) => await deleteUser(id),
 *   'UserList.handleDelete'
 * );
 * 
 * await safeDeleteUser(123);
 * ```
 */
export const withErrorHandler = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: string
): ((...args: Parameters<T>) => Promise<ReturnType<T> | null>) => {
  return async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      globalErrorHandler.handle(error as Error, context);
      return null;
    }
  };
};
