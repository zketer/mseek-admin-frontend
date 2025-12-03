/**
 * 博物馆全局状态管理
 * @description 管理博物馆分类、标签等全局共享数据，实现数据缓存
 */
import { useState, useCallback } from 'react';
import { getAllCategories } from '@/services/museum-service-api/museumCategoryController';
import { getAllTags } from '@/services/museum-service-api/museumTagController';
import type { CategoryOrTagItem } from '@/types/common';

interface MuseumModelState {
  /** 博物馆分类列表 */
  categories: CategoryOrTagItem[];
  /** 博物馆标签列表 */
  tags: CategoryOrTagItem[];
  /** 加载状态 */
  loading: boolean;
  /** 分类是否已加载 */
  categoriesLoaded: boolean;
  /** 标签是否已加载 */
  tagsLoaded: boolean;
}

export default () => {
  const [state, setState] = useState<MuseumModelState>({
    categories: [],
    tags: [],
    loading: false,
    categoriesLoaded: false,
    tagsLoaded: false,
  });

  /**
   * 获取博物馆分类列表（带缓存）
   */
  const fetchCategories = useCallback(async (forceRefresh = false) => {
    // ✅ 如果已加载且不强制刷新，直接返回缓存数据
    if (state.categoriesLoaded && !forceRefresh) {
      return state.categories;
    }

    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const res = await getAllCategories();
      if (res.success && res.data) {
        const categories = res.data as CategoryOrTagItem[];
        setState(prev => ({
          ...prev,
          categories,
          categoriesLoaded: true,
          loading: false,
        }));
        
        return categories;
      }
      
      setState(prev => ({ ...prev, loading: false }));
      return [];
    } catch (error) {
      console.error('[Museum Model] 分类数据加载失败:', error);
      setState(prev => ({ ...prev, loading: false }));
      return [];
    }
  }, [state.categories, state.categoriesLoaded]);

  /**
   * 获取博物馆标签列表（带缓存）
   */
  const fetchTags = useCallback(async (forceRefresh = false) => {
    // ✅ 如果已加载且不强制刷新，直接返回缓存数据
    if (state.tagsLoaded && !forceRefresh) {
      return state.tags;
    }

    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const res = await getAllTags();
      if (res.success && res.data) {
        const tags = res.data as CategoryOrTagItem[];
        setState(prev => ({
          ...prev,
          tags,
          tagsLoaded: true,
          loading: false,
        }));
        
        return tags;
      }
      
      setState(prev => ({ ...prev, loading: false }));
      return [];
    } catch (error) {
      console.error('[Museum Model] 标签数据加载失败:', error);
      setState(prev => ({ ...prev, loading: false }));
      return [];
    }
  }, [state.tags, state.tagsLoaded]);

  /**
   * 同时获取分类和标签（并发请求）
   */
  const fetchAll = useCallback(async (forceRefresh = false) => {
    const [categories, tags] = await Promise.all([
      fetchCategories(forceRefresh),
      fetchTags(forceRefresh),
    ]);
    return { categories, tags };
  }, [fetchCategories, fetchTags]);

  /**
   * 清空缓存（用于登出或切换账号）
   */
  const clearCache = useCallback(() => {
    setState({
      categories: [],
      tags: [],
      loading: false,
      categoriesLoaded: false,
      tagsLoaded: false,
    });
  }, []);

  /**
   * 刷新所有数据
   */
  const refresh = useCallback(async () => {
    return await fetchAll(true);
  }, [fetchAll]);

  return {
    ...state,
    fetchCategories,
    fetchTags,
    fetchAll,
    clearCache,
    refresh,
  };
};

