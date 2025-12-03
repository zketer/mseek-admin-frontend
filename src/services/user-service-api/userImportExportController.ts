// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 导出用户 POST /api/v1/system/user-import-export/export */
export async function exportUsers(
  body: UsersAPI.UserExportRequest,
  options?: { [key: string]: any }
) {
  return request<any>("/api/v1/system/user-import-export/export", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 导出所有用户 GET /api/v1/system/user-import-export/export/all */
export async function exportAllUsers(options?: { [key: string]: any }) {
  return request<any>("/api/v1/system/user-import-export/export/all", {
    method: "GET",
    ...(options || {}),
  });
}

/** 根据条件导出用户 GET /api/v1/system/user-import-export/export/query */
export async function exportUsersByQuery(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.exportUsersByQueryParams,
  options?: { [key: string]: any }
) {
  return request<any>("/api/v1/system/user-import-export/export/query", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 导入用户 POST /api/v1/system/user-import-export/import */
export async function importUsers1(
  body: {
    request?: UsersAPI.UserImportRequest;
  },
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultUserImportResult>(
    "/api/v1/system/user-import-export/import",
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

/** 下载用户导入模板 GET /api/v1/system/user-import-export/template */
export async function downloadTemplate1(options?: { [key: string]: any }) {
  return request<string>("/api/v1/system/user-import-export/template", {
    method: "GET",
    ...(options || {}),
  });
}
