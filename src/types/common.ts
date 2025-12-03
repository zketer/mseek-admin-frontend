/**
 * 通用类型定义
 */

/** 分页参数 */
export interface PaginationParams {
  /** 当前页码 */
  current?: number;
  /** 每页数量 */
  pageSize?: number;
  /** 其他查询参数 */
  [key: string]: any;
}

/** 分页响应 */
export interface PaginationResponse<T> {
  /** 数据列表 */
  records: T[];
  /** 总数 */
  total: number;
  /** 当前页码 */
  current: number;
  /** 每页数量 */
  size: number;
  /** 总页数 */
  pages?: number;
}

/** 分页结果（PageResult 别名，兼容已有代码） */
export type PageResult<T> = PaginationResponse<T>;

/** API 统一响应格式 */
export interface ApiResponse<T = any> {
  /** 业务状态码 */
  code: number;
  /** 响应消息 */
  message: string;
  /** 英文消息 */
  messageEn?: string;
  /** 响应数据 */
  data: T;
  /** 时间戳 */
  timestamp: number;
  /** 请求ID */
  requestId?: string;
  /** 是否成功 */
  success: boolean;
}

/** 排序参数 */
export interface SortParams {
  /** 排序字段 */
  field: string;
  /** 排序方向 */
  order: 'asc' | 'desc';
}

/** ID 参数 */
export interface IdParam {
  id: number | string;
}

/** 批量操作参数 */
export interface BatchOperationParams {
  ids: Array<number | string>;
}

/** 状态更新参数 */
export interface StatusUpdateParams extends IdParam {
  status: number;
}

/** 选项类型 */
export interface Option<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
  [key: string]: any;
}

/** 树形节点 */
export interface TreeNode<T = any> {
  key: string | number;
  title: string;
  children?: TreeNode<T>[];
  disabled?: boolean;
  data?: T;
}

/** 表单数据模式 */
export type FormMode = 'create' | 'edit' | 'view';

/** 加载状态 */
export interface LoadingState {
  /** 是否正在加载 */
  loading: boolean;
  /** 错误信息 */
  error?: string;
}

/** 操作结果 */
export interface OperationResult<T = any> {
  /** 是否成功 */
  success: boolean;
  /** 消息 */
  message?: string;
  /** 数据 */
  data?: T;
}

/** 地区选项（级联选择器） */
export interface AreaOption {
  /** 地区编码 */
  value: string;
  /** 地区名称 */
  label: string;
  /** 是否为叶子节点 */
  isLeaf?: boolean;
  /** 子节点 */
  children?: AreaOption[];
}

/** 地区数据 */
export interface AreaData {
  /** ID */
  id?: number;
  /** 地区编码 */
  adcode: string;
  /** 地区名称 */
  name: string;
  /** 父级编码 */
  parentCode?: string;
  /** 行政级别 */
  level?: number;
}

/** 文件上传响应 */
export interface FileUploadResponse {
  /** 文件ID */
  id?: string;
  /** 文件名 */
  name: string;
  /** 文件URL */
  url: string;
  /** 文件大小 */
  size?: number;
  /** 文件类型 */
  type?: string;
}

/** 分类/标签基础类型 */
export interface CategoryOrTagItem {
  /** ID */
  id: number;
  /** 名称 */
  name: string;
  /** 颜色 */
  color?: string;
  /** 排序 */
  sort?: number;
  /** 状态 */
  status?: number;
  /** 描述 */
  description?: string;
}

/** 通用状态枚举 */
export enum CommonStatus {
  /** 禁用 */
  DISABLED = 0,
  /** 启用 */
  ENABLED = 1,
}

/** 键值对类型 */
export type KeyValue<T = any> = Record<string, T>;

/** 深度可选 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** 深度只读 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};


