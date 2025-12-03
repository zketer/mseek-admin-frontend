import React, { useState } from 'react';
import {
  Card,
  Form,
  Select,
  InputNumber,
  Button,
  Space,
  Typography,
  Row,
  Col,
  DatePicker,
  Radio,
  Checkbox,
  Slider,
  message,
  Spin,
  Alert,
  Divider,
} from 'antd';
import {
  RobotOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  TeamOutlined,
  DollarOutlined,
  ThunderboltOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import dayjs from 'dayjs';
import './index.less';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Group: RadioGroup } = Radio;
const { Group: CheckboxGroup } = Checkbox;

// 旅游偏好接口
interface TravelPreferences {
  province: string;           // 省份
  city?: string;             // 城市
  duration: number;          // 游玩天数
  startDate?: string;        // 开始日期
  endDate?: string;          // 结束日期
  budget?: number;           // 预算（元）
  groupType: 'solo' | 'couple' | 'family' | 'friends' | 'group';  // 出行方式
  interests: string[];       // 兴趣偏好
  travelStyle: 'relaxed' | 'moderate' | 'intensive';  // 旅游强度
  accommodation: 'budget' | 'comfort' | 'luxury';     // 住宿偏好
  transport: 'walking' | 'public' | 'taxi' | 'car';   // 交通方式
  specialNeeds?: string[];   // 特殊需求
}

// 生成的攻略接口
interface TravelGuide {
  id: string;
  title: string;
  province: string;
  city: string;
  duration: number;
  budget: number;
  overview: string;
  highlights: string[];
  dailyPlan: DailyPlan[];
  recommendations: {
    museums: MuseumRecommendation[];
    restaurants: string[];
    hotels: string[];
    tips: string[];
  };
  createdAt: string;
}

interface DailyPlan {
  day: number;
  title: string;
  activities: Activity[];
  meals: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
  accommodation?: string;
  totalCost: number;
}

interface Activity {
  time: string;
  location: string;
  activity: string;
  description: string;
  duration: string;
  cost: number;
  tips?: string;
}

interface MuseumRecommendation {
  name: string;
  type: string;
  description: string;
  visitDuration: string;
  ticketPrice: number;
  openTime: string;
  highlights: string[];
  tips: string[];
}

