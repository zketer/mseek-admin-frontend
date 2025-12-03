import { getLocale } from '@umijs/max';

// 获取应用标题
export const getAppTitle = () => {
  const locale = getLocale();
  
  const titles: Record<string, string> = {
    'zh-CN': '文博探索',
    'en-US': 'Museum Seek',
  };
  
  return titles[locale] || titles['zh-CN'];
};
