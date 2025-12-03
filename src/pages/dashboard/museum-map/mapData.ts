// 中国省份地图数据和博物馆分布数据
export const provinceData = {
  '北京': { code: '110000', museums: 25, coordinates: [116.4074, 39.9042] },
  '天津': { code: '120000', museums: 12, coordinates: [117.1901, 39.1037] },
  '河北': { code: '130000', museums: 18, coordinates: [114.4995, 38.1006] },
  '山西': { code: '140000', museums: 15, coordinates: [112.3352, 37.9413] },
  '内蒙古': { code: '150000', museums: 10, coordinates: [111.4124, 40.4901] },
  '辽宁': { code: '210000', museums: 20, coordinates: [123.1238, 42.1216] },
  '吉林': { code: '220000', museums: 14, coordinates: [125.8154, 44.2584] },
  '黑龙江': { code: '230000', museums: 16, coordinates: [127.9688, 45.368] },
  '上海': { code: '310000', museums: 35, coordinates: [121.4737, 31.2304] },
  '江苏': { code: '320000', museums: 42, coordinates: [118.8062, 31.9208] },
  '浙江': { code: '330000', museums: 38, coordinates: [119.5313, 29.8773] },
  '安徽': { code: '340000', museums: 22, coordinates: [117.29, 32.0581] },
  '福建': { code: '350000', museums: 26, coordinates: [119.4543, 25.9222] },
  '江西': { code: '360000', museums: 19, coordinates: [115.8999, 28.2294] },
  '山东': { code: '370000', museums: 45, coordinates: [117.1582, 36.8701] },
  '河南': { code: '410000', museums: 32, coordinates: [113.4668, 34.6234] },
  '湖北': { code: '420000', museums: 28, coordinates: [114.3896, 30.6628] },
  '湖南': { code: '430000', museums: 24, coordinates: [113.0823, 28.2568] },
  '广东': { code: '440000', museums: 55, coordinates: [113.12244, 23.009505] },
  '广西': { code: '450000', museums: 18, coordinates: [108.479, 23.1152] },
  '海南': { code: '460000', museums: 8, coordinates: [110.3893, 19.8516] },
  '重庆': { code: '500000', museums: 20, coordinates: [106.9123, 29.1630] },
  '四川': { code: '510000', museums: 35, coordinates: [103.9526, 30.7617] },
  '贵州': { code: '520000', museums: 15, coordinates: [106.6992, 26.7682] },
  '云南': { code: '530000', museums: 22, coordinates: [102.9199, 25.4663] },
  '西藏': { code: '540000', museums: 6, coordinates: [91.1865, 30.1465] },
  '陕西': { code: '610000', museums: 28, coordinates: [109.1162, 34.2004] },
  '甘肃': { code: '620000', museums: 12, coordinates: [103.5901, 36.3043] },
  '青海': { code: '630000', museums: 5, coordinates: [101.4038, 36.8207] },
  '宁夏': { code: '640000', museums: 6, coordinates: [106.3586, 38.1775] },
  '新疆': { code: '650000', museums: 14, coordinates: [87.9236, 43.5883] },
  '台湾': { code: '710000', museums: 18, coordinates: [121.0254, 23.5986] },
  '香港': { code: '810000', museums: 12, coordinates: [114.2578, 22.3242] },
  '澳门': { code: '820000', museums: 4, coordinates: [113.5439, 22.1758] },
};

