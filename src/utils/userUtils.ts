/**
 * 用户相关工具类
 */
import { request } from '@umijs/max';
import { convertImageToBase64, checkImageSize, isValidImageType } from './imageUtils';

/**
 * 上传用户头像（直接上传文件，由后端处理）
 * @param userId 用户ID
 * @param file 头像文件
 * @returns Promise<string> 头像URL
 * @deprecated 推荐使用clientSideUploadAvatar方法，由前端处理图片
 */
export const uploadUserAvatar = async (userId: string | number, file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await request<any>(`/api/user/${userId}/avatar`, {
      method: 'POST',
      data: formData,
    });
    
    return response.data;
  } catch (error) {
    throw new Error('Failed to upload avatar');
  }
};

/**
 * 上传临时头像（用于创建用户时，由后端处理）
 * @param file 头像文件
 * @returns Promise<string> 头像URL
 * @deprecated 推荐使用clientSideUploadTempAvatar方法，由前端处理图片
 */
export const uploadTempAvatar = async (file: File): Promise<string> => {
  const tempUserId = 'temp-' + Date.now();
  return uploadUserAvatar(tempUserId, file);
};

/**
 * 前端处理并上传用户头像
 * @param userId 用户ID
 * @param file 头像文件
 * @returns Promise<string> Base64格式的头像
 */
export const clientSideUploadAvatar = async (userId: string | number, file: File): Promise<string> => {
  try {
    // 检查文件类型
    if (!isValidImageType(file)) {
      throw new Error('Invalid image type. Only JPEG, PNG and GIF are allowed.');
    }
    
    // 检查文件大小
    if (!checkImageSize(file)) {
      throw new Error('Image size exceeds the limit of 2MB.');
    }
    
    // 在前端处理图片
    const base64Avatar = await convertImageToBase64(file);
    
    // 发送Base64数据到后端
    const response = await request<any>(`/api/user/${userId}/avatar/base64`, {
      method: 'POST',
      data: { avatar: base64Avatar }
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 前端处理临时头像（用于创建用户时，仅在前端处理，不上传到后端）
 * @param file 头像文件
 * @returns Promise<string> Base64格式的头像
 */
export const clientSideUploadTempAvatar = async (file: File): Promise<string> => {
  try {
    // 检查文件类型
    if (!isValidImageType(file)) {
      throw new Error('Invalid image type. Only JPEG, PNG and GIF are allowed.');
    }
    
    // 检查文件大小
    if (!checkImageSize(file)) {
      throw new Error('Image size exceeds the limit of 2MB.');
    }
    
    // 在前端处理图片并返回Base64
    const base64Avatar = await convertImageToBase64(file);
    
    return base64Avatar;
  } catch (error) {
    throw error;
  }
};

export default {
  uploadUserAvatar,
  uploadTempAvatar,
  clientSideUploadAvatar,
  clientSideUploadTempAvatar,
};
