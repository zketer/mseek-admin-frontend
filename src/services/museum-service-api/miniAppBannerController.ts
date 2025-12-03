// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 获取首页轮播图 获取有效的轮播图列表 GET /api/v1/museums/miniapp/banners */
export async function getActiveBanners(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getActiveBannersParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultListBannerResponse>(
    "/api/v1/museums/miniapp/banners",
    {
      method: "GET",
      params: {
        // limit has a default value: 5
        limit: "5",
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 记录轮播图点击 记录轮播图点击次数 POST /api/v1/museums/miniapp/banners/${param0}/click */
export async function recordBannerClick(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.recordBannerClickParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(
    `/api/v1/museums/miniapp/banners/${param0}/click`,
    {
      method: "POST",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}
