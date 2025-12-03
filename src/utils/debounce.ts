/**
 * 防抖和节流工具函数
 */

/**
 * 防抖函数
 * @param func 需要防抖的函数
 * @param wait 等待时间（毫秒）
 * @param immediate 是否立即执行
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    const later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };
}

/**
 * 节流函数
 * @param func 需要节流的函数
 * @param wait 等待时间（毫秒）
 * @param options 配置选项
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  let previous = 0;
  const { leading = true, trailing = true } = options;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    const now = Date.now();

    if (!previous && !leading) {
      previous = now;
    }

    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
    } else if (!timeout && trailing) {
      timeout = setTimeout(() => {
        previous = leading ? Date.now() : 0;
        timeout = null;
        func.apply(context, args);
      }, remaining);
    }
  };
}

/**
 * 请求防抖 - 只保留最后一次请求
 * @param requestFn 请求函数
 * @param wait 等待时间（毫秒）
 * @returns Promise
 */
export function debounceRequest<T extends (...args: any[]) => Promise<any>>(
  requestFn: T,
  wait: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeout: NodeJS.Timeout | null = null;
  let pendingResolve: ((value: any) => void) | null = null;
  let pendingReject: ((reason?: any) => void) | null = null;

  return function (...args: Parameters<T>): Promise<ReturnType<T>> {
    // 清除之前的定时器
    if (timeout) {
      clearTimeout(timeout);
    }

    // 拒绝之前的 Promise
    if (pendingReject) {
      pendingReject(new Error('Request cancelled due to new request'));
    }

    // 创建新的 Promise
    const promise = new Promise<ReturnType<T>>((resolve, reject) => {
      pendingResolve = resolve;
      pendingReject = reject;

      timeout = setTimeout(async () => {
        try {
          const result = await requestFn(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          timeout = null;
          pendingResolve = null;
          pendingReject = null;
        }
      }, wait);
    });

    return promise;
  };
}

/**
 * 请求节流 - 在指定时间内只执行一次
 * @param requestFn 请求函数
 * @param wait 等待时间（毫秒）
 * @returns Promise
 */
export function throttleRequest<T extends (...args: any[]) => Promise<any>>(
  requestFn: T,
  wait: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let lastCall = 0;
  let pendingPromise: Promise<ReturnType<T>> | null = null;

  return function (...args: Parameters<T>): Promise<ReturnType<T>> {
    const now = Date.now();

    // 如果有正在进行的请求，返回该 Promise
    if (pendingPromise) {
      return pendingPromise;
    }

    // 如果距离上次调用时间超过 wait，立即执行
    if (now - lastCall >= wait) {
      lastCall = now;
      pendingPromise = requestFn(...args);

      pendingPromise.finally(() => {
        pendingPromise = null;
      });

      return pendingPromise;
    }

    // 否则延迟执行
    const delay = wait - (now - lastCall);
    pendingPromise = new Promise((resolve, reject) => {
      setTimeout(async () => {
        lastCall = Date.now();
        try {
          const result = await requestFn(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          pendingPromise = null;
        }
      }, delay);
    });

    return pendingPromise;
  };
}


