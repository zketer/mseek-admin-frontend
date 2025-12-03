// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 分页查询城市列表 支持按名称、区域代码、省份等条件查询 GET /api/v1/museums/areas/cities */
export async function getCityList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getCityListParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultIPageCityResponse>(
    "/api/v1/museums/areas/cities",
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

/** 创建城市 创建新的城市信息 POST /api/v1/museums/areas/cities */
export async function createCity(
  body: MuseumsAPI.CityCreateRequest,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultCityResponse>(
    "/api/v1/museums/areas/cities",
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

/** 根据ID获取城市详情 根据城市ID获取详细信息 GET /api/v1/museums/areas/cities/${param0} */
export async function getCityById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getCityByIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultCityResponse>(
    `/api/v1/museums/areas/cities/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 更新城市 根据ID更新城市信息 PUT /api/v1/museums/areas/cities/${param0} */
export async function updateCity(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.updateCityParams,
  body: MuseumsAPI.CityUpdateRequest,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultCityResponse>(
    `/api/v1/museums/areas/cities/${param0}`,
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

/** 删除城市 根据ID删除城市 DELETE /api/v1/museums/areas/cities/${param0} */
export async function deleteCity(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.deleteCityParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(
    `/api/v1/museums/areas/cities/${param0}`,
    {
      method: "DELETE",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 根据区域代码获取城市详情 根据区域代码获取城市详细信息 GET /api/v1/museums/areas/cities/adcode/${param0} */
export async function getCityByAdcode(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getCityByAdcodeParams,
  options?: { [key: string]: any }
) {
  const { adcode: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultCityResponse>(
    `/api/v1/museums/areas/cities/adcode/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 批量删除城市 批量删除多个城市 DELETE /api/v1/museums/areas/cities/batch */
export async function deleteCities(
  body: number[],
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultVoid>("/api/v1/museums/areas/cities/batch", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据省份获取城市列表 根据省份代码获取该省份下的所有城市 GET /api/v1/museums/areas/cities/province/${param0} */
export async function getCitiesByProvince(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getCitiesByProvinceParams,
  options?: { [key: string]: any }
) {
  const { provinceAdcode: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultListCityResponse>(
    `/api/v1/museums/areas/cities/province/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}
