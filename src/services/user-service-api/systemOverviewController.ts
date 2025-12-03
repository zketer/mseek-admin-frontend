// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 获取系统概览信息 获取系统基本信息、技术栈、微服务、功能模块、开发计划等信息 GET /api/v1/system/system-overview */
export async function getSystemOverview(options?: { [key: string]: any }) {
  return request<UsersAPI.ResultSystemOverviewResponse>(
    "/api/v1/system/system-overview",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}
