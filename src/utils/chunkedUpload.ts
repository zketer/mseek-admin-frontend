import { message } from 'antd';
import {
  initUpload,
  uploadChunk,
  completeUpload,
  abortUpload,
  getUploadStatus,
} from '@/services/file-service-api/chunkedUploadController';

/**
 * 分片上传工具
 * 用于大文件分片上传，避免单次请求超时
 */
export interface ChunkedUploadOptions {
  file: File;
  fileType: string;
  uploaderId?: number;
  onProgress?: (percent: number) => void;
  onSuccess?: (fileRecord: any) => void;
  onError?: (error: any) => void;
  calculateMd5?: boolean; // 是否计算MD5哈希值，用于秒传
}

/**
 * 分片上传文件
 * @param options 上传选项
 * @returns 文件记录
 */
// 计算文件的MD5哈希值
// 使用SparkMD5计算文件MD5哈希值
// 需要先安装依赖：npm install spark-md5
async function calculateFileMd5(file: File, progressCallback?: (percent: number) => void): Promise<string> {
  // 动态导入SparkMD5
  const SparkMD5 = await import('spark-md5').then(module => module.default);
  
  return new Promise((resolve, reject) => {
    // 创建文件读取器
    const blobSlice = File.prototype.slice || (File.prototype as any).mozSlice || (File.prototype as any).webkitSlice;
    const chunkSize = 2 * 1024 * 1024; // 每次读取2MB
    const chunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();
    
    // 进度回调函数
    const onProgress = (progress: number) => {
      // 计算MD5时的进度为0-10%
      if (progressCallback) {
        // 将MD5计算进度映射到10%的总进度
        progressCallback(Math.floor((progress / 100) * 10));
      }
      console.log(`MD5计算进度: ${progress.toFixed(2)}%`);
    };
    
    // 加载下一个分片
    function loadNext() {
      const start = currentChunk * chunkSize;
      const end = Math.min(file.size, start + chunkSize);
      
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    }
    
    // 文件加载完成事件
    fileReader.onload = (e: any) => {
      spark.append(e.target.result); // 将分片添加到计算器
      currentChunk++;
      
      // 计算进度
      const progress = (currentChunk / chunks) * 100;
      onProgress(progress);
      
      if (currentChunk < chunks) {
        // 还有分片需要读取
        loadNext();
      } else {
        // 所有分片已读取完成，生成最终的MD5哈希值
        const md5Hash = spark.end();
        resolve(md5Hash);
      }
    };
    
    // 错误处理
    fileReader.onerror = (e) => {
      console.error('读取文件时发生错误', e);
      reject(e);
    };
    
    // 开始读取第一个分片
    loadNext();
  });
}

