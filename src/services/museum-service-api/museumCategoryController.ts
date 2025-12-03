// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 分页查询分类列表 GET /api/v1/museums/categories */
export async function getCategoryPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getCategoryPageParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultIPageCategoryResponse>(
    "/api/v1/museums/categories",
    {
      method: "GET",
      params: {
        ...params,
        query: undefined,
        ...params["query"],
      },
      ...(options || {}),
    }
  );
}

/** 创建分类 POST /api/v1/museums/categories */
export async function createCategory(
  body: MuseumsAPI.CategoryCreateRequest,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultMapStringLong>("/api/v1/museums/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取分类详情 GET /api/v1/museums/categories/${param0} */
export async function getCategoryById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getCategoryByIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultCategoryResponse>(
    `/api/v1/museums/categories/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 更新分类 PUT /api/v1/museums/categories/${param0} */
export async function updateCategory(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.updateCategoryParams,
  body: MuseumsAPI.CategoryUpdateRequest,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(
    `/api/v1/museums/categories/${param0}`,
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

/** 删除分类 DELETE /api/v1/museums/categories/${param0} */
export async function deleteCategory(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.deleteCategoryParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(
    `/api/v1/museums/categories/${param0}`,
    {
      method: "DELETE",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 更新分类状态 PUT /api/v1/museums/categories/${param0}/status */
export async function updateStatus2(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.updateStatus2Params,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(
    `/api/v1/museums/categories/${param0}/status`,
    {
      method: "PUT",
      params: {
        ...queryParams,
      },
      ...(options || {}),
    }
  );
}

/** 获取所有分类列表 GET /api/v1/museums/categories/all */
export async function getAllCategories(options?: { [key: string]: any }) {
  return request<MuseumsAPI.ResultListCategoryResponse>(
    "/api/v1/museums/categories/all",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** 检查分类编码是否存在 GET /api/v1/museums/categories/check-code */
export async function checkCode2(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.checkCode2Params,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultBoolean>(
    "/api/v1/museums/categories/check-code",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}
