// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 获取用户成就列表 获取用户的所有成就及其完成情况 GET /api/v1/museums/miniapp/achievements */
export async function getUserAchievements(options?: { [key: string]: any }) {
  return request<MuseumsAPI.ResultListAchievementResponse>(
    "/api/v1/museums/miniapp/achievements",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** 检查并解锁新成就 检查用户是否达成新的成就条件并自动解锁 POST /api/v1/museums/miniapp/achievements/check */
export async function checkAndUnlockAchievements(options?: {
  [key: string]: any;
}) {
  return request<MuseumsAPI.ResultListAchievementResponse>(
    "/api/v1/museums/miniapp/achievements/check",
    {
      method: "POST",
      ...(options || {}),
    }
  );
}

/** 更新成就进度 内部接口：更新用户成就进度 POST /api/v1/museums/miniapp/achievements/progress */
export async function updateAchievementProgress(
  body: Record<string, any>,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultVoid>(
    "/api/v1/museums/miniapp/achievements/progress",
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

/** 分享成就 分享已解锁的成就 POST /api/v1/museums/miniapp/achievements/share */
export async function shareAchievement(
  body: Record<string, any>,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultBoolean>(
    "/api/v1/museums/miniapp/achievements/share",
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

/** 获取成就统计信息 获取用户成就完成统计 GET /api/v1/museums/miniapp/achievements/stats */
export async function getAchievementStats(options?: { [key: string]: any }) {
  return request<MuseumsAPI.ResultAchievementStatsResponse>(
    "/api/v1/museums/miniapp/achievements/stats",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}
