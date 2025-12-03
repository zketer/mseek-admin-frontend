import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Tag, Timeline, Divider, Space, Alert, Descriptions, Spin, message } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  RocketOutlined,
  DatabaseOutlined,
  CloudOutlined,
  MobileOutlined,
  ApiOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { getSystemOverview } from '@/services/user-service-api/systemOverviewController';

const { Title, Paragraph, Text } = Typography;

const SystemOverview: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<UsersAPI.SystemOverviewResponse | null>(null);

  useEffect(() => {
    fetchSystemOverview();
  }, []);

  const fetchSystemOverview = async () => {
    try {
      setLoading(true);
      const response = await getSystemOverview();
      setData(response.data || null);
    } catch (error) {
      message.error('获取系统概览信息失败');
      console.error('获取系统概览信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 按分类分组技术栈
  const techStackByCategory = (category: string) => {
    return data?.techStack?.filter((item: any) => item.category === category) || [];
  };

  // 按类型分组功能模块
  const featureModulesByType = (type: string) => {
    return data?.featureModules?.filter((item: any) => item.moduleType === type) || [];
  };

  // 按类型分组开发计划
  const developmentPlansByType = (type: string) => {
    return data?.developmentPlans?.filter((item: any) => item.planType === type) || [];
  };

  // 将JSON字符串解析为标签数组
  const parseToTags = (jsonStr: string | undefined, color: string = 'blue') => {
    if (!jsonStr) return null;
    try {
      const items = JSON.parse(jsonStr);
      if (Array.isArray(items)) {
        return (
          <Space wrap>
            {items.map((item: string, index: number) => (
              <Tag key={index} color={color}>{item}</Tag>
            ))}
          </Space>
        );
      }
      return jsonStr;
    } catch (e) {
      console.error('解析JSON失败:', jsonStr, e);
      return jsonStr;
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }} />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="系统概览"
      subTitle="文博探索·博物馆打卡后端管理系统功能与开发进度"
      content="了解当前系统的技术架构、已完成功能和后续开发计划"
    >
    <div className="system-overview">
      {/* 系统概览 */}
      {data?.basicInfo && (
      <Card title="系统概览" className="overview-section" style={{ marginBottom: 24 }}>
        <Descriptions column={2} bordered>
            <Descriptions.Item label="系统名称">{data.basicInfo.systemName}</Descriptions.Item>
            <Descriptions.Item label="系统版本">{data.basicInfo.systemVersion}</Descriptions.Item>
            <Descriptions.Item label="架构模式">{data.basicInfo.architectureMode}</Descriptions.Item>
            <Descriptions.Item label="部署方式">{parseToTags(data.basicInfo.deploymentMethod, 'cyan')}</Descriptions.Item>
            <Descriptions.Item label="技术栈">{parseToTags(data.basicInfo.techStack, 'blue')}</Descriptions.Item>
            <Descriptions.Item label="数据存储">{parseToTags(data.basicInfo.dataStorage, 'green')}</Descriptions.Item>
            <Descriptions.Item label="服务治理">{parseToTags(data.basicInfo.serviceGovernance, 'purple')}</Descriptions.Item>
            <Descriptions.Item label="认证方案">{parseToTags(data.basicInfo.authSolution, 'orange')}</Descriptions.Item>
        </Descriptions>
      </Card>
      )}

      {/* 技术架构 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="前端架构" className="architecture-card" extra={<RocketOutlined />}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {techStackByCategory('frontend').map((item: any, index: number) => (
                <div key={index}>
                  <Text strong>{item.name}</Text>
                  {item.version && <Text type="secondary"> {item.version}</Text>}
                  {item.port && <Text type="secondary"> - 端口: {item.port}</Text>}
                <br />
                  <Tag color={item.tagColor || 'blue'}>{item.name}</Tag>
                  {item.description && <Text type="secondary"> {item.description}</Text>}
              </div>
              ))}
            </Space>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="后端架构" className="architecture-card" extra={<DatabaseOutlined />}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {techStackByCategory('backend').map((item: any, index: number) => (
                <div key={index}>
                  <Text strong>{item.name}</Text>
                  {item.version && <Text type="secondary"> {item.version}</Text>}
                <br />
                  <Tag color={item.tagColor || 'orange'}>{item.name}</Tag>
                  {item.description && <Text type="secondary"> {item.description}</Text>}
              </div>
              ))}
              {techStackByCategory('middleware').length > 0 && (
              <div>
                <Text strong>服务治理与存储</Text>
                <br />
                  {techStackByCategory('middleware').map((item: any, index: number) => (
                    <Tag key={index} color={item.tagColor || 'purple'}>
                      {item.name} {item.version || ''}
                    </Tag>
                  ))}
              </div>
              )}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 微服务架构 */}
      {data?.microservices && data.microservices.length > 0 && (
      <Card title="微服务架构" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
            {data.microservices.map((service, index) => (
              <Col span={8} key={index}>
                <Card size="small" title={service.serviceName} className="service-card" extra={<CloudOutlined />}>
              <Paragraph>
                    <Text strong>{service.serviceCode}</Text>
                <br />
                    {service.description}
              </Paragraph>
              <Space>
                    {service.port && <Tag color="cyan">端口: {service.port}</Tag>}
                    <Tag color={service.statusTagColor || 'green'}>
                      {service.status === 'running' ? '运行中' : service.status === 'stopped' ? '已停止' : '维护中'}
                    </Tag>
              </Space>
            </Card>
          </Col>
            ))}
        </Row>
      </Card>
      )}

      {/* 功能模块状态 */}
      {data?.featureModules && data.featureModules.length > 0 && (
      <Card title="功能模块开发状态" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
            {featureModulesByType('completed').length > 0 && (
          <Col span={12}>
            <Title level={4}>✅ 已完成功能</Title>
            <Timeline
              items={featureModulesByType('completed').map((module, index) => ({
                key: index,
                dot: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                children: (
                  <>
                    <Text strong>{module.moduleName}</Text>
                    <br />
                    {module.description && <Text type="secondary">{module.description}</Text>}
                  </>
                ),
              }))}
            />
          </Col>
            )}
            {(featureModulesByType('developing').length > 0 || featureModulesByType('planned').length > 0) && (
          <Col span={12}>
                <Title level={4}>🚧 开发中/规划中功能</Title>
            <Timeline
              items={[
                ...featureModulesByType('developing').map((module, index) => ({
                  key: `developing-${index}`,
                  dot: <ClockCircleOutlined style={{ color: '#1890ff' }} />,
                  children: (
                    <>
                      <Text strong>{module.moduleName}</Text>
                      <br />
                      {module.description && <Text type="secondary">{module.description}</Text>}
                      {module.tagText && <Tag color={module.tagColor || 'processing'}>{module.tagText}</Tag>}
                    </>
                  ),
                })),
                ...featureModulesByType('planned').map((module, index) => ({
                  key: `planned-${index}`,
                  dot: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
                  children: (
                    <>
                      <Text strong>{module.moduleName}</Text>
                      <br />
                      {module.description && <Text type="secondary">{module.description}</Text>}
                      {module.tagText && <Tag color={module.tagColor || 'warning'}>{module.tagText}</Tag>}
                    </>
                  ),
                })),
              ]}
            />
          </Col>
            )}
        </Row>
      </Card>
      )}

      {/* 后续开发计划 */}
      {data?.developmentPlans && data.developmentPlans.length > 0 && (
      <Card title="后续开发计划" style={{ marginBottom: 24 }}>
        <Alert
          message="开发路线图"
          description="以下是系统后续的主要开发方向和接入计划"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Row gutter={[16, 16]}>
            {data.developmentPlans.map((plan, index) => (
              <Col span={8} key={index}>
                <Card size="small" title={plan.title} className="plan-card">
              <ul>
                    {plan.items?.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
              </ul>
            </Card>
          </Col>
            ))}
        </Row>
      </Card>
      )}

      {/* 技术接入说明 */}
      <Card title="技术接入说明" className="tech-section">
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Title level={4}>🔌 第三方服务接入</Title>
            <Descriptions size="small" column={1}>
              {data?.thirdPartyServices?.map((service, index) => (
                <Descriptions.Item key={index} label={service.serviceName}>
                  <Tag color={service.statusTagColor || 'green'}>
                    {service.status === 'connected' ? '已接入' : service.status === 'planned' ? '规划中' : '已废弃'}
                  </Tag>
                  {service.description}
              </Descriptions.Item>
              ))}
            </Descriptions>
          </Col>
          <Col span={12}>
            <Title level={4}>📊 监控与运维</Title>
            <Descriptions size="small" column={1}>
              {techStackByCategory('middleware').map((item, index) => (
                <Descriptions.Item key={index} label={item.description || item.name}>
                  <Tag color={item.tagColor || 'blue'}>
                    {item.name} {item.version || ''}
                  </Tag>
              </Descriptions.Item>
              ))}
            </Descriptions>
          </Col>
        </Row>

        <Divider />

        {data?.basicInfo?.statusMessage && (
        <Alert
          message="系统状态"
            description={data.basicInfo.statusMessage}
          type="success"
          showIcon
        />
        )}
      </Card>
    </div>
    </PageContainer>
  );
};

export default SystemOverview;