export async function chunkedUpload(options: ChunkedUploadOptions) {
  const { file, fileType, uploaderId = 1, onProgress, onSuccess, onError, calculateMd5 = true } = options;

  try {
    // 计算分片大小，默认2MB
    const chunkSize = 2 * 1024 * 1024;
    
    // 计算分片数量
    const totalChunks = Math.ceil(file.size / chunkSize);
    
    // 计算文件MD5哈希值（用于秒传）
    let md5Hash: string | undefined;
    if (calculateMd5) {
      try {
        // 使用新的calculateFileMd5函数，并传入进度回调
        md5Hash = await calculateFileMd5(file, (percent) => {
          // 将MD5计算进度传递给外部进度回调
          if (onProgress) onProgress(percent);
        });
        // MD5计算完成后，进度为10%
        if (onProgress) onProgress(10);
      } catch (error) {
        console.error('计算文件MD5哈希值失败:', error);
        // 如果计算失败，继续上传而不使用秒传
      }
    }
    
    // 步骤1: 初始化上传，直接传入正确的分片数和MD5哈希值
    const initResult = await initUpload({
      fileName: file.name,
      fileSize: file.size,
      totalChunks,
      fileType,
      uploaderId,
      md5Hash,
    });

    if (!initResult.success) {
      throw new Error(initResult.message || '初始化上传失败');
    }

    // 检查是否秒传成功
    if (initResult.data?.fastUpload === true && initResult.data?.fileRecord) {
      // 秒传成功，直接返回文件记录
      console.log('秒传成功！文件ID:', initResult.data.fileRecord.id);
      
      // 模拟一个平滑的进度变化，从当前进度到100%
      return new Promise<any>((resolve) => {
        if (onProgress) {
          // 当前进度应该是10%（MD5计算完成）
          const startProgress = 10;
          const endProgress = 100;
          const duration = 300; // 缩短持续时间为300毫秒
          const interval = 30; // 每30毫秒更新一次
          const steps = duration / interval;
          const increment = (endProgress - startProgress) / steps;
          
          let currentProgress = startProgress;
          const progressInterval = setInterval(() => {
            currentProgress += increment;
            if (currentProgress >= endProgress) {
              currentProgress = endProgress;
              clearInterval(progressInterval);
              
              // 进度到达100%后，触发成功回调并返回结果
              console.log('秒传进度到达100%，触发成功回调');
              const fileRecord = initResult.data?.fileRecord;
              if (onSuccess && fileRecord) onSuccess(fileRecord);
              resolve(fileRecord);
            }
            onProgress(Math.floor(currentProgress));
          }, interval);
        } else {
          // 如果没有进度回调，直接触发成功回调
          const fileRecord = initResult.data?.fileRecord;
          if (onSuccess && fileRecord) onSuccess(fileRecord);
          resolve(fileRecord);
        }
      });
    }
    
    const uploadId = initResult.data?.uploadId as string;
    if (!uploadId) {
      throw new Error('初始化上传失败：未获取到上传ID');
    }

    // 步骤2: 上传分片
    const uploadPromises = [];
    let uploadedChunks = 0;

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(file.size, start + chunkSize);
      const chunk = file.slice(start, end);

      // 创建FormData对象
      const formData = new FormData();
      formData.append('file', new File([chunk], file.name, { type: file.type }));

      const uploadPromise = uploadChunk(
        {
          uploadId,
          chunkNumber: i + 1,
        },
        formData,
        {
          requestType: 'form', // 使用form提交
          headers: {
            // 不要设置Content-Type，让浏览器自动设置为multipart/form-data
            'Content-Type': undefined,
          },
        }
      ).then(() => {
        uploadedChunks++;
        if (onProgress) {
          // MD5计算占总进度10%，分片上传占总进度85%，后端处理占总进度5%
          // 计算当前分片上传进度，范围为10%-95%
          const uploadProgress = (uploadedChunks / totalChunks) * 85;
          const percent = Math.floor(10 + uploadProgress); // 10%是MD5计算完成后的进度
          onProgress(percent);
        }
      });

      uploadPromises.push(uploadPromise);
    }

    // 等待所有分片上传完成
    await Promise.all(uploadPromises);

    // 步骤3: 完成上传
    console.log('所有分片上传完成，开始调用completeUpload');
    
    // 设置更长的超时时间，因为后端处理可能需要一段时间
    const completeResult = await completeUpload({
      uploadId,
    }, {
      timeout: 60000, // 设置60秒超时
    });

    if (!completeResult.success) {
      throw new Error(completeResult.message || '完成上传失败');
    }

    // 后端处理完成，平滑过渡到100%
    if (onProgress) {
      // 当前进度应该是95%（分片上传完成）
      const startProgress = 95;
      const endProgress = 100;
      const duration = 300; // 持续300毫秒
      const interval = 30; // 每30毫秒更新一次
      const steps = duration / interval;
      const increment = (endProgress - startProgress) / steps;
      
      let currentProgress = startProgress;
      const progressInterval = setInterval(() => {
        currentProgress += increment;
        if (currentProgress >= endProgress) {
          currentProgress = endProgress;
          clearInterval(progressInterval);
        }
        onProgress(Math.floor(currentProgress));
      }, interval);
    }
    
    // 添加日志，记录上传完成状态
    console.log('文件上传完成，返回数据:', completeResult.data);
    
    if (onSuccess) {
      // 确保在进度条动画完成后再触发成功回调
      setTimeout(() => {
        onSuccess(completeResult.data);
      }, 500);
    }

    return completeResult.data;
  } catch (error: any) {
    console.error('分片上传失败:', error);
    if (onError) {
      onError(error);
    }
    message.error(`上传失败: ${error.message || '未知错误'}`);
    throw error;
  }
}

/**
 * 取消分片上传
 * @param uploadId 上传ID
 */
export async function abortChunkedUpload(uploadId: string) {
  try {
    await abortUpload({
      uploadId,
    });
    return true;
  } catch (error: any) {
    console.error('取消上传失败:', error);
    return false;
  }
}

/**
 * 获取上传状态
 * @param uploadId 上传ID
 */
export async function getChunkedUploadStatus(uploadId: string) {
  try {
    const result = await getUploadStatus({
      uploadId,
    });
    return result.data;
  } catch (error: any) {
    console.error('获取上传状态失败:', error);
    return null;
  }
}
