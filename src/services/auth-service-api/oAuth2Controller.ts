// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 支付宝小程序登录 使用支付宝小程序auth_code登录 POST /api/v1/auth/oauth2/alipay/miniprogram */
export async function alipayMiniProgram(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: AuthAPI.alipayMiniProgramParams,
  options?: { [key: string]: any }
) {
  return request<AuthAPI.ResultLoginResponse>(
    "/api/v1/auth/oauth2/alipay/miniprogram",
    {
      method: "POST",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** OAuth2授权 跳转到第三方授权页面 GET /api/v1/auth/oauth2/authorize/${param0} */
export async function authorize(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: AuthAPI.authorizeParams,
  options?: { [key: string]: any }
) {
  const { provider: param0, ...queryParams } = params;
  return request<AuthAPI.ResultString>(
    `/api/v1/auth/oauth2/authorize/${param0}`,
    {
      method: "GET",
      params: {
        ...queryParams,
      },
      ...(options || {}),
    }
  );
}

/** 绑定第三方账号 将第三方账号绑定到当前用户 POST /api/v1/auth/oauth2/bind/${param0} */
export async function bindThirdPartyAccount(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: AuthAPI.bindThirdPartyAccountParams,
  options?: { [key: string]: any }
) {
  const { provider: param0, ...queryParams } = params;
  return request<AuthAPI.ResultVoid>(`/api/v1/auth/oauth2/bind/${param0}`, {
    method: "POST",
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** OAuth2回调 处理第三方登录回调 POST /api/v1/auth/oauth2/callback/${param0} */
export async function callback(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: AuthAPI.callbackParams,
  options?: { [key: string]: any }
) {
  const { provider: param0, ...queryParams } = params;
  return request<AuthAPI.ResultLoginResponse>(
    `/api/v1/auth/oauth2/callback/${param0}`,
    {
      method: "POST",
      params: {
        ...queryParams,
      },
      ...(options || {}),
    }
  );
}

/** 获取支持的OAuth2提供商列表 GET /api/v1/auth/oauth2/providers */
export async function getProviders(options?: { [key: string]: any }) {
  return request<AuthAPI.ResultObject>("/api/v1/auth/oauth2/providers", {
    method: "GET",
    ...(options || {}),
  });
}

/** 解绑第三方账号 解除第三方账号绑定 DELETE /api/v1/auth/oauth2/unbind/${param0} */
export async function unbindThirdPartyAccount(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: AuthAPI.unbindThirdPartyAccountParams,
  options?: { [key: string]: any }
) {
  const { provider: param0, ...queryParams } = params;
  return request<AuthAPI.ResultVoid>(`/api/v1/auth/oauth2/unbind/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取用户绑定的第三方账号列表 GET /api/v1/auth/oauth2/user/bindings */
export async function getUserBindings(options?: { [key: string]: any }) {
  return request<AuthAPI.ResultObject>("/api/v1/auth/oauth2/user/bindings", {
    method: "GET",
    ...(options || {}),
  });
}

/** 微信小程序登录 使用微信小程序code登录 POST /api/v1/auth/oauth2/wechat/miniprogram */
export async function wechatMiniProgram(
  body: AuthAPI.WechatMiniProgramLoginRequest,
  options?: { [key: string]: any }
) {
  return request<AuthAPI.ResultLoginResponse>(
    "/api/v1/auth/oauth2/wechat/miniprogram",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}
