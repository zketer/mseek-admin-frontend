// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 检查是否收藏展览 检查用户是否收藏了指定展览 GET /api/v1/museums/miniapp/favorites/check/exhibition/${param0} */
export async function checkExhibitionFavorite(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.checkExhibitionFavoriteParams,
  options?: { [key: string]: any }
) {
  const { exhibitionId: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultBoolean>(
    `/api/v1/museums/miniapp/favorites/check/exhibition/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 检查是否收藏博物馆 检查用户是否收藏了指定博物馆 GET /api/v1/museums/miniapp/favorites/check/museum/${param0} */
export async function checkMuseumFavorite(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.checkMuseumFavoriteParams,
  options?: { [key: string]: any }
) {
  const { museumId: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultBoolean>(
    `/api/v1/museums/miniapp/favorites/check/museum/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 收藏展览 用户收藏指定的展览 POST /api/v1/museums/miniapp/favorites/exhibition/${param0} */
export async function favoriteExhibition(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.favoriteExhibitionParams,
  options?: { [key: string]: any }
) {
  const { exhibitionId: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultBoolean>(
    `/api/v1/museums/miniapp/favorites/exhibition/${param0}`,
    {
      method: "POST",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 取消收藏展览 用户取消收藏指定的展览 DELETE /api/v1/museums/miniapp/favorites/exhibition/${param0} */
export async function unfavoriteExhibition(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.unfavoriteExhibitionParams,
  options?: { [key: string]: any }
) {
  const { exhibitionId: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultBoolean>(
    `/api/v1/museums/miniapp/favorites/exhibition/${param0}`,
    {
      method: "DELETE",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 获取用户收藏的展览列表 分页查询用户收藏的展览 GET /api/v1/museums/miniapp/favorites/exhibitions */
export async function getUserFavoriteExhibitions(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getUserFavoriteExhibitionsParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultIPageExhibitionResponse>(
    "/api/v1/museums/miniapp/favorites/exhibitions",
    {
      method: "GET",
      params: {
        // page has a default value: 1
        page: "1",
        // pageSize has a default value: 10
        pageSize: "10",

        // sortBy has a default value: time
        sortBy: "time",
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 收藏博物馆 用户收藏指定的博物馆 POST /api/v1/museums/miniapp/favorites/museum/${param0} */
export async function favoriteMuseum(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.favoriteMuseumParams,
  options?: { [key: string]: any }
) {
  const { museumId: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultBoolean>(
    `/api/v1/museums/miniapp/favorites/museum/${param0}`,
    {
      method: "POST",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 取消收藏博物馆 用户取消收藏指定的博物馆 DELETE /api/v1/museums/miniapp/favorites/museum/${param0} */
export async function unfavoriteMuseum(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.unfavoriteMuseumParams,
  options?: { [key: string]: any }
) {
  const { museumId: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultBoolean>(
    `/api/v1/museums/miniapp/favorites/museum/${param0}`,
    {
      method: "DELETE",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 获取用户收藏的博物馆列表 分页查询用户收藏的博物馆 GET /api/v1/museums/miniapp/favorites/museums */
export async function getUserFavoriteMuseums(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getUserFavoriteMuseumsParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultIPageMuseumResponse>(
    "/api/v1/museums/miniapp/favorites/museums",
    {
      method: "GET",
      params: {
        // page has a default value: 1
        page: "1",
        // pageSize has a default value: 10
        pageSize: "10",

        // sortBy has a default value: time
        sortBy: "time",
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 获取用户收藏统计 获取用户收藏的博物馆和展览统计信息 GET /api/v1/museums/miniapp/favorites/stats */
export async function getUserFavoriteStats(options?: { [key: string]: any }) {
  return request<MuseumsAPI.ResultFavoriteStats>(
    "/api/v1/museums/miniapp/favorites/stats",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}
