// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 获取用户统计信息 GET /api/v1/system/user-statistics */
export async function getUserStatistics1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getUserStatistics1Params,
  options?: { [key: string]: any }
) {
  return request<UsersAPI.UserStatisticsResponse>(
    "/api/v1/system/user-statistics",
    {
      method: "GET",
      params: {
        // days has a default value: 30
        days: "30",
        ...params,
      },
      ...(options || {}),
    }
  );
}
