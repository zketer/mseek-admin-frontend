// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 分页查询轮播图 根据条件分页查询轮播图列表 GET /api/v1/museums/banners */
export async function getBanners(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getBannersParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultIPageBannerResponse>(
    "/api/v1/museums/banners",
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

/** 创建轮播图 创建新的轮播图 POST /api/v1/museums/banners */
export async function createBanner(
  body: MuseumsAPI.BannerCreateRequest,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultMapStringLong>("/api/v1/museums/banners", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新轮播图 更新指定的轮播图信息 PUT /api/v1/museums/banners/${param0} */
export async function updateBanner(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.updateBannerParams,
  body: MuseumsAPI.BannerCreateRequest,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(`/api/v1/museums/banners/${param0}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除轮播图 删除指定的轮播图 DELETE /api/v1/museums/banners/${param0} */
export async function deleteBanner(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.deleteBannerParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(`/api/v1/museums/banners/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 更新轮播图状态 更新轮播图的上下线状态 PUT /api/v1/museums/banners/${param0}/status */
export async function updateBannerStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.updateBannerStatusParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(
    `/api/v1/museums/banners/${param0}/status`,
    {
      method: "PUT",
      params: {
        ...queryParams,
      },
      ...(options || {}),
    }
  );
}
