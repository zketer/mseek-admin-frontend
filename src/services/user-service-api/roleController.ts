// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 分页查询角色列表 GET /api/v1/system/roles */
export async function getRolePage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getRolePageParams,
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultPageResultRoleResponse>(
    "/api/v1/system/roles",
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

/** 更新角色 PUT /api/v1/system/roles */
export async function updateRole(
  body: UsersAPI.RoleUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultVoid>("/api/v1/system/roles", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 创建角色 POST /api/v1/system/roles */
export async function createRole(
  body: UsersAPI.RoleCreateRequest,
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultLong>("/api/v1/system/roles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据ID查询角色 GET /api/v1/system/roles/${param0} */
export async function getRoleById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getRoleByIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<UsersAPI.ResultRoleResponse>(
    `/api/v1/system/roles/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 删除角色 DELETE /api/v1/system/roles/${param0} */
export async function deleteRole(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.deleteRoleParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<UsersAPI.ResultVoid>(`/api/v1/system/roles/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取角色权限列表 GET /api/v1/system/roles/${param0}/permissions */
export async function getRolePermissions(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getRolePermissionsParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<UsersAPI.ResultListString>(
    `/api/v1/system/roles/${param0}/permissions`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 分配角色权限 PUT /api/v1/system/roles/${param0}/permissions */
export async function assignPermissions(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.assignPermissionsParams,
  body: number[],
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<UsersAPI.ResultVoid>(
    `/api/v1/system/roles/${param0}/permissions`,
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

/** 启用/禁用角色 PUT /api/v1/system/roles/${param0}/status */
export async function updateRoleStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.updateRoleStatusParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<UsersAPI.ResultVoid>(`/api/v1/system/roles/${param0}/status`, {
    method: "PUT",
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** 查询所有角色 GET /api/v1/system/roles/all */
export async function getAllRoles(options?: { [key: string]: any }) {
  return request<UsersAPI.ResultListRoleResponse>("/api/v1/system/roles/all", {
    method: "GET",
    ...(options || {}),
  });
}

/** 批量删除角色 DELETE /api/v1/system/roles/batch */
export async function deleteBatchRoles(
  body: number[],
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultVoid>("/api/v1/system/roles/batch", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 检查角色编码是否存在 GET /api/v1/system/roles/check-code */
export async function checkRoleCode(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.checkRoleCodeParams,
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultBoolean>("/api/v1/system/roles/check-code", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 根据角色编码查询角色 GET /api/v1/system/roles/code/${param0} */
export async function getRoleByCode(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getRoleByCodeParams,
  options?: { [key: string]: any }
) {
  const { roleCode: param0, ...queryParams } = params;
  return request<UsersAPI.ResultRoleResponse>(
    `/api/v1/system/roles/code/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 查询启用的角色 GET /api/v1/system/roles/enabled */
export async function getEnabledRoles(options?: { [key: string]: any }) {
  return request<UsersAPI.ResultListRoleResponse>(
    "/api/v1/system/roles/enabled",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** 根据用户ID查询角色列表 GET /api/v1/system/roles/user/${param0} */
export async function getRolesByUserId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getRolesByUserIdParams,
  options?: { [key: string]: any }
) {
  const { userId: param0, ...queryParams } = params;
  return request<UsersAPI.ResultListRoleResponse>(
    `/api/v1/system/roles/user/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}