// 城市数据示例（部分省份的主要城市）
export const cityData: Record<string, Record<string, { museums: number; coordinates: [number, number] }>> = {
  '江苏': {
    '南京市': { museums: 12, coordinates: [118.8062, 32.0581] },
    '苏州市': { museums: 8, coordinates: [120.6519, 31.3989] },
    '无锡市': { museums: 6, coordinates: [120.3442, 31.5527] },
    '常州市': { museums: 4, coordinates: [119.4543, 31.5582] },
    '镇江市': { museums: 3, coordinates: [119.4763, 32.2044] },
    '扬州市': { museums: 3, coordinates: [119.4653, 32.8162] },
    '泰州市': { museums: 2, coordinates: [120.0586, 32.5525] },
    '南通市': { museums: 4, coordinates: [121.1023, 32.1625] },
  },
  '广东': {
    '广州市': { museums: 18, coordinates: [113.12244, 23.009505] },
    '深圳市': { museums: 15, coordinates: [114.5435, 22.5439] },
    '珠海市': { museums: 4, coordinates: [113.7305, 22.1155] },
    '佛山市': { museums: 5, coordinates: [112.8955, 23.1097] },
    '东莞市': { museums: 4, coordinates: [113.8953, 22.901] },
    '中山市': { museums: 3, coordinates: [113.4229, 22.478] },
    '惠州市': { museums: 3, coordinates: [114.6204, 23.1647] },
    '江门市': { museums: 3, coordinates: [112.6318, 22.1484] },
  },
  '山东': {
    '济南市': { museums: 10, coordinates: [117.1582, 36.8701] },
    '青岛市': { museums: 12, coordinates: [120.4651, 36.3373] },
    '烟台市': { museums: 6, coordinates: [120.7397, 37.5128] },
    '潍坊市': { museums: 5, coordinates: [119.0918, 36.524] },
    '临沂市': { museums: 4, coordinates: [118.3118, 35.2936] },
    '淄博市': { museums: 4, coordinates: [118.0371, 36.6064] },
    '济宁市': { museums: 4, coordinates: [116.8286, 35.3375] },
  },
  '四川': {
    '成都市': { museums: 15, coordinates: [103.9526, 30.7617] },
    '绵阳市': { museums: 4, coordinates: [104.7327, 31.8713] },
    '德阳市': { museums: 3, coordinates: [104.48, 31.1133] },
    '南充市': { museums: 3, coordinates: [106.1649, 30.8377] },
    '宜宾市': { museums: 3, coordinates: [104.6558, 28.548] },
    '自贡市': { museums: 2, coordinates: [104.6667, 29.2786] },
    '泸州市': { museums: 2, coordinates: [105.4578, 28.493] },
    '达州市': { museums: 3, coordinates: [107.6111, 31.2254] },
  },
  '河南': {
    '郑州市': { museums: 8, coordinates: [113.4668, 34.6234] },
    '洛阳市': { museums: 6, coordinates: [112.0605, 34.3158] },
    '开封市': { museums: 4, coordinates: [114.5764, 34.6853] },
    '安阳市': { museums: 3, coordinates: [114.4775, 36.1976] },
    '新乡市': { museums: 3, coordinates: [113.9268, 35.2704] },
    '许昌市': { museums: 2, coordinates: [113.9389, 34.0466] },
    '平顶山市': { museums: 2, coordinates: [112.9724, 33.739] },
    '焦作市': { museums: 2, coordinates: [113.4778, 35.1378] },
    '商丘市': { museums: 2, coordinates: [115.6654, 34.2828] },
  },
};

// 模拟博物馆详细数据
export const mockMuseumData: Record<string, MuseumsAPI.MuseumResponse[]> = {
  '江苏-南京市': [
    {
      id: 1,
      name: '南京博物院',
      code: 'NJ001',
      city: '南京市',
      province: '江苏',
      district: '玄武区',
      address: '中山东路321号',
      phone: '025-84807923',
      website: 'http://www.njmuseum.com',
      level: 1,
      status: 1,
      description: '中国三大博物馆之一',
      createTime: '2020-01-01T00:00:00',
      updateTime: '2024-01-01T00:00:00',
    },
    {
      id: 2,
      name: '南京市博物馆',
      code: 'NJ002',
      city: '南京市',
      province: '江苏',
      district: '白下区',
      address: '朝天宫4号',
      phone: '025-84466460',
      level: 2,
      status: 1,
      description: '南京市综合性博物馆',
      createTime: '2020-01-01T00:00:00',
      updateTime: '2024-01-01T00:00:00',
    },
  ],
  '广东-广州市': [
    {
      id: 3,
      name: '广东省博物馆',
      code: 'GZ001',
      city: '广州市',
      province: '广东',
      district: '天河区',
      address: '珠江东路2号',
      phone: '020-38046886',
      website: 'http://www.gdmuseum.com',
      level: 1,
      status: 1,
      description: '广东省综合性博物馆',
      createTime: '2020-01-01T00:00:00',
      updateTime: '2024-01-01T00:00:00',
    },
    {
      id: 4,
      name: '广州博物馆',
      code: 'GZ002',
      city: '广州市',
      province: '广东',
      district: '越秀区',
      address: '镇海楼',
      phone: '020-83550627',
      level: 2,
      status: 1,
      description: '广州市历史博物馆',
      createTime: '2020-01-01T00:00:00',
      updateTime: '2024-01-01T00:00:00',
    },
  ],
};

// 中国地图基础配置
export const chinaMapOption = {
  tooltip: {
    trigger: 'item',
    formatter: '{b}<br/>博物馆数量: {c}个',
  },
  visualMap: {
    min: 0,
    max: 60,
    left: 'left',
    top: 'bottom',
    text: ['高', '低'],
    calculable: true,
    inRange: {
      color: ['#e0f3ff', '#006edd'],
    },
  },
  series: [
    {
      name: '博物馆数量',
      type: 'map',
      mapType: 'china',
      roam: true,
      emphasis: {
        label: {
          show: true,
        },
        itemStyle: {
          areaColor: '#ffeaa7',
        },
      },
    },
  ],
};

// 获取省份的博物馆数据
export const getProvinceMuseumData = () => {
  return Object.entries(provinceData).map(([name, info]) => ({
    name,
    value: info.museums,
    coordinates: info.coordinates,
  }));
};

// 获取城市的博物馆数据
export const getCityMuseumData = (provinceName: string) => {
  const cities = cityData[provinceName] || {};
  return Object.entries(cities).map(([name, info]) => ({
    name,
    value: info.museums,
    coordinates: info.coordinates,
  }));
};

// 获取博物馆列表数据
export const getMuseumListData = (province: string, city: string): MuseumsAPI.MuseumResponse[] => {
  const key = `${province}-${city}`;
  return mockMuseumData[key] || [];
};
