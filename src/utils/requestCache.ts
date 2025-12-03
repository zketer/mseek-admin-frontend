/**
 * 请求缓存工具
 * 
 * @description 提供简单的请求缓存机制，减少重复的 API 调用
 * @author zlynn
 * @date 2025-11-06
 */

/**
 * 缓存项接口
 */
interface CacheItem<T = any> {
  /** 缓存数据 */
  data: T;
  /** 缓存时间戳 */
  timestamp: number;
  /** 过期时间（毫秒） */
  ttl: number;
}

/**
 * 缓存配置接口
 */
export interface CacheConfig {
  /** 默认过期时间（毫秒），默认 5 分钟 */
  defaultTTL?: number;
  /** 最大缓存数量，默认 100 */
  maxSize?: number;
  /** 是否启用缓存，默认 true */
  enabled?: boolean;
}

/**
 * 请求缓存管理器
 */
class RequestCacheManager {
  private cache: Map<string, CacheItem> = new Map();
  private config: Required<CacheConfig>;

  constructor(config: CacheConfig = {}) {
    this.config = {
      defaultTTL: config.defaultTTL ?? 5 * 60 * 1000, // 5 分钟
      maxSize: config.maxSize ?? 100,
      enabled: config.enabled ?? true,
    };
  }

  /**
   * 生成缓存键
   * @param url 请求 URL
   * @param params 请求参数
   * @returns 缓存键
   */
  private generateKey(url: string, params?: any): string {
    if (!params) return url;
    
    // 将参数转换为稳定的字符串（排序后）
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {} as any);

    return `${url}?${JSON.stringify(sortedParams)}`;
  }

  /**
   * 检查缓存是否过期
   * @param item 缓存项
   * @returns 是否过期
   */
  private isExpired(item: CacheItem): boolean {
    return Date.now() - item.timestamp > item.ttl;
  }

  /**
   * 清理过期缓存
   */
  private cleanup(): void {
    for (const [key, item] of this.cache.entries()) {
      if (this.isExpired(item)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * 限制缓存大小（LRU策略）
   */
  private enforceMaxSize(): void {
    if (this.cache.size <= this.config.maxSize) return;

    // 按时间戳排序，删除最旧的缓存
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

    const toDelete = entries.slice(0, this.cache.size - this.config.maxSize);
    toDelete.forEach(([key]) => this.cache.delete(key));
  }

  /**
   * 获取缓存数据
   * @param url 请求 URL
   * @param params 请求参数
   * @returns 缓存数据，如果不存在或已过期则返回 null
   */
  get<T = any>(url: string, params?: any): T | null {
    if (!this.config.enabled) return null;

    const key = this.generateKey(url, params);
    const item = this.cache.get(key);

    if (!item) return null;

    // 检查是否过期
    if (this.isExpired(item)) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  /**
   * 设置缓存数据
   * @param url 请求 URL
   * @param data 数据
   * @param params 请求参数
   * @param ttl 过期时间（毫秒），默认使用配置的 defaultTTL
   */
  set<T = any>(url: string, data: T, params?: any, ttl?: number): void {
    if (!this.config.enabled) return;

    const key = this.generateKey(url, params);
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl ?? this.config.defaultTTL,
    };

    this.cache.set(key, item);

    // 限制缓存大小
    this.enforceMaxSize();
  }

  /**
   * 删除指定缓存
   * @param url 请求 URL
   * @param params 请求参数
   */
  delete(url: string, params?: any): void {
    const key = this.generateKey(url, params);
    this.cache.delete(key);
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 清理过期缓存（手动触发）
   */
  cleanupExpired(): void {
    this.cleanup();
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): {
    size: number;
    maxSize: number;
    enabled: boolean;
  } {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      enabled: this.config.enabled,
    };
  }
}

// 创建全局缓存实例
export const requestCache = new RequestCacheManager({
  defaultTTL: 5 * 60 * 1000, // 5 分钟
  maxSize: 100,
  enabled: true,
});

/**
 * 带缓存的请求包装器
 * 
 * @description 包装 API 请求函数，自动使用缓存
 * @param requestFn 原始请求函数
 * @param options 缓存选项
 * @returns 包装后的请求函数
 * 
 * @example
 * ```typescript
 * const getMuseumListWithCache = withCache(
 *   getMuseumList,
 *   {
 *     ttl: 10 * 60 * 1000, // 10 分钟
 *     getCacheKey: (params) => `/api/museums?${JSON.stringify(params)}`,
 *   }
 * );
 * 
 * // 第一次调用会发起请求
 * const data1 = await getMuseumListWithCache({ page: 1 });
 * 
 * // 10 分钟内的第二次调用会使用缓存
 * const data2 = await getMuseumListWithCache({ page: 1 });
 * ```
 */
export const withCache = <TParams extends any[], TResult>(
  requestFn: (...args: TParams) => Promise<TResult>,
  options: {
    /** 过期时间（毫秒） */
    ttl?: number;
    /** 自定义缓存键生成函数 */
    getCacheKey?: (...args: TParams) => string;
    /** 是否强制刷新（绕过缓存） */
    forceRefresh?: boolean;
  } = {}
) => {
  return async (...args: TParams): Promise<TResult> => {
    const {
      ttl,
      getCacheKey = (...args) => JSON.stringify(args),
      forceRefresh = false,
    } = options;

    const cacheKey = getCacheKey(...args);

    // 如果不强制刷新，先尝试从缓存获取
    if (!forceRefresh) {
      const cached = requestCache.get<TResult>(cacheKey);
      if (cached !== null) {
        return cached;
      }
    }

    // 发起请求

    const result = await requestFn(...args);

    // 缓存结果
    requestCache.set(cacheKey, result, undefined, ttl);

    return result;
  };
};

/**
 * 缓存装饰器（用于类方法）
 * 
 * @description 装饰器方式为类方法添加缓存
 * @param options 缓存选项
 * 
 * @example
 * ```typescript
 * class MuseumService {
 *   @Cacheable({ ttl: 10 * 60 * 1000 })
 *   async getMuseumList(params: any) {
 *     return await api.getMuseumList(params);
 *   }
 * }
 * ```
 */
export function Cacheable(options: {
  ttl?: number;
  getCacheKey?: (...args: any[]) => string;
} = {}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const {
        ttl,
        getCacheKey = (...args) => `${propertyKey}:${JSON.stringify(args)}`,
      } = options;

      const cacheKey = getCacheKey(...args);

      // 尝试从缓存获取
      const cached = requestCache.get(cacheKey);
      if (cached !== null) {
        return cached;
      }

      // 调用原始方法

      const result = await originalMethod.apply(this, args);

      // 缓存结果
      requestCache.set(cacheKey, result, undefined, ttl);

      return result;
    };

    return descriptor;
  };
}

// 定期清理过期缓存（每 5 分钟）
if (typeof window !== 'undefined') {
  setInterval(() => {
    requestCache.cleanupExpired();
  }, 5 * 60 * 1000);
}

export default requestCache;

