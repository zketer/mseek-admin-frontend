// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 分页查询省份列表 支持按名称、区域代码等条件查询 GET /api/v1/museums/areas/provinces */
export async function getProvinceList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getProvinceListParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultIPageProvinceResponse>(
    "/api/v1/museums/areas/provinces",
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

/** 创建省份 创建新的省份信息 POST /api/v1/museums/areas/provinces */
export async function createProvince(
  body: MuseumsAPI.ProvinceCreateRequest,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultProvinceResponse>(
    "/api/v1/museums/areas/provinces",
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

/** 根据ID获取省份详情 根据省份ID获取详细信息 GET /api/v1/museums/areas/provinces/${param0} */
export async function getProvinceById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getProvinceByIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultProvinceResponse>(
    `/api/v1/museums/areas/provinces/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 更新省份 根据ID更新省份信息 PUT /api/v1/museums/areas/provinces/${param0} */
export async function updateProvince(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.updateProvinceParams,
  body: MuseumsAPI.ProvinceUpdateRequest,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultProvinceResponse>(
    `/api/v1/museums/areas/provinces/${param0}`,
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

/** 删除省份 根据ID删除省份 DELETE /api/v1/museums/areas/provinces/${param0} */
export async function deleteProvince(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.deleteProvinceParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(
    `/api/v1/museums/areas/provinces/${param0}`,
    {
      method: "DELETE",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 根据区域代码获取省份详情 根据区域代码获取省份详细信息 GET /api/v1/museums/areas/provinces/adcode/${param0} */
export async function getProvinceByAdcode(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getProvinceByAdcodeParams,
  options?: { [key: string]: any }
) {
  const { adcode: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultProvinceResponse>(
    `/api/v1/museums/areas/provinces/adcode/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 获取所有省份列表 获取所有省份的基本信息（不分页） GET /api/v1/museums/areas/provinces/all */
export async function getAllProvinces(options?: { [key: string]: any }) {
  return request<MuseumsAPI.ResultListProvinceResponse>(
    "/api/v1/museums/areas/provinces/all",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** 批量删除省份 批量删除多个省份 DELETE /api/v1/museums/areas/provinces/batch */
export async function deleteProvinces(
  body: number[],
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultVoid>(
    "/api/v1/museums/areas/provinces/batch",
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
