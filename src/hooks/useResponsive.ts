/**
 * 响应式布局 Hook
 * 
 * @description 提供响应式断点检测，用于适配不同设备尺寸
 * @author zlynn
 * @date 2025-11-06
 */

import { useState, useEffect } from 'react';

/**
 * 响应式断点定义（参考 Ant Design 断点）
 */
export const BREAKPOINTS = {
  xs: 480,   // 超小屏幕（手机）
  sm: 576,   // 小屏幕（手机横屏）
  md: 768,   // 中等屏幕（平板）
  lg: 992,   // 大屏幕（桌面）
  xl: 1200,  // 超大屏幕（大桌面）
  xxl: 1600, // 超超大屏幕（超大桌面）
} as const;

/**
 * 响应式状态接口
 */
export interface ResponsiveState {
  /** 当前屏幕宽度 */
  width: number;
  /** 当前屏幕高度 */
  height: number;
  /** 是否为超小屏幕（手机竖屏，< 480px） */
  isXs: boolean;
  /** 是否为小屏幕（手机横屏，>= 480px 且 < 576px） */
  isSm: boolean;
  /** 是否为中等屏幕（平板，>= 576px 且 < 768px） */
  isMd: boolean;
  /** 是否为大屏幕（桌面，>= 768px 且 < 992px） */
  isLg: boolean;
  /** 是否为超大屏幕（大桌面，>= 992px 且 < 1200px） */
  isXl: boolean;
  /** 是否为超超大屏幕（超大桌面，>= 1200px） */
  isXxl: boolean;
  /** 是否为移动端（< 768px） */
  isMobile: boolean;
  /** 是否为平板（>= 768px 且 < 992px） */
  isTablet: boolean;
  /** 是否为桌面端（>= 992px） */
  isDesktop: boolean;
}

/**
 * 获取当前响应式状态
 * @param width 屏幕宽度
 * @param height 屏幕高度
 * @returns 响应式状态
 */
const getResponsiveState = (width: number, height: number): ResponsiveState => {
  return {
    width,
    height,
    isXs: width < BREAKPOINTS.xs,
    isSm: width >= BREAKPOINTS.xs && width < BREAKPOINTS.sm,
    isMd: width >= BREAKPOINTS.sm && width < BREAKPOINTS.md,
    isLg: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
    isXl: width >= BREAKPOINTS.lg && width < BREAKPOINTS.xl,
    isXxl: width >= BREAKPOINTS.xl,
    isMobile: width < BREAKPOINTS.md,
    isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
    isDesktop: width >= BREAKPOINTS.lg,
  };
};

/**
 * 响应式布局 Hook
 * 
 * @description 监听窗口大小变化，返回当前响应式状态
 * @returns 响应式状态
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { isMobile, isTablet, isDesktop } = useResponsive();
 *   
 *   return (
 *     <div>
 *       {isMobile && <MobileLayout />}
 *       {isTablet && <TabletLayout />}
 *       {isDesktop && <DesktopLayout />}
 *     </div>
 *   );
 * };
 * ```
 */
export const useResponsive = (): ResponsiveState => {
  // 初始化状态
  const [state, setState] = useState<ResponsiveState>(() => {
    // SSR 兼容：服务端渲染时默认为桌面端
    if (typeof window === 'undefined') {
      return getResponsiveState(BREAKPOINTS.xl, 768);
    }
    return getResponsiveState(window.innerWidth, window.innerHeight);
  });

  useEffect(() => {
    // 防抖处理，避免频繁触发
    let timeoutId: NodeJS.Timeout | null = null;

    const handleResize = () => {
      // 清除之前的定时器
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // 延迟 150ms 更新状态
      timeoutId = setTimeout(() => {
        const newState = getResponsiveState(window.innerWidth, window.innerHeight);
        
        // 只在状态真正变化时才更新（避免不必要的重渲染）
        setState((prevState) => {
          // 比较关键字段是否变化
          if (
            prevState.isMobile !== newState.isMobile ||
            prevState.isTablet !== newState.isTablet ||
            prevState.isDesktop !== newState.isDesktop
          ) {
            return newState;
          }
          return prevState;
        });
      }, 150);
    };

    // 添加事件监听
    window.addEventListener('resize', handleResize);

    // 初始化时立即执行一次
    handleResize();

    // 清理函数
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return state;
};

/**
 * 根据响应式状态返回不同的值
 * 
 * @param config 响应式配置
 * @returns 当前断点对应的值
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const columns = useResponsiveValue({
 *     xs: 1,
 *     sm: 2,
 *     md: 3,
 *     lg: 4,
 *     xl: 5,
 *     xxl: 6,
 *   });
 *   
 *   return <div>当前列数: {columns}</div>;
 * };
 * ```
 */
export const useResponsiveValue = <T = any>(config: {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  xxl?: T;
}): T | undefined => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl } = useResponsive();

  // 按优先级返回值（从小到大）
  if (isXs && config.xs !== undefined) return config.xs;
  if (isSm && config.sm !== undefined) return config.sm;
  if (isMd && config.md !== undefined) return config.md;
  if (isLg && config.lg !== undefined) return config.lg;
  if (isXl && config.xl !== undefined) return config.xl;
  if (isXxl && config.xxl !== undefined) return config.xxl;

  // 回退到最接近的值
  if (isXxl) return config.xl ?? config.lg ?? config.md ?? config.sm ?? config.xs;
  if (isXl) return config.lg ?? config.md ?? config.sm ?? config.xs;
  if (isLg) return config.md ?? config.sm ?? config.xs;
  if (isMd) return config.sm ?? config.xs;
  if (isSm) return config.xs;

  return config.xs;
};

/**
 * ProTable 响应式列配置 Hook
 * 
 * @description 根据屏幕大小自动隐藏/显示表格列
 * @param columns 原始列配置
 * @returns 响应式列配置
 * 
 * @example
 * ```tsx
 * const columns = useResponsiveColumns([
 *   { title: '名称', dataIndex: 'name', responsive: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] },
 *   { title: '描述', dataIndex: 'desc', responsive: ['md', 'lg', 'xl', 'xxl'] }, // 移动端隐藏
 *   { title: '创建时间', dataIndex: 'createTime', responsive: ['lg', 'xl', 'xxl'] }, // 平板和移动端隐藏
 * ]);
 * ```
 */
export const useResponsiveColumns = <T = any>(
  columns: any[]
): any[] => {
  const responsive = useResponsive();

  return columns.filter((column) => {
    // 如果没有设置 responsive，则始终显示
    if (!column.responsive || !Array.isArray(column.responsive)) {
      return true;
    }

    // 检查当前断点是否在 responsive 列表中
    const responsiveBreakpoints = column.responsive as string[];
    
    if (responsive.isXs && responsiveBreakpoints.includes('xs')) return true;
    if (responsive.isSm && responsiveBreakpoints.includes('sm')) return true;
    if (responsive.isMd && responsiveBreakpoints.includes('md')) return true;
    if (responsive.isLg && responsiveBreakpoints.includes('lg')) return true;
    if (responsive.isXl && responsiveBreakpoints.includes('xl')) return true;
    if (responsive.isXxl && responsiveBreakpoints.includes('xxl')) return true;

    return false;
  });
};

export default useResponsive;

