// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 获取系统架构信息 获取系统架构图表和详细信息 GET /api/v1/system/system-architecture */
export async function getSystemArchitecture(options?: { [key: string]: any }) {
  return request<UsersAPI.ResultSystemArchitectureResponse>(
    "/api/v1/system/system-architecture",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}
