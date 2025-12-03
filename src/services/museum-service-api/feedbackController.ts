// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 健康检查 检查反馈服务是否正常 GET /api/v1/museums/feedback/health */
export async function health(options?: { [key: string]: any }) {
  return request<MuseumsAPI.ResultString>("/api/v1/museums/feedback/health", {
    method: "GET",
    ...(options || {}),
  });
}

/** 提交反馈建议 用户提交反馈建议，发送邮件通知 POST /api/v1/museums/feedback/submit */
export async function submitFeedback(
  body: MuseumsAPI.FeedbackRequest,
  options?: { [key: string]: any }
) {
  return request<MuseumsAPI.ResultString>("/api/v1/museums/feedback/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
