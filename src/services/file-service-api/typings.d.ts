declare namespace MuseumsFileAPI {
  type abortUploadParams = {
    /** 上传ID */
    uploadId: string;
  };

  type completeUploadParams = {
    /** 上传ID */
    uploadId: string;
  };

  type deleteFileByNameParams = {
    /** 文件名 */
    fileName: string;
  };

  type deleteFileParams = {
    /** 文件ID */
    fileId: number;
  };

  type downloadFileByNameParams = {
    /** 文件名 */
    fileName: string;
  };

  type downloadFileParams = {
    /** 文件ID */
    fileId: number;
  };

  type fileExistsParams = {
    /** 文件名 */
    fileName: string;
  };

  type FileRecord = {
    /** 创建时间 */
    createAt?: string;
    /** 更新时间 */
    updateAt?: string;
    /** 创建人ID */
    createBy?: number;
    /** 更新人ID */
    updateBy?: number;
    id?: number;
    /** 删除标志：0-未删除，1-已删除 */
    deleted?: number;
    originalName?: string;
    fileName?: string;
    fileSize?: number;
    contentType?: string;
    bucketName?: string;
    category?: string;
    uploaderId?: number;
    status?: number;
    accessCount?: number;
    md5Hash?: string;
    remark?: string;
  };

  type getFileDownloadUrlByNameParams = {
    /** 文件名 */
    fileName: string;
  };

  type getFileDownloadUrlParams = {
    /** 文件ID */
    fileId: number;
  };

  type getFileRecordByNameParams = {
    /** 文件名 */
    fileName: string;
  };

  type getFileRecordParams = {
    /** 文件ID */
    fileId: number;
  };

  type getFileUrlByNameParams = {
    /** 文件名 */
    fileName: string;
  };

  type getFileUrlParams = {
    /** 文件ID */
    fileId: number;
  };

  type getUploadStatusParams = {
    /** 上传ID */
    uploadId: string;
  };

  type initUploadParams = {
    /** 原始文件名 */
    fileName: string;
    /** 文件总大小（字节） */
    fileSize: number;
    /** 总分片数 */
    totalChunks: number;
    /** 文件类型 */
    fileType: string;
    /** 上传者ID */
    uploaderId?: number;
    /** 文件MD5哈希值，用于秒传 */
    md5Hash?: string;
  };

  type ResultBoolean = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: boolean;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultFileRecord = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: FileRecord;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultListFileRecord = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: FileRecord[];
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultListMapStringObject = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: Record<string, any>[];
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultMapLongFileRecord = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: Record<string, any>;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultMapStringObject = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: Record<string, any>;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultObject = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: Record<string, any>;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultString = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: string;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultVoid = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: Record<string, any>;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type uploadChunkParams = {
    /** 上传ID */
    uploadId: string;
    /** 分片序号（从1开始） */
    chunkNumber: number;
  };

  type uploadFileParams = {
    /** 文件类型 */
    type: string;
    /** 上传者ID */
    uploaderId?: number;
  };

  type uploadFilesParams = {
    /** 文件列表 */
    files: string[];
    /** 文件类型 */
    type: string;
    /** 上传者ID */
    uploaderId?: number;
  };
}
