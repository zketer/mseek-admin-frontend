declare namespace AuthAPI {
  type alipayMiniProgramParams = {
    /** 支付宝小程序授权码 */
    authCode: string;
    /** 用户信息 */
    userInfo?: string;
  };

  type authorizeParams = {
    /** 第三方登录提供商 */
    provider: string;
    /** 授权成功后的回调地址 */
    redirectUri?: string;
  };

  type bindThirdPartyAccountParams = {
    /** 第三方登录提供商 */
    provider: string;
    /** 授权码 */
    code: string;
  };

  type callbackParams = {
    /** 第三方登录提供商 */
    provider: string;
    /** 授权码 */
    code: string;
    /** 状态参数 */
    state?: string;
  };

  type CaptchaResponse = {
    captchaKey?: string;
    captchaImage?: string;
    expiresIn?: number;
  };

  type getUserLoginInfoParams = {
    /** 用户ID */
    userId: number;
  };

  type LoginRequest = {
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
    /** 验证码 */
    captcha?: string;
    /** 验证码key */
    captchaKey?: string;
    /** 记住我 */
    rememberMe?: boolean;
  };

  type LoginResponse = {
    /** 访问令牌 */
    accessToken?: string;
    /** 刷新令牌 */
    refreshToken?: string;
    /** 令牌类型 */
    tokenType?: string;
    /** 过期时间（秒） */
    expiresIn?: number;
    userInfo?: UserInfo;
  };

  type refreshTokenParams = {
    refreshToken: string;
  };

  type RegisterRequest = {
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
    /** 图形验证码 */
    captcha?: string;
    /** 图形验证码key */
    captchaKey?: string;
  };

  type ResetPasswordRequest = {
    username: string;
    email: string;
    code: string;
    newPassword: string;
    confirmPassword: string;
    captcha?: string;
    captchaKey?: string;
  };

  type ResultCaptchaResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: CaptchaResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultLoginResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: LoginResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultObject = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: Record<string, any>;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultString = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: string;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultUserLoginInfoResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: UserLoginInfoResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultVoid = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: Record<string, any>;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type SendCodeRequest = {
    /** 邮箱 */
    email: string;
    /** 验证码类型：register-注册，reset-密码重置 */
    type: string;
  };

  type unbindThirdPartyAccountParams = {
    /** 第三方登录提供商 */
    provider: string;
  };

  type UserInfo = {
    /** 用户ID */
    userId?: number;
    /** 用户名 */
    username?: string;
    /** 昵称 */
    nickname?: string;
    /** 邮箱 */
    email?: string;
    /** 手机号 */
    phone?: string;
    /** 头像 */
    avatar?: string;
    /** 性别：0-未知，1-男，2-女 */
    gender?: number;
    /** 状态：0-禁用，1-启用 */
    status?: number;
    /** 最后登录时间 */
    lastLoginTime?: string;
    /** 角色列表 */
    roles?: string[];
    /** 权限列表 */
    permissions?: string[];
  };

  type UserLoginInfoResponse = {
    /** 最后登录时间 */
    lastLoginTime?: string;
    /** 最后登录IP */
    lastLoginIp?: string;
    /** 登录次数 */
    loginCount?: number;
    /** 登录地理位置 */
    loginLocation?: string;
    /** 设备类型 */
    deviceType?: string;
    /** 用户代理 */
    userAgent?: string;
  };

  type WechatMiniProgramLoginRequest = {
    /** 微信小程序授权码 */
    code: string;
    /** 用户信息JSON字符串 */
    userInfo?: string;
  };
}
