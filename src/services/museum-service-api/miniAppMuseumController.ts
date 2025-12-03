// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 分页查询博物馆列表 小程序端分页查询博物馆列表，支持城市筛选和关键词搜索 GET /api/v1/museums/miniapp/museums */
export async function getMuseumPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getMuseumPageParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultIPageMuseumResponse>(
    "/api/v1/museums/miniapp/museums",
    {
      method: "GET",
      params: {
        // page has a default value: 1
        page: "1",
        // pageSize has a default value: 10
        pageSize: "10",

        // sortBy has a default value: default
        sortBy: "default",
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 获取博物馆详情 根据博物馆ID获取详情信息 GET /api/v1/museums/miniapp/museums/${param0} */
export async function getMuseumDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getMuseumDetailParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultMuseumResponse>(
    `/api/v1/museums/miniapp/museums/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 获取博物馆分类列表 获取所有可用的博物馆分类 GET /api/v1/museums/miniapp/museums/categories */
export async function getCategories(options?: { [key: string]: any }) {
  return request<MuseumsAPI.ResultListCategoryResponse>(
    "/api/v1/museums/miniapp/museums/categories",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** 根据城市获取博物馆列表 根据城市代码获取该城市的所有博物馆 GET /api/v1/museums/miniapp/museums/city/${param0} */
export async function getMuseumsByCity(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getMuseumsByCityParams,
  options?: { [key: string]: any }
) {
  const { cityCode: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultIPageMuseumResponse>(
    `/api/v1/museums/miniapp/museums/city/${param0}`,
    {
      method: "GET",
      params: {
        // page has a default value: 1
        page: "1",
        // pageSize has a default value: 20
        pageSize: "20",

        // sortBy has a default value: default
        sortBy: "default",
        ...queryParams,
      },
      ...(options || {}),
    }
  );
}

/** 分页获取热门博物馆列表 根据用户打卡次数统计最热门的博物馆，支持懒加载分页和按名称搜索 GET /api/v1/museums/miniapp/museums/hot */
export async function getHotMuseums1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getHotMuseums1Params,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultIPageMuseumResponse>(
    "/api/v1/museums/miniapp/museums/hot",
    {
      method: "GET",
      params: {
        // page has a default value: 1
        page: "1",
        // pageSize has a default value: 5
        pageSize: "5",
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 根据位置获取附近博物馆 根据经纬度获取附近的博物馆列表，包含位置信息，支持按名称搜索 GET /api/v1/museums/miniapp/museums/nearby */
export async function getNearbyMuseums1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getNearbyMuseums1Params,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultNearbyMuseumsResponse>(
    "/api/v1/museums/miniapp/museums/nearby",
    {
      method: "GET",
      params: {
        // radius has a default value: 20
        radius: "20",
        // page has a default value: 1
        page: "1",
        // pageSize has a default value: 10
        pageSize: "10",

        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 搜索博物馆 根据关键词搜索博物馆 GET /api/v1/museums/miniapp/museums/search */
export async function searchMuseums(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.searchMuseumsParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultIPageMuseumResponse>(
    "/api/v1/museums/miniapp/museums/search",
    {
      method: "GET",
      params: {
        // page has a default value: 1
        page: "1",
        // pageSize has a default value: 20
        pageSize: "20",

        // sortBy has a default value: relevance
        sortBy: "relevance",
        ...params,
      },
      ...(options || {}),
    }
  );
}
