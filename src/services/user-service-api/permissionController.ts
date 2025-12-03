// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 更新权限 PUT /api/v1/system/permissions */
export async function updatePermission(
  body: UsersAPI.PermissionUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultVoid>("/api/v1/system/permissions", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 创建权限 POST /api/v1/system/permissions */
export async function createPermission(
  body: UsersAPI.PermissionCreateRequest,
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultLong>("/api/v1/system/permissions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据ID查询权限 GET /api/v1/system/permissions/${param0} */
export async function getPermissionById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getPermissionByIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<UsersAPI.ResultPermissionResponse>(
    `/api/v1/system/permissions/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 删除权限 DELETE /api/v1/system/permissions/${param0} */
export async function deletePermission(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.deletePermissionParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<UsersAPI.ResultVoid>(`/api/v1/system/permissions/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 启用/禁用权限 PUT /api/v1/system/permissions/${param0}/status */
export async function updatePermissionStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.updatePermissionStatusParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<UsersAPI.ResultVoid>(
    `/api/v1/system/permissions/${param0}/status`,
    {
      method: "PUT",
      params: {
        ...queryParams,
      },
      ...(options || {}),
    }
  );
}

/** 查询所有权限 GET /api/v1/system/permissions/all */
export async function getAllPermissions(options?: { [key: string]: any }) {
  return request<UsersAPI.ResultListPermissionResponse>(
    "/api/v1/system/permissions/all",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** 批量删除权限 DELETE /api/v1/system/permissions/batch */
export async function deleteBatchPermissions(
  body: number[],
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultVoid>("/api/v1/system/permissions/batch", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据父级ID查询子权限 GET /api/v1/system/permissions/children/${param0} */
export async function getPermissionsByParentId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getPermissionsByParentIdParams,
  options?: { [key: string]: any }
) {
  const { parentId: param0, ...queryParams } = params;
  return request<UsersAPI.ResultListPermissionResponse>(
    `/api/v1/system/permissions/children/${param0}`,
    {
      method: "GET",
      params: {
        ...queryParams,
      },
      ...(options || {}),
    }
  );
}

/** 查询启用的权限 GET /api/v1/system/permissions/enabled */
export async function getEnabledPermissions(options?: { [key: string]: any }) {
  return request<UsersAPI.ResultListPermissionResponse>(
    "/api/v1/system/permissions/enabled",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** 检查权限编码是否存在 GET /api/v1/system/permissions/exists */
export async function existsByPermissionCode(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.existsByPermissionCodeParams,
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultBoolean>("/api/v1/system/permissions/exists", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 初始化演示权限数据（仅当无数据时） POST /api/v1/system/permissions/init-demo */
export async function initDemoData(options?: { [key: string]: any }) {
  return request<UsersAPI.ResultInteger>(
    "/api/v1/system/permissions/init-demo",
    {
      method: "POST",
      ...(options || {}),
    }
  );
}

/** 分页查询权限列表 GET /api/v1/system/permissions/page */
export async function getPermissionPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getPermissionPageParams,
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultPageResultPermissionResponse>(
    "/api/v1/system/permissions/page",
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

/** 根据角色ID查询权限列表 GET /api/v1/system/permissions/role/${param0} */
export async function getPermissionsByRoleId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getPermissionsByRoleIdParams,
  options?: { [key: string]: any }
) {
  const { roleId: param0, ...queryParams } = params;
  return request<UsersAPI.ResultListPermissionResponse>(
    `/api/v1/system/permissions/role/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 查询权限树 GET /api/v1/system/permissions/tree */
export async function getPermissionTree(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getPermissionTreeParams,
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultListPermissionResponse>(
    "/api/v1/system/permissions/tree",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 查询按类型分组的权限树 GET /api/v1/system/permissions/tree-by-type */
export async function getPermissionTreeByType(options?: {
  [key: string]: any;
}) {
  return request<UsersAPI.ResultListPermissionResponse>(
    "/api/v1/system/permissions/tree-by-type",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** 根据用户ID查询权限列表 GET /api/v1/system/permissions/user/${param0} */
export async function getPermissionsByUserId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getPermissionsByUserIdParams,
  options?: { [key: string]: any }
) {
  const { userId: param0, ...queryParams } = params;
  return request<UsersAPI.ResultListPermissionResponse>(
    `/api/v1/system/permissions/user/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}
