/**
 * 这个文件作为组件的目录
 * 目的是统一管理对外输出的组件，方便分类
 */
/**
 * 布局组件
 */
import AppTitle from './AppTitle';
import ColorfulLangSwitch from './ColorfulLangSwitch';
import Footer from './Footer';
import MenuFooter from './MenuFooter';
import { SelectLang } from './RightContent';
import { AvatarDropdown, AvatarName } from './RightContent/AvatarDropdown';
import ErrorBoundary from './ErrorBoundary';
// ✅ 新增优化组件
import PageTransition from './PageTransition';

export { 
  AppTitle, 
  AvatarDropdown, 
  AvatarName, 
  ColorfulLangSwitch, 
  Footer, 
  MenuFooter, 
  SelectLang, 
  ErrorBoundary,
  PageTransition,
};
