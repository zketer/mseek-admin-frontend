// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 获取有效公告列表 获取当前有效的公告列表 GET /api/v1/museums/miniapp/announcements */
export async function getActiveAnnouncements(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getActiveAnnouncementsParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultListAnnouncementResponse>(
    "/api/v1/museums/miniapp/announcements",
    {
      method: "GET",
      params: {
        // limit has a default value: 10
        limit: "10",
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 获取公告详情 获取公告详情并增加阅读次数 GET /api/v1/museums/miniapp/announcements/${param0} */
export async function getAnnouncementDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getAnnouncementDetailParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultAnnouncementResponse>(
    `/api/v1/museums/miniapp/announcements/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}
