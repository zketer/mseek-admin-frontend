/**
 * 页面切换动画组件
 * 
 * @description 为页面切换提供平滑的过渡动画
 * @author zlynn
 * @date 2025-11-06
 */

import React, { CSSProperties } from 'react';
import './index.less';

/**
 * 动画类型
 */
export type AnimationType = 'fade' | 'slide' | 'zoom' | 'none';

/**
 * 页面切换动画组件属性
 */
export interface PageTransitionProps {
  /** 子元素 */
  children: React.ReactNode;
  /** 动画类型，默认 'fade' */
  type?: AnimationType;
  /** 动画持续时间（ms），默认 300 */
  duration?: number;
  /** 自定义样式 */
  style?: CSSProperties;
  /** 自定义类名 */
  className?: string;
}

/**
 * 页面切换动画组件
 * 
 * @example
 * ```tsx
 * import { PageTransition } from '@/components';
 * 
 * const MyPage = () => {
 *   return (
 *     <PageTransition type="fade" duration={300}>
 *       <div>页面内容</div>
 *     </PageTransition>
 *   );
 * };
 * ```
 */
const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  type = 'fade',
  duration = 300,
  style,
  className,
}) => {
  const animationClass = type !== 'none' ? `page-transition-${type}` : '';

  return (
    <div
      className={`page-transition ${animationClass} ${className || ''}`}
      style={{
        ...style,
        animationDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;

