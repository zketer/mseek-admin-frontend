import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Row, Col, Typography, Button, Space } from 'antd';
import { InfoCircleOutlined, ApartmentOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { history } from 'umi';
import './index.less';

const { Title, Paragraph } = Typography;

const SystemInfo: React.FC = () => {
  const handleNavigate = (path: string) => {
    history.push(path);
  };

  return (
    <div className="system-info">
      <PageContainer
        title="系统说明"
        subTitle="文博探索·博物馆打卡系统架构与开发进度"
        content="了解当前系统的技术架构、已完成功能和后续开发计划"
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card 
              hoverable
              className="system-info-card"
              cover={
                <div style={{ 
                  height: '200px', 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <InfoCircleOutlined style={{ fontSize: '64px', color: 'white' }} />
                </div>
              }
              actions={[
                <Button 
                  type="primary" 
                  icon={<ArrowRightOutlined />}
                  onClick={() => handleNavigate('/system-info/overview')}
                >
                  查看详情
                </Button>
              ]}
            >
              <Card.Meta
                title={<Title level={3}>系统概览</Title>}
                description={
                  <div>
                    <Paragraph>
                      详细了解系统的技术架构、已完成功能和后续开发计划。
                      包含微服务架构说明、功能模块开发状态、技术接入情况等。
                    </Paragraph>
                    <Space>
                      <span>🎯 功能状态</span>
                      <span>🚀 开发计划</span>
                      <span>🔌 技术接入</span>
                    </Space>
                  </div>
                }
              />
            </Card>
          </Col>
          
          <Col xs={24} md={12}>
            <Card 
              hoverable
              className="system-info-card"
              cover={
                <div style={{ 
                  height: '200px', 
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ApartmentOutlined style={{ fontSize: '64px', color: 'white' }} />
                </div>
              }
              actions={[
                <Button 
                  type="primary" 
                  icon={<ArrowRightOutlined />}
                  onClick={() => handleNavigate('/system-info/architecture')}
                >
                  查看架构
                </Button>
              ]}
            >
              <Card.Meta
                title={<Title level={3}>系统架构图</Title>}
                description={
                  <div>
                    <Paragraph>
                      可视化展示系统的总体架构、认证架构、部署架构和数据架构。
                      包含架构图表、服务端口分配、架构优势等详细信息。
                    </Paragraph>
                    <Space>
                      <span>🏗️ 总体架构</span>
                      <span>🔐 认证架构</span>
                      <span>📊 数据架构</span>
                    </Space>
                  </div>
                }
              />
            </Card>
          </Col>
        </Row>
      </PageContainer>
    </div>
  );
};

export default SystemInfo;