/**
 * 性能监控工具
 * 使用 Performance API 收集和上报性能数据
 */

/** 性能指标数据 */
interface PerformanceMetrics {
  /** DNS 查询时间 */
  dns?: number;
  /** TCP 连接时间 */
  tcp?: number;
  /** 请求时间 */
  request?: number;
  /** 响应时间 */
  response?: number;
  /** DOM 解析时间 */
  domParse?: number;
  /** DOM 就绪时间 */
  domReady?: number;
  /** 页面完全加载时间 */
  loadComplete?: number;
  /** 首次内容绘制 */
  fcp?: number;
  /** 最大内容绘制 */
  lcp?: number;
  /** 首次输入延迟 */
  fid?: number;
  /** 累积布局偏移 */
  cls?: number;
}

/** 性能数据上报 */
interface PerformanceReport {
  /** 数据类型 */
  type: 'navigation' | 'resource' | 'long-task' | 'web-vitals';
  /** 数据内容 */
  data: any;
  /** 时间戳 */
  timestamp: number;
  /** 页面路径 */
  path: string;
  /** 用户代理 */
  userAgent?: string;
}

/**
 * 性能监控器
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private observers: PerformanceObserver[] = [];
  private metrics: PerformanceMetrics = {};

  private constructor() {
    if ('PerformanceObserver' in window) {
      this.init();
    } else {
      console.warn('[PerformanceMonitor] PerformanceObserver not supported');
    }
  }

  /**
   * 获取单例实例
   */
  static getInstance(): PerformanceMonitor {
    if (!this.instance) {
      this.instance = new PerformanceMonitor();
    }
    return this.instance;
  }

  /**
   * 初始化监控
   */
  private init() {
    // 监控页面导航性能
    this.observeNavigation();
    
    // 监控资源加载性能
    this.observeResources();
    
    // 监控长任务
    this.observeLongTasks();
    
    // 监控 Web Vitals
    this.observeWebVitals();

    if (process.env.NODE_ENV === 'development') {
      console.log('[PerformanceMonitor] Initialized');
    }
  }

  /**
   * 监控页面导航性能
   */
  private observeNavigation() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const navigation = entry as PerformanceNavigationTiming;
          
          this.metrics = {
            dns: Math.round(navigation.domainLookupEnd - navigation.domainLookupStart),
            tcp: Math.round(navigation.connectEnd - navigation.connectStart),
            request: Math.round(navigation.responseStart - navigation.requestStart),
            response: Math.round(navigation.responseEnd - navigation.responseStart),
            domParse: Math.round(navigation.domInteractive - navigation.responseEnd),
            domReady: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
            loadComplete: Math.round(navigation.loadEventEnd - navigation.fetchStart),
          };

          this.report({
            type: 'navigation',
            data: this.metrics,
            timestamp: Date.now(),
            path: window.location.pathname,
          });

          if (process.env.NODE_ENV === 'development') {
            console.log('[PerformanceMonitor] Navigation metrics:', this.metrics);
          }
        }
      });

      observer.observe({ entryTypes: ['navigation'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('[PerformanceMonitor] Failed to observe navigation:', error);
    }
  }

  /**
   * 监控资源加载性能
   */
  private observeResources() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resource = entry as PerformanceResourceTiming;
          
          // 只监控慢资源（加载时间超过1秒）
          if (resource.duration > 1000) {
            const resourceData = {
              url: resource.name,
              duration: Math.round(resource.duration),
              size: resource.transferSize,
              type: resource.initiatorType,
            };

            this.report({
              type: 'resource',
              data: resourceData,
              timestamp: Date.now(),
              path: window.location.pathname,
            });

            if (process.env.NODE_ENV === 'development') {
              console.warn('[PerformanceMonitor] Slow resource detected:', resourceData);
            }
          }
        }
      });

      observer.observe({ entryTypes: ['resource'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('[PerformanceMonitor] Failed to observe resources:', error);
    }
  }

  /**
   * 监控长任务（JavaScript 执行时间超过50ms的任务）
   */
  private observeLongTasks() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const taskData = {
            duration: Math.round(entry.duration),
            startTime: Math.round(entry.startTime),
          };

          this.report({
            type: 'long-task',
            data: taskData,
            timestamp: Date.now(),
            path: window.location.pathname,
          });

          if (process.env.NODE_ENV === 'development') {
            console.warn('[PerformanceMonitor] Long task detected:', taskData);
          }
        }
      });

      observer.observe({ entryTypes: ['longtask'] });
      this.observers.push(observer);
    } catch (error) {
      // longtask 可能不被所有浏览器支持
      console.warn('[PerformanceMonitor] Failed to observe long tasks:', error);
    }
  }

  /**
   * 监控 Web Vitals（核心网页指标）
   */
  private observeWebVitals() {
    // FCP - First Contentful Paint
    this.observeFCP();
    
    // LCP - Largest Contentful Paint
    this.observeLCP();
    
    // FID - First Input Delay
    this.observeFID();
    
    // CLS - Cumulative Layout Shift
    this.observeCLS();
  }

  /**
   * 监控 FCP（首次内容绘制）
   */
  private observeFCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = Math.round(entry.startTime);

            this.report({
              type: 'web-vitals',
              data: { metric: 'FCP', value: this.metrics.fcp },
              timestamp: Date.now(),
              path: window.location.pathname,
            });

            if (process.env.NODE_ENV === 'development') {
              console.log('[PerformanceMonitor] FCP:', this.metrics.fcp, 'ms');
            }
          }
        }
      });

      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('[PerformanceMonitor] Failed to observe FCP:', error);
    }
  }

  /**
   * 监控 LCP（最大内容绘制）
   */
  private observeLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        this.metrics.lcp = Math.round(lastEntry.startTime);

        this.report({
          type: 'web-vitals',
          data: { metric: 'LCP', value: this.metrics.lcp },
          timestamp: Date.now(),
          path: window.location.pathname,
        });

        if (process.env.NODE_ENV === 'development') {
          console.log('[PerformanceMonitor] LCP:', this.metrics.lcp, 'ms');
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('[PerformanceMonitor] Failed to observe LCP:', error);
    }
  }

  /**
   * 监控 FID（首次输入延迟）
   */
  private observeFID() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.fid = Math.round(entry.processingStart - entry.startTime);

          this.report({
            type: 'web-vitals',
            data: { metric: 'FID', value: this.metrics.fid },
            timestamp: Date.now(),
            path: window.location.pathname,
          });

          if (process.env.NODE_ENV === 'development') {
            console.log('[PerformanceMonitor] FID:', this.metrics.fid, 'ms');
          }
        }
      });

      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('[PerformanceMonitor] Failed to observe FID:', error);
    }
  }

  /**
   * 监控 CLS（累积布局偏移）
   */
  private observeCLS() {
    try {
      let clsValue = 0;

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            this.metrics.cls = Math.round(clsValue * 1000) / 1000;
          }
        }

        this.report({
          type: 'web-vitals',
          data: { metric: 'CLS', value: this.metrics.cls },
          timestamp: Date.now(),
          path: window.location.pathname,
        });

        if (process.env.NODE_ENV === 'development') {
          console.log('[PerformanceMonitor] CLS:', this.metrics.cls);
        }
      });

      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('[PerformanceMonitor] Failed to observe CLS:', error);
    }
  }

  /**
   * 上报性能数据
   */
  private report(data: PerformanceReport) {
    if (process.env.NODE_ENV === 'development') {
      // 开发环境：输出到控制台
      console.log(`[PerformanceMonitor] Report:`, data);
    } else {
      // 生产环境：上报到监控服务
      this.sendToMonitoringService(data);
    }
  }

  /**
   * 发送数据到监控服务
   */
  private sendToMonitoringService(data: PerformanceReport) {
    try {
      // 性能监控服务集成（需要时取消注释并配置）
      // 使用 sendBeacon 发送数据，不会阻塞页面卸载
      if ('sendBeacon' in navigator) {
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        navigator.sendBeacon('/api/v1/monitoring/performance', blob);
      } else {
        // 降级方案：使用 fetch
        fetch('/api/v1/monitoring/performance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          keepalive: true,
        }).catch((error) => {
          console.error('[PerformanceMonitor] Failed to send report:', error);
        });
      }
    } catch (error) {
      console.error('[PerformanceMonitor] Failed to send report:', error);
    }
  }

  /**
   * 获取当前性能指标
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * 手动记录性能标记
   */
  mark(name: string) {
    try {
      performance.mark(name);
    } catch (error) {
      console.warn('[PerformanceMonitor] Failed to create mark:', error);
    }
  }

  /**
   * 测量两个标记之间的时间
   */
  measure(name: string, startMark: string, endMark: string) {
    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0];
      
      if (measure) {
        this.report({
          type: 'navigation',
          data: {
            name,
            duration: Math.round(measure.duration),
          },
          timestamp: Date.now(),
          path: window.location.pathname,
        });
      }
    } catch (error) {
      console.warn('[PerformanceMonitor] Failed to measure:', error);
    }
  }

  /**
   * 清理所有观察器
   */
  destroy() {
    this.observers.forEach((observer) => {
      try {
        observer.disconnect();
      } catch (error) {
        console.warn('[PerformanceMonitor] Failed to disconnect observer:', error);
      }
    });
    this.observers = [];

    if (process.env.NODE_ENV === 'development') {
      console.log('[PerformanceMonitor] Destroyed');
    }
  }
}

// 创建全局单例
let performanceMonitorInstance: PerformanceMonitor | null = null;

/**
 * 获取性能监控器实例
 */
export function getPerformanceMonitor(): PerformanceMonitor {
  if (!performanceMonitorInstance) {
    performanceMonitorInstance = PerformanceMonitor.getInstance();
  }
  return performanceMonitorInstance;
}

/**
 * 销毁性能监控器
 */
export function destroyPerformanceMonitor() {
  if (performanceMonitorInstance) {
    performanceMonitorInstance.destroy();
    performanceMonitorInstance = null;
  }
}

// 默认导出实例
export default getPerformanceMonitor();


