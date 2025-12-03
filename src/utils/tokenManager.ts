/**
 * Token 管理器
 * @description 负责 Token 自动刷新和生命周期管理
 */
import { request } from '@umijs/max';
import { message } from 'antd';
import tokenSync from '@/utils/tokenSync';
import { TOKEN_CONFIG, STORAGE_KEYS, HTTP_STATUS } from '@/constants';
import type { JWTPayload } from '@/types/jwt';

/**
 * Token 管理器类
 * @description 单例模式，管理 Access Token 和 Refresh Token 的生命周期
 */
export class TokenManager {
  private refreshTimer: NodeJS.Timeout | null = null;
  private isRefreshing = false;
  private retryCount = 0;
  private readonly maxRetries = TOKEN_CONFIG.MAX_RETRY_COUNT;
  
  /**
   * 启动定时刷新
   */
  startAutoRefresh() {
    this.retryCount = 0; // 重置重试计数
    this.scheduleNextRefresh();
  }
  
  /**
   * 停止定时刷新
   */
  stopAutoRefresh() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    this.retryCount = 0;
  }
  
  /**
   * 计划下次刷新
   * @private
   */
  private scheduleNextRefresh() {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) {
      return;
    }
    
    try {
      // 解析 token 获取过期时间
      const tokenParts = token.split(' ');
      if (tokenParts.length !== 2) {
        throw new Error('Invalid token format');
      }
      
      const payload: JWTPayload = JSON.parse(atob(tokenParts[1].split('.')[1]));
      const exp = payload.exp * 1000; // 转换为毫秒
      const now = Date.now();
      const timeUntilExpiry = exp - now;
      
      // ✅ 优化：提前5分钟刷新（使用常量配置）
      const refreshTime = timeUntilExpiry - TOKEN_CONFIG.REFRESH_BEFORE_EXPIRE;
      
      if (refreshTime > 0) {
        this.refreshTimer = setTimeout(() => {
          this.performAutoRefresh();
        }, refreshTime);
      } else {
        // Token 已过期或即将过期，立即刷新
        this.performAutoRefresh();
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[TokenManager] Token 解析错误:', error);
      }
      // Token 解析失败，停止自动刷新
      this.stopAutoRefresh();
    }
  }
  
  /**
   * 执行自动刷新
   * @private
   */
  private async performAutoRefresh() {
    if (this.isRefreshing) {
      return;
    }
    
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      return;
    }
    
    this.isRefreshing = true;
    
    try {
      const newTokens = await this.refreshTokenSilently(refreshToken);
      
      if (newTokens) {
        // ✅ 刷新成功，重置重试计数
        this.retryCount = 0;
        
        // 更新 token
        localStorage.setItem(STORAGE_KEYS.TOKEN, `Bearer ${newTokens.accessToken}`);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newTokens.refreshToken);
        
        // 计划下次刷新
        this.scheduleNextRefresh();
      } else {
        // ✅ 刷新失败，执行重试逻辑
        this.handleRefreshFailure();
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[TokenManager] 刷新错误:', error);
      }
      this.handleRefreshFailure();
    } finally {
      this.isRefreshing = false;
    }
  }
  
  /**
   * 静默刷新 token（不显示错误消息）
   * @private
   */
  private async refreshTokenSilently(refreshToken: string) {
    try {
      const response = await request('/api/v1/auth/refresh', {
        method: 'POST',
        params: { refreshToken },
        skipErrorHandler: true,
      });
      
      if (response.code === HTTP_STATUS.OK && response.data) {
        const tokens = {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        };
        
        // 同步到其他标签页
        tokenSync.broadcastTokenRefresh(
          `Bearer ${tokens.accessToken}`,
          tokens.refreshToken
        );
        
        return tokens;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
  
  /**
   * 处理刷新失败，添加重试机制
   * @private
   */
  private handleRefreshFailure() {
    this.retryCount++;
    
    if (this.retryCount < this.maxRetries) {
      // 延迟重试（递增延迟）
      const retryDelay = TOKEN_CONFIG.RETRY_DELAY * this.retryCount;
      
      setTimeout(() => {
        this.performAutoRefresh();
      }, retryDelay);
    } else {
      // 达到最大重试次数，停止自动刷新
      if (process.env.NODE_ENV === 'development') {
        console.error('[TokenManager] 达到最大重试次数，停止自动刷新');
      }
      
      this.stopAutoRefresh();
      this.retryCount = 0;
      
      // 不立即跳转，让用户的下一个请求触发登录
    }
  }
  
  /**
   * 手动刷新 token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
    return await this.refreshTokenSilently(refreshToken);
  }
  
  /**
   * 清理所有 token
   */
  clearTokens() {
    this.stopAutoRefresh();
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    
    // 广播登出事件到其他标签页
    tokenSync.broadcastLogout();
  }
  
  /**
   * 获取当前 token
   */
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }
  
  /**
   * 获取 Refresh Token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }
  
  /**
   * 检查 token 是否有效
   */
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    
    try {
      const tokenParts = token.split(' ');
      if (tokenParts.length !== 2) {
        return false;
      }
      
      const payload: JWTPayload = JSON.parse(atob(tokenParts[1].split('.')[1]));
      const exp = payload.exp * 1000;
      const now = Date.now();
      
      return exp > now;
    } catch (error) {
      return false;
    }
  }
}

// ✅ 创建全局单例
export const tokenManager = new TokenManager();

// ✅ 暴露到全局，便于调试
declare global {
  interface Window {
    tokenManager: TokenManager;
  }
}

if (typeof window !== 'undefined') {
  window.tokenManager = tokenManager;
}

export default tokenManager;

