import { EllipsisOutlined } from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Card, Col, Dropdown, Row, Statistic, Typography, Table, Tag, Progress, message } from 'antd';
import type { FC } from 'react';
import { Suspense, useState, useEffect } from 'react';
import { Column } from '@ant-design/plots';
import PageLoading from './components/PageLoading';
import { getMuseumStatistics } from '@/services/museum-service-api/museumStatisticsController';

const { Title } = Typography;

const MuseumOverview: FC = () => {
  const intl = useIntl();
  const [loading, setLoading] = useState<boolean>(true);
  const [statisticsData, setStatisticsData] = useState<any>(null);
  const [days, setDays] = useState<number>(30);

  // 获取博物馆统计数据
  const fetchMuseumStatistics = async () => {
    try {
      setLoading(true);
      const response = await getMuseumStatistics({ days });
      setStatisticsData(response);
    } catch (error) {
      message.error('获取博物馆统计数据失败');
      console.error('获取博物馆统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMuseumStatistics();
  }, [days]);

  // 处理类别分布数据
  const categoryDistribution = statisticsData?.categoryDistribution?.map((item) => ({
    category: item.category || '',
    count: item.count || 0,
  })) || [];

  // 处理热门博物馆数据
  const topMuseums = statisticsData?.topMuseums?.map((item) => ({
    id: item.id || 0,
    name: item.name || '',
    visitors: item.visitors || 0,
    status: item.status === 1 ? 'active' : 'maintenance',
    capacityUsage: item.capacityUsage || 0,
  })) || [];

  // 处理访客趋势数据
  const visitorsTrend = statisticsData?.visitorsTrend?.map((item) => ({
    month: item.month || '',
    visitors: item.visitors || 0,
  })) || [];

  const visitorsTrendConfig = {
    data: visitorsTrend,
    xField: 'month',
    yField: 'visitors',
    meta: {
      visitors: {
        alias: intl.formatMessage({ id: 'pages.data-center.museum.visitors', defaultMessage: 'Visitors' }),
      },
    },
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
  };

  const exhibitCategoriesConfig = {
    data: categoryDistribution,
    xField: 'category',
    yField: 'count',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
  };

  const columns = [
    {
      title: intl.formatMessage({ id: 'pages.data-center.museum.name', defaultMessage: 'Museum Name' }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: intl.formatMessage({ id: 'pages.data-center.museum.visitors', defaultMessage: 'Visitors Today' }),
      dataIndex: 'visitors',
      key: 'visitors',
      sorter: (a, b) => a.visitors - b.visitors,
      render: (visitors) => (
        <span>{visitors.toLocaleString()}</span>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.data-center.museum.status', defaultMessage: 'Status' }),
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'orange'}>
          {status === 'active'
            ? intl.formatMessage({ id: 'pages.data-center.museum.status.active', defaultMessage: 'Active' })
            : intl.formatMessage({ id: 'pages.data-center.museum.status.maintenance', defaultMessage: 'Maintenance' })
          }
        </Tag>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.data-center.museum.capacity', defaultMessage: 'Capacity Usage' }),
      key: 'capacity',
      render: (_, record) => {
        // 根据访问人数计算容量使用率
        const capacity = record.capacityUsage || Math.round((record.visitors / 25000) * 100);
        let color = 'green';
        if (capacity > 70) color = 'orange';
        if (capacity > 90) color = 'red';

        return (
          <Progress percent={capacity} size="small" strokeColor={color} />
        );
      },
    },
  ];

  const dropdownMenu = (
    <Dropdown
      menu={{
        items: [
          {
            key: '1',
            label: intl.formatMessage({ id: 'pages.data-center.action.refresh', defaultMessage: 'Refresh' }),
            onClick: () => fetchMuseumStatistics(),
          },
          {
            key: '2',
            label: intl.formatMessage({ id: 'pages.data-center.action.export', defaultMessage: 'Export' }),
          },
        ],
      }}
      placement="bottomRight"
    >
      <EllipsisOutlined style={{ fontSize: 16, cursor: 'pointer' }} />
    </Dropdown>
  );

  return (
    <GridContent>
      <Suspense fallback={<PageLoading />}>
        <Row gutter={24}>
          <Col span={24}>
            <Card
              title={intl.formatMessage({ id: 'pages.data-center.museum.overview', defaultMessage: 'Museum Overview' })}
              extra={dropdownMenu}
              style={{ marginBottom: 24 }}
            >
              <Row gutter={24}>
                <Col span={6}>
                  <Statistic
                    title={intl.formatMessage({ id: 'pages.data-center.museum.total', defaultMessage: 'Total Museums' })}
                    value={statisticsData?.totalMuseums || 0}
                    loading={loading}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title={intl.formatMessage({ id: 'pages.data-center.museum.active', defaultMessage: 'Active Museums' })}
                    value={statisticsData?.activeMuseums || 0}
                    valueStyle={{ color: '#3f8600' }}
                    loading={loading}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title={intl.formatMessage({ id: 'pages.data-center.museum.maintenance', defaultMessage: 'In Maintenance' })}
                    value={statisticsData?.maintenanceMuseums || 0}
                    valueStyle={{ color: '#faad14' }}
                    loading={loading}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title={intl.formatMessage({ id: 'pages.data-center.museum.visitorsToday', defaultMessage: 'Visitors Today' })}
                    value={statisticsData?.visitorsToday || 0}
                    precision={0}
                    loading={loading}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Row gutter={24}>
          {visitorsTrend && visitorsTrend.length > 0 && (
            <Col span={categoryDistribution && categoryDistribution.length > 0 ? 12 : 24}>
              <Card
                title={intl.formatMessage({ id: 'pages.data-center.museum.visitorsTrend', defaultMessage: 'Monthly Visitors Trend' })}
                extra={dropdownMenu}
                style={{ marginBottom: 24 }}
              >
                <div style={{ height: 300 }}>
                  {loading ? <PageLoading /> : <Column {...visitorsTrendConfig} />}
                </div>
              </Card>
            </Col>
          )}
          {categoryDistribution && categoryDistribution.length > 0 && (
            <Col span={visitorsTrend && visitorsTrend.length > 0 ? 12 : 24}>
              <Card
                title={intl.formatMessage({ id: 'pages.data-center.museum.exhibitCategories', defaultMessage: 'Exhibit Categories' })}
                extra={dropdownMenu}
                style={{ marginBottom: 24 }}
              >
                <div style={{ height: 300 }}>
                  {loading ? <PageLoading /> : <Column {...exhibitCategoriesConfig} />}
                </div>
              </Card>
            </Col>
          )}
        </Row>

        {topMuseums && topMuseums.length > 0 && (
          <Card
            title={intl.formatMessage({ id: 'pages.data-center.museum.topMuseums', defaultMessage: 'Top Museums Today' })}
            extra={dropdownMenu}
          >
            <Table
              dataSource={topMuseums}
              columns={columns}
              rowKey="id"
              pagination={false}
              loading={loading}
            />
          </Card>
        )}
      </Suspense>
    </GridContent>
  );
};

export default MuseumOverview;
