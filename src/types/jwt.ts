/**
 * JWT Token 相关类型定义
 */

/** JWT Payload 标准字段 */
export interface JWTPayload {
  /** 主题 - 通常是用户名 */
  sub: string;
  /** 过期时间（秒级时间戳） */
  exp: number;
  /** 签发时间（秒级时间戳） */
  iat: number;
  /** JWT ID */
  jti?: string;
  /** 签发者 */
  iss?: string;
  /** 受众 */
  aud?: string | string[];
  /** 不早于（秒级时间戳） */
  nbf?: number;
}

/** Token 响应 */
export interface TokenResponse {
  /** 访问令牌 */
  accessToken: string;
  /** 刷新令牌 */
  refreshToken: string;
  /** 令牌类型 */
  tokenType: string;
  /** 过期时间（秒） */
  expiresIn?: number;
}

/** Token 刷新请求 */
export interface TokenRefreshRequest {
  /** 刷新令牌 */
  refreshToken: string;
}


