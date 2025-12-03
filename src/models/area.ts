/**
 * 地区数据全局状态管理
 * @description 管理省市区街道数据，实现多级缓存
 */
import { useState, useCallback } from 'react';
import { getAllProvinces } from '@/services/museum-service-api/areaProvinceController';
import { getCitiesByProvince } from '@/services/museum-service-api/areaCityController';
import { getDistrictsByCity } from '@/services/museum-service-api/areaDistrictController';
import { getStreetsByDistrict } from '@/services/museum-service-api/areaStreetController';
import type { AreaData, AreaOption } from '@/types/common';

interface AreaCache {
  /** 省份列表缓存 */
  provinces?: AreaData[];
  /** 城市列表缓存（按省份编码索引） */
  cities: Record<string, AreaData[]>;
  /** 区县列表缓存（按城市编码索引） */
  districts: Record<string, AreaData[]>;
  /** 街道列表缓存（按区县编码索引） */
  streets: Record<string, AreaData[]>;
}

export default () => {
  const [cache, setCache] = useState<AreaCache>({
    cities: {},
    districts: {},
    streets: {},
  });
  const [loading, setLoading] = useState(false);

  /**
   * 获取省份列表（带缓存）
   */
  const fetchProvinces = useCallback(async (forceRefresh = false) => {
    // ✅ 缓存命中
    if (cache.provinces && !forceRefresh) {
      return cache.provinces;
    }

    setLoading(true);
    try {
      const res = await getAllProvinces();
      if (res.success && res.data) {
        const provinces = res.data as AreaData[];
        setCache(prev => ({ ...prev, provinces }));
        
        return provinces;
      }
      return [];
    } catch (error) {
      console.error('[Area Model] 省份数据加载失败:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [cache.provinces]);

  /**
   * 获取城市列表（带缓存）
   */
  const fetchCities = useCallback(async (provinceCode: string, forceRefresh = false) => {
    // ✅ 缓存命中
    if (cache.cities[provinceCode] && !forceRefresh) {
      return cache.cities[provinceCode];
    }

    setLoading(true);
    try {
      const res = await getCitiesByProvince({ provinceAdcode: provinceCode });
      if (res.success && res.data) {
        const cities = res.data as AreaData[];
        setCache(prev => ({
          ...prev,
          cities: {
            ...prev.cities,
            [provinceCode]: cities,
          },
        }));
        
        return cities;
      }
      return [];
    } catch (error) {
      console.error(`[Area Model] 城市数据加载失败: ${provinceCode}`, error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [cache.cities]);

  /**
   * 获取区县列表（带缓存）
   */
  const fetchDistricts = useCallback(async (cityCode: string, forceRefresh = false) => {
    // ✅ 缓存命中
    if (cache.districts[cityCode] && !forceRefresh) {
      return cache.districts[cityCode];
    }

    setLoading(true);
    try {
      const res = await getDistrictsByCity({ cityCode });
      if (res.success && res.data) {
        const districts = res.data as AreaData[];
        setCache(prev => ({
          ...prev,
          districts: {
            ...prev.districts,
            [cityCode]: districts,
          },
        }));
        
        return districts;
      }
      return [];
    } catch (error) {
      console.error(`[Area Model] 区县数据加载失败: ${cityCode}`, error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [cache.districts]);

  /**
   * 获取街道列表（带缓存）
   */
  const fetchStreets = useCallback(async (districtCode: string, forceRefresh = false) => {
    // ✅ 缓存命中
    if (cache.streets[districtCode] && !forceRefresh) {
      return cache.streets[districtCode];
    }

    setLoading(true);
    try {
      const res = await getStreetsByDistrict({ districtCode });
      if (res.success && res.data) {
        const streets = res.data as AreaData[];
        setCache(prev => ({
          ...prev,
          streets: {
            ...prev.streets,
            [districtCode]: streets,
          },
        }));
        
        return streets;
      }
      return [];
    } catch (error) {
      console.error(`[Area Model] 街道数据加载失败: ${districtCode}`, error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [cache.streets]);

  /**
   * 转换为级联选择器选项格式
   */
  const toAreaOptions = useCallback((areas: AreaData[], isLeaf = false): AreaOption[] => {
    return areas.map(area => ({
      value: area.adcode,
      label: area.name,
      isLeaf,
    }));
  }, []);

  /**
   * 清空缓存
   */
  const clearCache = useCallback(() => {
    setCache({
      provinces: undefined,
      cities: {},
      districts: {},
      streets: {},
    });
  }, []);

  /**
   * 获取缓存统计信息
   */
  const getCacheStats = useCallback(() => {
    return {
      hasProvinces: !!cache.provinces,
      provincesCount: cache.provinces?.length || 0,
      citiesCacheSize: Object.keys(cache.cities).length,
      districtsCacheSize: Object.keys(cache.districts).length,
      streetsCacheSize: Object.keys(cache.streets).length,
    };
  }, [cache]);

  return {
    loading,
    cache,
    fetchProvinces,
    fetchCities,
    fetchDistricts,
    fetchStreets,
    toAreaOptions,
    clearCache,
    getCacheStats,
  };
};

