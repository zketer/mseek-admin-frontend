// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 分页查询操作日志列表 GET /api/v1/system/operation-logs */
export async function getOperateLogPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getOperateLogPageParams,
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultIPageOperationLogResponse>(
    "/api/v1/system/operation-logs",
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

/** 根据ID查询操作日志 GET /api/v1/system/operation-logs/${param0} */
export async function getOperateLogById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getOperateLogByIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<UsersAPI.ResultOperationLogResponse>(
    `/api/v1/system/operation-logs/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 删除操作日志 DELETE /api/v1/system/operation-logs/${param0} */
export async function deleteById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.deleteByIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<UsersAPI.ResultVoid>(
    `/api/v1/system/operation-logs/${param0}`,
    {
      method: "DELETE",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 批量删除操作日志 DELETE /api/v1/system/operation-logs/batch */
export async function deleteBatch(
  body: number[],
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultVoid>("/api/v1/system/operation-logs/batch", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 清理指定天数前的日志 DELETE /api/v1/system/operation-logs/clean */
export async function cleanLogs(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.cleanLogsParams,
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultInteger>(
    "/api/v1/system/operation-logs/clean",
    {
      method: "DELETE",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 导出操作日志 POST /api/v1/system/operation-logs/export */
export async function exportLogs(
  body: UsersAPI.OperationLogQueryRequest,
  options?: { [key: string]: any }
) {
  return request<any>("/api/v1/system/operation-logs/export", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取热门操作排行 GET /api/v1/system/operation-logs/popular-operations */
export async function getPopularOperations(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getPopularOperationsParams,
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultListMapStringObject>(
    "/api/v1/system/operation-logs/popular-operations",
    {
      method: "GET",
      params: {
        // days has a default value: 7
        days: "7",
        // limit has a default value: 10
        limit: "10",
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 获取操作日志统计 GET /api/v1/system/operation-logs/statistics */
export async function getStatistics(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getStatisticsParams,
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultMapStringObject>(
    "/api/v1/system/operation-logs/statistics",
    {
      method: "GET",
      params: {
        // days has a default value: 7
        days: "7",
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 获取用户操作统计 GET /api/v1/system/operation-logs/user-statistics */
export async function getUserOperationStatistics(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UsersAPI.getUserOperationStatisticsParams,
  options?: { [key: string]: any }
) {
  return request<UsersAPI.ResultListMapStringObject>(
    "/api/v1/system/operation-logs/user-statistics",
    {
      method: "GET",
      params: {
        // days has a default value: 7
        days: "7",
        // limit has a default value: 10
        limit: "10",
        ...params,
      },
      ...(options || {}),
    }
  );
}
