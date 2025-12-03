import dayjs from 'dayjs';

/**
 * 日期时间格式化工具类
 */

/**
 * 格式化日期时间为 YYYY-MM-DD HH:mm:ss
 * @param date 日期字符串或Date对象
 * @param defaultValue 当date为空时的默认值
 * @returns 格式化后的日期字符串
 */
export const formatDateTime = (date?: string | Date | null, defaultValue: string = '-'): string => {
  if (!date) return defaultValue;
  
  try {
    // 处理ISO格式的时间字符串（包含T）
    const dateStr = typeof date === 'string' ? date.replace('T', ' ') : date;
    return dayjs(dateStr).format('YYYY-MM-DD HH:mm:ss');
  } catch (error) {
    console.warn('日期格式化失败:', date, error);
    return defaultValue;
  }
};

/**
 * 格式化日期为 YYYY-MM-DD
 * @param date 日期字符串或Date对象
 * @param defaultValue 当date为空时的默认值
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date?: string | Date | null, defaultValue: string = '-'): string => {
  if (!date) return defaultValue;
  
  try {
    const dateStr = typeof date === 'string' ? date.replace('T', ' ') : date;
    return dayjs(dateStr).format('YYYY-MM-DD');
  } catch (error) {
    console.warn('日期格式化失败:', date, error);
    return defaultValue;
  }
};

/**
 * 格式化时间为 HH:mm:ss
 * @param date 日期字符串或Date对象
 * @param defaultValue 当date为空时的默认值
 * @returns 格式化后的时间字符串
 */
export const formatTime = (date?: string | Date | null, defaultValue: string = '-'): string => {
  if (!date) return defaultValue;
  
  try {
    const dateStr = typeof date === 'string' ? date.replace('T', ' ') : date;
    return dayjs(dateStr).format('HH:mm:ss');
  } catch (error) {
    console.warn('时间格式化失败:', date, error);
    return defaultValue;
  }
};

/**
 * 格式化为相对时间（如：3天前）
 * @param date 日期字符串或Date对象
 * @param defaultValue 当date为空时的默认值
 * @returns 相对时间字符串
 */
export const formatRelativeTime = (date?: string | Date | null, defaultValue: string = '-'): string => {
  if (!date) return defaultValue;
  
  try {
    const dateStr = typeof date === 'string' ? date.replace('T', ' ') : date;
    const targetDate = dayjs(dateStr);
    const now = dayjs();
    
    const diffSeconds = now.diff(targetDate, 'second');
    const diffMinutes = now.diff(targetDate, 'minute');
    const diffHours = now.diff(targetDate, 'hour');
    const diffDays = now.diff(targetDate, 'day');
    const diffMonths = now.diff(targetDate, 'month');
    const diffYears = now.diff(targetDate, 'year');
    
    if (diffSeconds < 60) return '刚刚';
    if (diffMinutes < 60) return `${diffMinutes}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 30) return `${diffDays}天前`;
    if (diffMonths < 12) return `${diffMonths}个月前`;
    return `${diffYears}年前`;
  } catch (error) {
    console.warn('相对时间格式化失败:', date, error);
    return defaultValue;
  }
};

/**
 * 自定义格式化
 * @param date 日期字符串或Date对象
 * @param format 格式字符串，如 'YYYY年MM月DD日'
 * @param defaultValue 当date为空时的默认值
 * @returns 格式化后的日期字符串
 */
export const formatCustom = (
  date?: string | Date | null,
  format: string = 'YYYY-MM-DD HH:mm:ss',
  defaultValue: string = '-'
): string => {
  if (!date) return defaultValue;
  
  try {
    const dateStr = typeof date === 'string' ? date.replace('T', ' ') : date;
    return dayjs(dateStr).format(format);
  } catch (error) {
    console.warn('自定义格式化失败:', date, error);
    return defaultValue;
  }
};

/**
 * 判断日期是否有效
 * @param date 日期字符串或Date对象
 * @returns 是否有效
 */
export const isValidDate = (date?: string | Date | null): boolean => {
  if (!date) return false;
  
  try {
    const dateStr = typeof date === 'string' ? date.replace('T', ' ') : date;
    return dayjs(dateStr).isValid();
  } catch (error) {
    return false;
  }
};

