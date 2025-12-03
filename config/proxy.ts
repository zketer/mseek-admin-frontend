/**
 * @name 统一的代理配置 - 适配新的API路径结构
 * @description 后端已统一为标准的RESTful API路径，前端简化为单一Gateway配置
 *
 * 新的API路径结构:
 * - 认证: /api/v1/auth/*
 * - 用户: /api/v1/users/*
 * - 博物馆: /api/v1/museums/* (包含所有博物馆相关资源)
 *
 * 所有请求都通过Gateway统一处理
 */

/**
 * @name 基础URL配置
 * @description 统一管理后端服务地址，方便环境切换
//  */
const API_GATEWAY_URL = 'http://localhost:8000';
const FILE_SERVICE_URL = 'http://localhost:9000';

export default {
  // 开发环境配置
  dev: {
    '/api/v1/**': {
      target: API_GATEWAY_URL,
      changeOrigin: true,
    },

    // API文档和监控相关
    '/actuator/**': {
      target: API_GATEWAY_URL,
      changeOrigin: true,
    },
    '/doc.html': {
      target: API_GATEWAY_URL,
      changeOrigin: true,
    },
    '/swagger-ui/**': {
      target: API_GATEWAY_URL,
      changeOrigin: true,
    },
    '/v3/api-docs/**': {
      target: API_GATEWAY_URL,
      changeOrigin: true,
    },

    // 文件上传服务 (如果有独立的文件服务)
    '/upload/**': {
      target: FILE_SERVICE_URL,
      changeOrigin: true,
    },
  },
};
