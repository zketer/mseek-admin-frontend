// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 分页查询用户列表 GET /api/v1/system/users */
export async function getUserPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getUserPageParams,
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultIPageUserResponse>("/api/v1/system/users", {
    method: "GET",
    params: {
      ...params,
      query: undefined,
      ...params["query"],
    },
    ...(options || {}),
  });
}

/** 更新用户 PUT /api/v1/system/users */
export async function updateUser(
  body: UsersAPI.UserUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultVoid>("/api/v1/system/users", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 创建用户（注册） 用于用户注册，返回用户基础信息 POST /api/v1/system/users */
export async function createUser(
  body: Record<string, any>,
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultUserBasicInfo>("/api/v1/system/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据ID查询用户 GET /api/v1/system/users/${param0} */
export async function getUserById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getUserByIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<UsersAPI.ResultUserResponse>(
    `/api/v1/system/users/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 删除用户 DELETE /api/v1/system/users/${param0} */
export async function deleteUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.deleteUserParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<UsersAPI.ResultVoid>(`/api/v1/system/users/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 用户头像上传（Base64） POST /api/v1/system/users/${param0}/avatar/base64 */
export async function uploadAvatarBase64(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.uploadAvatarBase64Params,
  body: Record<string, any>,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<UsersAPI.ResultString>(
    `/api/v1/system/users/${param0}/avatar/base64`,
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

/** 修改用户密码 PUT /api/v1/system/users/${param0}/change-password */
export async function changePassword(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.changePasswordParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<UsersAPI.ResultVoid>(
    `/api/v1/system/users/${param0}/change-password`,
    {
      method: "PUT",
      params: {
        ...queryParams,
      },
      ...(options || {}),
    }
  );
}

/** 锁定用户 PUT /api/v1/system/users/${param0}/lock */
export async function lockUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.lockUserParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<UsersAPI.ResultVoid>(`/api/v1/system/users/${param0}/lock`, {
    method: "PUT",
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** 重置用户密码 PUT /api/v1/system/users/${param0}/password */
export async function resetPassword(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.resetPasswordParams,
  body: Record<string, any>,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<UsersAPI.ResultVoid>(
    `/api/v1/system/users/${param0}/password`,
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

/** 获取用户权限列表 GET /api/v1/system/users/${param0}/permissions */
export async function getUserPermissions(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getUserPermissionsParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<UsersAPI.ResultListString>(
    `/api/v1/system/users/${param0}/permissions`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 获取用户个人资料 GET /api/v1/system/users/${param0}/profile */
export async function getUserProfile(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getUserProfileParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<UsersAPI.ResultObject>(
    `/api/v1/system/users/${param0}/profile`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 更新用户个人资料 PUT /api/v1/system/users/${param0}/profile */
export async function updateUserProfile(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.updateUserProfileParams,
  body: Record<string, any>,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<UsersAPI.ResultVoid>(
    `/api/v1/system/users/${param0}/profile`,
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

/** 获取用户角色列表 GET /api/v1/system/users/${param0}/roles */
export async function getUserRoles(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getUserRolesParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<UsersAPI.ResultListString>(
    `/api/v1/system/users/${param0}/roles`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 分配用户角色 PUT /api/v1/system/users/${param0}/roles */
export async function assignRoles(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.assignRolesParams,
  body: number[],
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<UsersAPI.ResultVoid>(`/api/v1/system/users/${param0}/roles`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 启用/禁用用户 PUT /api/v1/system/users/${param0}/status */
export async function updateUserStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.updateUserStatusParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<UsersAPI.ResultVoid>(`/api/v1/system/users/${param0}/status`, {
    method: "PUT",
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** 解锁用户 PUT /api/v1/system/users/${param0}/unlock */
export async function unlockUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.unlockUserParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<UsersAPI.ResultVoid>(`/api/v1/system/users/${param0}/unlock`, {
    method: "PUT",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 创建用户（管理端） 管理端创建用户，返回用户ID POST /api/v1/system/users/admin */
export async function createUserForAdmin(
  body: UsersAPI.UserCreateRequest,
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultLong>("/api/v1/system/users/admin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量删除用户 DELETE /api/v1/system/users/batch */
export async function deleteBatchUsers(
  body: number[],
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultVoid>("/api/v1/system/users/batch", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 检查邮箱是否存在 GET /api/v1/system/users/check-email */
export async function checkEmail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.checkEmailParams,
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultBoolean>("/api/v1/system/users/check-email", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 检查邮箱是否存在 用于注册场景，不抛异常，返回true表示已存在，false表示不存在 GET /api/v1/system/users/check-email/${param0} */
export async function checkEmailExists(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.checkEmailExistsParams,
  options?: { [key: string]: any }
) {
  const { email: param0, ...queryParams } = params;
  return request<UsersAPI.ResultBoolean>(
    `/api/v1/system/users/check-email/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 检查手机号是否存在 GET /api/v1/system/users/check-phone */
export async function checkPhone(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.checkPhoneParams,
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultBoolean>("/api/v1/system/users/check-phone", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 检查用户名是否存在 GET /api/v1/system/users/check-username */
export async function checkUsername(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.checkUsernameParams,
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultBoolean>(
    "/api/v1/system/users/check-username",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 检查用户名是否存在 用于注册场景，不抛异常，返回true表示已存在，false表示不存在 GET /api/v1/system/users/check-username/${param0} */
export async function checkUsernameExists(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.checkUsernameExistsParams,
  options?: { [key: string]: any }
) {
  const { username: param0, ...queryParams } = params;
  return request<UsersAPI.ResultBoolean>(
    `/api/v1/system/users/check-username/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 根据部门ID查询用户列表 GET /api/v1/system/users/department/${param0} */
export async function getUsersByDeptId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getUsersByDeptIdParams,
  options?: { [key: string]: any }
) {
  const { deptId: param0, ...queryParams } = params;
  return request<UsersAPI.ResultListUserResponse>(
    `/api/v1/system/users/department/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 根据邮箱查询用户基础信息 GET /api/v1/system/users/email/${param0}/basic */
export async function getUserBasicInfoByEmail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getUserBasicInfoByEmailParams,
  options?: { [key: string]: any }
) {
  const { email: param0, ...queryParams } = params;
  return request<UsersAPI.ResultUserBasicInfo>(
    `/api/v1/system/users/email/${param0}/basic`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 批量导出用户 GET /api/v1/system/users/export */
export async function exportUsers1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.exportUsers1Params,
  options?: { [key: string]: any }
) {
  return request<any>("/api/v1/system/users/export", {
    method: "GET",
    params: {
      ...params,
      query: undefined,
      ...params["query"],
    },
    ...(options || {}),
  });
}

/** 批量导入用户 POST /api/v1/system/users/import */
export async function importUsers(body: {}, options?: { [key: string]: any }) {
  return request<UsersAPI.ResultMapStringObject>(
    "/api/v1/system/users/import",
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

/** 根据角色ID查询用户列表 GET /api/v1/system/users/role/${param0} */
export async function getUsersByRoleId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getUsersByRoleIdParams,
  options?: { [key: string]: any }
) {
  const { roleId: param0, ...queryParams } = params;
  return request<UsersAPI.ResultListUserResponse>(
    `/api/v1/system/users/role/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 获取用户统计信息 GET /api/v1/system/users/statistics */
export async function getUserStatistics(options?: { [key: string]: any }) {
  return request<UsersAPI.ResultObject>("/api/v1/system/users/statistics", {
    method: "GET",
    ...(options || {}),
  });
}

/** 下载用户导入模板 GET /api/v1/system/users/template */
export async function downloadTemplate(options?: { [key: string]: any }) {
  return request<any>("/api/v1/system/users/template", {
    method: "GET",
    ...(options || {}),
  });
}

/** 创建第三方登录用户 为微信、支付宝等第三方登录创建用户 POST /api/v1/system/users/third-party */
export async function createThirdPartyUser(
  body: Record<string, any>,
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultUserBasicInfo>(
    "/api/v1/system/users/third-party",
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

/** 根据用户名查询用户 GET /api/v1/system/users/username/${param0} */
export async function getByUsername(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getByUsernameParams,
  options?: { [key: string]: any }
) {
  const { username: param0, ...queryParams } = params;
  return request<UsersAPI.ResultUserResponse>(
    `/api/v1/system/users/username/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 根据用户名查询用户基础信息 GET /api/v1/system/users/username/${param0}/basic */
export async function getUserBasicInfoByUsername(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getUserBasicInfoByUsernameParams,
  options?: { [key: string]: any }
) {
  const { username: param0, ...queryParams } = params;
  return request<UsersAPI.ResultUserBasicInfo>(
    `/api/v1/system/users/username/${param0}/basic`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}
