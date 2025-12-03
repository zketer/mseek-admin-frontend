/**
 * 搜索历史 Hook
 * 
 * @description 管理搜索历史记录，提供搜索建议功能
 * @author zlynn
 * @date 2025-11-06
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * 搜索历史配置接口
 */
export interface SearchHistoryConfig {
  /** 存储键名 */
  storageKey: string;
  /** 最大历史记录数量 */
  maxItems?: number;
  /** 历史记录过期时间（毫秒），默认 30 天 */
  expireTime?: number;
}

/**
 * 搜索历史项接口
 */
export interface SearchHistoryItem {
  /** 搜索关键词 */
  keyword: string;
  /** 搜索时间戳 */
  timestamp: number;
  /** 搜索次数 */
  count: number;
}

/**
 * 搜索历史 Hook 返回值接口
 */
export interface UseSearchHistoryReturn {
  /** 搜索历史列表 */
  history: SearchHistoryItem[];
  /** 添加搜索记录 */
  addHistory: (keyword: string) => void;
  /** 删除指定搜索记录 */
  removeHistory: (keyword: string) => void;
  /** 清空所有搜索记录 */
  clearHistory: () => void;
  /** 获取搜索建议 */
  getSuggestions: (input: string) => SearchHistoryItem[];
}

/**
 * 搜索历史 Hook
 * 
 * @description 管理搜索历史记录，支持搜索建议、自动过期等功能
 * @param config 配置项
 * @returns 搜索历史管理方法
 * 
 * @example
 * ```tsx
 * const MySearch = () => {
 *   const { history, addHistory, clearHistory, getSuggestions } = useSearchHistory({
 *     storageKey: 'museum-search-history',
 *     maxItems: 10,
 *   });
 *   
 *   const handleSearch = (keyword: string) => {
 *     addHistory(keyword);
 *     // 执行搜索逻辑
 *   };
 *   
 *   return (
 *     <AutoComplete
 *       options={getSuggestions(inputValue).map(item => ({
 *         value: item.keyword,
 *         label: item.keyword,
 *       }))}
 *       onSelect={handleSearch}
 *     />
 *   );
 * };
 * ```
 */
