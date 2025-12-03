/**
 * 用户相关类型定义
 */

/** 用户信息 */
export interface UserInfo {
  /** 用户ID */
  id: number | string;
  /** 用户名 */
  username: string;
  /** 昵称 */
  nickname?: string;
  /** 头像 */
  avatar?: string;
  /** 邮箱 */
  email?: string;
  /** 手机号 */
  phone?: string;
  /** 性别：0-未知，1-男，2-女 */
  gender?: number;
  /** 生日 */
  birthday?: string;
  /** 角色列表 */
  roles?: string[];
  /** 权限列表 */
  permissions?: string[];
  /** 状态 */
  status?: number;
  /** 创建时间 */
  createdAt?: string;
  /** 更新时间 */
  updatedAt?: string;
}

/** 登录请求 */
export interface LoginRequest {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 记住我 */
  rememberMe?: boolean;
  /** 验证码 */
  captcha?: string;
  /** 验证码KEY */
  captchaKey?: string;
}

/** 注册请求 */
export interface RegisterRequest {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 确认密码 */
  confirmPassword: string;
  /** 邮箱 */
  email: string;
  /** 邮箱验证码 */
  code: string;
  /** 昵称 */
  nickname?: string;
  /** 手机号 */
  phone?: string;
  /** 验证码 */
  captcha?: string;
  /** 验证码KEY */
  captchaKey?: string;
}

/** 重置密码请求 */
export interface ResetPasswordRequest {
  /** 用户名 */
  username: string;
  /** 邮箱 */
  email: string;
  /** 邮箱验证码 */
  code: string;
  /** 新密码 */
  newPassword: string;
  /** 确认密码 */
  confirmPassword: string;
  /** 验证码 */
  captcha?: string;
  /** 验证码KEY */
  captchaKey?: string;
}

/** 当前用户信息（用于全局状态） */
export interface CurrentUser extends UserInfo {
  /** 访问级别（兼容旧代码） */
  access?: string;
}

