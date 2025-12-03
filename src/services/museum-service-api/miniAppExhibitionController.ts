// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 获取展览详情 获取展览详细信息 GET /api/v1/museums/miniapp/exhibitions/${param0} */
export async function getExhibitionDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getExhibitionDetailParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultExhibitionResponse>(
    `/api/v1/museums/miniapp/exhibitions/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 分页获取所有展览列表 支持多种过滤条件的展览分页查询，支持懒加载 GET /api/v1/museums/miniapp/exhibitions/all */
export async function getAllExhibitions(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getAllExhibitionsParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultIPageExhibitionResponse>(
    "/api/v1/museums/miniapp/exhibitions/all",
    {
      method: "GET",
      params: {
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

/** 分页获取最新展览列表 获取正在进行或即将开始的展览，按开始时间排序，支持懒加载 GET /api/v1/museums/miniapp/exhibitions/latest */
export async function getLatestExhibitions(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getLatestExhibitionsParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultIPageExhibitionResponse>(
    "/api/v1/museums/miniapp/exhibitions/latest",
    {
      method: "GET",
      params: {
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
