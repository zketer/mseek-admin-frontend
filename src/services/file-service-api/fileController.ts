// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 获取文件信息 GET /api/v1/files/${param0} */
export async function getFileRecord(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsFileAPI.getFileRecordParams,
  options?: { [key: string]: any }
) {
  const { fileId: param0, ...queryParams } = params;
  return request<MuseumsFileAPI.ResultFileRecord>(`/api/v1/files/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 删除文件 DELETE /api/v1/files/${param0} */
export async function deleteFile(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsFileAPI.deleteFileParams,
  options?: { [key: string]: any }
) {
  const { fileId: param0, ...queryParams } = params;
  return request<MuseumsFileAPI.ResultVoid>(`/api/v1/files/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 批量获取文件信息 POST /api/v1/files/batch */
export async function getBatchFileRecords(
  body: number[],
  options?: { [key: string]: any }
) {
  return request<MuseumsFileAPI.ResultMapLongFileRecord>(
    "/api/v1/files/batch",
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

/** 获取文件强制下载URL GET /api/v1/files/download-url/${param0} */
export async function getFileDownloadUrl(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsFileAPI.getFileDownloadUrlParams,
  options?: { [key: string]: any }
) {
  const { fileId: param0, ...queryParams } = params;
  return request<MuseumsFileAPI.ResultString>(
    `/api/v1/files/download-url/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 根据文件名获取强制下载URL GET /api/v1/files/download-url/name/${param0} */
export async function getFileDownloadUrlByName(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsFileAPI.getFileDownloadUrlByNameParams,
  options?: { [key: string]: any }
) {
  const { fileName: param0, ...queryParams } = params;
  return request<MuseumsFileAPI.ResultString>(
    `/api/v1/files/download-url/name/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 下载文件 GET /api/v1/files/download/${param0} */
export async function downloadFile(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsFileAPI.downloadFileParams,
  options?: { [key: string]: any }
) {
  const { fileId: param0, ...queryParams } = params;
  return request<any>(`/api/v1/files/download/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 根据文件名下载文件 GET /api/v1/files/download/name/${param0} */
export async function downloadFileByName(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsFileAPI.downloadFileByNameParams,
  options?: { [key: string]: any }
) {
  const { fileName: param0, ...queryParams } = params;
  return request<any>(`/api/v1/files/download/name/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 检查文件是否存在 GET /api/v1/files/exists/${param0} */
export async function fileExists(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsFileAPI.fileExistsParams,
  options?: { [key: string]: any }
) {
  const { fileName: param0, ...queryParams } = params;
  return request<MuseumsFileAPI.ResultBoolean>(
    `/api/v1/files/exists/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 根据文件名获取文件信息 GET /api/v1/files/name/${param0} */
export async function getFileRecordByName(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsFileAPI.getFileRecordByNameParams,
  options?: { [key: string]: any }
) {
  const { fileName: param0, ...queryParams } = params;
  return request<MuseumsFileAPI.ResultFileRecord>(
    `/api/v1/files/name/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 根据文件名删除文件 DELETE /api/v1/files/name/${param0} */
export async function deleteFileByName(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsFileAPI.deleteFileByNameParams,
  options?: { [key: string]: any }
) {
  const { fileName: param0, ...queryParams } = params;
  return request<MuseumsFileAPI.ResultVoid>(`/api/v1/files/name/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 上传单个文件 POST /api/v1/files/upload */
export async function uploadFile(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsFileAPI.uploadFileParams,
  body: {},
  file?: File,
  options?: { [key: string]: any }
) {
  const formData = new FormData();

  if (file) {
    formData.append("file", file);
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === "object" && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ""));
        } else {
          formData.append(
            ele,
            new Blob([JSON.stringify(item)], { type: "application/json" })
          );
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

  return request<MuseumsFileAPI.ResultFileRecord>("/api/v1/files/upload", {
    method: "POST",
    params: {
      ...params,
    },
    data: formData,
    requestType: "form",
    ...(options || {}),
  });
}

/** 批量上传文件 POST /api/v1/files/upload/batch */
export async function uploadFiles(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsFileAPI.uploadFilesParams,
  options?: { [key: string]: any }
) {
  return request<MuseumsFileAPI.ResultListFileRecord>(
    "/api/v1/files/upload/batch",
    {
      method: "POST",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 获取文件访问URL GET /api/v1/files/url/${param0} */
export async function getFileUrl(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsFileAPI.getFileUrlParams,
  options?: { [key: string]: any }
) {
  const { fileId: param0, ...queryParams } = params;
  return request<MuseumsFileAPI.ResultString>(`/api/v1/files/url/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 根据文件名获取访问URL GET /api/v1/files/url/name/${param0} */
export async function getFileUrlByName(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: MuseumsFileAPI.getFileUrlByNameParams,
  options?: { [key: string]: any }
) {
  const { fileName: param0, ...queryParams } = params;
  return request<MuseumsFileAPI.ResultString>(
    `/api/v1/files/url/name/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 批量获取文件访问URL POST /api/v1/files/urls/batch */
export async function getBatchFileUrls(
  body: number[],
  options?: { [key: string]: any }
) {
  return request<MuseumsFileAPI.ResultListMapStringObject>(
    "/api/v1/files/urls/batch",
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
