// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 获取用户登录信息 获取用户的最后登录时间、登录IP、登录次数等信息 GET /api/v1/auth/users/${param0}/login-info */
export async function getUserLoginInfo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: AuthAPI.getUserLoginInfoParams,
  options?: { [key: string]: any }
) {
  const { userId: param0, ...queryParams } = params;
  return request<AuthAPI.ResultUserLoginInfoResponse>(
    `/api/v1/auth/users/${param0}/login-info`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}
