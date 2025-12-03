/**
 * 地图数据懒加载工具
 * 按需加载省市地图 JSON 文件，优化首屏加载性能
 */

/** 地图数据缓存 */
const mapCache = new Map<string, any>();

/** 正在加载的地图 Promise 缓存（防止重复加载） */
const loadingPromises = new Map<string, Promise<any>>();

/**
 * 加载中国地图数据
 * @returns 中国地图 GeoJSON 数据
 */
export async function loadChinaMap(): Promise<any> {
  const key = 'china';

  // 检查缓存
  if (mapCache.has(key)) {
    return mapCache.get(key);
  }

  // 检查是否正在加载
  if (loadingPromises.has(key)) {
    return loadingPromises.get(key);
  }

  // 开始加载
  const loadPromise = (async () => {
    try {
      if (process.env.NODE_ENV === 'development') {
      }

      // 使用动态 import 实现代码分割
      // @ts-ignore - 动态 import JSON 在运行时可以正常工作
      const mapData = await import('../china.json');

      // 存入缓存
      mapCache.set(key, mapData.default || mapData);

      return mapData.default || mapData;
    } catch (error) {
      console.error('[MapLoader] Failed to load china map:', error);
      throw error;
    } finally {
      loadingPromises.delete(key);
    }
  })();

  loadingPromises.set(key, loadPromise);
  return loadPromise;
}

/**
 * 加载省份地图数据
 * @param provinceFileName 省份文件名（如 'beijing', 'shanghai'）
 * @returns 省份地图 GeoJSON 数据
 */
export async function loadProvinceMap(provinceFileName: string): Promise<any> {
  const key = `province_${provinceFileName}`;

  // 检查缓存
  if (mapCache.has(key)) {
    return mapCache.get(key);
  }

  // 检查是否正在加载
  if (loadingPromises.has(key)) {
    return loadingPromises.get(key);
  }

  // 开始加载
  const loadPromise = (async () => {
    try {
      if (process.env.NODE_ENV === 'development') {
      }

      // 使用动态 import 实现按需加载
      // @ts-ignore - 动态 import JSON 在运行时可以正常工作
      const mapData = await import(`../provinces/${provinceFileName}.json`);

      // 存入缓存
      mapCache.set(key, mapData.default || mapData);

      return mapData.default || mapData;
    } catch (error) {
      console.error(`[MapLoader] Failed to load ${provinceFileName} map:`, error);
      throw error;
    } finally {
      loadingPromises.delete(key);
    }
  })();

  loadingPromises.set(key, loadPromise);
  return loadPromise;
}

/**
 * 预加载省份地图（可选）
 * @param provinceFileNames 省份文件名数组
 */
export async function preloadProvinceMaps(provinceFileNames: string[]): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
  }

  const promises = provinceFileNames.map((fileName) => 
    loadProvinceMap(fileName).catch((error) => {
      console.warn(`[MapLoader] Failed to preload ${fileName}:`, error);
    })
  );

  await Promise.all(promises);

  if (process.env.NODE_ENV === 'development') {
  }
}

/**
 * 清除地图缓存
 * @param key 缓存键，不传则清除所有缓存
 */
export function clearMapCache(key?: string): void {
  if (key) {
    mapCache.delete(key);
  } else {
    mapCache.clear();
  }
}

/**
 * 获取缓存大小
 * @returns 缓存中的地图数量
 */
export function getCacheSize(): number {
  return mapCache.size;
}

/**
 * 获取缓存的地图列表
 * @returns 缓存的地图键名数组
 */
export function getCachedMaps(): string[] {
  return Array.from(mapCache.keys());
}

