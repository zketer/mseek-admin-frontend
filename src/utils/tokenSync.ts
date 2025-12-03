/**
 * Token 多标签页同步工具
 * 使用 BroadcastChannel API 实现多个标签页之间的 token 同步
 */

import { STORAGE_KEYS } from '@/constants';

type MessageType = 'TOKEN_UPDATE' | 'LOGOUT' | 'TOKEN_REFRESH';

interface SyncMessage {
  type: MessageType;
  data?: any;
  timestamp: number;
}

class TokenSync {
  private channel: BroadcastChannel | null = null;
  private readonly channelName = 'museum-token-sync';

  constructor() {
    // 检查浏览器是否支持 BroadcastChannel
    if ('BroadcastChannel' in window) {
      this.initChannel();
    } else {
      // BroadcastChannel API不支持，使用storage事件作为fallback
      this.initStorageFallback();
    }
  }

  /**
   * 初始化 BroadcastChannel
   */
  private initChannel() {
    this.channel = new BroadcastChannel(this.channelName);
    this.listenToMessages();
  }

  /**
   * 降级方案：使用 localStorage 事件
   * 对于不支持 BroadcastChannel 的浏览器
   */
  private initStorageFallback() {
    window.addEventListener('storage', (event) => {
      if (event.key === 'token-sync-message' && event.newValue) {
        try {
          const message: SyncMessage = JSON.parse(event.newValue);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse storage message:', error);
        }
      }
    });
  }

  /**
   * 广播 token 更新
   */
  broadcastTokenUpdate(token: string, refreshToken: string) {
    const message: SyncMessage = {
      type: 'TOKEN_UPDATE',
      data: { token, refreshToken },
      timestamp: Date.now(),
    };

    this.sendMessage(message);
  }

  /**
   * 广播 token 刷新完成
   */
  broadcastTokenRefresh(token: string, refreshToken: string) {
    const message: SyncMessage = {
      type: 'TOKEN_REFRESH',
      data: { token, refreshToken },
      timestamp: Date.now(),
    };

    this.sendMessage(message);
  }

  /**
   * 广播登出事件
   */
  broadcastLogout() {
    const message: SyncMessage = {
      type: 'LOGOUT',
      timestamp: Date.now(),
    };

    this.sendMessage(message);
  }

  /**
   * 发送消息
   */
  private sendMessage(message: SyncMessage) {
    if (this.channel) {
      // 使用 BroadcastChannel
      this.channel.postMessage(message);
    } else {
      // 降级到 localStorage
      localStorage.setItem('token-sync-message', JSON.stringify(message));
      // 立即清除，以便下次触发 storage 事件
      setTimeout(() => {
        localStorage.removeItem('token-sync-message');
      }, 100);
    }
  }

  /**
   * 监听其他标签页的消息
   */
  private listenToMessages() {
    if (!this.channel) return;

    this.channel.onmessage = (event) => {
      const message: SyncMessage = event.data;
      this.handleMessage(message);
    };
  }

  /**
   * 处理接收到的消息
   */
  private handleMessage(message: SyncMessage) {
    const { type, data, timestamp } = message;

    // 防止处理过期的消息（超过5秒）
    if (Date.now() - timestamp > 5000) {
      return;
    }

    switch (type) {
      case 'TOKEN_UPDATE':
      case 'TOKEN_REFRESH':
        if (data?.token && data?.refreshToken) {
          localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);

          // 触发自定义事件，通知应用 token 已更新
          window.dispatchEvent(new CustomEvent('token-synced', { detail: data }));
        }
        break;

      case 'LOGOUT':
        // 清除所有认证信息
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_INFO);

        // 触发自定义事件
        window.dispatchEvent(new Event('logout-synced'));

        // 跳转到登录页
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
        break;
    }
  }

  /**
   * 销毁实例
   */
  destroy() {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
  }
}

// 创建全局单例
let tokenSyncInstance: TokenSync | null = null;

export const getTokenSync = (): TokenSync => {
  if (!tokenSyncInstance) {
    tokenSyncInstance = new TokenSync();
  }
  return tokenSyncInstance;
};

export const destroyTokenSync = () => {
  if (tokenSyncInstance) {
    tokenSyncInstance.destroy();
    tokenSyncInstance = null;
  }
};

// 默认导出单例实例
export default getTokenSync();


