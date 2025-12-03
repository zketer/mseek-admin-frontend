// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 创建街道 创建新的街道信息 POST /api/v1/museums/areas/streets */
export async function createStreet(
  body: MuseumsAPI.StreetCreateRequest,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultStreetResponse>(
    "/api/v1/museums/areas/streets",
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

/** 根据ID获取街道详情 根据街道ID获取详细信息 GET /api/v1/museums/areas/streets/${param0} */
export async function getStreetById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getStreetByIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultStreetResponse>(
    `/api/v1/museums/areas/streets/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 更新街道 根据ID更新街道信息 PUT /api/v1/museums/areas/streets/${param0} */
export async function updateStreet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.updateStreetParams,
  body: MuseumsAPI.StreetUpdateRequest,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultStreetResponse>(
    `/api/v1/museums/areas/streets/${param0}`,
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

/** 删除街道 根据ID删除街道 DELETE /api/v1/museums/areas/streets/${param0} */
export async function deleteStreet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.deleteStreetParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(
    `/api/v1/museums/areas/streets/${param0}`,
    {
      method: "DELETE",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 根据区域代码获取街道详情 根据区域代码获取街道详细信息 GET /api/v1/museums/areas/streets/adcode/${param0} */
export async function getStreetByAdcode(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getStreetByAdcodeParams,
  options?: { [key: string]: any }
) {
  const { adcode: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultStreetResponse>(
    `/api/v1/museums/areas/streets/adcode/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 批量删除街道 批量删除多个街道 DELETE /api/v1/museums/areas/streets/batch */
export async function deleteStreets(
  body: number[],
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultVoid>("/api/v1/museums/areas/streets/batch", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据区县获取街道列表 根据区县代码获取该区县下的所有街道（用于懒加载） GET /api/v1/museums/areas/streets/district/${param0} */
export async function getStreetsByDistrict(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getStreetsByDistrictParams,
  options?: { [key: string]: any }
) {
  const { districtCode: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultListStreetResponse>(
    `/api/v1/museums/areas/streets/district/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 分页查询街道列表 高性能分页查询所有街道信息，支持关键词和区域代码搜索 GET /api/v1/museums/areas/streets/page */
export async function getStreetsPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getStreetsPageParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultIPageStreetResponse>(
    "/api/v1/museums/areas/streets/page",
    {
      method: "GET",
      params: {
        // current has a default value: 1
        current: "1",
        // pageSize has a default value: 20
        pageSize: "20",

        ...params,
      },
      ...(options || {}),
    }
  );
}
