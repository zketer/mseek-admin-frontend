// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 获取打卡详情 获取指定打卡记录的详细信息 GET /api/v1/museums/miniapp/checkin/${param0} */
export async function getCheckinDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getCheckinDetailParams,
  options?: { [key: string]: any }
) {
  const { checkinId: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultCheckinRecord>(
    `/api/v1/museums/miniapp/checkin/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 删除打卡记录 删除指定的正式打卡记录 DELETE /api/v1/museums/miniapp/checkin/${param0} */
export async function deleteCheckinRecord(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.deleteCheckinRecordParams,
  options?: { [key: string]: any }
) {
  const { checkinId: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultBoolean>(
    `/api/v1/museums/miniapp/checkin/${param0}`,
    {
      method: "DELETE",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 删除暂存记录 删除指定的暂存记录 DELETE /api/v1/museums/miniapp/checkin/draft/${param0} */
export async function deleteDraft(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.deleteDraftParams,
  options?: { [key: string]: any }
) {
  const { draftId: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultBoolean>(
    `/api/v1/museums/miniapp/checkin/draft/${param0}`,
    {
      method: "DELETE",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 将暂存转为正式打卡 将暂存记录转换为正式打卡记录 POST /api/v1/museums/miniapp/checkin/draft/${param0}/convert */
export async function convertDraftToCheckin(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.convertDraftToCheckinParams,
  options?: { [key: string]: any }
) {
  const { draftId: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultCheckinSubmitResponse>(
    `/api/v1/museums/miniapp/checkin/draft/${param0}/convert`,
    {
      method: "POST",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 获取省份博物馆详情 获取指定省份的博物馆列表及用户访问状态 GET /api/v1/museums/miniapp/checkin/provinces/${param0}/museums */
export async function getProvinceMuseumDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getProvinceMuseumDetailParams,
  options?: { [key: string]: any }
) {
  const { provinceCode: param0, ...queryParams } = params;
  return request<MuseumsAPI.ResultProvinceMuseumDetailResponse>(
    `/api/v1/museums/miniapp/checkin/provinces/${param0}/museums`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 获取打卡记录列表 分页获取用户的打卡记录，支持搜索和筛选 GET /api/v1/museums/miniapp/checkin/records */
export async function getCheckinRecords(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsAPI.getCheckinRecordsParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultIPageCheckinRecord>(
    "/api/v1/museums/miniapp/checkin/records",
    {
      method: "GET",
      params: {
        // page has a default value: 1
        page: "1",
        // pageSize has a default value: 10
        pageSize: "10",

        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 获取打卡统计 获取用户的打卡统计信息 GET /api/v1/museums/miniapp/checkin/stats */
export async function getCheckinStats(options?: { [key: string]: any }) {
  return request<MuseumsAPI.ResultCheckinStatsResponse>(
    "/api/v1/museums/miniapp/checkin/stats",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** 获取省份打卡统计 获取用户的省份足迹地图统计数据 GET /api/v1/museums/miniapp/checkin/stats/provinces */
export async function getProvinceStats(options?: { [key: string]: any }) {
  return request<MuseumsAPI.ResultProvinceCheckinStatsResponse>(
    "/api/v1/museums/miniapp/checkin/stats/provinces",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** 提交打卡/暂存 提交打卡记录或保存为暂存 POST /api/v1/museums/miniapp/checkin/submit */
export async function submitCheckin(
  body: MuseumsAPI.CheckinSubmitRequest,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultCheckinSubmitResponse>(
    "/api/v1/museums/miniapp/checkin/submit",
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
