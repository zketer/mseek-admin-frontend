// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 创建文件业务关联 POST /api/v1/museums/file-relations */
export async function createRelation(
  body: MuseumsAPI.CreateRelationRequest,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultFileBusinessRelation>(
    "/api/v1/museums/file-relations",
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

/** 更新文件关联排序 PUT /api/v1/museums/file-relations/${param0}/sort */
export async function updateSortOrder(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.updateSortOrderParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(
    `/api/v1/museums/file-relations/${param0}/sort`,
    {
      method: "PUT",
      params: {
        ...queryParams,
      },
      ...(options || {}),
    }
  );
}

/** 批量创建文件业务关联 POST /api/v1/museums/file-relations/batch */
export async function batchCreateRelation(
  body: MuseumsAPI.BatchCreateRelationRequest,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultListFileBusinessRelation>(
    "/api/v1/museums/file-relations/batch",
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

/** 根据业务实体查询文件关联 GET /api/v1/museums/file-relations/business */
export async function getByBusiness(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getByBusinessParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultListFileBusinessRelation>(
    "/api/v1/museums/file-relations/business",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 删除业务实体的所有文件关联 DELETE /api/v1/museums/file-relations/business */
export async function deleteByBusiness(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.deleteByBusinessParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultVoid>(
    "/api/v1/museums/file-relations/business",
    {
      method: "DELETE",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 获取业务实体的文件ID列表 GET /api/v1/museums/file-relations/business/${param0}/files */
export async function getBusinessFileIds(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getBusinessFileIdsParams,
  options?: { [key: string]: any }
) {
  const { businessId: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultListLong>(
    `/api/v1/museums/file-relations/business/${param0}/files`,
    {
      method: "GET",
      params: {
        ...queryParams,
      },
      ...(options || {}),
    }
  );
}

/** 获取业务实体的主图文件ID GET /api/v1/museums/file-relations/business/${param0}/main-image */
export async function getMainImageFileId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getMainImageFileIdParams,
  options?: { [key: string]: any }
) {
  const { businessId: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultLong>(
    `/api/v1/museums/file-relations/business/${param0}/main-image`,
    {
      method: "GET",
      params: {
        ...queryParams,
      },
      ...(options || {}),
    }
  );
}

/** 设置业务实体的主图 PUT /api/v1/museums/file-relations/business/${param0}/main-image */
export async function setMainImage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.setMainImageParams,
  options?: { [key: string]: any }
) {
  const { businessId: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultFileBusinessRelation>(
    `/api/v1/museums/file-relations/business/${param0}/main-image`,
    {
      method: "PUT",
      params: {
        ...queryParams,
      },
      ...(options || {}),
    }
  );
}

/** 获取枚举值列表 GET /api/v1/museums/file-relations/enums */
export async function getEnums(options?: { [key: string]: any }) {
  return request<MuseumsAPI.ResultMapStringObject>(
    "/api/v1/museums/file-relations/enums",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** 根据文件ID查询业务关联 GET /api/v1/museums/file-relations/file/${param0} */
export async function getByFileId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getByFileIdParams,
  options?: { [key: string]: any }
) {
  const { fileId: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultListFileBusinessRelation>(
    `/api/v1/museums/file-relations/file/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 删除文件的所有业务关联 DELETE /api/v1/museums/file-relations/file/${param0} */
export async function deleteByFileId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.deleteByFileIdParams,
  options?: { [key: string]: any }
) {
  const { fileId: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(
    `/api/v1/museums/file-relations/file/${param0}`,
    {
      method: "DELETE",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 检查文件是否被使用 GET /api/v1/museums/file-relations/file/${param0}/in-use */
export async function isFileInUse(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.isFileInUseParams,
  options?: { [key: string]: any }
) {
  const { fileId: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultBoolean>(
    `/api/v1/museums/file-relations/file/${param0}/in-use`,
    {
      method: "GET",
      params: {
        ...queryParams,
      },
      ...(options || {}),
    }
  );
}
