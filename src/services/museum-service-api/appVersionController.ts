// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 获取版本列表 分页查询应用版本列表 GET /api/v1/museums/app-versions */
export async function getAppVersions(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getAppVersionsParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultIPageAppVersionResponse>(
    "/api/v1/museums/app-versions",
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

/** 创建版本 创建新的应用版本 POST /api/v1/museums/app-versions */
export async function createAppVersion(
  body: MuseumsAPI.AppVersionCreateRequest,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultMapStringLong>(
    "/api/v1/museums/app-versions",
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

/** 获取版本详情 根据ID获取应用版本详情 GET /api/v1/museums/app-versions/${param0} */
export async function getAppVersionDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getAppVersionDetailParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultAppVersionResponse>(
    `/api/v1/museums/app-versions/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 更新版本 更新应用版本信息 PUT /api/v1/museums/app-versions/${param0} */
export async function updateAppVersion(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.updateAppVersionParams,
  body: MuseumsAPI.AppVersionUpdateRequest,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(
    `/api/v1/museums/app-versions/${param0}`,
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

/** 删除版本 删除应用版本 DELETE /api/v1/museums/app-versions/${param0} */
export async function deleteAppVersion(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.deleteAppVersionParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(
    `/api/v1/museums/app-versions/${param0}`,
    {
      method: "DELETE",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 废弃版本 废弃应用版本 PUT /api/v1/museums/app-versions/${param0}/deprecate */
export async function deprecateVersion(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.deprecateVersionParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(
    `/api/v1/museums/app-versions/${param0}/deprecate`,
    {
      method: "PUT",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 更新下载次数 记录下载行为，增加下载计数 POST /api/v1/museums/app-versions/${param0}/download */
export async function updateDownloadCount(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.updateDownloadCountParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(
    `/api/v1/museums/app-versions/${param0}/download`,
    {
      method: "POST",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 获取下载URL 获取应用版本下载地址 GET /api/v1/museums/app-versions/${param0}/download-url */
export async function getDownloadUrl(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getDownloadUrlParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultString>(
    `/api/v1/museums/app-versions/${param0}/download-url`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 标记为最新版本 将指定版本标记为最新版本 PUT /api/v1/museums/app-versions/${param0}/latest */
export async function markAsLatest(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.markAsLatestParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(
    `/api/v1/museums/app-versions/${param0}/latest`,
    {
      method: "PUT",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 发布版本 发布应用版本 PUT /api/v1/museums/app-versions/${param0}/publish */
export async function publishVersion(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.publishVersionParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(
    `/api/v1/museums/app-versions/${param0}/publish`,
    {
      method: "PUT",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 获取最新版本 获取各平台最新发布版本信息 GET /api/v1/museums/app-versions/latest */
export async function getLatestVersions(options?: { [key: string]: any }) {
  return request<MuseumsAPI.ResultMapStringAppVersionResponse>(
    "/api/v1/museums/app-versions/latest",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** 获取统计信息 获取应用版本统计信息 GET /api/v1/museums/app-versions/stats */
export async function getAppVersionStats(options?: { [key: string]: any }) {
  return request<MuseumsAPI.ResultAppVersionStatsResponse>(
    "/api/v1/museums/app-versions/stats",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}
