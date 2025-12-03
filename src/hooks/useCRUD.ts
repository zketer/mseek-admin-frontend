/**
 * 通用 CRUD Hooks
 * 减少列表页面的重复代码
 */

import { useState, useCallback, useRef } from 'react';
import { App } from 'antd';
import { useIntl } from '@umijs/max';
import type { ActionType } from '@ant-design/pro-components';
import type { PaginationParams, ApiResponse } from '@/types';

/** CRUD 操作配置 */
export interface CRUDConfig<T> {
  /** 创建 API */
  createAPI?: (data: Partial<T>) => Promise<ApiResponse<T>>;
  /** 更新 API */
  updateAPI?: (data: Partial<T> & { id: number | string }) => Promise<ApiResponse<T>>;
  /** 删除 API */
  deleteAPI?: (id: number | string) => Promise<ApiResponse<any>>;
  /** 批量删除 API */
  batchDeleteAPI?: (ids: Array<number | string>) => Promise<ApiResponse<any>>;
  /** 列表查询 API */
  listAPI?: (params: PaginationParams & any) => Promise<ApiResponse<T[]>>;
  /** 状态更新 API */
  updateStatusAPI?: (id: number | string, status: number) => Promise<ApiResponse<any>>;
  /** 成功消息 */
  messages?: {
    createSuccess?: string;
    updateSuccess?: string;
    deleteSuccess?: string;
    statusUpdateSuccess?: string;
  };
}

/** CRUD Hooks 返回值 */
export interface CRUDHooksReturn<T> {
  /** 加载状态 */
  loading: boolean;
  /** 数据源 */
  dataSource: T[];
  /** 总数 */
  total: number;
  /** ProTable ActionRef */
  actionRef: React.MutableRefObject<ActionType | undefined>;
  /** 处理创建 */
  handleCreate: (data: Partial<T>) => Promise<boolean>;
  /** 处理更新 */
  handleUpdate: (data: Partial<T> & { id: number | string }) => Promise<boolean>;
  /** 处理删除 */
  handleDelete: (id: number | string) => Promise<boolean>;
  /** 处理批量删除 */
  handleBatchDelete: (ids: Array<number | string>) => Promise<boolean>;
  /** 处理列表查询 */
  handleList: (params: PaginationParams & any) => Promise<{ data: T[]; total: number; success: boolean }>;
  /** 处理状态更新 */
  handleStatusUpdate: (id: number | string, status: number) => Promise<boolean>;
  /** 刷新列表 */
  refresh: () => void;
}

/**
 * 通用 CRUD Hooks
 * @param config CRUD 配置
 * @returns CRUD 操作方法
 */
