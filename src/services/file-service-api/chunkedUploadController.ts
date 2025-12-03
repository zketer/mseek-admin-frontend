// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 取消上传 取消上传并清理临时文件 POST /api/v1/files/chunked/abort */
export async function abortUpload(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsFileAPI.abortUploadParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsFileAPI.ResultVoid>("/api/v1/files/chunked/abort", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 完成上传 合并所有分片完成上传 POST /api/v1/files/chunked/complete */
export async function completeUpload(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsFileAPI.completeUploadParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsFileAPI.ResultFileRecord>(
    "/api/v1/files/chunked/complete",
    {
      method: "POST",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 初始化分片上传 开始一个新的分片上传任务，支持秒传 POST /api/v1/files/chunked/init */
export async function initUpload(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsFileAPI.initUploadParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsFileAPI.ResultMapStringObject>(
    "/api/v1/files/chunked/init",
    {
      method: "POST",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 查询上传状态 获取已上传的分片数 GET /api/v1/files/chunked/status */
export async function getUploadStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsFileAPI.getUploadStatusParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsFileAPI.ResultMapStringObject>(
    "/api/v1/files/chunked/status",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 上传分片 上传单个分片 POST /api/v1/files/chunked/upload */
export async function uploadChunk(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsFileAPI.uploadChunkParams,
  body: {},
  options?: { [key: string]: any }
) {
  return request<MuseumsFileAPI.ResultString>("/api/v1/files/chunked/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}
