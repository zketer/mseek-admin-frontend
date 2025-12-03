import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { chunkedUpload } from '@/utils/chunkedUpload';
import type { UploadProps } from 'antd';
import type { RcFile, UploadFile } from 'antd/es/upload';

interface ChunkedUploaderProps {
  fileType: string;
  uploaderId?: number;
  onSuccess?: (fileRecord: any) => void;
  maxSize?: number; // 最大文件大小，单位MB
  accept?: string; // 接受的文件类型
  buttonText?: string; // 按钮文本
  disabled?: boolean; // 是否禁用
}

/**
 * 分片上传组件
 * 用于大文件上传，避免单次请求超时
 */
const ChunkedUploader: React.FC<ChunkedUploaderProps> = ({
  fileType,
  uploaderId,
  onSuccess,
  maxSize = 200, // 默认最大200MB
  accept,
  buttonText = '上传文件',
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // 文件列表变化处理
  const handleChange: UploadProps['onChange'] = (info) => {
    setFileList(info.fileList);
    
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    
    // 上传状态已由 customRequest 处理，这里不需要重复处理
  };

  // 自定义上传请求（使用分片上传）
  const customRequest = async ({ file, onSuccess: onUploadSuccess, onError, onProgress: onUploadProgress }: any) => {
    try {
      console.log('开始上传文件:', file.name, '大小:', (file.size / 1024 / 1024).toFixed(2), 'MB');
      setUploading(true);

      // 调用分片上传
      const fileRecord = await chunkedUpload({
        file,
        fileType,
        uploaderId,
        onProgress: (percent) => {
          console.log(`上传进度: ${percent}%`);
          // 调用原生进度回调
          onUploadProgress({ percent });
          
          // 如果进度到达100%，添加额外的日志
          if (percent === 100) {
            console.log('进度条已达到100%，等待后端处理完成...');
          }
        },
        onSuccess: (data) => {
          console.log('分片上传成功回调触发，数据:', data);
          if (onSuccess) {
            onSuccess(data);
          }
        },
        onError: (error) => {
          console.error('上传失败:', error);
          message.error(`上传失败: ${error.message || '未知错误'}`);
        },
      });

      console.log('分片上传完成，文件记录:', fileRecord);

      // 上传成功，构造符合 antd Upload 组件预期的响应格式
      const successResponse = {
        ...fileRecord,
        uid: file.uid,
        fileId: fileRecord?.id,
        name: file.name,
        status: 'done',
        response: { fileId: fileRecord?.id }
      };
      
      console.log('调用antd Upload的onSuccess回调，响应:', successResponse);
      
      // 先调用onUploadSuccess，然后再重置上传状态
      // 确保在UI更新后再重置状态，避免加载指示器仍然在转动
      onUploadSuccess(successResponse);
      
      // 使用setTimeout确保在UI更新后再重置状态
      setTimeout(() => {
        console.log('上传成功，重置上传状态');
        setUploading(false);
        message.success(`${file.name} 上传成功`);
      }, 300);
    } catch (error: any) {
      console.error('分片上传异常:', error);
      message.error(`${file.name} 上传失败: ${error.message || '未知错误'}`);
      onError(error);
      setUploading(false);
    }
  };

  const beforeUpload = (file: RcFile) => {
    // 检查文件大小
    const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
    if (!isLtMaxSize) {
      message.error(`文件大小不能超过 ${maxSize}MB！`);
      return false;
    }
    return true;
  };

  return (
    <Upload
      name="file"
      customRequest={customRequest}
      fileList={fileList}
      onChange={handleChange}
      beforeUpload={beforeUpload}
      accept={accept}
      maxCount={1}
      showUploadList={{
        showRemoveIcon: true,
        showPreviewIcon: false,
      }}
      listType="text"
      disabled={disabled || uploading}
      progress={{
        strokeColor: {
          '0%': '#108ee9',
          '100%': '#87d068',
        },
        strokeWidth: 3,
        format: (percent) => percent && `${Number.parseFloat(percent.toFixed(2))}%`
      }}
    >
      <Button icon={<UploadOutlined />} loading={uploading} disabled={disabled || uploading}>
        {buttonText}
      </Button>
    </Upload>
  );
};

export default ChunkedUploader;
