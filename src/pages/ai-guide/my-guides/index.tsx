import React, { useState, useEffect } from 'react';
import {
  Card,
  List,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Tag,
  Empty,
  Modal,
  message,
  Popconfirm,
  Input,
  Select,
} from 'antd';
import {
  BookOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  SearchOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { usePermission } from '@/utils/authUtils';
import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import dayjs from 'dayjs';
import './index.less';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

// 攻略接口（与生成器中相同）
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

const MyGuides: React.FC = () => {
  const [guides, setGuides] = useState<TravelGuide[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<TravelGuide[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<TravelGuide | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterProvince, setFilterProvince] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'duration' | 'budget'>('date');

  // 权限检查
  const { hasAuth: canEditGuide } = usePermission('ai-guide:my-guides:edit');
  const { hasAuth: canDeleteGuide } = usePermission('ai-guide:my-guides:delete');

  // 加载保存的攻略
  useEffect(() => {
    loadGuides();
  }, []);

  // 应用筛选和搜索
  useEffect(() => {
    let filtered = [...guides];

    // 搜索过滤
    if (searchText) {
      filtered = filtered.filter(guide => 
        guide.title.toLowerCase().includes(searchText.toLowerCase()) ||
        guide.province.toLowerCase().includes(searchText.toLowerCase()) ||
        guide.city.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 省份过滤
    if (filterProvince) {
      filtered = filtered.filter(guide => guide.province === filterProvince);
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'duration':
          return b.duration - a.duration;
        case 'budget':
          return b.budget - a.budget;
        default:
          return 0;
      }
    });

    setFilteredGuides(filtered);
  }, [guides, searchText, filterProvince, sortBy]);

  const loadGuides = () => {
    try {
      const savedGuides = JSON.parse(localStorage.getItem('travel_guides') || '[]');
      setGuides(savedGuides);
    } catch (error) {
      console.error('加载攻略失败:', error);
      message.error('加载攻略失败');
    }
  };

  const deleteGuide = (guideId: string) => {
    try {
      const updatedGuides = guides.filter(guide => guide.id !== guideId);
      setGuides(updatedGuides);
      localStorage.setItem('travel_guides', JSON.stringify(updatedGuides));
      message.success('攻略已删除');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const viewGuideDetail = (guide: TravelGuide) => {
    setSelectedGuide(guide);
    setDetailVisible(true);
  };

  const shareGuide = (guide: TravelGuide) => {
    // 模拟分享功能
    const shareData = {
      title: guide.title,
      text: guide.overview,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {
        // 如果分享失败，复制到剪贴板
        copyToClipboard(JSON.stringify(guide, null, 2));
      });
    } else {
      copyToClipboard(JSON.stringify(guide, null, 2));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('攻略已复制到剪贴板');
    }).catch(() => {
      message.error('复制失败');
    });
  };

  const exportGuide = (guide: TravelGuide) => {
    // 导出为JSON文件
    const dataStr = JSON.stringify(guide, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${guide.title}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    message.success('攻略已导出');
  };

  const getUniqueProvinces = () => {
    return Array.from(new Set(guides.map(guide => guide.province)));
  };

  const renderGuideCard = (guide: TravelGuide) => (
    <Card
      key={guide.id}
      hoverable
      className="guide-card"
      cover={
        <div className="guide-cover">
          <div className="guide-info">
            <div className="info-item">
              <EnvironmentOutlined />
              <span>{guide.province} {guide.city}</span>
            </div>
            <div className="info-item">
              <CalendarOutlined />
              <span>{guide.duration}天</span>
            </div>
            <div className="info-item">
              <DollarOutlined />
              <span>¥{guide.budget}</span>
            </div>
          </div>
        </div>
      }
      actions={[
        <Button
          key="view"
          type="text"
          icon={<EyeOutlined />}
          onClick={() => viewGuideDetail(guide)}
        >
          查看详情
        </Button>,
        <Button
          key="share"
          type="text"
          icon={<ShareAltOutlined />}
          onClick={() => shareGuide(guide)}
        >
          分享
        </Button>,
        <Button
          key="export"
          type="text"
          icon={<DownloadOutlined />}
          onClick={() => exportGuide(guide)}
        >
          导出
        </Button>,
        <Popconfirm
          key="delete"
          title="确定要删除这个攻略吗？"
          onConfirm={() => deleteGuide(guide.id)}
          okText="删除"
          cancelText="取消"
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
          >
            删除
          </Button>
        </Popconfirm>,
      ]}
    >
      <Card.Meta
        title={guide.title}
        description={
          <div>
            <Paragraph ellipsis={{ rows: 2 }}>
              {guide.overview}
            </Paragraph>
            <div className="guide-tags">
              {guide.highlights.slice(0, 2).map((highlight, index) => (
                <Tag key={index} color="blue">
                  {highlight.length > 10 ? highlight.substring(0, 10) + '...' : highlight}
                </Tag>
              ))}
            </div>
            <div className="guide-meta">
              <Text type="secondary">
                创建时间: {dayjs(guide.createdAt).format('YYYY-MM-DD HH:mm')}
              </Text>
            </div>
          </div>
        }
      />
    </Card>
  );

  const renderDetailModal = () => {
    if (!selectedGuide) return null;

    return (
      <Modal
        title={selectedGuide.title}
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={1000}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
          <Button key="edit" type="primary" onClick={() => {
            setDetailVisible(false);
            history.push('/ai-travel-guide/generator');
          }}>
            编辑攻略
          </Button>,
        ]}
        className="guide-detail-modal"
      >
        <div className="guide-detail">
          <div className="guide-overview">
            <Row gutter={24}>
              <Col span={18}>
                <Paragraph>{selectedGuide.overview}</Paragraph>
              </Col>
              <Col span={6}>
                <div className="guide-stats">
                  <div className="stat-item">
                    <EnvironmentOutlined />
                    <span>{selectedGuide.province} {selectedGuide.city}</span>
                  </div>
                  <div className="stat-item">
                    <CalendarOutlined />
                    <span>{selectedGuide.duration}天</span>
                  </div>
                  <div className="stat-item">
                    <DollarOutlined />
                    <span>预算 ¥{selectedGuide.budget}</span>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          <Title level={5}>行程亮点</Title>
          <Row gutter={16}>
            {selectedGuide.highlights.map((highlight, index) => (
              <Col span={12} key={index}>
                <div className="highlight-item">
                  ✨ {highlight}
                </div>
              </Col>
            ))}
          </Row>

          <Title level={5}>每日行程</Title>
          {selectedGuide.dailyPlan.map((day) => (
            <Card
              key={day.day}
              size="small"
              title={day.title}
              style={{ marginBottom: 16 }}
              extra={<Text strong>预算: ¥{day.totalCost}</Text>}
            >
              {day.activities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <Row gutter={16}>
                    <Col span={3}>
                      <Text strong>{activity.time}</Text>
                    </Col>
                    <Col span={5}>
                      <Text type="secondary">{activity.location}</Text>
                    </Col>
                    <Col span={10}>
                      <Text strong>{activity.activity}</Text>
                      <br />
                      <Text type="secondary">{activity.description}</Text>
                    </Col>
                    <Col span={3}>
                      <Text>¥{activity.cost}</Text>
                    </Col>
                    <Col span={3}>
                      <Text>{activity.duration}</Text>
                    </Col>
                  </Row>
                </div>
              ))}
            </Card>
          ))}

          <Title level={5}>推荐博物馆</Title>
          <Row gutter={16}>
            {selectedGuide.recommendations.museums.map((museum, index) => (
              <Col span={12} key={index}>
                <Card size="small" title={museum.name} style={{ marginBottom: 16 }}>
                  <Text type="secondary">{museum.type}</Text>
                  <Paragraph ellipsis={{ rows: 2 }}>{museum.description}</Paragraph>
                  <div>
                    <Text>参观时长: {museum.visitDuration}</Text>
                    <br />
                    <Text>门票: {museum.ticketPrice === 0 ? '免费' : `¥${museum.ticketPrice}`}</Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Modal>
    );
  };

  return (
    <PageContainer
      title="我的攻略"
      subTitle={`已保存 ${guides.length} 个攻略`}
      extra={[
        <Button
          key="create"
          type="primary"
          onClick={() => history.push('/ai-travel-guide/generator')}
        >
          创建新攻略
        </Button>,
      ]}
      content={
        <div className="guides-filters">
          <Row gutter={16} align="middle">
            <Col flex="auto">
              <Search
                placeholder="搜索攻略标题、省份或城市"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: '100%' }}
                allowClear
              />
            </Col>
            <Col>
              <Select
                placeholder="筛选省份"
                value={filterProvince}
                onChange={setFilterProvince}
                style={{ width: 150 }}
                allowClear
              >
                {getUniqueProvinces().map(province => (
                  <Option key={province} value={province}>{province}</Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Select
                value={sortBy}
                onChange={setSortBy}
                style={{ width: 120 }}
              >
                <Option value="date">创建时间</Option>
                <Option value="duration">游玩天数</Option>
                <Option value="budget">预算</Option>
              </Select>
            </Col>
          </Row>
        </div>
      }
    >
      {filteredGuides.length > 0 ? (
        <Row gutter={[16, 16]}>
          {filteredGuides.map(guide => (
            <Col xs={24} sm={12} lg={8} xl={6} key={guide.id}>
              {renderGuideCard(guide)}
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            guides.length === 0 ? "还没有保存的攻略" : "没有符合条件的攻略"
          }
          style={{ padding: '60px 0' }}
        >
          {guides.length === 0 && (
            <Button
              type="primary"
              onClick={() => history.push('/ai-travel-guide/generator')}
            >
              创建第一个攻略
            </Button>
          )}
        </Empty>
      )}

      {renderDetailModal()}
    </PageContainer>
  );
};

export default MyGuides;
