import { getMuseumById } from '@/services/museum-service-api/museumInfoController';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Button, Card, Col, Divider, message, Row, Space, Spin, Tag, Typography, Image } from 'antd';
import React, { useEffect, useState } from 'react';
import { history, useParams } from '@umijs/max';
import { formatDateTime } from '@/utils/dateUtils';

const { Title, Paragraph } = Typography;
const { PreviewGroup } = Image;

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

/**
 * 博物馆详情页面
 */
const MuseumDetail: React.FC = () => {
  const params = useParams<{ id: string }>();
  const [museum, setMuseum] = useState<MuseumsAPI.MuseumResponse | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * 获取博物馆详情
   */
  const fetchMuseumDetail = async () => {
    try {
      setLoading(true);
      const id = Number(params.id);
      
      if (isNaN(id)) {
        message.error('无效的博物馆ID');
        return;
      }

      const response = await getMuseumById({ id });
      
      if (response.success && response.data) {
        setMuseum(response.data);
      } else {
        message.error(response.message || '获取博物馆详情失败');
      }
    } catch (error) {
      message.error('获取博物馆详情失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchMuseumDetail();
    }
  }, [params.id]);

  /**
   * 返回列表页
   */
  const handleBack = () => {
    history.push('/museum-service/museum/list');
  };

  /**
   * 编辑博物馆
   */
  const handleEdit = () => {
    history.push(`/museum-service/museum/form/${params.id}`);
  };

  if (loading) {
    return (
      <PageContainer>
        <Card>
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
          </div>
        </Card>
      </PageContainer>
    );
  }

  if (!museum) {
    return (
      <PageContainer>
        <Card>
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Title level={4}>未找到博物馆信息</Title>
            <Button type="primary" onClick={handleBack}>
              返回列表
            </Button>
          </div>
        </Card>
      </PageContainer>
    );
  }

  const levelInfo = museumLevelMap[museum.level as keyof typeof museumLevelMap] || museumLevelMap[0];
  const statusInfo = museumStatusMap[museum.status as keyof typeof museumStatusMap] || museumStatusMap[0];

  return (
    <PageContainer
      header={{
        title: museum.name,
        subTitle: (
          <Space>
            <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
            <Tag color={levelInfo.color}>{levelInfo.text}</Tag>
          </Space>
        ),
        backIcon: true,
        onBack: handleBack,
      }}
      extra={[
        <Button key="edit" type="primary" onClick={handleEdit}>
          编辑
        </Button>,
      ]}
    >
      <Card title="基本信息" bordered={false}>
        <ProDescriptions 
          column={1}
          styles={{ label: { width: '130px', fontWeight: 'bold' } }}
        >
          <ProDescriptions.Item label="博物馆名称">{museum.name}</ProDescriptions.Item>
          <ProDescriptions.Item label="博物馆编码" copyable>
            {museum.code}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="所在城市">
            {[museum.province, museum.city, museum.district].filter(Boolean).join(' - ')}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="详细地址">{museum.address || '-'}</ProDescriptions.Item>
          <ProDescriptions.Item label="联系电话">{museum.phone || '-'}</ProDescriptions.Item>
          <ProDescriptions.Item label="官方网站">
            {museum.website ? (
              <a href={museum.website} target="_blank" rel="noopener noreferrer">
                {museum.website}
              </a>
            ) : (
              '-'
            )}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="开放时间">{museum.openTime || '-'}</ProDescriptions.Item>
          <ProDescriptions.Item label="日接待能力">
            {museum.capacity ? `${museum.capacity}人/天` : '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="创建时间">
            {formatDateTime(museum.createAt)}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="更新时间">
            {formatDateTime(museum.updateAt)}
          </ProDescriptions.Item>
        </ProDescriptions>
      </Card>

      <Card title="位置信息" style={{ marginTop: 24 }} bordered={false}>
        <Row gutter={16}>
          <Col span={12}>
            <ProDescriptions 
          column={1}
          styles={{ label: { width: '130px', fontWeight: 'bold' } }}
        >
              <ProDescriptions.Item label="经度">{museum.longitude || '-'}</ProDescriptions.Item>
              <ProDescriptions.Item label="纬度">{museum.latitude || '-'}</ProDescriptions.Item>
            </ProDescriptions>
          </Col>
          <Col span={12}>
            {museum.longitude && museum.latitude ? (
              <div style={{ height: 300, background: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                地图组件（需要集成地图API）
              </div>
            ) : (
              <div style={{ height: 300, background: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                暂无位置信息
              </div>
            )}
          </Col>
        </Row>
      </Card>

      <Card title="分类与标签" style={{ marginTop: 24 }} bordered={false}>
        <Row gutter={16}>
          <Col span={12}>
            <Title level={5}>分类</Title>
            <Space wrap>
              {museum.categories && museum.categories.length > 0 ? (
                museum.categories.map((category) => (
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
              {museum.tags && museum.tags.length > 0 ? (
                museum.tags.map((tag) => (
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

      <Card title="博物馆描述" style={{ marginTop: 24 }} bordered={false}>
        <Paragraph>{museum.description || '暂无描述'}</Paragraph>
      </Card>

      <Card title="门票信息" style={{ marginTop: 24 }} bordered={false}>
        <Paragraph>{museum.ticketInfo || '暂无门票信息'}</Paragraph>
      </Card>

      <Card title="博物馆Logo" style={{ marginTop: 24 }} bordered={false}>
        {museum.logoUrl ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Image
              src={museum.logoUrl}
              alt={`${museum.name} Logo`}
              style={{
                maxWidth: 200,
                maxHeight: 200,
                objectFit: 'contain',
                borderRadius: 8,
                border: '1px solid #f0f0f0',
              }}
              preview={{ mask: '预览' }}
            />
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>暂无Logo</div>
        )}
      </Card>

      <Card title="博物馆图片" style={{ marginTop: 24 }} bordered={false}>
        {museum.imageUrls && museum.imageUrls.length > 0 ? (
          <PreviewGroup>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {museum.imageUrls.map((url, index) => (
                <Image
                  key={index}
                  width={200}
                  height={140}
                  src={url}
                  style={{
                    borderRadius: 8,
                    border: '1px solid #d9d9d9',
                    objectFit: 'cover',
                    cursor: 'pointer',
                  }}
                  preview={{
                    mask: (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%',
                          height: '100%',
                          color: '#fff',
                          fontSize: 16,
                          letterSpacing: 2,
                        }}
                      >
                        预览
                      </span>
                    ),
                  }}
                />
              ))}
            </div>
          </PreviewGroup>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>暂无图片</div>
        )}
      </Card>
    </PageContainer>
  );
};

export default MuseumDetail;
