// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 分页查询博物馆列表 GET /api/v1/museums/info */
export async function getMuseumPage1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getMuseumPage1Params,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultIPageMuseumResponse>("/api/v1/museums/info", {
    method: "GET",
    params: {
      ...params,
      query: undefined,
      ...params["query"],
    },
    ...(options || {}),
  });
}

/** 创建博物馆 POST /api/v1/museums/info */
export async function createMuseum(
  body: MuseumsAPI.MuseumCreateRequest,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultMapStringLong>("/api/v1/museums/info", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取博物馆详情 GET /api/v1/museums/info/${param0} */
export async function getMuseumById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getMuseumByIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultMuseumResponse>(
    `/api/v1/museums/info/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 更新博物馆 PUT /api/v1/museums/info/${param0} */
export async function updateMuseum(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.updateMuseumParams,
  body: MuseumsAPI.MuseumUpdateRequest,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(`/api/v1/museums/info/${param0}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除博物馆 DELETE /api/v1/museums/info/${param0} */
export async function deleteMuseum(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.deleteMuseumParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(`/api/v1/museums/info/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 更新博物馆状态 PUT /api/v1/museums/info/${param0}/status */
export async function updateStatus1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.updateStatus1Params,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(
    `/api/v1/museums/info/${param0}/status`,
    {
      method: "PUT",
      params: {
        ...queryParams,
      },
      ...(options || {}),
    }
  );
}

/** 检查博物馆编码是否存在 GET /api/v1/museums/info/check-code */
export async function checkCode1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.checkCode1Params,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultBoolean>("/api/v1/museums/info/check-code", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
