// 省份名称到地图文件的映射 - 完整版
export const provinceFileMapping: Record<string, string> = {
  // 直辖市
  '北京市': 'beijing',
  '天津市': 'tianjin',
  '上海市': 'shanghai',
  '重庆市': 'chongqing',
  
  // 省份
  '河北省': 'hebei',
  '山西省': 'shanxi',
  '辽宁省': 'liaoning',
  '吉林省': 'jilin',
  '黑龙江省': 'heilongjiang',
  '江苏省': 'jiangsu',
  '浙江省': 'zhejiang',
  '安徽省': 'anhui',
  '福建省': 'fujian',
  '江西省': 'jiangxi',
  '山东省': 'shandong',
  '河南省': 'henan',
  '湖北省': 'hubei',
  '湖南省': 'hunan',
  '广东省': 'guangdong',
  '海南省': 'hainan',
  '四川省': 'sichuan',
  '贵州省': 'guizhou',
  '云南省': 'yunnan',
  '陕西省': 'shaanxi',
  '甘肃省': 'gansu',
  '青海省': 'qinghai',
  '台湾省': 'taiwan',
  
  // 自治区
  '内蒙古自治区': 'neimenggu',
  '广西壮族自治区': 'guangxi',
  '西藏自治区': 'xizang',
  '宁夏回族自治区': 'ningxia',
  '新疆维吾尔自治区': 'xinjiang',
  
  // 特别行政区
  '香港特别行政区': 'hongkong',
  '澳门特别行政区': 'macao',
};

// 省份的市级博物馆数据（模拟数据，实际应从API获取）
export const cityMuseumData: Record<string, Array<{ name: string; value: number }>> = {
  '北京市': [
    { name: '东城区', value: 8 },
    { name: '西城区', value: 6 },
    { name: '朝阳区', value: 5 },
    { name: '海淀区', value: 4 },
    { name: '丰台区', value: 2 },
  ],
  '天津市': [
    { name: '和平区', value: 4 },
    { name: '河东区', value: 3 },
    { name: '河西区', value: 3 },
    { name: '南开区', value: 3 },
    { name: '红桥区', value: 2 },
  ],
  '上海市': [
    { name: '黄浦区', value: 12 },
    { name: '徐汇区', value: 8 },
    { name: '长宁区', value: 5 },
    { name: '静安区', value: 6 },
    { name: '普陀区', value: 4 },
  ],
  '重庆市': [
    { name: '渝中区', value: 6 },
    { name: '江北区', value: 4 },
    { name: '南岸区', value: 4 },
    { name: '九龙坡区', value: 3 },
    { name: '沙坪坝区', value: 3 },
  ],
  '广东省': [
    { name: '广州市', value: 15 },
    { name: '深圳市', value: 12 },
    { name: '珠海市', value: 6 },
    { name: '佛山市', value: 8 },
    { name: '东莞市', value: 5 },
    { name: '中山市', value: 4 },
    { name: '惠州市', value: 3 },
  ],
  '江苏省': [
    { name: '南京市', value: 14 },
    { name: '苏州市', value: 10 },
    { name: '无锡市', value: 8 },
    { name: '常州市', value: 6 },
    { name: '南通市', value: 4 },
  ],
  '浙江省': [
    { name: '杭州市', value: 12 },
    { name: '宁波市', value: 8 },
    { name: '温州市', value: 6 },
    { name: '嘉兴市', value: 4 },
    { name: '湖州市', value: 4 },
  ],
  '山东省': [
    { name: '济南市', value: 12 },
    { name: '青岛市', value: 15 },
    { name: '烟台市', value: 8 },
    { name: '潍坊市', value: 6 },
    { name: '淄博市', value: 5 },
  ],
  '河南省': [
    { name: '郑州市', value: 10 },
    { name: '洛阳市', value: 8 },
    { name: '开封市', value: 6 },
    { name: '安阳市', value: 4 },
    { name: '新乡市', value: 4 },
  ],
  '四川省': [
    { name: '成都市', value: 18 },
    { name: '绵阳市', value: 6 },
    { name: '德阳市', value: 4 },
    { name: '南充市', value: 3 },
    { name: '宜宾市', value: 4 },
  ],
  '台湾省': [
    { name: '台北市', value: 8 },
    { name: '新北市', value: 6 },
    { name: '桃园市', value: 4 },
    { name: '台中市', value: 5 },
    { name: '台南市', value: 4 },
    { name: '高雄市', value: 6 },
  ],
  '新疆维吾尔自治区': [
    { name: '乌鲁木齐市', value: 8 },
    { name: '克拉玛依市', value: 3 },
    { name: '吐鲁番市', value: 2 },
    { name: '哈密市', value: 2 },
    { name: '昌吉回族自治州', value: 4 },
    { name: '博尔塔拉蒙古自治州', value: 2 },
    { name: '巴音郭楞蒙古自治州', value: 3 },
    { name: '阿克苏地区', value: 4 },
    { name: '克孜勒苏柯尔克孜自治州', value: 1 },
    { name: '喀什地区', value: 5 },
    { name: '和田地区', value: 3 },
    { name: '伊犁哈萨克自治州', value: 6 },
    { name: '塔城地区', value: 2 },
    { name: '阿勒泰地区', value: 2 },
  ],
  '宁夏回族自治区': [
    { name: '银川市', value: 6 },
    { name: '石嘴山市', value: 3 },
    { name: '吴忠市', value: 4 },
    { name: '固原市', value: 3 },
    { name: '中卫市', value: 2 },
  ],
  // 可以继续为其他省份添加市级数据...
  // 为了演示，这里只添加了部分省份的数据
  // 实际项目中应该从API动态获取
};