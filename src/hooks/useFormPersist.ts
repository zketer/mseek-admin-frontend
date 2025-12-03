/**
 * 表单持久化 Hook
 * 自动保存表单数据到 localStorage，防止数据丢失
 */

import { useEffect, useCallback, useRef } from 'react';
import type { FormInstance } from 'antd';
import { STORAGE_KEYS } from '@/constants';

interface FormPersistOptions {
  /** 自动保存间隔（毫秒），默认 5000ms */
  saveInterval?: number;
  /** 是否在表单值变化时立即保存，默认 false */
  saveOnChange?: boolean;
  /** 需要排除的字段（不保存） */
  excludeFields?: string[];
  /** 是否启用，默认 true */
  enabled?: boolean;
}

/**
 * 表单持久化 Hook
 * @param form Ant Design Form 实例
 * @param formKey 表单唯一标识
 * @param options 配置选项
 * @returns 控制方法
 */
export function useFormPersist(
  form: FormInstance,
  formKey: string,
  options: FormPersistOptions = {}
) {
  const {
    saveInterval = 5000,
    saveOnChange = false,
    excludeFields = [],
    enabled = true,
  } = options;

  const storageKey = `${STORAGE_KEYS.TOKEN}_form_draft_${formKey}`;
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isRestoringRef = useRef(false);

  /**
   * 保存表单数据到 localStorage
   */
  const saveDraft = useCallback(() => {
    if (!enabled || isRestoringRef.current) {
      return;
    }

    try {
      const values = form.getFieldsValue();

      // 排除指定字段
      if (excludeFields.length > 0) {
        excludeFields.forEach((field) => {
          delete values[field];
        });
      }

      // 只保存有值的字段
      const validValues = Object.entries(values).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      if (Object.keys(validValues).length > 0) {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            data: validValues,
            timestamp: Date.now(),
          })
        );

        if (process.env.NODE_ENV === 'development') {
          console.log('[FormPersist] Draft saved:', formKey);
        }
      }
    } catch (error) {
      console.error('[FormPersist] Failed to save draft:', error);
    }
  }, [form, storageKey, excludeFields, enabled]);

  /**
   * 从 localStorage 恢复表单数据
   */
  const restoreDraft = useCallback(() => {
    if (!enabled) {
      return false;
    }

    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) {
        return false;
      }

      const { data, timestamp } = JSON.parse(saved);

      // 检查数据是否过期（超过7天）
      const maxAge = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - timestamp > maxAge) {
        localStorage.removeItem(storageKey);
        return false;
      }

      // 恢复数据
      isRestoringRef.current = true;
      form.setFieldsValue(data);
      isRestoringRef.current = false;

      if (process.env.NODE_ENV === 'development') {
        console.log('[FormPersist] Draft restored:', formKey);
      }

      return true;
    } catch (error) {
      console.error('[FormPersist] Failed to restore draft:', error);
      localStorage.removeItem(storageKey);
      return false;
    }
  }, [form, storageKey, formKey, enabled]);

  /**
   * 清除草稿
   */
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);

      if (process.env.NODE_ENV === 'development') {
        console.log('[FormPersist] Draft cleared:', formKey);
      }
    } catch (error) {
      console.error('[FormPersist] Failed to clear draft:', error);
    }
  }, [storageKey, formKey]);

  /**
   * 检查是否有保存的草稿
   */
  const hasDraft = useCallback((): boolean => {
    try {
      const saved = localStorage.getItem(storageKey);
      return !!saved;
    } catch (error) {
      return false;
    }
  }, [storageKey]);

  // 页面加载时恢复草稿
  useEffect(() => {
    if (enabled) {
      restoreDraft();
    }
  }, [enabled, restoreDraft]);

  // 定时自动保存
  useEffect(() => {
    if (!enabled || saveInterval <= 0) {
      return;
    }

    intervalRef.current = setInterval(() => {
      saveDraft();
    }, saveInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, saveInterval, saveDraft]);

  // 监听表单值变化（可选）
  useEffect(() => {
    if (!enabled || !saveOnChange) {
      return;
    }

    const handleValuesChange = () => {
      saveDraft();
    };

    // 注意：这里需要手动监听表单变化
    // 可以通过 Form 的 onValuesChange 属性实现
    // 或者使用 form 实例的方法

    return () => {
      // 清理
    };
  }, [enabled, saveOnChange, saveDraft]);

  // 页面卸载时保存
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (enabled) {
        saveDraft();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled, saveDraft]);

  return {
    /** 手动保存草稿 */
    saveDraft,
    /** 恢复草稿 */
    restoreDraft,
    /** 清除草稿 */
    clearDraft,
    /** 是否有草稿 */
    hasDraft,
  };
}

export default useFormPersist;


