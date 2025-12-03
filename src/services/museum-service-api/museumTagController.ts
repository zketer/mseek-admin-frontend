// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 分页查询标签列表 GET /api/v1/museums/tags */
export async function getTagPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getTagPageParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultIPageTagResponse>("/api/v1/museums/tags", {
    method: "GET",
    params: {
      ...params,
      query: undefined,
      ...params["query"],
    },
    ...(options || {}),
  });
}

/** 创建标签 POST /api/v1/museums/tags */
export async function createTag(
  body: MuseumsAPI.TagCreateRequest,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultMapStringLong>("/api/v1/museums/tags", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取标签详情 GET /api/v1/museums/tags/${param0} */
export async function getTagById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getTagByIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultTagResponse>(
    `/api/v1/museums/tags/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 更新标签 PUT /api/v1/museums/tags/${param0} */
export async function updateTag(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.updateTagParams,
  body: MuseumsAPI.TagUpdateRequest,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(`/api/v1/museums/tags/${param0}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除标签 DELETE /api/v1/museums/tags/${param0} */
export async function deleteTag(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.deleteTagParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(`/api/v1/museums/tags/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取所有标签列表 GET /api/v1/museums/tags/all */
export async function getAllTags(options?: { [key: string]: any }) {
  return request<MuseumsAPI.ResultListTagResponse>("/api/v1/museums/tags/all", {
    method: "GET",
    ...(options || {}),
  });
}

/** 检查标签编码是否存在 GET /api/v1/museums/tags/check-code */
export async function checkCode(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.checkCodeParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultBoolean>("/api/v1/museums/tags/check-code", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
