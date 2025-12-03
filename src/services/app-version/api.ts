/**
 * 应用版本管理 API
 */

import { request } from '@umijs/max';

/**
 * 获取版本列表
 * @param params 查询参数
 */
export async function getAppVersions(params?: API.AppVersionQuery) {
  return request<API.Response<API.AppVersion[]>>('/api/v1/app-versions', {
    method: 'GET',
    params,
  });
}

/**
 * 获取版本详情
 * @param id 版本ID
 */
export async function getAppVersionDetail(id: number) {
  return request<API.Response<API.AppVersion>>(`/api/v1/app-versions/${id}`, {
    method: 'GET',
  });
}

/**
 * 创建版本
 * @param data 版本数据
 */
export async function createAppVersion(data: API.AppVersionForm) {
  return request<API.Response<API.AppVersion>>('/api/v1/app-versions', {
    method: 'POST',
    data,
  });
}

/**
 * 更新版本
 * @param id 版本ID
 * @param data 版本数据
 */
export async function updateAppVersion(id: number, data: API.AppVersionForm) {
  return request<API.Response<API.AppVersion>>(`/api/v1/app-versions/${id}`, {
    method: 'PUT',
    data,
  });
}

/**
 * 删除版本
 * @param id 版本ID
 */
export async function deleteAppVersion(id: number) {
  return request<API.Response<void>>(`/api/v1/app-versions/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 更新下载次数
 * @param id 版本ID
 */
export async function updateDownloadCount(id: number) {
  return request<API.Response<void>>(`/api/v1/app-versions/${id}/download`, {
    method: 'POST',
  });
}

/**
 * 获取版本统计信息
 */
export async function getAppVersionStats() {
  return request<API.Response<API.AppVersionStats>>('/api/v1/app-versions/stats', {
    method: 'GET',
  });
}

/**
 * 标记为最新版本
 * @param id 版本ID
 */
export async function markAsLatest(id: number) {
  return request<API.Response<void>>(`/api/v1/app-versions/${id}/latest`, {
    method: 'PUT',
  });
}

/**
 * 发布版本
 * @param id 版本ID
 */
export async function publishVersion(id: number) {
  return request<API.Response<void>>(`/api/v1/app-versions/${id}/publish`, {
    method: 'PUT',
  });
}

/**
 * 废弃版本
 * @param id 版本ID
 */
export async function deprecateVersion(id: number) {
  return request<API.Response<void>>(`/api/v1/app-versions/${id}/deprecate`, {
    method: 'PUT',
  });
}

