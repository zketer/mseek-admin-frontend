// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 分页查询打卡记录 根据条件分页查询打卡记录列表 GET /api/v1/museums/checkin-records */
export async function getCheckinRecords1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getCheckinRecords1Params,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultIPageCheckinRecordResponse>(
    "/api/v1/museums/checkin-records",
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

/** 创建打卡记录 创建新的打卡记录并自动审核 POST /api/v1/museums/checkin-records */
export async function createCheckinRecord(
  body: MuseumsAPI.CheckinRecord,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultCheckinRecordResponse>(
    "/api/v1/museums/checkin-records",
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

/** 获取打卡记录详情 根据ID获取打卡记录的详细信息 GET /api/v1/museums/checkin-records/${param0} */
export async function getCheckinRecordDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getCheckinRecordDetailParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultCheckinRecordResponse>(
    `/api/v1/museums/checkin-records/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 删除打卡记录 删除指定的打卡记录 DELETE /api/v1/museums/checkin-records/${param0} */
export async function deleteCheckinRecord1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.deleteCheckinRecord1Params,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(
    `/api/v1/museums/checkin-records/${param0}`,
    {
      method: "DELETE",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 审核打卡记录 对指定的打卡记录进行审核 PUT /api/v1/museums/checkin-records/${param0}/audit */
export async function auditCheckinRecord(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.auditCheckinRecordParams,
  body: MuseumsAPI.CheckinAuditRequest,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultVoid>(
    `/api/v1/museums/checkin-records/${param0}/audit`,
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

/** 手动触发自动审核 对指定的打卡记录手动触发自动审核 POST /api/v1/museums/checkin-records/${param0}/auto-audit */
export async function triggerAutoAudit(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.triggerAutoAuditParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultCheckinRecordResponse>(
    `/api/v1/museums/checkin-records/${param0}/auto-audit`,
    {
      method: "POST",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 获取异常打卡记录 获取系统检测到的异常打卡记录 GET /api/v1/museums/checkin-records/anomalies */
export async function getAnomalyCheckinRecords(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getAnomalyCheckinRecordsParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultIPageCheckinRecordResponse>(
    "/api/v1/museums/checkin-records/anomalies",
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

/** 获取自动审核系统状态 检查自动审核系统的运行状态 GET /api/v1/museums/checkin-records/auto-audit/status */
export async function getAutoAuditStatus(options?: { [key: string]: any }) {
  return request<MuseumsAPI.ResultString>(
    "/api/v1/museums/checkin-records/auto-audit/status",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** 批量审核打卡记录 批量审核多个打卡记录 PUT /api/v1/museums/checkin-records/batch-audit */
export async function batchAuditCheckinRecords(
  body: MuseumsAPI.BatchCheckinAuditRequest,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultVoid>(
    "/api/v1/museums/checkin-records/batch-audit",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** 执行异常检测 手动触发异常检测任务 POST /api/v1/museums/checkin-records/detect-anomalies */
export async function detectAnomalies(options?: { [key: string]: any }) {
  return request<MuseumsAPI.ResultVoid>(
    "/api/v1/museums/checkin-records/detect-anomalies",
    {
      method: "POST",
      ...(options || {}),
    }
  );
}
