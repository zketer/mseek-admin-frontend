// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 创建区县 创建新的区县信息 POST /api/v1/museums/areas/districts */
export async function createDistrict(
  body: MuseumsAPI.DistrictCreateRequest,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultDistrictResponse>(
    "/api/v1/museums/areas/districts",
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

/** 根据ID获取区县详情 根据区县ID获取详细信息 GET /api/v1/museums/areas/districts/${param0} */
export async function getDistrictById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getDistrictByIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultDistrictResponse>(
    `/api/v1/museums/areas/districts/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 更新区县 根据ID更新区县信息 PUT /api/v1/museums/areas/districts/${param0} */
export async function updateDistrict(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.updateDistrictParams,
  body: MuseumsAPI.DistrictUpdateRequest,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultDistrictResponse>(
    `/api/v1/museums/areas/districts/${param0}`,
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

/** 删除区县 根据ID删除区县 DELETE /api/v1/museums/areas/districts/${param0} */
export async function deleteDistrict(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.deleteDistrictParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(
    `/api/v1/museums/areas/districts/${param0}`,
    {
      method: "DELETE",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 根据区域代码获取区县详情 根据区域代码获取区县详细信息 GET /api/v1/museums/areas/districts/adcode/${param0} */
export async function getDistrictByAdcode(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getDistrictByAdcodeParams,
  options?: { [key: string]: any }
) {
  const { adcode: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultDistrictResponse>(
    `/api/v1/museums/areas/districts/adcode/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 批量删除区县 批量删除多个区县 DELETE /api/v1/museums/areas/districts/batch */
export async function deleteDistricts(
  body: number[],
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultVoid>(
    "/api/v1/museums/areas/districts/batch",
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** 根据城市获取区县列表 根据城市代码获取该城市下的所有区县（用于懒加载） GET /api/v1/museums/areas/districts/city/${param0} */
export async function getDistrictsByCity(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getDistrictsByCityParams,
  options?: { [key: string]: any }
) {
  const { cityCode: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultListAreaDivisionResponse>(
    `/api/v1/museums/areas/districts/city/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 分页查询区县列表 高性能分页查询所有区县信息，支持关键词和区域代码搜索 GET /api/v1/museums/areas/districts/page */
export async function getDistrictsPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getDistrictsPageParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultIPageAreaDivisionResponse>(
    "/api/v1/museums/areas/districts/page",
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