export const useSearchHistory = (config: SearchHistoryConfig): UseSearchHistoryReturn => {
  const {
    storageKey,
    maxItems = 10,
    expireTime = 30 * 24 * 60 * 60 * 1000, // 30 天
  } = config;

  // 加载历史记录
  const loadHistory = useCallback((): SearchHistoryItem[] => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return [];

      const parsed = JSON.parse(stored) as SearchHistoryItem[];
      const now = Date.now();

      // 过滤掉过期的记录
      const validHistory = parsed.filter(
        (item) => now - item.timestamp < expireTime
      );

      // 如果有过期记录被过滤，更新存储
      if (validHistory.length !== parsed.length) {
        localStorage.setItem(storageKey, JSON.stringify(validHistory));
      }

      return validHistory;
    } catch (error) {
      console.error('Failed to load search history:', error);
      return [];
    }
  }, [storageKey, expireTime]);

  const [history, setHistory] = useState<SearchHistoryItem[]>(loadHistory);

  // 保存历史记录到 localStorage
  const saveHistory = useCallback(
    (items: SearchHistoryItem[]) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(items));
        setHistory(items);
      } catch (error) {
        console.error('Failed to save search history:', error);
      }
    },
    [storageKey]
  );

  /**
   * 添加搜索记录
   * @param keyword 搜索关键词
   */
  const addHistory = useCallback(
    (keyword: string) => {
      // 忽略空字符串
      const trimmedKeyword = keyword.trim();
      if (!trimmedKeyword) return;

      const now = Date.now();
      const currentHistory = loadHistory();

      // 查找是否已存在
      const existingIndex = currentHistory.findIndex(
        (item) => item.keyword.toLowerCase() === trimmedKeyword.toLowerCase()
      );

      let newHistory: SearchHistoryItem[];

      if (existingIndex >= 0) {
        // 已存在：更新时间戳和计数，并移到最前面
        const existingItem = currentHistory[existingIndex];
        newHistory = [
          {
            keyword: trimmedKeyword,
            timestamp: now,
            count: existingItem.count + 1,
          },
          ...currentHistory.slice(0, existingIndex),
          ...currentHistory.slice(existingIndex + 1),
        ];
      } else {
        // 不存在：添加新记录到最前面
        newHistory = [
          {
            keyword: trimmedKeyword,
            timestamp: now,
            count: 1,
          },
          ...currentHistory,
        ];
      }

      // 限制最大数量
      if (newHistory.length > maxItems) {
        newHistory = newHistory.slice(0, maxItems);
      }

      saveHistory(newHistory);
    },
    [loadHistory, maxItems, saveHistory]
  );

  /**
   * 删除指定搜索记录
   * @param keyword 搜索关键词
   */
  const removeHistory = useCallback(
    (keyword: string) => {
      const currentHistory = loadHistory();
      const newHistory = currentHistory.filter(
        (item) => item.keyword.toLowerCase() !== keyword.toLowerCase()
      );
      saveHistory(newHistory);
    },
    [loadHistory, saveHistory]
  );

  /**
   * 清空所有搜索记录
   */
  const clearHistory = useCallback(() => {
    saveHistory([]);
  }, [saveHistory]);

  /**
   * 获取搜索建议
   * @param input 输入文本
   * @returns 匹配的搜索历史
   */
  const getSuggestions = useCallback(
    (input: string): SearchHistoryItem[] => {
      const trimmedInput = input.trim().toLowerCase();
      if (!trimmedInput) {
        // 没有输入时，返回所有历史记录（按时间倒序）
        return history;
      }

      // 搜索匹配的历史记录
      const matched = history.filter((item) =>
        item.keyword.toLowerCase().includes(trimmedInput)
      );

      // 按匹配度和搜索次数排序
      return matched.sort((a, b) => {
        // 优先考虑以输入开头的记录
        const aStartsWith = a.keyword.toLowerCase().startsWith(trimmedInput);
        const bStartsWith = b.keyword.toLowerCase().startsWith(trimmedInput);
        
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;

        // 其次按搜索次数排序
        if (a.count !== b.count) return b.count - a.count;

        // 最后按时间排序
        return b.timestamp - a.timestamp;
      });
    },
    [history]
  );

  // 监听 storage 事件，同步多标签页的搜索历史
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey) {
        setHistory(loadHistory());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [storageKey, loadHistory]);

  return {
    history,
    addHistory,
    removeHistory,
    clearHistory,
    getSuggestions,
  };
};

/**
 * 热门搜索 Hook
 * 
 * @description 基于搜索历史统计热门搜索词
 * @param config 配置项
 * @param topN 返回前 N 个热门搜索
 * @returns 热门搜索列表
 * 
 * @example
 * ```tsx
 * const MySearch = () => {
 *   const { history } = useSearchHistory({ storageKey: 'museum-search' });
 *   const hotSearches = useHotSearches({ storageKey: 'museum-search' }, 5);
 *   
 *   return (
 *     <div>
 *       <h3>热门搜索</h3>
 *       {hotSearches.map(item => (
 *         <Tag key={item.keyword}>{item.keyword} ({item.count})</Tag>
 *       ))}
 *     </div>
 *   );
 * };
 * ```
 */
export const useHotSearches = (
  config: SearchHistoryConfig,
  topN: number = 5
): SearchHistoryItem[] => {
  const { history } = useSearchHistory(config);

  return history
    .slice() // 创建副本，避免修改原数组
    .sort((a, b) => {
      // 按搜索次数降序排序
      if (a.count !== b.count) return b.count - a.count;
      // 搜索次数相同时，按时间降序排序
      return b.timestamp - a.timestamp;
    })
    .slice(0, topN);
};

export default useSearchHistory;

