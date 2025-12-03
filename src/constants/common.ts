/**
 * 通用常量
 */

/** 分页默认配置 */
export const PAGINATION = {
  /** 默认页码 */
  DEFAULT_CURRENT: 1,
  /** 默认每页数量 */
  DEFAULT_PAGE_SIZE: 20,
  /** 每页数量选项 */
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

/** 日期格式 */
export const DATE_FORMAT = {
  /** 日期 */
  DATE: 'YYYY-MM-DD',
  /** 日期时间 */
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  /** 时间 */
  TIME: 'HH:mm:ss',
  /** 月份 */
  MONTH: 'YYYY-MM',
  /** 年份 */
  YEAR: 'YYYY',
} as const;

/** 上传文件限制 */
export const UPLOAD_LIMIT = {
  /** 图片最大大小（5MB） */
  IMAGE_MAX_SIZE: 5 * 1024 * 1024,
  /** 文件最大大小（10MB） */
  FILE_MAX_SIZE: 10 * 1024 * 1024,
  /** 支持的图片类型 */
  IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  /** 支持的文档类型 */
  DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const;

/** 状态枚举 */
export const STATUS = {
  /** 禁用 */
  DISABLED: 0,
  /** 启用 */
  ENABLED: 1,
} as const;

/** Token 刷新配置 */
export const TOKEN_CONFIG = {
  /** 提前刷新时间（毫秒） - 提前5分钟 */
  REFRESH_BEFORE_EXPIRE: 5 * 60 * 1000,
  /** 刷新失败重试次数 */
  MAX_RETRY_COUNT: 3,
  /** 重试延迟（毫秒） */
  RETRY_DELAY: 1000,
} as const;

/** 防抖/节流配置 */
export const DEBOUNCE_WAIT = {
  /** 搜索防抖时间 */
  SEARCH: 300,
  /** 输入防抖时间 */
  INPUT: 500,
  /** 窗口大小变化防抖时间 */
  RESIZE: 200,
  /** 滚动防抖时间 */
  SCROLL: 100,
} as const;


