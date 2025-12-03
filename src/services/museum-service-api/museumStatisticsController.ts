// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 获取博物馆统计信息 GET /api/v1/museums/statistics */
export async function getMuseumStatistics(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getMuseumStatisticsParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.MuseumStatisticsResponse>(
    "/api/v1/museums/statistics",
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

/** 按城市统计博物馆数量 GET /api/v1/museums/statistics/by-city */
export async function getMuseumCountByCity(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getMuseumCountByCityParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultListMapStringObject>(
    "/api/v1/museums/statistics/by-city",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 按省份统计博物馆数量 GET /api/v1/museums/statistics/by-province */
export async function getMuseumCountByProvince(options?: {
  [key: string]: any;
}) {
  return request<MuseumsAPI.ResultListMapStringObject>(
    "/api/v1/museums/statistics/by-province",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}