export function useCRUD<T = any>(config: CRUDConfig<T>): CRUDHooksReturn<T> {
  const { message } = App.useApp();
  const intl = useIntl(); // ✅ 添加国际化支持
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const actionRef = useRef<ActionType | undefined>(undefined);

  const {
    createAPI,
    updateAPI,
    deleteAPI,
    batchDeleteAPI,
    listAPI,
    updateStatusAPI,
    messages = {},
  } = config;

  /**
   * 处理创建
   */
  const handleCreate = useCallback(
    async (data: Partial<T>): Promise<boolean> => {
      if (!createAPI) {
        return false;
      }

      setLoading(true);
      try {
        const response = await createAPI(data);

        if (response.success) {
          message.success(messages.createSuccess || intl.formatMessage({ id: 'pages.common.createSuccess' }));
          actionRef.current?.reload();
          return true;
        }

        message.error(response.message || intl.formatMessage({ id: 'pages.common.operationFailed' }));
        return false;
      } catch (error: any) {
        message.error(error.message || intl.formatMessage({ id: 'pages.common.operationFailed' }));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [createAPI, messages.createSuccess, message]
  );

  /**
   * 处理更新
   */
  const handleUpdate = useCallback(
    async (data: Partial<T> & { id: number | string }): Promise<boolean> => {
      if (!updateAPI) {
        return false;
      }

      setLoading(true);
      try {
        const response = await updateAPI(data);

        if (response.success) {
          message.success(messages.updateSuccess || intl.formatMessage({ id: 'pages.common.updateSuccess' }));
          actionRef.current?.reload();
          return true;
        }

        message.error(response.message || intl.formatMessage({ id: 'pages.common.operationFailed' }));
        return false;
      } catch (error: any) {
        message.error(error.message || intl.formatMessage({ id: 'pages.common.operationFailed' }));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [updateAPI, messages.updateSuccess, message]
  );

  /**
   * 处理删除
   */
  const handleDelete = useCallback(
    async (id: number | string): Promise<boolean> => {
      if (!deleteAPI) {
        return false;
      }

      setLoading(true);
      try {
        const response = await deleteAPI(id);

        if (response.success) {
          message.success(messages.deleteSuccess || intl.formatMessage({ id: 'pages.common.deleteSuccess' }));
          actionRef.current?.reload();
          return true;
        }

        message.error(response.message || intl.formatMessage({ id: 'pages.common.operationFailed' }));
        return false;
      } catch (error: any) {
        message.error(error.message || intl.formatMessage({ id: 'pages.common.operationFailed' }));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [deleteAPI, messages.deleteSuccess, message]
  );

  /**
   * 处理批量删除
   */
  const handleBatchDelete = useCallback(
    async (ids: Array<number | string>): Promise<boolean> => {
      if (!batchDeleteAPI) {
        return false;
      }

      if (ids.length === 0) {
        message.warning(intl.formatMessage({ id: 'pages.common.pleaseSelect', defaultMessage: '请选择要删除的项' }));
        return false;
      }

      setLoading(true);
      try {
        const response = await batchDeleteAPI(ids);

        if (response.success) {
          message.success(intl.formatMessage(
            { id: 'pages.common.batchDeleteSuccess', defaultMessage: '成功删除 {count} 项' },
            { count: ids.length }
          ));
          actionRef.current?.reload();
          return true;
        }

        message.error(response.message || intl.formatMessage({ id: 'pages.common.operationFailed' }));
        return false;
      } catch (error: any) {
        message.error(error.message || intl.formatMessage({ id: 'pages.common.operationFailed' }));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [batchDeleteAPI, message]
  );

  /**
   * 处理列表查询
   */
  const handleList = useCallback(
    async (params: PaginationParams & any) => {
      if (!listAPI) {
        return {
          data: [],
          total: 0,
          success: false,
        };
      }

      setLoading(true);
      try {
        const response = await listAPI(params);

        if (response.success) {
          const data = Array.isArray(response.data) ? response.data : [];
          const total = (response.data as any)?.total || 0;

          setDataSource(data);
          setTotal(total);

          return {
            data,
            total,
            success: true,
          };
        }

        message.error(response.message || intl.formatMessage({ id: 'pages.common.operationFailed' }));
        return {
          data: [],
          total: 0,
          success: false,
        };
      } catch (error: any) {
        message.error(error.message || intl.formatMessage({ id: 'pages.common.operationFailed' }));
        return {
          data: [],
          total: 0,
          success: false,
        };
      } finally {
        setLoading(false);
      }
    },
    [listAPI, message]
  );

  /**
   * 处理状态更新
   */
  const handleStatusUpdate = useCallback(
    async (id: number | string, status: number): Promise<boolean> => {
      if (!updateStatusAPI) {
        return false;
      }

      setLoading(true);
      try {
        const response = await updateStatusAPI(id, status);

        if (response.success) {
          message.success(messages.statusUpdateSuccess || intl.formatMessage({ id: 'pages.common.updateSuccess' }));
          actionRef.current?.reload();
          return true;
        }

        message.error(response.message || intl.formatMessage({ id: 'pages.common.operationFailed' }));
        return false;
      } catch (error: any) {
        message.error(error.message || intl.formatMessage({ id: 'pages.common.operationFailed' }));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [updateStatusAPI, messages.statusUpdateSuccess, message]
  );

  /**
   * 刷新列表
   */
  const refresh = useCallback(() => {
    actionRef.current?.reload();
  }, []);

  return {
    loading,
    dataSource,
    total,
    actionRef,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleBatchDelete,
    handleList,
    handleStatusUpdate,
    refresh,
  };
}

export default useCRUD;

