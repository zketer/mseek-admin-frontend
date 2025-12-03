/**
 * TokenManager 单元测试
 * @description 测试 Token 管理器功能
 */
import { TokenManager } from '../tokenManager';
import { STORAGE_KEYS } from '@/constants';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('TokenManager', () => {
  let tokenManager: TokenManager;

  beforeEach(() => {
    tokenManager = new TokenManager();
    localStorageMock.clear();
  });

  afterEach(() => {
    tokenManager.stopAutoRefresh();
  });

  describe('getToken', () => {
    it('should return null when no token exists', () => {
      expect(tokenManager.getToken()).toBeNull();
    });

    it('should return token when it exists', () => {
      const mockToken = 'Bearer test-token';
      localStorage.setItem(STORAGE_KEYS.TOKEN, mockToken);
      expect(tokenManager.getToken()).toBe(mockToken);
    });
  });

  describe('getRefreshToken', () => {
    it('should return null when no refresh token exists', () => {
      expect(tokenManager.getRefreshToken()).toBeNull();
    });

    it('should return refresh token when it exists', () => {
      const mockRefreshToken = 'refresh-token-123';
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, mockRefreshToken);
      expect(tokenManager.getRefreshToken()).toBe(mockRefreshToken);
    });
  });

  describe('clearTokens', () => {
    it('should remove all tokens from localStorage', () => {
      localStorage.setItem(STORAGE_KEYS.TOKEN, 'Bearer test-token');
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, 'refresh-token');

      tokenManager.clearTokens();

      expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBeNull();
    });
  });

  describe('isTokenValid', () => {
    it('should return false when no token exists', () => {
      expect(tokenManager.isTokenValid()).toBe(false);
    });

    it('should return false for invalid token format', () => {
      localStorage.setItem(STORAGE_KEYS.TOKEN, 'invalid-token');
      expect(tokenManager.isTokenValid()).toBe(false);
    });

    it('should return false for expired token', () => {
      // Create an expired token (expired 1 hour ago)
      const expiredTime = Math.floor(Date.now() / 1000) - 3600;
      const payload = { sub: 'testuser', exp: expiredTime };
      const encodedPayload = btoa(JSON.stringify(payload));
      const mockToken = `Bearer header.${encodedPayload}.signature`;
      
      localStorage.setItem(STORAGE_KEYS.TOKEN, mockToken);
      expect(tokenManager.isTokenValid()).toBe(false);
    });

    it('should return true for valid token', () => {
      // Create a valid token (expires in 1 hour)
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const payload = { sub: 'testuser', exp: futureTime };
      const encodedPayload = btoa(JSON.stringify(payload));
      const mockToken = `Bearer header.${encodedPayload}.signature`;
      
      localStorage.setItem(STORAGE_KEYS.TOKEN, mockToken);
      expect(tokenManager.isTokenValid()).toBe(true);
    });
  });
});

