// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 分页查询在线用户列表 GET /api/v1/system/online-users */
export async function getOnlineUsers(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getOnlineUsersParams,
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultIPageOnlineUserResponse>(
    "/api/v1/system/online-users",
    {
      method: "GET",
      params: {
        ...params,
        query: undefined,
        ...params["query"],
      },
      ...(options || {}),
    }
  );
}

/** 强制下线用户 DELETE /api/v1/system/online-users/sessions/${param0} */
export async function forceLogout(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.forceLogoutParams,
  options?: { [key: string]: any }
) {
  const { sessionId: param0, ...queryParams } = params;
  return request<UsersAPI.ResultVoid>(
    `/api/v1/system/online-users/sessions/${param0}`,
    {
      method: "DELETE",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 批量强制下线用户 DELETE /api/v1/system/online-users/sessions/batch */
export async function batchForceLogout(
  body: string[],
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultVoid>(
    "/api/v1/system/online-users/sessions/batch",
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** 清理过期会话 DELETE /api/v1/system/online-users/sessions/expired */
export async function cleanExpiredSessions(options?: { [key: string]: any }) {
  return request<UsersAPI.ResultInteger>(
    "/api/v1/system/online-users/sessions/expired",
    {
      method: "DELETE",
      ...(options || {}),
    }
  );
}

/** 获取在线用户统计 GET /api/v1/system/online-users/statistics */
export async function getOnlineUserStatistics(options?: {
  [key: string]: any;
}) {
  return request<UsersAPI.ResultObject>(
    "/api/v1/system/online-users/statistics",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** 根据用户ID强制下线 DELETE /api/v1/system/online-users/users/${param0}/sessions */
export async function forceLogoutByUserId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.forceLogoutByUserIdParams,
  options?: { [key: string]: any }
) {
  const { userId: param0, ...queryParams } = params;
  return request<UsersAPI.ResultVoid>(
    `/api/v1/system/online-users/users/${param0}/sessions`,
    {
      method: "DELETE",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}