const TravelGuideGenerator: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<TravelPreferences>();
  const [generatedGuide, setGeneratedGuide] = useState<TravelGuide>();

  // 省份城市数据
  const provinceData = {
    '北京': ['北京市'],
    '上海': ['上海市'],
    '天津': ['天津市'],
    '重庆': ['重庆市'],
    '河北': ['石家庄市', '唐山市', '秦皇岛市', '邯郸市', '邢台市', '保定市'],
    '山西': ['太原市', '大同市', '阳泉市', '长治市', '晋城市', '朔州市'],
    '内蒙古': ['呼和浩特市', '包头市', '乌海市', '赤峰市', '通辽市'],
    '辽宁': ['沈阳市', '大连市', '鞍山市', '抚顺市', '本溪市', '丹东市'],
    '吉林': ['长春市', '吉林市', '四平市', '辽源市', '通化市', '白山市'],
    '黑龙江': ['哈尔滨市', '齐齐哈尔市', '鸡西市', '鹤岗市', '双鸭山市'],
    '江苏': ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市'],
    '浙江': ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市'],
    '安徽': ['合肥市', '芜湖市', '蚌埠市', '淮南市', '马鞍山市', '淮北市'],
    '福建': ['福州市', '厦门市', '莆田市', '三明市', '泉州市', '漳州市'],
    '江西': ['南昌市', '景德镇市', '萍乡市', '九江市', '新余市', '鹰潭市'],
    '山东': ['济南市', '青岛市', '淄博市', '枣庄市', '东营市', '烟台市'],
    '河南': ['郑州市', '开封市', '洛阳市', '平顶山市', '安阳市', '鹤壁市'],
    '湖北': ['武汉市', '黄石市', '十堰市', '宜昌市', '襄阳市', '鄂州市'],
    '湖南': ['长沙市', '株洲市', '湘潭市', '衡阳市', '邵阳市', '岳阳市'],
    '广东': ['广州市', '韶关市', '深圳市', '珠海市', '汕头市', '佛山市'],
    '广西': ['南宁市', '柳州市', '桂林市', '梧州市', '北海市', '防城港市'],
    '海南': ['海口市', '三亚市', '三沙市', '儋州市'],
    '四川': ['成都市', '自贡市', '攀枝花市', '泸州市', '德阳市', '绵阳市'],
    '贵州': ['贵阳市', '六盘水市', '遵义市', '安顺市', '毕节市', '铜仁市'],
    '云南': ['昆明市', '曲靖市', '玉溪市', '保山市', '昭通市', '丽江市'],
    '西藏': ['拉萨市', '日喀则市', '昌都市', '林芝市', '山南市', '那曲市'],
    '陕西': ['西安市', '铜川市', '宝鸡市', '咸阳市', '渭南市', '延安市'],
    '甘肃': ['兰州市', '嘉峪关市', '金昌市', '白银市', '天水市', '武威市'],
    '青海': ['西宁市', '海东市'],
    '宁夏': ['银川市', '石嘴山市', '吴忠市', '固原市', '中卫市'],
    '新疆': ['乌鲁木齐市', '克拉玛依市', '吐鲁番市', '哈密市'],
  };

  const [cities, setCities] = useState<string[]>([]);

  // 兴趣偏好选项
  const interestOptions = [
    { label: '历史文化', value: 'history' },
    { label: '艺术美术', value: 'art' },
    { label: '自然科学', value: 'science' },
    { label: '军事历史', value: 'military' },
    { label: '民俗文化', value: 'folk' },
    { label: '现代科技', value: 'technology' },
    { label: '古建筑', value: 'architecture' },
    { label: '宗教文化', value: 'religion' },
  ];

  // 特殊需求选项
  const specialNeedsOptions = [
    { label: '无障碍设施', value: 'accessibility' },
    { label: '儿童友好', value: 'kid_friendly' },
    { label: '摄影友好', value: 'photo_friendly' },
    { label: '导览服务', value: 'guided_tour' },
    { label: '多语言支持', value: 'multilingual' },
    { label: '停车便利', value: 'parking' },
  ];

  // 处理省份变更
  const handleProvinceChange = (value: string) => {
    setCities(provinceData[value as keyof typeof provinceData] || []);
    form.setFieldsValue({ city: undefined });
  };

  // 生成攻略
  const generateGuide = async (values: TravelPreferences) => {
    setLoading(true);
    try {
      // 模拟AI生成攻略的过程
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockGuide: TravelGuide = {
        id: `guide_${Date.now()}`,
        title: `${values.province}${values.city ? values.city : ''}${values.duration}日博物馆文化之旅`,
        province: values.province,
        city: values.city || '',
        duration: values.duration,
        budget: values.budget || 1000,
        overview: `这是一份精心定制的${values.duration}日${values.province}博物馆文化旅游攻略，涵盖了当地最具代表性的博物馆和文化景点，适合${getGroupTypeText(values.groupType)}出行。行程安排${getTravelStyleText(values.travelStyle)}，让您深度体验当地的历史文化魅力。`,
        highlights: [
          '参观世界级博物馆，感受深厚文化底蕴',
          '体验当地特色美食和传统工艺',
          '专业导览和深度文化解读',
          '合理的行程安排，劳逸结合',
        ],
        dailyPlan: generateDailyPlan(values),
        recommendations: {
          museums: generateMuseumRecommendations(values),
          restaurants: ['当地特色餐厅A', '传统小吃街', '文化主题餐厅'],
          hotels: ['文化主题酒店', '市中心便捷酒店', '传统庭院酒店'],
          tips: [
            '建议提前预约热门博物馆门票',
            '携带身份证件，部分博物馆需要实名登记',
            '注意博物馆开放时间，避免周一闭馆',
            '建议穿着舒适的步行鞋',
          ],
        },
        createdAt: new Date().toISOString(),
      };

      setGeneratedGuide(mockGuide);
      setCurrentStep(1);
      message.success('攻略生成成功！');
    } catch (error) {
      message.error('攻略生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 生成每日行程
  const generateDailyPlan = (values: TravelPreferences): DailyPlan[] => {
    const plans: DailyPlan[] = [];
    for (let day = 1; day <= values.duration; day++) {
      plans.push({
        day,
        title: `第${day}天 - ${getDayTheme(day, values)}`,
        activities: generateDayActivities(day, values),
        meals: {
          breakfast: '酒店自助早餐',
          lunch: `当地特色餐厅${day}`,
          dinner: `文化主题餐厅${day}`,
        },
        accommodation: day < values.duration ? `${getAccommodationText(values.accommodation)}` : undefined,
        totalCost: 200 + day * 50,
      });
    }
    return plans;
  };

  // 生成单日活动
  const generateDayActivities = (day: number, values: TravelPreferences): Activity[] => {
    const baseActivities = [
      {
        time: '09:00',
        location: `${values.province}博物馆${day}`,
        activity: '参观主题展览',
        description: '深度参观博物馆主要展厅，了解当地历史文化',
        duration: '2小时',
        cost: 50,
        tips: '建议跟随导览，获得更好的参观体验',
      },
      {
        time: '11:30',
        location: '博物馆文创商店',
        activity: '文创产品购物',
        description: '选购具有当地特色的文创纪念品',
        duration: '30分钟',
        cost: 100,
      },
      {
        time: '14:00',
        location: `${values.province}历史街区`,
        activity: '文化街区漫步',
        description: '体验当地传统文化氛围，品尝地方小吃',
        duration: '1.5小时',
        cost: 80,
      },
    ];

    return baseActivities;
  };

  // 生成博物馆推荐
  const generateMuseumRecommendations = (values: TravelPreferences): MuseumRecommendation[] => {
    return [
      {
        name: `${values.province}省博物馆`,
        type: '综合性博物馆',
        description: '展示当地历史文化和自然资源的综合性博物馆',
        visitDuration: '2-3小时',
        ticketPrice: 0,
        openTime: '09:00-17:00（周一闭馆）',
        highlights: ['镇馆之宝', '历史文物', '自然标本'],
        tips: ['免费参观需预约', '提供免费导览服务', '有专门的儿童体验区'],
      },
      {
        name: `${values.province}美术馆`,
        type: '艺术类博物馆',
        description: '展示当代艺术作品和传统艺术精品',
        visitDuration: '1-2小时',
        ticketPrice: 30,
        openTime: '10:00-18:00',
        highlights: ['当代艺术展', '传统书画', '雕塑作品'],
        tips: ['学生票半价', '周五晚上延长开放', '定期举办艺术讲座'],
      },
    ];
  };

  // 辅助函数
  const getGroupTypeText = (groupType: string) => {
    const map = {
      solo: '独自',
      couple: '情侣',
      family: '家庭',
      friends: '朋友',
      group: '团体',
    };
    return map[groupType as keyof typeof map] || '个人';
  };

  const getTravelStyleText = (style: string) => {
    const map = {
      relaxed: '轻松悠闲',
      moderate: '适中节奏',
      intensive: '紧凑充实',
    };
    return map[style as keyof typeof map] || '适中';
  };

  const getAccommodationText = (accommodation: string) => {
    const map = {
      budget: '经济型酒店',
      comfort: '舒适型酒店',
      luxury: '豪华型酒店',
    };
    return map[accommodation as keyof typeof map] || '舒适型酒店';
  };

  const getDayTheme = (day: number, values: TravelPreferences) => {
    const themes = ['文化探索', '艺术体验', '历史寻踪', '民俗文化', '现代科技'];
    return themes[(day - 1) % themes.length];
  };

  // 保存攻略
  const saveGuide = () => {
    if (!generatedGuide) return;

    const savedGuides = JSON.parse(localStorage.getItem('travel_guides') || '[]');
    savedGuides.push(generatedGuide);
    localStorage.setItem('travel_guides', JSON.stringify(savedGuides));

    message.success('攻略已保存到我的攻略');
    history.push('/ai-travel-guide/my-guides');
  };

  // 重新生成
  const regenerateGuide = () => {
    setCurrentStep(0);
    setGeneratedGuide(undefined);
  };

  const onFinish = (values: any) => {
    const travelPrefs: TravelPreferences = {
      ...values,
      startDate: values.dateRange?.[0]?.format('YYYY-MM-DD'),
      endDate: values.dateRange?.[1]?.format('YYYY-MM-DD'),
    };
    setPreferences(travelPrefs);
    generateGuide(travelPrefs);
  };

  // 渲染表单
  const renderForm = () => (
    <Card title="智能攻略生成器" className="generator-form">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          duration: 3,
          budget: 2000,
          groupType: 'family',
          travelStyle: 'moderate',
          accommodation: 'comfort',
          transport: 'public',
          interests: ['history', 'art'],
        }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="province"
              label="目的地省份"
              rules={[{ required: true, message: '请选择省份' }]}
            >
              <Select
                placeholder="请选择省份"
                onChange={handleProvinceChange}
                showSearch
                optionFilterProp="children"
              >
                {Object.keys(provinceData).map(province => (
                  <Option key={province} value={province}>{province}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="city"
              label="目的地城市"
            >
              <Select
                placeholder="请选择城市（可选）"
                disabled={cities.length === 0}
                showSearch
                optionFilterProp="children"
              >
                {cities.map(city => (
                  <Option key={city} value={city}>{city}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="duration"
              label="游玩天数"
              rules={[{ required: true, message: '请选择游玩天数' }]}
            >
              <InputNumber
                min={1}
                max={10}
                style={{ width: '100%' }}
                addonAfter="天"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="dateRange"
              label="出行日期"
            >
              <RangePicker
                style={{ width: '100%' }}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="budget"
              label="预算范围（元）"
            >
              <Slider
                min={500}
                max={10000}
                step={100}
                marks={{
                  500: '500',
                  2000: '2000',
                  5000: '5000',
                  10000: '10000+',
                }}
                tooltip={{
                  formatter: (value) => `¥${value}`,
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="groupType"
              label="出行方式"
              rules={[{ required: true, message: '请选择出行方式' }]}
            >
              <RadioGroup>
                <Radio value="solo">独自出行</Radio>
                <Radio value="couple">情侣出行</Radio>
                <Radio value="family">家庭出行</Radio>
                <Radio value="friends">朋友出行</Radio>
                <Radio value="group">团体出行</Radio>
              </RadioGroup>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="interests"
          label="兴趣偏好"
          rules={[{ required: true, message: '请选择至少一个兴趣偏好' }]}
        >
          <CheckboxGroup options={interestOptions} />
        </Form.Item>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              name="travelStyle"
              label="旅游强度"
            >
              <Select>
                <Option value="relaxed">轻松悠闲</Option>
                <Option value="moderate">适中节奏</Option>
                <Option value="intensive">紧凑充实</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="accommodation"
              label="住宿偏好"
            >
              <Select>
                <Option value="budget">经济型</Option>
                <Option value="comfort">舒适型</Option>
                <Option value="luxury">豪华型</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="transport"
              label="交通方式"
            >
              <Select>
                <Option value="walking">步行为主</Option>
                <Option value="public">公共交通</Option>
                <Option value="taxi">出租车</Option>
                <Option value="car">自驾车</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="specialNeeds"
          label="特殊需求"
        >
          <CheckboxGroup options={specialNeedsOptions} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            icon={<RobotOutlined />}
            loading={loading}
            block
          >
            {loading ? 'AI正在生成攻略...' : '生成专属攻略'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );

  // 渲染生成的攻略
  const renderGuide = () => {
    if (!generatedGuide) return null;

    return (
      <div className="generated-guide">
        <Card
          title={
            <div className="guide-header">
              <Title level={3}>{generatedGuide.title}</Title>
              <Space>
                <Button onClick={regenerateGuide}>重新生成</Button>
                <Button type="primary" onClick={saveGuide}>
                  保存攻略
                </Button>
              </Space>
            </div>
          }
        >
          <div className="guide-overview">
            <Row gutter={24}>
              <Col span={18}>
                <Paragraph>{generatedGuide.overview}</Paragraph>
              </Col>
              <Col span={6}>
                <div className="guide-stats">
                  <div className="stat-item">
                    <EnvironmentOutlined />
                    <span>{generatedGuide.province} {generatedGuide.city}</span>
                  </div>
                  <div className="stat-item">
                    <CalendarOutlined />
                    <span>{generatedGuide.duration}天</span>
                  </div>
                  <div className="stat-item">
                    <DollarOutlined />
                    <span>预算 ¥{generatedGuide.budget}</span>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          <Divider />

          <Title level={4}>行程亮点</Title>
          <Row gutter={16}>
            {generatedGuide.highlights.map((highlight, index) => (
              <Col span={12} key={index}>
                <Alert
                  message={highlight}
                  type="success"
                  showIcon
                  style={{ marginBottom: 8 }}
                />
              </Col>
            ))}
          </Row>

          <Divider />

          <Title level={4}>详细行程</Title>
          {generatedGuide.dailyPlan.map((day) => (
            <Card
              key={day.day}
              size="small"
              title={day.title}
              style={{ marginBottom: 16 }}
              extra={<Text strong>预算: ¥{day.totalCost}</Text>}
            >
              {day.activities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <Row gutter={16} align="middle">
                    <Col span={2}>
                      <Text strong>{activity.time}</Text>
                    </Col>
                    <Col span={4}>
                      <Text type="secondary">{activity.location}</Text>
                    </Col>
                    <Col span={12}>
                      <div>
                        <Text strong>{activity.activity}</Text>
                        <br />
                        <Text type="secondary">{activity.description}</Text>
                      </div>
                    </Col>
                    <Col span={3}>
                      <Text>用时: {activity.duration}</Text>
                    </Col>
                    <Col span={3}>
                      <Text>费用: ¥{activity.cost}</Text>
                    </Col>
                  </Row>
                  {activity.tips && (
                    <div className="activity-tips">
                      <Text type="warning">💡 {activity.tips}</Text>
                    </div>
                  )}
                </div>
              ))}

              <Divider />

              <Row gutter={16}>
                <Col span={8}>
                  <Text strong>早餐: </Text>
                  <Text>{day.meals.breakfast}</Text>
                </Col>
                <Col span={8}>
                  <Text strong>午餐: </Text>
                  <Text>{day.meals.lunch}</Text>
                </Col>
                <Col span={8}>
                  <Text strong>晚餐: </Text>
                  <Text>{day.meals.dinner}</Text>
                </Col>
              </Row>

              {day.accommodation && (
                <div style={{ marginTop: 8 }}>
                  <Text strong>住宿: </Text>
                  <Text>{day.accommodation}</Text>
                </div>
              )}
            </Card>
          ))}

          <Divider />

          <Title level={4}>推荐博物馆</Title>
          <Row gutter={16}>
            {generatedGuide.recommendations.museums.map((museum, index) => (
              <Col span={12} key={index}>
                <Card size="small" title={museum.name} style={{ marginBottom: 16 }}>
                  <Text type="secondary">{museum.type}</Text>
                  <Paragraph ellipsis={{ rows: 2 }}>{museum.description}</Paragraph>
                  <div className="museum-service">
                    <Text>参观时长: {museum.visitDuration}</Text>
                    <br />
                    <Text>门票价格: {museum.ticketPrice === 0 ? '免费' : `¥${museum.ticketPrice}`}</Text>
                    <br />
                    <Text>开放时间: {museum.openTime}</Text>
                  </div>
                  <div className="museum-highlights">
                    <Text strong>亮点: </Text>
                    {museum.highlights.join('、')}
                  </div>
                  <div className="museum-tips">
                    {museum.tips.map((tip, tipIndex) => (
                      <div key={tipIndex}>
                        <Text type="warning">💡 {tip}</Text>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <Divider />

          <Title level={4}>实用建议</Title>
          <Row gutter={16}>
            <Col span={8}>
              <Card size="small" title="推荐餐厅">
                {generatedGuide.recommendations.restaurants.map((restaurant, index) => (
                  <div key={index}>• {restaurant}</div>
                ))}
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small" title="推荐住宿">
                {generatedGuide.recommendations.hotels.map((hotel, index) => (
                  <div key={index}>• {hotel}</div>
                ))}
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small" title="贴心提示">
                {generatedGuide.recommendations.tips.map((tip, index) => (
                  <div key={index} style={{ marginBottom: 4 }}>
                    💡 {tip}
                  </div>
                ))}
              </Card>
            </Col>
          </Row>
        </Card>
      </div>
    );
  };

  return (
    <PageContainer
      title="AI旅游攻略生成器"
      subTitle="输入您的旅行偏好，AI为您生成专属的博物馆文化旅游攻略"
      className="travel-guide-generator"
    >
      <Spin spinning={loading} tip="AI正在为您生成专属攻略...">
        {currentStep === 0 ? renderForm() : renderGuide()}
      </Spin>
    </PageContainer>
  );
};

export default TravelGuideGenerator;
