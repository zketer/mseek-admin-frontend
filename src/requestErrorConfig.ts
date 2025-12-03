/**
 * UmiJS 请求配置
 * @description 统一的网络请求和错误处理配置
 */
import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message, notification } from 'antd';
import { getIntl } from '@umijs/max';
import { STORAGE_KEYS } from '@/constants';
import { tokenManager } from '@/utils/tokenManager';
import { globalErrorHandler, ErrorType } from '@/utils/errorHandler';

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}
// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
}

// 博物馆项目后端返回的响应格式
interface MuseumResponseStructure {
  code: number;
  message: string;
  messageEn: string;
  data: any;
  timestamp: number;
  requestId?: string;
  error?: boolean;
  success?: boolean;
}

/**
 * ✅ HTTP 状态码错误消息映射（国际化）
 * @description 使用 Map 简化错误处理逻辑
 */
const HTTP_ERROR_MESSAGES = new Map<number, string>([
  [400, 'pages.error.badRequest'],
  [401, 'pages.error.unauthorized'],
  [403, 'pages.error.forbidden'],
  [404, 'pages.error.notFound'],
  [405, 'pages.error.methodNotAllowed'],
  [409, 'pages.error.conflict'],
  [500, 'pages.error.serverError'],
  [502, 'pages.error.badGateway'],
  [503, 'pages.error.serviceUnavailable'],
  [504, 'pages.error.gatewayTimeout'],
]);

/**
 * 处理 Token 过期
 */
const handleTokenExpired = () => {
  // 使用独立的 TokenManager
  tokenManager.clearTokens();
  
  const currentPath = window.location.pathname;
  const whiteList = ['/login', '/oauth2/callback', '/user/register', '/user/register-result'];

  // ✅ 如果已经在白名单页面（如登录页），不显示错误消息，避免重复提示
  if (!whiteList.includes(currentPath)) {
    const intl = getIntl();
    message.error(intl.formatMessage({ id: 'pages.error.unauthorized' }));
  }
  
  // 如果不在登录页，跳转到登录页面
  if (currentPath !== '/login') {
    const loginUrl = `/login?redirect=${encodeURIComponent(currentPath + window.location.search)}`;
  
  setTimeout(() => {
    window.location.href = loginUrl;
  }, 1000);
  }
};

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      const { success, data, errorCode, errorMessage, showType } =
        res as unknown as ResponseStructure;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError';
        error.info = { errorCode, errorMessage, showType, data };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      // ✅ 使用全局错误处理器统一处理
      // 构建请求上下文信息
      const context = opts?.url ? `API: ${opts.url}` : 'Unknown API';
      
      // 调用全局错误处理器
      const errorInfo = globalErrorHandler.handle(error, context);
      
      // 特殊处理：401错误直接跳转登录
      if (errorInfo.code === 401 || errorInfo.type === ErrorType.AUTH) {
        handleTokenExpired();
        return; // 已处理，直接返回
      }
      
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo = error.info;
        if (errorInfo) {
          const { errorMessage, errorCode, errorMessageEn } = errorInfo;
          
          // 优先使用中文错误信息
          const displayMessage = errorMessage || errorMessageEn || '未知错误';
          
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break;
            case ErrorShowType.WARN_MESSAGE:
              message.warning(displayMessage);
              break;
            case ErrorShowType.ERROR_MESSAGE:
              message.error(displayMessage);
              break;
            case ErrorShowType.NOTIFICATION:
              notification.open({
                description: displayMessage,
                message: `错误码: ${errorCode}`,
              });
              break;
            case ErrorShowType.REDIRECT:
              // 重定向错误处理（目前未使用）
              break;
            default:
              message.error(displayMessage);
          }
        }
      } else if (error.response) {
        // ✅ 使用国际化处理HTTP错误
        const intl = getIntl();
        const status = error.response.status;
        
        // ✅ 检查是否有响应数据中的标准 Result 结构
        if (error.response.data) {
          const responseData = error.response.data;
          // 如果包含标准 Result 结构（code + message），说明是业务错误
          // 不在这里显示错误消息，让业务代码自己处理
          if (responseData.code && responseData.message) {
            console.warn('[ErrorHandler] 检测到业务错误（HTTP ' + status + '）:', {
              code: responseData.code,
              message: responseData.message,
            });
            // 不显示错误消息，避免与业务代码中的错误处理重复
            return;
          }
        }
        
        // ✅ 特殊处理：401 直接跳转登录
        if (status === 401) {
          handleTokenExpired();
          return;
        }
        
        // ✅ 使用 Map 获取错误消息（国际化）
        const errorMessageKey = HTTP_ERROR_MESSAGES.get(status);
        if (errorMessageKey) {
          message.error(intl.formatMessage({ id: errorMessageKey }));
        } else {
          // 未知状态码
          message.error(intl.formatMessage({ id: 'pages.error.unknown' }) + ` (${status})`);
        }
      } else if (error.request) {
        // ✅ 请求已发起但无响应（国际化）
        const intl = getIntl();
        if (error.code === 'ECONNABORTED') {
          message.error(intl.formatMessage({ id: 'pages.error.requestTimeout' }));
        } else if (error.message === 'Network Error') {
          message.error(intl.formatMessage({ id: 'pages.error.networkError' }));
        } else if (error.message?.includes('cancel')) {
          // 请求被取消，不显示错误
          if (process.env.NODE_ENV === 'development') {
            console.log('[Request] 请求已取消');
          }
        } else {
          message.error(intl.formatMessage({ id: 'pages.error.unknown' }));
        }
      } else {
        // ✅ 其他错误（国际化）
        const intl = getIntl();
        if (error.message) {
          message.error(`${intl.formatMessage({ id: 'pages.error.unknown' })}: ${error.message}`);
        } else {
          message.error(intl.formatMessage({ id: 'pages.error.unknown' }));
        }
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 从localStorage获取token
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      
      // 如果存在token，添加到请求头
      if (token && config.headers) {
        // 确保token格式为 "Bearer xxx"
        const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token.replace('Bearer ', '')}`;
        config.headers['Authorization'] = formattedToken;
      }
      
      return config;
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response as any;

      // ✅ 处理博物馆项目的响应格式
      if (data && typeof data === 'object' && 'code' in data) {
        const museumResponse = data as MuseumResponseStructure;
        
        // 如果不是成功状态码（200），记录日志
        if (museumResponse.code !== 200) {
          console.warn('[Response] 业务错误:', {
            code: museumResponse.code,
            message: museumResponse.message,
            url: (response as any).config?.url,
          });
        }
      } else if (data?.success === false) {
        console.warn('[Response] 请求失败:', data);
      }
      
      return response;
    },
  ],
};
