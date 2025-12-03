import React, { useEffect, useRef, useState } from 'react';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Card, Spin, message, Button, Space, Drawer, Table, Tag, FloatButton, Popover, List, Avatar, Badge, Modal, Descriptions, Col, Row, Typography, Tooltip } from 'antd';
import { ArrowLeftOutlined, EnvironmentOutlined, UnorderedListOutlined, EyeOutlined, CloseOutlined, PhoneOutlined, ClockCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl, history } from '@umijs/max';

// ✅ 【优化】按需引入 ECharts - 减少 70% 的 ECharts 打包体积
// 只引入地图所需的核心模块
import * as echarts from 'echarts/core';
import { MapChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  GeoComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { ComposeOption } from 'echarts/core';
import type { MapSeriesOption } from 'echarts/charts';
import type {
  TitleComponentOption,
  TooltipComponentOption,
  VisualMapComponentOption,
  GeoComponentOption,
} from 'echarts/components';

// 注册必要的组件
echarts.use([
  MapChart,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  GeoComponent,
  CanvasRenderer,
]);

// ECharts 类型定义
type ECOption = ComposeOption<
  | MapSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | VisualMapComponentOption
  | GeoComponentOption
>;

import { getMuseumPage1, getMuseumById } from '@/services/museum-service-api/museumInfoController';
import { getMuseumCountByProvince, getMuseumCountByCity } from '@/services/museum-service-api/museumStatisticsController';
import type { ColumnsType } from 'antd/es/table';
import { provinceFileMapping } from './provinceMapping';
import { loadChinaMap, loadProvinceMap as loadProvinceMapData, getCachedMaps } from './utils/mapLoader';

const { Title, Paragraph } = Typography;

/**
 * 博物馆等级映射
 */
const museumLevelMap = {
  0: { text: '无等级', color: '' },
  1: { text: '一级', color: 'blue' },
  2: { text: '二级', color: 'cyan' },
  3: { text: '三级', color: 'green' },
  4: { text: '四级', color: 'orange' },
  5: { text: '五级', color: 'red' },
};

/**
 * 博物馆状态映射
 */
const museumStatusMap = {
  0: { text: '关闭', color: 'default' },
  1: { text: '开放', color: 'success' },
};

// 省份博物馆数据 - 将从后端API获取真实数据
// const provinceMuseumData = [...]; // 已移除硬编码数据，改用state存储真实数据

/**
 * 博物馆地图展示页面
 */
const MuseumMap: React.FC = () => {
  const intl = useIntl();
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const isComponentMounted = useRef(true);

  const [loading, setLoading] = useState(false); // 页面先显示，地图后加载
  const [loadingMessage, setLoadingMessage] = useState('正在初始化地图...');
  const [museums, setMuseums] = useState<MuseumsAPI.MuseumResponse[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [currentMapLevel, setCurrentMapLevel] = useState<'china' | 'province'>('china');
  const [mapHistory, setMapHistory] = useState<Array<{level: 'china' | 'province', name: string}>>([{level: 'china', name: '中国'}]);
  
  // 真实统计数据
  const [provinceMuseumData, setProvinceMuseumData] = useState<Array<{name: string; code: string; value: number}>>([]);
  const [cityMuseumDataMap, setCityMuseumDataMap] = useState<Record<string, Array<{name: string; code: string; value: number}>>>({});

  // 浮动按钮和悬浮列表相关状态
  const [floatingButtonVisible, setFloatingButtonVisible] = useState(false);
  const [floatingButtonBounce, setFloatingButtonBounce] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);

  // 博物馆详情模态框相关状态
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedMuseum, setSelectedMuseum] = useState<MuseumsAPI.MuseumResponse | null>(null);

  // 地图数据缓存（已迁移到 mapLoader 工具）
  // const mapDataCache = useRef<Record<string, any>>({});

  // 获取博物馆数据
  const fetchMuseums = async (cityCode?: string, cityName?: string): Promise<MuseumsAPI.MuseumResponse[]> => {
    try {
      // 构建查询参数，如果提供了城市编码，则按城市编码筛选
      const queryParams: any = {
        page: 1,
        size: 1000, // 一次性获取足够多的数据
      };
      
      if (cityCode) {
        queryParams.cityCode = cityCode;
      }

      const response = await getMuseumPage1({
        query: queryParams
      });

      if (response.success && response.data) {
        const records = response.data.records || [];
        return records;
      }
      return [];
    } catch (error) {
      console.error('获取博物馆数据失败:', error);
      message.error('获取博物馆数据失败');
      return [];
    }
  };

  // 博物馆列表表格列定义
  const columns: ColumnsType<MuseumsAPI.MuseumResponse> = [
    {
      title: '博物馆名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: MuseumsAPI.MuseumResponse) => (
        <Button
          type="link"
          onClick={() => handleViewMuseumDetail(record)}
          style={{ padding: 0, height: 'auto' }}
        >
          {text}
        </Button>
      ),
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '开放' : '关闭'}
        </Tag>
      ),
    },
  ];

  // 查看博物馆详情
  const handleViewMuseumDetail = async (museum: MuseumsAPI.MuseumResponse) => {
    if (!museum.id) {
      message.warning('该博物馆暂无详细信息');
      return;
    }

    try {
      // 使用局部loading状态，不影响整个页面
      const response = await getMuseumById({ id: museum.id });
      if (response.success && response.data) {
        setSelectedMuseum(response.data);
        setDetailModalVisible(true);
      } else {
        message.error(response.message || '获取博物馆详情失败');
      }
    } catch (error) {
      message.error('获取博物馆详情失败');
      console.error(error);
    }
  };

  // 处理浮动按钮点击
  const handleFloatingButtonClick = () => {
    setPopoverVisible(!popoverVisible);
    // 停止跳动动画
    setFloatingButtonBounce(false);
  };

  // 创建悬浮列表内容
  const getPopoverContent = () => {
    if (!museums.length) {
      return (
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <EnvironmentOutlined style={{ fontSize: '24px', color: '#bfbfbf', marginBottom: '8px' }} />
          <div>暂无博物馆数据</div>
        </div>
      );
    }

    return (
      <div style={{ width: '300px', maxHeight: '400px', overflow: 'auto' }}>
        <List
          header={
            <div style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#1890ff',
              textAlign: 'center',
              borderBottom: '1px solid #f0f0f0',
              paddingBottom: '8px'
            }}>
              <EnvironmentOutlined style={{ marginRight: '8px' }} />
              {selectedCity} - 博物馆列表
            </div>
          }
          itemLayout="horizontal"
          dataSource={museums.slice(0, 10)} // 限制显示前10个
          renderItem={(museum, index) => (
            <List.Item
              style={{
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                padding: '12px 16px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={() => {
                handleViewMuseumDetail(museum);
                setPopoverVisible(false);
              }}
              actions={[
                <Button
                  type="link"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewMuseumDetail(museum);
                    setPopoverVisible(false);
                  }}
                >
                  查看
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{
                      backgroundColor: '#1890ff',
                      fontSize: '12px'
                    }}
                  >
                    {index + 1}
                  </Avatar>
                }
                title={
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#262626',
                    marginBottom: '4px'
                  }}>
                    {museum.name}
                  </div>
                }
                description={
                  <div>
                    {museum.address && (
                      <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '2px' }}>
                        📍 {museum.address}
                      </div>
                    )}
                    {museum.type && (
                      <Tag color="blue">{museum.type}</Tag>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
          footer={
            museums.length > 10 && (
              <div style={{
                textAlign: 'center',
                padding: '8px',
                color: '#8c8c8c',
                fontSize: '12px',
                borderTop: '1px solid #f0f0f0'
              }}>
                还有 {museums.length - 10} 个博物馆...
              </div>
            )
          }
        />
      </div>
    );
  };

  // 异步加载省份地图数据（带缓存）
  // 已迁移到 utils/mapLoader.ts，使用动态 import 实现真正的懒加载
  // const loadProvinceMapData = async (fileName: string) => { ... }

  // 加载省份地图
  const loadProvinceMap = async (provinceName: string) => {
    if (!chartInstance.current) return;

    const fileName = provinceFileMapping[provinceName];
    if (!fileName) {
      message.warning(`暂无${provinceName}的详细地图数据`);
      return;
    }

    try {
      setLoading(true);
      setLoadingMessage(`正在加载${provinceName}地图数据...`);

      // 异步加载省份地图数据
      const provinceMapData = await loadProvinceMapData(fileName);
      const mapName = `province_${fileName}`;

      // 注册省份地图
      echarts.registerMap(mapName, provinceMapData);

      // 获取该省份的市级数据 - 从后端API获取真实数据
      let cityData: Array<{name: string; code: string; value: number}> = [];
      
      // 先从provinceMuseumData中找到对应省份的编码
      const provinceInfo = provinceMuseumData.find(p => p.name === provinceName);
      const provinceCode = provinceInfo?.code;
      
      if (provinceCode) {
        // 检查缓存
        if (cityMuseumDataMap[provinceCode]) {
          cityData = cityMuseumDataMap[provinceCode];
        } else {
          // 从后端获取城市数据
          try {
            const cityResponse = await getMuseumCountByCity({ provinceCode });
            if (cityResponse.success && cityResponse.data) {
              cityData = cityResponse.data as any;
              // 缓存城市数据
              setCityMuseumDataMap(prev => ({
                ...prev,
                [provinceCode]: cityData
              }));
            }
          } catch (error) {
            console.error('获取城市统计数据失败:', error);
            // API失败时返回空数组，不再使用模拟数据
            cityData = [];
          }
        }
      } else {
        // 没有找到省份编码，返回空数组
        console.warn(`未找到省份编码: ${provinceName}`);
        cityData = [];
      }
      
      const maxVal = cityData.length > 0 ? Math.max(...cityData.map(item => item.value), 1) : 1;

      const mapOption = {
        title: {
          text: intl.formatMessage({
            id: 'pages.dataCenter.museumMap.title',
            defaultMessage: '博物馆分布地图',
          }),
          subtext: provinceName,
          left: 'center',
          textStyle: { color: '#333', fontSize: 20 },
          subtextStyle: { color: '#666', fontSize: 14 },
        },
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            // 获取博物馆数量，如果为undefined或null则显示0
            const museumCount = params.data?.value ?? 0;
            
            if (params.data) {
              return `
                <div style="padding: 8px;">
                  <div style="font-weight: bold; margin-bottom: 4px;">${params.data.name || params.name}</div>
                  <div style="color: #87CEEB;">博物馆数量: <span style="color: #FFD700; font-weight: bold;">${museumCount}</span> 个</div>
                  <div style="margin-top: 4px; font-size: 12px; color: #ccc;">点击查看市内博物馆列表</div>
                </div>
              `;
            }
            return `
              <div style="padding: 8px;">
                <div style="font-weight: bold;">${params.name}</div>
                <div style="color: #87CEEB;">博物馆数量: <span style="color: #FFD700; font-weight: bold;">0</span> 个</div>
              </div>
            `;
          },
        },
        visualMap: {
          min: 0,
          max: maxVal,
          left: 'left',
          top: 'bottom',
          text: ['高', '低'],
          calculable: true,
          inRange: {
            color: ['#e0f3ff', '#4dabf7', '#339af0', '#228be6', '#1c7ed6', '#1971c2', '#1864ab'],
          },
          outOfRange: {
            color: ['#f8f9fa'],
          },
        },
        series: [
          {
            name: '博物馆数量',
            type: 'map',
            map: mapName,
            roam: true,
            zoom: 1.1, // 省份地图适当缩放
            scaleLimit: { min: 0.5, max: 3 },
            label: {
              show: true,
              fontSize: 11,
              color: '#333',
              fontWeight: 'normal',
              position: 'inside',
              formatter: '{b}',
              align: 'center',
              verticalAlign: 'middle',
              overflow: 'truncate',
              width: 60,
              height: 16
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1
              // 移除固定的areaColor，让visualMap控制颜色
            },
            emphasis: {
              label: { show: true, fontSize: 14, fontWeight: 'bold', color: '#333' },
              itemStyle: { areaColor: '#ffd43b', borderColor: '#fab005', borderWidth: 2, shadowColor: 'rgba(0, 0, 0, 0.3)', shadowBlur: 10 },
            },
            select: {
              label: { show: true, color: '#fff' },
              itemStyle: { areaColor: '#1c7ed6' },
            },
            data: cityData,
          },
        ],
      };

      chartInstance.current.setOption(mapOption, true); // true表示不合并，完全替换

      // 移除所有旧的事件监听器
      chartInstance.current.off('click');

      // 添加省级地图专用的点击事件监听
      chartInstance.current.on('click', (params: any) => {
        // 阻止任何可能的事件传播
        if (params.event && params.event.event) {
          params.event.event.stopPropagation();
          params.event.event.preventDefault();
        }

        if (params.componentType === 'series' && params.data) {
          // 在省份地图层级，点击市则显示博物馆列表
          const cityName = params.data.name;
          const cityCode = params.data.code; // 获取城市编码
          
          // 确保不会调用 loadProvinceMap
          if (provinceFileMapping[cityName]) {
            // 阻止对市级地区的进一步下探，因为我们只要两层
            return; // 直接返回，不执行任何操作
          }

          setSelectedCity(cityName);

          // 使用城市编码获取该城市的真实博物馆数据
          fetchMuseums(cityCode, cityName).then((museumList) => {
            setMuseums(museumList);

            // 显示浮动按钮并触发跳动动画
            setFloatingButtonVisible(true);
            setFloatingButtonBounce(true);

            // 3秒后停止跳动
            setTimeout(() => {
              setFloatingButtonBounce(false);
            }, 3000);
          });
        }
      });

      // 更新状态
      setCurrentMapLevel('province');
      setSelectedProvince(provinceName);
      setMapHistory(prev => [...prev, {level: 'province', name: provinceName}]);

    } catch (error) {
      console.error('加载省份地图失败:', error);
      message.error(`加载${provinceName}地图数据失败`);
    } finally {
      setLoadingMessage('正在加载地图数据...');
    }
  };

  // 返回上一级地图
  const goBackToChina = () => {
    if (!chartInstance.current) return;

    setLoading(true);

    // 重新初始化中国地图
    initializeMap();

    // 重置状态
    setCurrentMapLevel('china');
    setSelectedProvince(null);
    setSelectedCity(null);
    setMapHistory([{level: 'china', name: '中国'}]);

    // 隐藏浮动按钮和重置相关状态
    setFloatingButtonVisible(false);
    setFloatingButtonBounce(false);
    setPopoverVisible(false);
    setMuseums([]);
  };

  // 异步加载中国地图数据
  // 已迁移到 utils/mapLoader.ts，使用动态 import 实现真正的懒加载
  const loadChinaMapData = async () => {
    try {
      setLoadingMessage('正在加载中国地图数据...');
      return await loadChinaMap();
    } catch (error) {
      console.error('加载中国地图数据失败:', error);
        throw new Error('无法加载中国地图数据');
    }
  };

  // 初始化地图
  const initializeMap = async (data?: Array<{name: string; code: string; value: number}>) => {
    if (!chartRef.current || !isComponentMounted.current) return;

    // 如果没有传入数据，使用state中的数据
    const mapDataToUse = data || provinceMuseumData;
    
    // 如果没有数据，等待数据加载
    if (!mapDataToUse || mapDataToUse.length === 0) {
      return;
    }

    try {
      // 不再设置全局loading，只在地图容器内显示加载状态
      setLoadingMessage('正在初始化地图组件...');

      // 确保容器存在且组件仍然挂载
      if (chartRef.current && isComponentMounted.current) {
        // 清理可能存在的旧实例
        if (chartInstance.current) {
          try {
            chartInstance.current.dispose();
          } catch (e) {
            console.warn('清理旧ECharts实例:', e);
          }
        }

        chartInstance.current = echarts.init(chartRef.current);

        // 显示加载中的地图
        if (chartInstance.current && isComponentMounted.current) {
          chartInstance.current.showLoading('default', {
            text: '正在加载中国地图数据...',
            color: '#1890ff',
            textColor: '#000',
            maskColor: 'rgba(255, 255, 255, 0.8)',
            zlevel: 0
          });
        }
      } else {
        throw new Error('地图容器未就绪或组件已卸载');
      }

      // 异步加载地图数据
      const chinaMapData = await loadChinaMapData();

      // 检查组件是否仍然挂载
      if (!isComponentMounted.current) return;

      // 隐藏加载动画
      if (chartInstance.current) {
        chartInstance.current.hideLoading();
      }

      // 注册中国地图数据
      echarts.registerMap('china', chinaMapData as any);

      const mapData = mapDataToUse.map(item => ({
        name: item.name,
        value: item.value
      }));
      const maxVal = Math.max(...mapData.map(item => item.value), 10);

      const mapOption = {
        title: {
          text: intl.formatMessage({
            id: 'pages.dataCenter.museumMap.title',
            defaultMessage: '博物馆分布地图',
          }),
          subtext: '中国',
          left: 'center',
          textStyle: { color: '#333', fontSize: 20 },
          subtextStyle: { color: '#666', fontSize: 14 },
        },
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            // 获取博物馆数量，如果为undefined或null则显示0
            const museumCount = params.data?.value ?? 0;
            
            if (params.data) {
              return `
                <div style="padding: 8px;">
                  <div style="font-weight: bold; margin-bottom: 4px;">${params.data.name || params.name}</div>
                  <div style="color: #87CEEB;">博物馆数量: <span style="color: #FFD700; font-weight: bold;">${museumCount}</span> 个</div>
                  <div style="margin-top: 4px; font-size: 12px; color: #ccc;">点击查看省内地图</div>
                </div>
              `;
            }
            return `
              <div style="padding: 8px;">
                <div style="font-weight: bold;">${params.name}</div>
                <div style="color: #87CEEB;">博物馆数量: <span style="color: #FFD700; font-weight: bold;">0</span> 个</div>
              </div>
            `;
          },
        },
        visualMap: {
          min: 0,
          max: maxVal,
          left: 'left',
          top: 'bottom',
          text: ['高', '低'],
          calculable: true,
          inRange: {
            color: ['#e0f3ff', '#4dabf7', '#339af0', '#228be6', '#1c7ed6', '#1971c2', '#1864ab'],
          },
          outOfRange: {
            color: ['#f8f9fa'],
          },
        },
        series: [
          {
            name: '博物馆数量',
            type: 'map',
            map: 'china',
            roam: true,
            center: [104.1954, 35.8617], // 中国地理中心坐标
            zoom: 1.2, // 适当的缩放比例
            scaleLimit: { min: 0.5, max: 3 },
            label: {
              show: true,
              fontSize: 12,
              color: '#333',
              fontWeight: 'normal',
              position: 'inside',
              formatter: '{b}',
              align: 'center',
              verticalAlign: 'middle',
              overflow: 'truncate',
              width: 80,
              height: 20
            },
            itemStyle: { borderColor: '#fff', borderWidth: 1, areaColor: '#f8f9fa' },
            emphasis: {
              label: { show: true, fontSize: 14, fontWeight: 'bold', color: '#333' },
              itemStyle: { areaColor: '#ffd43b', borderColor: '#fab005', borderWidth: 2, shadowColor: 'rgba(0, 0, 0, 0.3)', shadowBlur: 10 },
            },
            select: {
              label: { show: true, color: '#fff' },
              itemStyle: { areaColor: '#1c7ed6' },
            },
            data: mapData,
          },
        ],
      };

      chartInstance.current.setOption(mapOption);

      // 移除所有旧的事件监听器
      chartInstance.current.off('click');

      // 添加中国地图专用的点击事件监听
      chartInstance.current.on('click', (params: any) => {
        if (params.componentType === 'series' && params.data) {
          // 在中国地图层级，只处理钻取到省份地图
          const provinceName = params.data.name;
          loadProvinceMap(provinceName);
        }
      });

      // 添加窗口大小变化监听
      const handleResize = () => {
        chartInstance.current?.resize();
      };
      window.addEventListener('resize', handleResize);

      // 添加清理函数到全局
      const cleanup = () => {
        window.removeEventListener('resize', handleResize);
        chartInstance.current?.dispose();
      };

    } catch (error) {
      console.error('初始化地图失败:', error);
      message.error('加载地图数据失败');
    }
  };

  // 预加载热门省份地图数据（在用户可能需要时提前加载）
  const preloadPopularProvinces = async () => {
    const popularProvinces = ['beijing', 'shanghai', 'guangdong', 'jiangsu', 'zhejiang'];

    // 延迟3秒后开始预加载，避免影响初始页面加载
    setTimeout(async () => {
      const cachedMaps = getCachedMaps(); // 获取已缓存的地图列表
      for (const province of popularProvinces) {
        try {
          const cacheKey = `province_${province}`;
          if (!cachedMaps.includes(cacheKey)) {
            setLoadingMessage(`预加载${province}地图数据...`);
            await loadProvinceMapData(province);
            // 每个省份之间间隔200ms，避免同时加载过多
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        } catch (error) {
        }
      }
    }, 3000);
  };

  // 获取统计数据
  const fetchStatisticsData = async () => {
    try {
      // 获取省份统计数据
      const provinceResponse = await getMuseumCountByProvince({});
      if (provinceResponse.success && provinceResponse.data) {
        const data = provinceResponse.data as any;
        setProvinceMuseumData(data);
        return data;
      }
      
      // 预加载热门省份的城市数据（可选）
      // 注：暂不预加载所有省份数据，避免首次加载过慢
    } catch (error) {
      console.error('❌ 获取统计数据失败:', error);
      // 失败时返回空数组
      return [];
    }
  };
  
  // 组件挂载时获取统计数据
  useEffect(() => {
    fetchStatisticsData();
  }, []);

  // 当省份数据加载完成后，初始化地图
  useEffect(() => {
    // 如果数据还没有加载完成，不执行
    if (!provinceMuseumData || provinceMuseumData.length === 0) {
      return;
    }

    let isMounted = true;
    let timer: NodeJS.Timeout | null = null;

    // 延迟一点，确保DOM已渲染
    timer = setTimeout(() => {
      if (isMounted && chartRef.current) {
        initializeMap(provinceMuseumData).then(() => {
          // 只有在组件仍然挂载时才启动预加载
          if (isMounted) {
            preloadPopularProvinces();
          }
        }).catch((error) => {
          if (isMounted) {
            console.error('地图初始化失败:', error);
            message.error('地图加载失败，请刷新页面重试');
          }
        });
      }
    }, 100);

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [provinceMuseumData]);

  // 组件卸载时清理资源
  useEffect(() => {
    return () => {
      isComponentMounted.current = false;
      // 立即清理ECharts实例，避免React DOM冲突
      if (chartInstance.current) {
        try {
          // 先停止所有动画和交互
          chartInstance.current.clear();
          chartInstance.current.off(); // 移除所有事件监听器
          // 立即dispose
          chartInstance.current.dispose();
        } catch (error) {
          console.warn('清理ECharts实例时出错:', error);
        } finally {
          chartInstance.current = null;
        }
      }
    };
  }, []);

  // 监听窗口大小变化，调整地图大小
  useEffect(() => {
    const handleResize = () => {
      if (chartInstance.current && isComponentMounted.current) {
        try {
          chartInstance.current.resize();
        } catch (error) {
          console.warn('调整地图大小时出错:', error);
        }
      }
    };

    window.addEventListener('resize', handleResize);

    // 也可以监听元素大小变化（如果支持ResizeObserver）
    let resizeObserver: ResizeObserver | null = null;
    if (chartRef.current && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(chartRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  return (
    <PageContainer
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
      header={{
        title: intl.formatMessage({
          id: 'pages.dataCenter.museumMap.pageTitle',
          defaultMessage: '博物馆地图分布',
        }),
        extra: (
          <Tooltip
            title={
              <div>
                <div>💡 鼠标悬停查看博物馆数量</div>
                <div style={{ marginTop: 4 }}>
                  {currentMapLevel === 'china' ? (
                    <span>🖱️ 点击省份查看省内地图</span>
                  ) : (
                    <span>🖱️ 点击市区后查看右侧浮动按钮</span>
                  )}
                </div>
                <div style={{ marginTop: 4 }}>🔍 支持地图缩放和平移</div>
              </div>
            }
            placement="bottom"
          >
            <Button
              type="text"
              icon={<InfoCircleOutlined />}
              style={{ color: '#1890ff' }}
            >
              操作提示
            </Button>
          </Tooltip>
        ),
        breadcrumb: {
          routes: [
            {
              path: '/dashboard',
              breadcrumbName: intl.formatMessage({
                id: 'menu.dashboard',
                defaultMessage: '数据中心',
              }),
            },
            {
              path: '/dashboard/museum-map',
              breadcrumbName: intl.formatMessage({
                id: 'menu.museum-map',
                defaultMessage: '博物馆地图',
              }),
            },
          ],
        },
      }}
    >
      <Card style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}
      styles={{
        body: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '24px'
        }
      }}>
        {/* 地图导航面包屑 */}
        {currentMapLevel === 'province' && (
          <div style={{ marginBottom: 16, padding: '8px 16px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
            <Space>
              <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={goBackToChina}
                style={{ padding: 0 }}
              >
                返回全国地图
              </Button>
              <span style={{ color: '#999' }}>→</span>
              <span style={{ fontWeight: 'bold' }}>{selectedProvince}</span>
            </Space>
          </div>
        )}

        {/* 地图展示 */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          <div
            ref={chartRef}
            key="echarts-container" // 添加key确保React正确追踪这个元素
            style={{
              width: '100%',
              height: '100%',
              minHeight: '500px',
              border: '1px solid #f0f0f0',
              borderRadius: '6px',
              backgroundColor: '#fafafa'
            }}
          />
          {/* 将占位内容移到外层，避免干扰ECharts DOM */}
          {!chartInstance.current && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
              pointerEvents: 'none',
              zIndex: 1
            }}>
              <EnvironmentOutlined style={{ fontSize: '48px', marginBottom: '16px', color: '#1890ff' }} />
              <div style={{ fontSize: '16px', marginBottom: '8px' }}>博物馆分布地图</div>
              <div style={{ fontSize: '14px', color: '#999' }}>正在加载地图数据，请稍候...</div>
            </div>
          )}
        </div>
      </Card>

      {/* 博物馆列表抽屉 */}
      <Drawer
        title={
          <div>
            <EnvironmentOutlined style={{ marginRight: 8 }} />
            {selectedCity ? `${selectedProvince} - ${selectedCity}` : selectedProvince} - 博物馆列表
          </div>
        }
        width={800}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        extra={
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => setDrawerVisible(false)}
          >
            返回地图
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={museums}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          scroll={{ x: 'max-content' }}
        />
      </Drawer>

      {/* 浮动按钮 - 显示博物馆列表 */}
      {floatingButtonVisible && (
        <Popover
          content={getPopoverContent()}
          title={null}
          trigger="click"
          open={popoverVisible}
          onOpenChange={setPopoverVisible}
          placement="leftTop"
          overlayStyle={{
            zIndex: 1001,
            maxWidth: 'none'
          }}
        >
          <FloatButton
            icon={
              <Badge count={museums.length} size="small" offset={[8, -8]}>
                <UnorderedListOutlined />
              </Badge>
            }
            type="primary"
            style={{
              right: 24,
              bottom: 80,
              width: 56,
              height: 56,
              animation: floatingButtonBounce ? 'bounce 0.6s infinite alternate' : 'none',
              boxShadow: '0 4px 16px rgba(24, 144, 255, 0.4)',
            }}
            onClick={handleFloatingButtonClick}
            tooltip={`${selectedCity} 的博物馆列表 (${museums.length}个)`}
          />
        </Popover>
      )}

      {/* 博物馆详情模态框 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <EnvironmentOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            <span style={{ fontSize: '18px' }}>
              {selectedMuseum ? selectedMuseum.name : '博物馆详情'}
            </span>
          </div>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button
            key="close"
            onClick={() => setDetailModalVisible(false)}
            icon={<CloseOutlined />}
          >
            关闭
          </Button>
        ]}
        width={1000}
        centered
        destroyOnHidden
        style={{ top: 20 }}
      >
        {selectedMuseum && (
          <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '8px' }}>
            {/* 基本信息 */}
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>基本信息</span>
                  <Space>
                    {(() => {
                      const statusInfo = museumStatusMap[selectedMuseum.status as keyof typeof museumStatusMap] || museumStatusMap[0];
                      const levelInfo = museumLevelMap[selectedMuseum.level as keyof typeof museumLevelMap] || museumLevelMap[0];
                      return (
                        <>
                          <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
                          <Tag color={levelInfo.color}>{levelInfo.text}</Tag>
                        </>
                      );
                    })()}
                  </Space>
                </div>
              }
              bordered={false}
              style={{ marginBottom: 16 }}
            >
              <ProDescriptions 
                column={1}
                labelStyle={{ width: '130px', fontWeight: 'bold' }}
              >
                <ProDescriptions.Item label="博物馆名称">{selectedMuseum.name}</ProDescriptions.Item>
                <ProDescriptions.Item label="博物馆编码" copyable>
                  {selectedMuseum.code}
                </ProDescriptions.Item>
                <ProDescriptions.Item label="所在城市">
                  {[selectedMuseum.province, selectedMuseum.city, selectedMuseum.district].filter(Boolean).join(' - ')}
                </ProDescriptions.Item>
                <ProDescriptions.Item label="详细地址">{selectedMuseum.address || '-'}</ProDescriptions.Item>
                <ProDescriptions.Item label="联系电话">{selectedMuseum.phone || '-'}</ProDescriptions.Item>
                <ProDescriptions.Item label="官方网站">
                  {selectedMuseum.website ? (
                    <a href={selectedMuseum.website} target="_blank" rel="noopener noreferrer">
                      {selectedMuseum.website}
                    </a>
                  ) : (
                    '-'
                  )}
                </ProDescriptions.Item>
                <ProDescriptions.Item label="开放时间">{selectedMuseum.openTime || '-'}</ProDescriptions.Item>
                <ProDescriptions.Item label="日接待能力">
                  {selectedMuseum.capacity ? `${selectedMuseum.capacity}人/天` : '-'}
                </ProDescriptions.Item>
                <ProDescriptions.Item label="创建时间" valueType="dateTime">
                  {selectedMuseum.createAt}
                </ProDescriptions.Item>
                <ProDescriptions.Item label="更新时间" valueType="dateTime">
                  {selectedMuseum.updateAt}
                </ProDescriptions.Item>
              </ProDescriptions>
            </Card>

            {/* 位置信息 */}
            <Card title="位置信息" style={{ marginBottom: 16 }} bordered={false}>
              <Row gutter={16}>
                <Col span={12}>
                  <ProDescriptions 
                    column={1}
                    labelStyle={{ width: '130px', fontWeight: 'bold' }}
                  >
                    <ProDescriptions.Item label="经度">{selectedMuseum.longitude || '-'}</ProDescriptions.Item>
                    <ProDescriptions.Item label="纬度">{selectedMuseum.latitude || '-'}</ProDescriptions.Item>
                  </ProDescriptions>
                </Col>
                <Col span={12}>
                  {selectedMuseum.longitude && selectedMuseum.latitude ? (
                    <div style={{ height: 200, background: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '6px' }}>
                      地图组件（需要集成地图API）
                    </div>
                  ) : (
                    <div style={{ height: 200, background: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '6px' }}>
                      暂无位置信息
                    </div>
                  )}
                </Col>
              </Row>
            </Card>

            {/* 分类与标签 */}
            <Card title="分类与标签" style={{ marginBottom: 16 }} bordered={false}>
              <Row gutter={16}>
                <Col span={12}>
                  <Title level={5}>分类</Title>
                  <Space wrap>
                    {selectedMuseum.categories && selectedMuseum.categories.length > 0 ? (
                      selectedMuseum.categories.map((category) => (
                        <Tag key={category.id} color="blue">
                          {category.name}
                        </Tag>
                      ))
                    ) : (
                      <span>暂无分类</span>
                    )}
                  </Space>
                </Col>
                <Col span={12}>
                  <Title level={5}>标签</Title>
                  <Space wrap>
                    {selectedMuseum.tags && selectedMuseum.tags.length > 0 ? (
                      selectedMuseum.tags.map((tag) => (
                        <Tag key={tag.id} color={tag.color || 'default'}>
                          {tag.name}
                        </Tag>
                      ))
                    ) : (
                      <span>暂无标签</span>
                    )}
                  </Space>
                </Col>
              </Row>
            </Card>

            {/* 博物馆描述 */}
            <Card title="博物馆描述" style={{ marginBottom: 16 }} bordered={false}>
              <Paragraph>{selectedMuseum.description || '暂无描述'}</Paragraph>
            </Card>

            {/* 门票信息 */}
            <Card title="门票信息" bordered={false}>
              <Paragraph>{selectedMuseum.ticketInfo || '暂无门票信息'}</Paragraph>
            </Card>
          </div>
        )}
      </Modal>

      {/* 添加CSS动画 */}
      <style>{`
        @keyframes bounce {
          0% { transform: scale(1) translateY(0px); }
          100% { transform: scale(1.1) translateY(-5px); }
        }
      `}</style>
    </PageContainer>
  );
};

export default MuseumMap;
