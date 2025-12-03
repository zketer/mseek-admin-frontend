/**
 * LocalStorage 存储键名常量
 * 统一管理所有 localStorage 的 key，避免硬编码
 */
export const STORAGE_KEYS = {
  /** 访问令牌 */
  TOKEN: 'token',
  /** 刷新令牌 */
  REFRESH_TOKEN: 'refreshToken',
  /** 用户信息 */
  USER_INFO: 'userInfo',
  /** 用户权限列表 */
  USER_PERMISSIONS: 'userPermissions',
  /** 语言设置 */
  LOCALE: 'umi_locale',
  /** 主题设置 */
  THEME: 'theme',
  /** 侧边栏折叠状态 */
  SIDEBAR_COLLAPSED: 'sidebarCollapsed',
  /** 表单草稿前缀 */
  FORM_DRAFT: 'form_draft',
  /** AI 推荐 - 用户行为数据 */
  AI_USER_BEHAVIORS: 'ai_recommend_user_behaviors',
  /** AI 推荐 - 用户偏好设置 */
  AI_USER_PREFERENCES: 'ai_recommend_user_preferences',
} as const;

export type StorageKey = keyof typeof STORAGE_KEYS;

