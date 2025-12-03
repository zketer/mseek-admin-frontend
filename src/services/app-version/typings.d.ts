/**
 * 应用版本管理 - 类型定义
 */

declare namespace API {
  /**
   * 应用版本信息
   */
  interface AppVersion {
    /** 版本ID */
    id: number;
    /** 版本名称，如 "1.0.0" */
    versionName: string;
    /** 版本号，如 1 */
    versionCode: number;
    /** 平台：android | ios | all */
    platform: 'android' | 'ios' | 'all';
    /** 发布日期 */
    releaseDate: string;
    /** 更新类型：major（重大更新）| minor（功能更新）| patch（修复更新） */
    updateType: 'major' | 'minor' | 'patch';
    /** 文件大小 */
    fileSize: string;
    /** 下载地址 */
    downloadUrl: string;
    /** 更新日志 */
    changeLog: string[];
    /** 是否为最新版本 */
    isLatest: boolean;
    /** 下载次数 */
    downloadCount: number;
    /** 状态：published（已发布）| draft（草稿）| deprecated（已废弃） */
    status: 'published' | 'draft' | 'deprecated';
    /** 创建时间 */
    createdAt?: string;
    /** 更新时间 */
    updatedAt?: string;
  }

  /**
   * 版本列表查询参数
   */
  interface AppVersionQuery {
    /** 当前页码 */
    current?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 搜索关键词 */
    keyword?: string;
    /** 平台筛选 */
    platform?: 'android' | 'ios' | 'all';
    /** 状态筛选 */
    status?: 'published' | 'draft' | 'deprecated';
  }

  /**
   * 版本统计信息
   */
  interface AppVersionStats {
    /** 版本总数 */
    totalVersions: number;
    /** 最新版本号 */
    latestVersion: string;
    /** 总下载量 */
    totalDownloads: number;
    /** Android版本数 */
    androidVersions: number;
    /** iOS版本数 */
    iosVersions: number;
  }

  /**
   * 版本创建/更新参数
   */
  interface AppVersionForm {
    /** 版本名称 */
    versionName: string;
    /** 版本号 */
    versionCode: number;
    /** 平台 */
    platform: 'android' | 'ios' | 'all';
    /** 更新类型 */
    updateType: 'major' | 'minor' | 'patch';
    /** 文件大小 */
    fileSize: string;
    /** 下载地址 */
    downloadUrl: string;
    /** 更新日志 */
    changeLog: string[];
    /** 状态 */
    status: 'published' | 'draft' | 'deprecated';
  }
}

