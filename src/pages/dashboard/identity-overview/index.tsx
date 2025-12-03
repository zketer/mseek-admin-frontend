import { EllipsisOutlined } from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Card, Col, Dropdown, Row, Statistic, Typography, message } from 'antd';
import type { FC } from 'react';
import { Suspense, useState, useEffect } from 'react';
import { Line, Pie } from '@ant-design/plots';
import PageLoading from './components/PageLoading';
import { getUserStatistics1 } from '@/services/user-service-api/userStatisticsController';

const { Title } = Typography;

const IdentityOverview: FC = () => {
  const intl = useIntl();
  const [loading, setLoading] = useState<boolean>(true);
  const [statisticsData, setStatisticsData] = useState<UsersAPI.UserStatisticsResponse | null>(null);
  const [days, setDays] = useState<number>(30);

  // 获取用户统计数据
  const fetchUserStatistics = async () => {
    try {
      setLoading(true);
      const response = await getUserStatistics1({ days });
      setStatisticsData(response);
    } catch (error) {
      message.error('获取用户统计数据失败');
      console.error('获取用户统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStatistics();
  }, [days]);

  // 处理角色分布数据
  const roleDistribution = statisticsData?.roleDistribution?.map((item) => ({
    type: item.type || '',
    value: item.value || 0,
  })) || [];

  // 处理权限分布数据
  const permissionDistribution = statisticsData?.permissionDistribution?.map((item) => ({
    type: item.type || '',
    value: item.value || 0,
  })) || [];

  // 处理用户增长趋势数据
  const userGrowthTrend = statisticsData?.userGrowthTrend?.map((item) => ({
    date: item.date || '',
    count: item.count || 0,
  })) || [];

  const userTrendConfig = {
    data: userGrowthTrend,
    xField: 'date',
    yField: 'count',
    smooth: true,
    meta: {
      count: {
        alias: intl.formatMessage({ id: 'pages.data-center.identity.user.count', defaultMessage: 'User Count' }),
      },
    },
  };

  const rolePieConfig = {
    data: roleDistribution,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
    },
    interactions: [{ type: 'element-active' }],
  };

  const permissionPieConfig = {
    data: permissionDistribution,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
    },
    interactions: [{ type: 'element-active' }],
  };

  const dropdownMenu = (
    <Dropdown
      menu={{
        items: [
          {
            key: '1',
            label: intl.formatMessage({ id: 'pages.data-center.action.refresh', defaultMessage: 'Refresh' }),
            onClick: () => fetchUserStatistics(),
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
              title={intl.formatMessage({ id: 'pages.data-center.identity.user.overview', defaultMessage: 'User Overview' })}
              extra={dropdownMenu}
              style={{ marginBottom: 24 }}
            >
              <Row gutter={24}>
                <Col span={6}>
                  <Statistic
                    title={intl.formatMessage({ id: 'pages.data-center.identity.user.total', defaultMessage: 'Total Users' })}
                    value={statisticsData?.totalUsers || 0}
                    loading={loading}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title={intl.formatMessage({ id: 'pages.data-center.identity.user.active', defaultMessage: 'Active Users' })}
                    value={statisticsData?.activeUsers || 0}
                    valueStyle={{ color: '#3f8600' }}
                    loading={loading}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title={intl.formatMessage({ id: 'pages.data-center.identity.user.inactive', defaultMessage: 'Inactive Users' })}
                    value={statisticsData?.inactiveUsers || 0}
                    valueStyle={{ color: '#faad14' }}
                    loading={loading}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title={intl.formatMessage({ id: 'pages.data-center.identity.user.locked', defaultMessage: 'Locked Users' })}
                    value={statisticsData?.lockedUsers || 0}
                    valueStyle={{ color: '#cf1322' }}
                    loading={loading}
                  />
                </Col>
              </Row>
              <div style={{ height: 300, marginTop: 32 }}>
                <Title level={5}>{intl.formatMessage({ id: 'pages.data-center.identity.user.trend', defaultMessage: 'User Growth Trend' })}</Title>
                {loading ? <PageLoading /> : <Line {...userTrendConfig} />}
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Card
              title={intl.formatMessage({ id: 'pages.data-center.identity.role.overview', defaultMessage: 'Role Overview' })}
              extra={dropdownMenu}
            >
              <Statistic
                title={intl.formatMessage({ id: 'pages.data-center.identity.role.total', defaultMessage: 'Total Roles' })}
                value={statisticsData?.totalRoles || 0}
                style={{ marginBottom: 24 }}
                loading={loading}
              />
              <div style={{ height: 300 }}>
                <Title level={5}>{intl.formatMessage({ id: 'pages.data-center.identity.role.distribution', defaultMessage: 'Role Distribution' })}</Title>
                {loading ? <PageLoading /> : <Pie {...rolePieConfig} />}
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title={intl.formatMessage({ id: 'pages.data-center.identity.permission.overview', defaultMessage: 'Permission Overview' })}
              extra={dropdownMenu}
            >
              <Statistic
                title={intl.formatMessage({ id: 'pages.data-center.identity.permission.total', defaultMessage: 'Total Permissions' })}
                value={statisticsData?.totalPermissions || 0}
                style={{ marginBottom: 24 }}
                loading={loading}
              />
              <div style={{ height: 300 }}>
                <Title level={5}>{intl.formatMessage({ id: 'pages.data-center.identity.permission.distribution', defaultMessage: 'Permission Distribution' })}</Title>
                {loading ? <PageLoading /> : <Pie {...permissionPieConfig} />}
              </div>
            </Card>
          </Col>
        </Row>
      </Suspense>
    </GridContent>
  );
};

export default IdentityOverview;
