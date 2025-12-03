/**
 * API 相关常量
 */

/** HTTP 状态码 */
export const HTTP_STATUS = {
  /** 成功 */
  OK: 200,
  /** 已创建 */
  CREATED: 201,
  /** 无内容 */
  NO_CONTENT: 204,
  /** 错误请求 */
  BAD_REQUEST: 400,
  /** 未授权 */
  UNAUTHORIZED: 401,
  /** 禁止访问 */
  FORBIDDEN: 403,
  /** 未找到 */
  NOT_FOUND: 404,
  /** 服务器错误 */
  INTERNAL_SERVER_ERROR: 500,
  /** 网关超时 */
  GATEWAY_TIMEOUT: 504,
} as const;

/** 业务状态码 */
export const BIZ_CODE = {
  /** 成功 */
  SUCCESS: 200,
  /** 业务错误 */
  BIZ_ERROR: 400,
  /** 未授权 */
  UNAUTHORIZED: 401,
  /** 无权限 */
  FORBIDDEN: 403,
  /** 资源不存在 */
  NOT_FOUND: 404,
  /** 服务器错误 */
  SERVER_ERROR: 500,
} as const;

/** 请求超时时间（毫秒） */
export const REQUEST_TIMEOUT = {
  /** 默认超时 */
  DEFAULT: 30000,
  /** 上传超时 */
  UPLOAD: 300000,
  /** 下载超时 */
  DOWNLOAD: 600000,
} as const;

/** API 路径前缀 */
export const API_PREFIX = {
  /** V1 版本 */
  V1: '/api/v1',
  /** 认证服务 */
  AUTH: '/api/v1/auth',
  /** 用户服务 */
  SYSTEM: '/api/v1/system',
  /** 博物馆服务 */
  MUSEUMS: '/api/v1/museums',
  /** 文件服务 */
  FILES: '/api/v1/files',
} as const;


