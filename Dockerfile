# 直接使用nginx提供静态文件服务
FROM nginx:alpine

# 创建应用目录
RUN mkdir -p /app/dist

# 复制构建产物（假设已在本地执行npm run build）
COPY museum-ui-pro/dist/ /opt/museum-frontend/

# 复制Nginx配置
COPY docker/nginx/frontend.conf /etc/nginx/conf.d/default.conf

# 创建日志目录
RUN mkdir -p /var/log/nginx && \
    chmod 755 /var/log/nginx

# 安装curl用于健康检查
RUN apk add --no-cache curl

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost || exit 1

# 暴露端口
EXPOSE 80

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]