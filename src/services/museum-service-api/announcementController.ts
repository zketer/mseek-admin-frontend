// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 分页查询公告 支持按标题、类型、状态查询公告 GET /api/v1/museums/announcements */
export async function getAnnouncements(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getAnnouncementsParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultIPageAnnouncementResponse>(
    "/api/v1/museums/announcements",
    {
      method: "GET",
      params: {
        ...params,
        request: undefined,
        ...params["request"],
      },
      ...(options || {}),
    }
  );
}

/** 创建公告 创建新的公告 POST /api/v1/museums/announcements */
export async function createAnnouncement(
  body: MuseumsAPI.AnnouncementCreateRequest,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultMapStringLong>(
    "/api/v1/museums/announcements",
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

/** 获取公告详情 根据ID获取公告详情 GET /api/v1/museums/announcements/${param0} */
export async function getAnnouncementDetail1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getAnnouncementDetail1Params,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultAnnouncementResponse>(
    `/api/v1/museums/announcements/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 更新公告 更新公告信息 PUT /api/v1/museums/announcements/${param0} */
export async function updateAnnouncement(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.updateAnnouncementParams,
  body: MuseumsAPI.AnnouncementCreateRequest,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(
    `/api/v1/museums/announcements/${param0}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    }
  );
}

/** 删除公告 删除公告 DELETE /api/v1/museums/announcements/${param0} */
export async function deleteAnnouncement(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.deleteAnnouncementParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(
    `/api/v1/museums/announcements/${param0}`,
    {
      method: "DELETE",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 切换启用状态 切换公告启用状态，只有已发布的公告才能进行启用/禁用切换 PUT /api/v1/museums/announcements/${param0}/enabled */
export async function updateAnnouncementEnabled(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.updateAnnouncementEnabledParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(
    `/api/v1/museums/announcements/${param0}/enabled`,
    {
      method: "PUT",
      params: {
        ...queryParams,
      },
      ...(options || {}),
    }
  );
}

/** 下线公告 下线公告 PUT /api/v1/museums/announcements/${param0}/offline */
export async function offlineAnnouncement(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.offlineAnnouncementParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(
    `/api/v1/museums/announcements/${param0}/offline`,
    {
      method: "PUT",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 发布公告 发布公告 PUT /api/v1/museums/announcements/${param0}/publish */
export async function publishAnnouncement(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.publishAnnouncementParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(
    `/api/v1/museums/announcements/${param0}/publish`,
    {
      method: "PUT",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 更新公告状态 更新公告状态 PUT /api/v1/museums/announcements/${param0}/status */
export async function updateAnnouncementStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.updateAnnouncementStatusParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(
    `/api/v1/museums/announcements/${param0}/status`,
    {
      method: "PUT",
      params: {
        ...queryParams,
      },
      ...(options || {}),
    }
  );
}

/** 查询启用的公告 查询已发布且启用的公告列表，用于小程序端展示 GET /api/v1/museums/announcements/enabled */
export async function getEnabledAnnouncements(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getEnabledAnnouncementsParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultIPageAnnouncementResponse>(
    "/api/v1/museums/announcements/enabled",
    {
      method: "GET",
      params: {
        ...params,
        request: undefined,
        ...params["request"],
      },
      ...(options || {}),
    }
  );
}
