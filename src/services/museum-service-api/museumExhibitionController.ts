// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 分页查询展览列表 GET /api/v1/museums/${param0}/exhibitions */
export async function getExhibitionPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getExhibitionPageParams,
  options?: { [key: string]: any }
) {
  const { museumId: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultIPageExhibitionResponse>(
    `/api/v1/museums/${param0}/exhibitions`,
    {
      method: "GET",
      params: {
        ...queryParams,
        query: undefined,
        ...queryParams["query"],
      },
      ...(options || {}),
    }
  );
}

/** 创建展览 POST /api/v1/museums/${param0}/exhibitions */
export async function createExhibition(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.createExhibitionParams,
  body: MuseumsAPI.ExhibitionCreateRequest,
  options?: { [key: string]: any }
) {
  const { museumId: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultMapStringLong>(
    `/api/v1/museums/${param0}/exhibitions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    }
  );
}

/** 获取展览详情 GET /api/v1/museums/${param0}/exhibitions/${param1} */
export async function getExhibitionById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getExhibitionByIdParams,
  options?: { [key: string]: any }
) {
  const { museumId: param0, id: param1, ...queryParams } = params;
  return request<MuseumsAPI.ResultExhibitionResponse>(
    `/api/v1/museums/${param0}/exhibitions/${param1}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 更新展览 PUT /api/v1/museums/${param0}/exhibitions/${param1} */
export async function updateExhibition(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.updateExhibitionParams,
  body: MuseumsAPI.ExhibitionUpdateRequest,
  options?: { [key: string]: any }
) {
  const { museumId: param0, id: param1, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(
    `/api/v1/museums/${param0}/exhibitions/${param1}`,
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

/** 删除展览 DELETE /api/v1/museums/${param0}/exhibitions/${param1} */
export async function deleteExhibition(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.deleteExhibitionParams,
  options?: { [key: string]: any }
) {
  const { museumId: param0, id: param1, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(
    `/api/v1/museums/${param0}/exhibitions/${param1}`,
    {
      method: "DELETE",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 更新展览状态 PUT /api/v1/museums/${param0}/exhibitions/${param1}/status */
export async function updateStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.updateStatusParams,
  options?: { [key: string]: any }
) {
  const { museumId: param0, id: param1, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(
    `/api/v1/museums/${param0}/exhibitions/${param1}/status`,
    {
      method: "PUT",
      params: {
        ...queryParams,
      },
      ...(options || {}),
    }
  );
}
