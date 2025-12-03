/**
 * XSS 防护工具
 * 使用 DOMPurify 清理用户输入的 HTML 内容
 */

import DOMPurify from 'dompurify';

/** 清理配置 */
interface SanitizeConfig {
  /** 允许的标签 */
  allowedTags?: string[];
  /** 允许的属性 */
  allowedAttributes?: string[];
  /** 是否允许所有属性 */
  allowAllAttributes?: boolean;
}

/** 预设配置 */
const PRESETS = {
  /** 基础：只允许文本格式标签 */
  basic: {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u', 's', 'mark', 'small', 'sub', 'sup'],
    ALLOWED_ATTR: [],
  },
  /** 富文本：允许常用富文本标签 */
  richText: {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'u', 's', 'mark', 'small', 'sub', 'sup',
      'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a', 'img',
      'blockquote', 'code', 'pre',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'style'],
  },
  /** 链接：只允许链接 */
  link: {
    ALLOWED_TAGS: ['a'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  },
  /** 无：移除所有 HTML 标签 */
  none: {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  },
};

/**
 * 清理 HTML 内容（防止 XSS 攻击）
 * @param dirty 待清理的 HTML 字符串
 * @param preset 预设配置（'basic' | 'richText' | 'link' | 'none'）
 * @param customConfig 自定义配置
 * @returns 清理后的安全 HTML 字符串
 */
export function sanitizeHTML(
  dirty: string,
  preset: keyof typeof PRESETS = 'basic',
  customConfig?: SanitizeConfig
): string {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  // 获取预设配置
  const presetConfig = PRESETS[preset];

  // 合并配置
  const config: any = {
    ...presetConfig,
  };

  // 自定义配置覆盖
  if (customConfig) {
    if (customConfig.allowedTags) {
      config.ALLOWED_TAGS = customConfig.allowedTags;
    }
    if (customConfig.allowedAttributes) {
      config.ALLOWED_ATTR = customConfig.allowedAttributes;
    }
  }

  // 清理并返回
  return DOMPurify.sanitize(dirty, config);
}

/**
 * 清理纯文本（移除所有 HTML 标签）
 * @param dirty 待清理的字符串
 * @returns 纯文本
 */
export function sanitizeText(dirty: string): string {
  return sanitizeHTML(dirty, 'none');
}

/**
 * 清理链接
 * @param dirty 待清理的 HTML 字符串
 * @returns 只包含安全链接的 HTML 字符串
 */
export function sanitizeLink(dirty: string): string {
  const cleaned = sanitizeHTML(dirty, 'link');
  
  // 额外处理：确保外部链接有 rel="noopener noreferrer"
  const div = document.createElement('div');
  div.innerHTML = cleaned;
  
  const links = div.querySelectorAll('a');
  links.forEach((link) => {
    if (link.getAttribute('target') === '_blank') {
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
  
  return div.innerHTML;
}

/**
 * 清理富文本内容
 * @param dirty 待清理的 HTML 字符串
 * @returns 清理后的富文本 HTML
 */
export function sanitizeRichText(dirty: string): string {
  return sanitizeHTML(dirty, 'richText');
}

/**
 * 清理并转义特殊字符
 * @param text 待处理的文本
 * @returns 转义后的文本
 */
export function escapeHTML(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * URL 清理（防止 javascript: 等危险协议）
 * @param url URL 字符串
 * @returns 安全的 URL 或空字符串
 */
export function sanitizeURL(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  // 移除前后空格
  url = url.trim();

  // 检查是否是危险协议
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lowerURL = url.toLowerCase();

  for (const protocol of dangerousProtocols) {
    if (lowerURL.startsWith(protocol)) {
      console.warn('[Sanitize] Dangerous URL protocol detected:', url);
      return '';
    }
  }

  // 只允许 http(s) 和相对路径
  if (!url.match(/^(https?:\/\/|\/)/)) {
    console.warn('[Sanitize] Invalid URL format:', url);
    return '';
  }

  return url;
}

/**
 * 文件名清理（防止路径遍历攻击）
 * @param filename 文件名
 * @returns 安全的文件名
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return '';
  }

  // 移除路径分隔符和特殊字符
  return filename
    .replace(/[\/\\]/g, '')
    .replace(/[<>:"|?*]/g, '')
    .replace(/\.\./g, '')
    .trim();
}

/**
 * 配置 DOMPurify 钩子（全局设置）
 */
export function configureDOMPurify() {
  // 添加钩子：移除所有 script 标签
  DOMPurify.addHook('beforeSanitizeElements', (node) => {
    if (node.nodeName && node.nodeName.toLowerCase() === 'script') {
      node.remove();
    }
  });

  // 添加钩子：移除所有事件处理器属性
  DOMPurify.addHook('beforeSanitizeAttributes', (node) => {
    if (node instanceof Element) {
      const attributes = Array.from(node.attributes);
      attributes.forEach((attr) => {
        if (attr.name.startsWith('on')) {
          node.removeAttribute(attr.name);
        }
      });
    }
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('[Sanitize] DOMPurify configured with security hooks');
  }
}

// 初始化配置
configureDOMPurify();

export default {
  sanitizeHTML,
  sanitizeText,
  sanitizeLink,
  sanitizeRichText,
  escapeHTML,
  sanitizeURL,
  sanitizeFilename,
};


