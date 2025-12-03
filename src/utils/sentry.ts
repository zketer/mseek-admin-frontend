/**
 * Sentry 错误监控配置
 * @description 集成 Sentry 进行错误追踪和性能监控
 * @doc https://docs.sentry.io/platforms/javascript/guides/react/
 */

/**
 * Sentry 配置接口
 */
export interface SentryConfig {
  /** Sentry DSN */
  dsn: string;
  /** 环境 */
  environment: string;
  /** 版本号 */
  release?: string;
  /** 采样率 */
  tracesSampleRate?: number;
  /** 是否启用 */
  enabled?: boolean;
}

/**
 * 初始化 Sentry
 * @description 仅在生产环境启用
 * @example
 * ```typescript
 * // 在 app.tsx 中调用
 * initSentry({
 *   dsn: 'https://your-sentry-dsn@sentry.io/project-id',
 *   environment: 'production',
 *   release: 'v0.0.1',
 * });
 * ```
 */
export function initSentry(config: SentryConfig) {
  // ✅ 仅在配置了 DSN 且启用时初始化
  if (!config.dsn || config.enabled === false) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Sentry] 未配置或已禁用，跳过初始化');
    }
    return;
  }

  // ✅ 生产环境才启用 Sentry
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Sentry] 非生产环境，跳过初始化');
    return;
  }

  try {
    // TODO: 取消注释以启用 Sentry
    // import('@sentry/react').then((Sentry) => {
    //   Sentry.init({
    //     dsn: config.dsn,
    //     environment: config.environment,
    //     release: config.release,
    //     integrations: [
    //       new Sentry.BrowserTracing(),
    //       new Sentry.Replay({
    //         maskAllText: true,
    //         blockAllMedia: true,
    //       }),
    //     ],
    //     // 性能监控采样率（0-1）
    //     tracesSampleRate: config.tracesSampleRate || 0.1,
    //     // 错误重放采样率
    //     replaysSessionSampleRate: 0.1,
    //     replaysOnErrorSampleRate: 1.0,
    //     // 忽略特定错误
    //     ignoreErrors: [
    //       'ResizeObserver loop limit exceeded',
    //       'Non-Error promise rejection captured',
    //       'Network Error',
    //       'NetworkError',
    //     ],
    //     // 错误过滤
    //     beforeSend(event, hint) {
    //       // 过滤掉取消的请求
    //       if (hint?.originalException?.message?.includes('cancel')) {
    //         return null;
    //       }
    //       return event;
    //     },
    //   });

    //   console.log('[Sentry] 初始化成功');
    // });

    console.log('[Sentry] 配置已就绪（待启用）');
  } catch (error) {
    console.error('[Sentry] 初始化失败:', error);
  }
}

/**
 * 手动捕获错误
 * @param error 错误对象
 * @param context 错误上下文
 */
export function captureError(error: Error, context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'production') {
    // TODO: 取消注释以启用
    // import('@sentry/react').then((Sentry) => {
    //   Sentry.captureException(error, {
    //     extra: context,
    //   });
    // });
  }
  
  // 开发环境输出到控制台
  if (process.env.NODE_ENV === 'development') {
    console.error('[Error]', error, context);
  }
}

/**
 * 手动捕获消息
 * @param message 消息内容
 * @param level 级别
 * @param context 上下文
 */
export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  context?: Record<string, any>
) {
  if (process.env.NODE_ENV === 'production') {
    // TODO: 取消注释以启用
    // import('@sentry/react').then((Sentry) => {
    //   Sentry.captureMessage(message, {
    //     level,
    //     extra: context,
    //   });
    // });
  }
  
  // 开发环境输出到控制台
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${level.toUpperCase()}]`, message, context);
  }
}

/**
 * 设置用户信息
 * @param user 用户信息
 */
export function setUser(user: { id: string; username?: string; email?: string }) {
  if (process.env.NODE_ENV === 'production') {
    // TODO: 取消注释以启用
    // import('@sentry/react').then((Sentry) => {
    //   Sentry.setUser(user);
    // });
  }
}

/**
 * 清除用户信息
 */
export function clearUser() {
  if (process.env.NODE_ENV === 'production') {
    // TODO: 取消注释以启用
    // import('@sentry/react').then((Sentry) => {
    //   Sentry.setUser(null);
    // });
  }
}

/**
 * 添加面包屑（用户行为追踪）
 * @param breadcrumb 面包屑数据
 */
export function addBreadcrumb(breadcrumb: {
  message: string;
  category?: string;
  level?: 'info' | 'warning' | 'error';
  data?: Record<string, any>;
}) {
  if (process.env.NODE_ENV === 'production') {
    // TODO: 取消注释以启用
    // import('@sentry/react').then((Sentry) => {
    //   Sentry.addBreadcrumb(breadcrumb);
    // });
  }
}

export default {
  initSentry,
  captureError,
  captureMessage,
  setUser,
  clearUser,
  addBreadcrumb,
};

