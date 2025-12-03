/**
 * 表单验证工具类
 * @description 提供通用的表单字段验证函数
 * @author zlynn
 * @date 2025-11-06
 */

/**
 * 验证用户名格式
 * @param username 用户名
 * @returns boolean
 * @description 用户名规则：3-20位字母、数字或下划线
 */
export const validateUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * 验证邮箱格式
 * @param email 邮箱
 * @returns boolean
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 验证手机号格式
 * @param phone 手机号
 * @returns boolean
 * @description 支持中国大陆手机号格式
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * 密码强度级别
 */
export type PasswordStrength = 'weak' | 'medium' | 'strong';

/**
 * 密码验证结果
 */
export interface PasswordValidationResult {
  /** 是否有效 */
  valid: boolean;
  /** 强度 */
  strength: PasswordStrength;
  /** 提示消息 */
  message: string;
}

/**
 * 验证密码强度
 * @param password 密码
 * @returns PasswordValidationResult
 * @description 
 * - 最少6位
 * - 包含大小写字母、数字、特殊字符越多，强度越高
 */
export const validatePassword = (password: string): PasswordValidationResult => {
  if (password.length < 6) {
    return { valid: false, strength: 'weak', message: '密码长度至少6位' };
  }

  if (password.length < 8) {
    return { valid: true, strength: 'weak', message: '密码强度较弱' };
  }

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strengthCount = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;

  if (strengthCount >= 3) {
    return { valid: true, strength: 'strong', message: '密码强度高' };
  } else if (strengthCount >= 2) {
    return { valid: true, strength: 'medium', message: '密码强度中等' };
  } else {
    return { valid: true, strength: 'weak', message: '密码强度较弱' };
  }
};

/**
 * 验证 URL 格式
 * @param url URL 字符串
 * @returns boolean
 */
export const validateURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * 验证身份证号格式
 * @param idCard 身份证号
 * @returns boolean
 * @description 支持15位和18位身份证号
 */
export const validateIDCard = (idCard: string): boolean => {
  const idCard15Regex = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
  const idCard18Regex = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
  
  return idCard15Regex.test(idCard) || idCard18Regex.test(idCard);
};

/**
 * 验证中文姓名
 * @param name 姓名
 * @returns boolean
 * @description 2-20位中文字符
 */
export const validateChineseName = (name: string): boolean => {
  const nameRegex = /^[\u4e00-\u9fa5]{2,20}$/;
  return nameRegex.test(name);
};

/**
 * 验证数字范围
 * @param value 数值
 * @param min 最小值（包含）
 * @param max 最大值（包含）
 * @returns boolean
 */
export const validateNumberRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * 验证字符串长度
 * @param str 字符串
 * @param minLength 最小长度（包含）
 * @param maxLength 最大长度（包含）
 * @returns boolean
 */
export const validateStringLength = (str: string, minLength: number, maxLength: number): boolean => {
  return str.length >= minLength && str.length <= maxLength;
};

/**
 * 验证是否为空
 * @param value 值
 * @returns boolean
 * @description 空字符串、null、undefined、空数组、空对象都视为空
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * 验证是否为纯数字字符串
 * @param str 字符串
 * @returns boolean
 */
export const isNumericString = (str: string): boolean => {
  return /^\d+$/.test(str);
};

/**
 * 验证邮政编码
 * @param zipCode 邮政编码
 * @returns boolean
 * @description 6位数字
 */
export const validateZipCode = (zipCode: string): boolean => {
  return /^\d{6}$/.test(zipCode);
};

/**
 * 验证 IP 地址
 * @param ip IP 地址
 * @returns boolean
 * @description 支持 IPv4 格式
 */
export const validateIPv4 = (ip: string): boolean => {
  const ipv4Regex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Regex.test(ip);
};

/**
 * 验证银行卡号
 * @param cardNumber 银行卡号
 * @returns boolean
 * @description 16-19位数字，使用 Luhn 算法验证
 */
export const validateBankCard = (cardNumber: string): boolean => {
  if (!/^\d{16,19}$/.test(cardNumber)) return false;

  // Luhn 算法验证
  let sum = 0;
  let shouldDouble = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

/**
 * 验证 QQ 号
 * @param qq QQ号
 * @returns boolean
 * @description 5-11位数字
 */
export const validateQQ = (qq: string): boolean => {
  return /^[1-9]\d{4,10}$/.test(qq);
};

/**
 * 验证微信号
 * @param wechat 微信号
 * @returns boolean
 * @description 6-20位字母、数字、下划线、减号
 */
export const validateWechat = (wechat: string): boolean => {
  return /^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/.test(wechat);
};

export default {
  validateUsername,
  validateEmail,
  validatePhone,
  validatePassword,
  validateURL,
  validateIDCard,
  validateChineseName,
  validateNumberRange,
  validateStringLength,
  isEmpty,
  isNumericString,
  validateZipCode,
  validateIPv4,
  validateBankCard,
  validateQQ,
  validateWechat,
};

