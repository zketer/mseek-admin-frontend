/**
 * 可取消的请求工具
 * 使用 AbortController 实现请求取消
 */

/**
 * 可取消的请求类
 */
export class CancellableRequest<T = any> {
  private abortController: AbortController;
  private pending = false;

  constructor() {
    this.abortController = new AbortController();
  }

  /**
   * 发送请求
   * @param url 请求URL
   * @param options 请求选项
   * @returns Promise
   */
  async request(url: string, options?: RequestInit): Promise<T> {
    this.pending = true;

    try {
      const response = await fetch(url, {
        ...options,
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request cancelled');
      }
      throw error;
    } finally {
      this.pending = false;
    }
  }

  /**
   * 取消请求
   */
  cancel(reason?: string) {
    if (this.pending) {
      this.abortController.abort();
    }
  }

  /**
   * 是否正在请求中
   */
  isPending(): boolean {
    return this.pending;
  }
}

/**
 * 创建可取消的请求实例
 * @returns CancellableRequest 实例
 */
export function createCancellableRequest<T = any>(): CancellableRequest<T> {
  return new CancellableRequest<T>();
}

/**
 * React Hook：使用可取消的请求
 * @param requestFn 请求函数
 * @returns 请求函数和取消函数
 */
export function useCancellableRequest<T extends (...args: any[]) => Promise<any>>(
  requestFn: T
): [T, () => void] {
  const abortControllerRef = { current: new AbortController() };

  const cancellableRequest = ((...args: Parameters<T>) => {
    // 如果之前有请求正在进行，先取消它
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 创建新的 AbortController
    abortControllerRef.current = new AbortController();

    // 如果请求函数的最后一个参数是 options 对象，注入 signal
    const lastArg = args[args.length - 1];
    if (lastArg && typeof lastArg === 'object' && !Array.isArray(lastArg)) {
      lastArg.signal = abortControllerRef.current.signal;
    }

    return requestFn(...args);
  }) as T;

  const cancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return [cancellableRequest, cancel];
}

/**
 * 请求管理器 - 管理多个请求
 */
export class RequestManager {
  private requests: Map<string, AbortController> = new Map();

  /**
   * 发送请求
   * @param key 请求的唯一标识
   * @param requestFn 请求函数
   * @returns Promise
   */
  async request<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    // 如果已有相同 key 的请求，先取消
    this.cancel(key);

    // 创建新的 AbortController
    const controller = new AbortController();
    this.requests.set(key, controller);

    try {
      const result = await requestFn();
      this.requests.delete(key);
      return result;
    } catch (error) {
      this.requests.delete(key);
      throw error;
    }
  }

  /**
   * 取消指定的请求
   * @param key 请求的唯一标识
   */
  cancel(key: string) {
    const controller = this.requests.get(key);
    if (controller) {
      controller.abort();
      this.requests.delete(key);
    }
  }

  /**
   * 取消所有请求
   */
  cancelAll() {
    this.requests.forEach((controller) => {
      controller.abort();
    });
    this.requests.clear();
  }

  /**
   * 获取正在进行的请求数量
   */
  getPendingCount(): number {
    return this.requests.size;
  }

  /**
   * 是否有正在进行的请求
   */
  hasPending(): boolean {
    return this.requests.size > 0;
  }
}

/**
 * 创建请求管理器实例
 */
export function createRequestManager(): RequestManager {
  return new RequestManager();
}

export default CancellableRequest;


