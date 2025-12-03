// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 查询部门列表 GET /api/v1/system/departments */
export async function getDepartmentList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getDepartmentListParams,
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultListDepartmentResponse>(
    "/api/v1/system/departments",
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

/** 更新部门 PUT /api/v1/system/departments */
export async function updateDepartment(
  body: UsersAPI.DepartmentUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultVoid>("/api/v1/system/departments", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 创建部门 POST /api/v1/system/departments */
export async function createDepartment(
  body: UsersAPI.DepartmentCreateRequest,
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultLong>("/api/v1/system/departments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据ID查询部门 GET /api/v1/system/departments/${param0} */
export async function getDeptById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getDeptByIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<UsersAPI.ResultDepartmentResponse>(
    `/api/v1/system/departments/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 删除部门 DELETE /api/v1/system/departments/${param0} */
export async function deleteDepartment(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.deleteDepartmentParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<UsersAPI.ResultVoid>(`/api/v1/system/departments/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 启用/停用部门 PUT /api/v1/system/departments/${param0}/status */
export async function updateDepartmentStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.updateDepartmentStatusParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<UsersAPI.ResultVoid>(
    `/api/v1/system/departments/${param0}/status`,
    {
      method: "PUT",
      params: {
        ...queryParams,
      },
      ...(options || {}),
    }
  );
}

/** 获取部门用户列表 GET /api/v1/system/departments/${param0}/users */
export async function getDepartmentUsers(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getDepartmentUsersParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<UsersAPI.ResultListLong>(
    `/api/v1/system/departments/${param0}/users`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 移动用户到部门 PUT /api/v1/system/departments/${param0}/users */
export async function moveUsersToDepart(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.moveUsersToDepartParams,
  body: number[],
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<UsersAPI.ResultVoid>(
    `/api/v1/system/departments/${param0}/users`,
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

/** 批量删除部门 DELETE /api/v1/system/departments/batch */
export async function deleteBatchDepartments(
  body: number[],
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultVoid>("/api/v1/system/departments/batch", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 检查部门编码是否存在 GET /api/v1/system/departments/check-code */
export async function checkDeptCode(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.checkDeptCodeParams,
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultBoolean>(
    "/api/v1/system/departments/check-code",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 根据父级ID查询子部门 GET /api/v1/system/departments/children/${param0} */
export async function getChildrenByParentId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getChildrenByParentIdParams,
  options?: { [key: string]: any }
) {
  const { parentId: param0, ...queryParams } = params;
  return request<UsersAPI.ResultListDepartmentResponse>(
    `/api/v1/system/departments/children/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 查询启用的部门列表 GET /api/v1/system/departments/enabled */
export async function getEnabledDepartments(options?: { [key: string]: any }) {
  return request<UsersAPI.ResultListDepartmentResponse>(
    "/api/v1/system/departments/enabled",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** 查询部门树 GET /api/v1/system/departments/tree */
export async function getDepartmentTree(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getDepartmentTreeParams,
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultListDepartmentResponse>(
    "/api/v1/system/departments/tree",
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
