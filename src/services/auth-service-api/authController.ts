// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 获取图形验证码 GET /api/v1/auth/captcha */
export async function getCaptcha(options?: { [key: string]: any }) {
  return request<AuthAPI.ResultCaptchaResponse>("/api/v1/auth/captcha", {
    method: "GET",
    ...(options || {}),
  });
}

/** 健康检查 GET /api/v1/auth/health */
export async function health(options?: { [key: string]: any }) {
  return request<AuthAPI.ResultString>("/api/v1/auth/health", {
    method: "GET",
    ...(options || {}),
  });
}

/** 服务信息 GET /api/v1/auth/info */
export async function info(options?: { [key: string]: any }) {
  return request<AuthAPI.ResultString>("/api/v1/auth/info", {
    method: "GET",
    ...(options || {}),
  });
}

/** 用户登录 POST /api/v1/auth/login */
export async function login(
  body: AuthAPI.LoginRequest,
  options?: { [key: string]: any }
) {
  return request<AuthAPI.ResultLoginResponse>("/api/v1/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户登出 POST /api/v1/auth/logout */
export async function logout(options?: { [key: string]: any }) {
  return request<AuthAPI.ResultVoid>("/api/v1/auth/logout", {
    method: "POST",
    ...(options || {}),
  });
}

/** 刷新令牌 POST /api/v1/auth/refresh */
export async function refreshToken(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: AuthAPI.refreshTokenParams,
  options?: { [key: string]: any }
) {
  return request<AuthAPI.ResultLoginResponse>("/api/v1/auth/refresh", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 用户注册 POST /api/v1/auth/register */
export async function register(
  body: AuthAPI.RegisterRequest,
  options?: { [key: string]: any }
) {
  return request<AuthAPI.ResultLoginResponse>("/api/v1/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 重置密码（忘记密码） POST /api/v1/auth/reset-password */
export async function resetPassword(
  body: AuthAPI.ResetPasswordRequest,
  options?: { [key: string]: any }
) {
  return request<AuthAPI.ResultVoid>("/api/v1/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 发送验证码 POST /api/v1/auth/send-code */
export async function sendCode(
  body: AuthAPI.SendCodeRequest,
  options?: { [key: string]: any }
) {
  return request<AuthAPI.ResultVoid>("/api/v1/auth/send-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
