/**
 * 图片处理工具类
 */

/**
 * 将图片文件转换为Base64格式
 * @param file 图片文件
 * @param maxWidth 最大宽度
 * @param maxHeight 最大高度
 * @param quality 压缩质量(0-1)
 * @returns Promise<string> Base64格式的图片
 */
export const convertImageToBase64 = (
  file: File,
  maxWidth = 300,
  maxHeight = 300,
  quality = 0.8
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 创建FileReader读取文件
    const reader = new FileReader();
    reader.onload = (e) => {
      // 创建Image对象
      const img = new Image();
      img.onload = () => {
        // 计算缩放比例
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }

        // 创建canvas进行绘制
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // 绘制图片
        ctx.drawImage(img, 0, 0, width, height);

        // 获取文件类型
        let mimeType = file.type;
        if (!mimeType || mimeType === '') {
          // 如果没有类型，根据扩展名判断
          const ext = file.name.split('.').pop()?.toLowerCase();
          if (ext === 'png') {
            mimeType = 'image/png';
          } else if (ext === 'gif') {
            mimeType = 'image/gif';
          } else {
            mimeType = 'image/jpeg'; // 默认使用jpeg
          }
        }

        // 转换为Base64，控制质量和格式
        const base64 = canvas.toDataURL(mimeType, quality);
        resolve(base64);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * 检查图片大小是否超过限制
 * @param file 图片文件
 * @param maxSize 最大大小(字节)
 * @returns boolean 是否超过限制
 */
export const checkImageSize = (file: File, maxSize = 2 * 1024 * 1024): boolean => {
  return file.size <= maxSize;
};

/**
 * 检查图片类型是否有效
 * @param file 图片文件
 * @returns boolean 是否为有效图片类型
 */
export const isValidImageType = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
  return validTypes.includes(file.type);
};

export default {
  convertImageToBase64,
  checkImageSize,
  isValidImageType,
};
