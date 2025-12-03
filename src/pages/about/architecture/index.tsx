import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Tag, Space, Alert, Tabs, Image, Button, Spin, message } from 'antd';
import { 
  CloudOutlined,
  DatabaseOutlined,
  ApiOutlined,
  SafetyCertificateOutlined,
  MobileOutlined,
  DesktopOutlined,
  GlobalOutlined,
  SettingOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import DirectMermaidDiagram from '@/components/MermaidDiagram/direct';
import { getSystemArchitecture } from '@/services/user-service-api/systemArchitectureController';

const { Title, Paragraph, Text } = Typography;

const SystemArchitecture: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<UsersAPI.SystemArchitectureResponse | null>(null);

  useEffect(() => {
    fetchSystemArchitecture();
  }, []);

  const fetchSystemArchitecture = async () => {
    try {
      setLoading(true);
      const response = await getSystemArchitecture();
      setData(response.data || null);
      // 设置默认激活的tab
      if (response.data?.architectures && response.data.architectures.length > 0) {
        setActiveTab(response.data.architectures[0].type || 'overview');
      }
    } catch (error) {
      message.error('获取系统架构信息失败');
      console.error('获取系统架构信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 根据类型获取架构信息
  const getArchitectureByType = (type: string) => {
    return data?.architectures?.find((arch: any) => arch.type === type);
  };

  if (loading) {
    return (
      <PageContainer>
        <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }} />
      </PageContainer>
    );
  }

  // 从API获取Mermaid代码，如果没有则使用默认值
  const overviewArch = getArchitectureByType('overview');
  const authArch = getArchitectureByType('auth');
  const deploymentArch = getArchitectureByType('deployment');
  const dataArch = getArchitectureByType('data');

  return (
    <PageContainer
      title="系统架构图"
      subTitle="文博探索·博物馆打卡后端管理系统架构设计"
      content="查看系统的总体架构、认证架构、部署架构和数据架构设计"
    >
    <div className="system-architecture">
      <Alert
        message="系统架构总览"
        description="文博探索·博物馆打卡后端管理系统采用现代化微服务架构，具备高可用、高性能、高扩展性的特点。"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        size="large"
        items={[
          {
            key: 'overview',
            label: <span><DesktopOutlined />系统总体架构</span>,
            children: overviewArch ? (
          <Card title={overviewArch.title} style={{ marginBottom: 24 }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Alert
                message="架构说明"
                description={overviewArch.description || "采用分层架构设计，从上到下分为客户端层、网关层、业务服务层、数据层和数据处理层。"}
                type="success"
                showIcon
                style={{ marginBottom: 16 }}
              />
            </div>
            
            {/* 系统架构图 */}
            {overviewArch.mermaidCode ? (
            <DirectMermaidDiagram 
                chart={overviewArch.mermaidCode} 
                title={overviewArch.title} 
              height={700}
            />
            ) : (
              <Alert
                message="架构图数据缺失"
                description="后端API未返回系统总体架构的Mermaid代码，请检查后端服务是否正常运行。"
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}

            {/* 架构层次说明 */}
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
              <Col span={12}>
                <Card size="small" title="客户端层" extra={<GlobalOutlined />}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Tag color="blue">Web前端</Tag>
                      <Text>React 19 + Ant Design Pro，端口8080</Text>
                    </div>
                    <div>
                      <Tag color="green">微信小程序</Tag>
                      <Text>TDesign + 原生小程序，已上线</Text>
                    </div>
                    <div>
                      <Tag color="orange">第三方API</Tag>
                      <Text>高德地图 + 微信开放平台</Text>
                    </div>
                  </Space>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="网关层" extra={<CloudOutlined />}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Tag color="purple">API Gateway</Tag>
                      <Text>端口8000，智能路径发现</Text>
                    </div>
                    <div>
                      <Tag color="purple">多层缓存</Tag>
                      <Text>90%+缓存命中率</Text>
                    </div>
                    <div>
                      <Tag color="purple">高性能</Tag>
                      <Text>1200+ QPS并发处理</Text>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={8}>
                <Card size="small" title="业务服务层" extra={<ApiOutlined />}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Tag color="red">认证服务</Tag>
                      <Text>端口8001，RS256 JWT</Text>
                    </div>
                    <div>
                      <Tag color="red">用户服务</Tag>
                      <Text>端口8002，RBAC权限</Text>
                    </div>
                    <div>
                      <Tag color="red">信息服务</Tag>
                      <Text>端口8003，博物馆管理</Text>
                    </div>
                  </Space>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" title="数据层" extra={<DatabaseOutlined />}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Tag color="gold">MySQL 8.0</Tag>
                      <Text>主从架构，业务数据</Text>
                    </div>
                    <div>
                      <Tag color="gold">Redis 7.0</Tag>
                      <Text>多层缓存，会话存储</Text>
                    </div>
                    <div>
                      <Tag color="gold">Nacos 2.2.0</Tag>
                      <Text>服务发现，配置管理</Text>
                    </div>
                  </Space>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" title="数据处理层" extra={<SettingOutlined />}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Tag color="magenta">Python Scripts</Tag>
                      <Text>高德数据爬取</Text>
                    </div>
                    <div>
                      <Tag color="magenta">数据清洗</Tag>
                      <Text>行政区划处理</Text>
                    </div>
                    <div>
                      <Tag color="magenta">信息整合</Tag>
                      <Text>博物馆信息标准化</Text>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Card>
            ) : null
          },
          {
            key: 'auth',
            label: <span><SafetyCertificateOutlined />认证架构</span>,
            children: authArch ? (
          <Card title={authArch.title} style={{ marginBottom: 24 }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Alert
                message="认证架构说明"
                description={authArch.description || "采用RS256 JWT + JWKS动态密钥管理，实现企业级安全认证，平均响应时间42ms。"}
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
              />
            </div>
            
            {/* 认证架构图 */}
            {authArch.mermaidCode ? (
            <DirectMermaidDiagram 
                chart={authArch.mermaidCode} 
                title={authArch.title} 
              height={700}
            />
            ) : (
              <Alert
                message="架构图数据缺失"
                description="后端API未返回认证架构的Mermaid代码，请检查后端服务是否正常运行。"
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}

            {/* 认证流程说明 */}
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
              <Col span={12}>
                <Card size="small" title="认证流程" extra={<SafetyCertificateOutlined />}>
                  <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                    <div><strong>1. 客户端登录</strong> - Web/小程序发起登录请求</div>
                    <div><strong>2. 网关转发</strong> - API Gateway转发到认证服务</div>
                    <div><strong>3. 凭证验证</strong> - 验证用户名密码/微信授权</div>
                    <div><strong>4. 生成JWT</strong> - 使用RS256算法签名Token</div>
                    <div><strong>5. 缓存会话</strong> - Redis存储会话状态</div>
                    <div><strong>6. 返回Token</strong> - 客户端获得访问令牌</div>
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="安全特性" extra={<EyeOutlined />}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Tag color="red">RS256算法</Tag>
                      <Text>非对称加密，安全性更高</Text>
                    </div>
                    <div>
                      <Tag color="orange">JWKS端点</Tag>
                      <Text>动态密钥管理和分发</Text>
                    </div>
                    <div>
                      <Tag color="green">Token验证</Tag>
                      <Text>网关层统一验证</Text>
                    </div>
                    <div>
                      <Tag color="blue">会话管理</Tag>
                      <Text>Redis高效会话存储</Text>
                    </div>
                    <div>
                      <Tag color="purple">权限控制</Tag>
                      <Text>RBAC细粒度权限</Text>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Card>
            ) : null
          },
          {
            key: 'deployment',
            label: <span><MobileOutlined />部署架构</span>,
            children: (
          <Card title="部署架构图" style={{ marginBottom: 24 }}>
            <Alert
              message="容器化部署"
              description="系统采用Docker容器化部署，支持Kubernetes编排，具备高可用和弹性扩缩容能力。"
              type="success"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card size="small" title="开发环境" extra={<SettingOutlined />}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Tag color="blue">Docker Compose</Tag>
                      <Text>docker-compose.dev.yml</Text>
                    </div>
                    <div>
                      <Tag color="green">中间件服务</Tag>
                      <Text>MySQL + Redis + Nacos</Text>
                    </div>
                    <div>
                      <Tag color="orange">管理工具</Tag>
                      <Text>Adminer + Redis Commander</Text>
                    </div>
                    <div>
                      <Tag color="purple">应用服务</Tag>
                      <Text>IDE中独立运行</Text>
                    </div>
                  </Space>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="生产环境" extra={<CloudOutlined />}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Tag color="red">Kubernetes</Tag>
                      <Text>k8s集群编排</Text>
                    </div>
                    <div>
                      <Tag color="gold">负载均衡</Tag>
                      <Text>多实例高可用</Text>
                    </div>
                    <div>
                      <Tag color="cyan">监控告警</Tag>
                      <Text>Actuator + Prometheus</Text>
                    </div>
                    <div>
                      <Tag color="magenta">日志聚合</Tag>
                      <Text>ELK Stack</Text>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>

            <Card size="small" title="服务端口分配" style={{ marginTop: 16 }}>
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <div style={{ textAlign: 'center', padding: '16px', background: '#f0f2f5', borderRadius: '4px' }}>
                    <div><strong>API网关</strong></div>
                    <Tag color="blue" style={{ marginTop: '8px' }}>8000</Tag>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ textAlign: 'center', padding: '16px', background: '#f0f2f5', borderRadius: '4px' }}>
                    <div><strong>认证服务</strong></div>
                    <Tag color="orange" style={{ marginTop: '8px' }}>8001</Tag>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ textAlign: 'center', padding: '16px', background: '#f0f2f5', borderRadius: '4px' }}>
                    <div><strong>用户服务</strong></div>
                    <Tag color="green" style={{ marginTop: '8px' }}>8002</Tag>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ textAlign: 'center', padding: '16px', background: '#f0f2f5', borderRadius: '4px' }}>
                    <div><strong>信息服务</strong></div>
                    <Tag color="purple" style={{ marginTop: '8px' }}>8003</Tag>
                  </div>
                </Col>
              </Row>
              
              <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col span={6}>
                  <div style={{ textAlign: 'center', padding: '16px', background: '#f0f2f5', borderRadius: '4px' }}>
                    <div><strong>Web前端</strong></div>
                    <Tag color="cyan" style={{ marginTop: '8px' }}>8080</Tag>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ textAlign: 'center', padding: '16px', background: '#f0f2f5', borderRadius: '4px' }}>
                    <div><strong>Nacos</strong></div>
                    <Tag color="red" style={{ marginTop: '8px' }}>8848</Tag>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ textAlign: 'center', padding: '16px', background: '#f0f2f5', borderRadius: '4px' }}>
                    <div><strong>MySQL</strong></div>
                    <Tag color="gold" style={{ marginTop: '8px' }}>3306</Tag>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ textAlign: 'center', padding: '16px', background: '#f0f2f5', borderRadius: '4px' }}>
                    <div><strong>Redis</strong></div>
                    <Tag color="magenta" style={{ marginTop: '8px' }}>6379</Tag>
                  </div>
                </Col>
              </Row>
            </Card>
          </Card>
            )
          },
          {
            key: 'data',
            label: <span><DatabaseOutlined />数据架构</span>,
            children: (
          <Card title="数据架构设计" style={{ marginBottom: 24 }}>
            <Alert
              message="数据架构说明"
              description="采用MySQL主从架构存储业务数据，Redis多层缓存优化性能，Python脚本处理外部数据源。"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card size="small" title="MySQL数据库" extra={<DatabaseOutlined />}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Tag color="blue">认证数据库</Tag>
                      <Text>端口3306，用户凭证</Text>
                    </div>
                    <div>
                      <Tag color="green">用户数据库</Tag>
                      <Text>端口3307，用户信息</Text>
                    </div>
                    <div>
                      <Tag color="orange">信息数据库</Tag>
                      <Text>博物馆数据，展览信息</Text>
                    </div>
                    <div>
                      <Tag color="purple">主从复制</Tag>
                      <Text>读写分离，高可用</Text>
                    </div>
                  </Space>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" title="Redis缓存" extra={<CloudOutlined />}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Tag color="red">会话缓存</Tag>
                      <Text>JWT Token存储</Text>
                    </div>
                    <div>
                      <Tag color="gold">数据缓存</Tag>
                      <Text>热点数据缓存</Text>
                    </div>
                    <div>
                      <Tag color="cyan">分布式锁</Tag>
                      <Text>并发控制</Text>
                    </div>
                    <div>
                      <Tag color="magenta">高命中率</Tag>
                      <Text>90%+缓存命中</Text>
                    </div>
                  </Space>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" title="数据处理" extra={<SettingOutlined />}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Tag color="green">Python爬虫</Tag>
                      <Text>高德地图数据</Text>
                    </div>
                    <div>
                      <Tag color="blue">数据清洗</Tag>
                      <Text>行政区划标准化</Text>
                    </div>
                    <div>
                      <Tag color="orange">数据验证</Tag>
                      <Text>一致性检查</Text>
                    </div>
                    <div>
                      <Tag color="purple">定时同步</Tag>
                      <Text>增量更新机制</Text>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>

            <Card size="small" title="数据流向" style={{ marginTop: 16 }}>
              <div style={{ 
                padding: '20px', 
                background: '#fafafa', 
                borderRadius: '4px',
                fontSize: '14px',
                lineHeight: '2'
              }}>
                <div><strong>1. 数据采集：</strong>Python脚本 → 高德地图API → 原始数据</div>
                <div><strong>2. 数据处理：</strong>原始数据 → 清洗验证 → 标准化数据</div>
                <div><strong>3. 数据存储：</strong>标准化数据 → MySQL数据库 → 持久化存储</div>
                <div><strong>4. 数据缓存：</strong>热点数据 → Redis缓存 → 快速访问</div>
                <div><strong>5. 数据服务：</strong>缓存/数据库 → 业务服务 → API接口</div>
                <div><strong>6. 数据展示：</strong>API接口 → 前端应用 → 用户界面</div>
              </div>
            </Card>
          </Card>
            )
          }
        ]}
      />

      <Card title="架构优势" style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <CloudOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '12px' }} />
              <div><strong>高可用性</strong></div>
              <Text type="secondary">99.9%系统可用性</Text>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <DatabaseOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '12px' }} />
              <div><strong>高性能</strong></div>
              <Text type="secondary">1200+ QPS处理能力</Text>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <ApiOutlined style={{ fontSize: '32px', color: '#fa541c', marginBottom: '12px' }} />
              <div><strong>高扩展</strong></div>
              <Text type="secondary">微服务弹性扩容</Text>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <SafetyCertificateOutlined style={{ fontSize: '32px', color: '#722ed1', marginBottom: '12px' }} />
              <div><strong>高安全</strong></div>
              <Text type="secondary">企业级认证体系</Text>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
    </PageContainer>
  );
};

export default SystemArchitecture;
