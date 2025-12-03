// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 获取JWKS 返回用于验证JWT的公钥集合，符合RFC 7517标准 GET /api/v1/auth/.well-known/jwks.json */
export async function getJwks(options?: { [key: string]: any }) {
  return request<Record<string, any>>("/api/v1/auth/.well-known/jwks.json", {
    method: "GET",
    ...(options || {}),
  });
}

/** 获取公钥信息 返回当前使用的公钥信息（调试用） GET /api/v1/auth/.well-known/public-key */
export async function getPublicKeyInfo(options?: { [key: string]: any }) {
  return request<Record<string, any>>("/api/v1/auth/.well-known/public-key", {
    method: "GET",
    ...(options || {}),
  });
}
