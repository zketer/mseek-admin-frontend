import { PageContainer, ProTable, ProColumns, FooterToolbar, ProDescriptions } from '@ant-design/pro-components';
import { Button, Tag, Space, Drawer, Image, Card, Modal, message, Tooltip, Spin } from 'antd';
import { FormattedMessage, useIntl } from '@umijs/max';
import { useRef, useState } from 'react';
import { usePermission } from '@/utils/authUtils';
import type { ActionType } from '@ant-design/pro-components';
import {
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  EnvironmentOutlined,
  CameraOutlined,
  UserOutlined,
  DownloadOutlined,
  LeftOutlined,
  RightOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  UndoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import museumInfoApi from '@/services/museum-service-api';

const { confirm } = Modal;

/**
 * 打卡记录管理页面
 */
const CheckinRecordsPage: React.FC = () => {
  const actionRef = useRef<ActionType | null>(null);
  const [selectedRows, setSelectedRows] = useState<MuseumsAPI.CheckinRecordResponse[]>([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<MuseumsAPI.CheckinRecordResponse>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [detailLoading, setDetailLoading] = useState(false);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  // 权限检查
  const { hasAuth: canAuditCheckin } = usePermission('checkins:records:audit');
  const { hasAuth: canDeleteCheckin } = usePermission('checkins:records:delete');
  const { hasAuth: canExportCheckin } = usePermission('checkins:records:export');

  // 审核状态枚举
  const auditStatusEnum = {
    0: { 
      text: intl.formatMessage({ id: 'pages.checkinRecord.auditStatus.pending', defaultMessage: '待审核' }), 
      status: 'Processing' 
    },
    1: { 
      text: intl.formatMessage({ id: 'pages.checkinRecord.auditStatus.approved', defaultMessage: '审核通过' }), 
      status: 'Success' 
    },
    2: { 
      text: intl.formatMessage({ id: 'pages.checkinRecord.auditStatus.rejected', defaultMessage: '审核拒绝' }), 
      status: 'Error' 
    },
    3: { 
      text: intl.formatMessage({ id: 'pages.checkinRecord.auditStatus.anomaly', defaultMessage: '异常标记' }), 
      status: 'Warning' 
    },
  };

  // 异常类型枚举
  const anomalyTypeEnum = {
    distance_anomaly: intl.formatMessage({ id: 'pages.checkinRecord.anomalyType.distance', defaultMessage: '距离异常' }),
    time_anomaly: intl.formatMessage({ id: 'pages.checkinRecord.anomalyType.time', defaultMessage: '时间异常' }),
    frequency_anomaly: intl.formatMessage({ id: 'pages.checkinRecord.anomalyType.frequency', defaultMessage: '频率异常' }),
  };

  // 心情状态枚举
  const moodEnum = {
    happy: intl.formatMessage({ id: 'pages.checkinRecord.mood.happy', defaultMessage: '开心😊' }),
    excited: intl.formatMessage({ id: 'pages.checkinRecord.mood.excited', defaultMessage: '兴奋😆' }),
    peaceful: intl.formatMessage({ id: 'pages.checkinRecord.mood.peaceful', defaultMessage: '平静😌' }),
    inspired: intl.formatMessage({ id: 'pages.checkinRecord.mood.inspired', defaultMessage: '受启发💡' }),
    grateful: intl.formatMessage({ id: 'pages.checkinRecord.mood.grateful', defaultMessage: '感激🙏' }),
  };

  // 表格列定义
  const columns: ProColumns<MuseumsAPI.CheckinRecordResponse>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.checkinRecord.index',
        defaultMessage: '序号',
      }),
      dataIndex: 'index',
      width: 50,
      fixed: 'left',
      render: (_, __, index) => (
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: '#364657',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: '500',
            lineHeight: 1,
          }}
        >
          {index + 1}
        </div>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'pages.checkinRecord.userName',
        defaultMessage: '用户',
      }),
      dataIndex: 'userName',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, fontSize: 13 }}>
            <UserOutlined style={{ marginRight: 4 }} />
            {record.userName}
          </div>
          {record.userNickname && (
            <div style={{ fontSize: 11, color: '#666' }}>
              {record.userNickname}
            </div>
          )}
        </div>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'pages.checkinRecord.museumName',
        defaultMessage: '博物馆',
      }),
      dataIndex: 'museumName',
      width: 160,
      ellipsis: true,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, fontSize: 13 }}>{record.museumName}</div>
          {record.museumAddress && (
            <div style={{ fontSize: 11, color: '#666' }}>
              <EnvironmentOutlined style={{ marginRight: 4 }} />
              {record.museumAddress.length > 15 ? record.museumAddress.substr(0, 15) + '...' : record.museumAddress}
            </div>
          )}
        </div>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'pages.checkinRecord.checkinTime',
        defaultMessage: '打卡时间',
      }),
      dataIndex: 'checkinTime',
      width: 140,
      valueType: 'dateTime',
      search: false,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          {record.checkinTime ? new Date(record.checkinTime).toLocaleString('zh-CN', {
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) : '-'}
        </div>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'pages.checkinRecord.auditStatus',
        defaultMessage: '状态',
      }),
      dataIndex: 'auditStatus',
      width: 90,
      valueEnum: auditStatusEnum,
      render: (_, record) => {
        const statusText = auditStatusEnum[record.auditStatus as keyof typeof auditStatusEnum]?.text || 
          intl.formatMessage({ id: 'pages.common.unknown', defaultMessage: '未知' });
        const statusColor = record.auditStatus === 0 ? 'orange' : 
                           record.auditStatus === 1 ? 'green' : 
                           record.auditStatus === 2 ? 'red' : 'purple';
        return <Tag color={statusColor}>{statusText}</Tag>;
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.checkinRecord.anomalyType',
        defaultMessage: '异常',
      }),
      dataIndex: 'anomalyType',
      width: 100,
      search: false,
      render: (_, record) => {
        if (!record.anomalyType) return '-';
        return (
          <Tag color="orange" style={{ fontSize: 11 }}>
            {anomalyTypeEnum[record.anomalyType as keyof typeof anomalyTypeEnum]?.substr(0, 2)}
          </Tag>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.checkinRecord.photos',
        defaultMessage: '照片',
      }),
      dataIndex: 'photoUrls',
      width: 60,
      search: false,
      render: (_, record) => {
        let photoUrls: string[] = [];
        try {
          photoUrls = record.photoUrls ? JSON.parse(record.photoUrls) : [];
        } catch (e) {
          photoUrls = [];
        }
        return (
          <span style={{ fontSize: 12 }}>
            <CameraOutlined style={{ marginRight: 2 }} />
            {photoUrls.length || 0}
          </span>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.checkinRecord.distance',
        defaultMessage: '距离',
      }),
      dataIndex: 'distance',
      width: 70,
      search: false,
      render: (_, record) => {
        if (!record.distance) return '-';
        const distance = Math.round(record.distance);
        const color = distance > 1000 ? 'red' : distance > 500 ? 'orange' : 'green';
        return <span style={{ color, fontSize: 12 }}>{distance}m</span>;
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.checkinRecord.actions',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      width: 80,
      key: 'option',
      fixed: 'right',
      render: (_, record) => {
        const actions = [];

        // 查看详情按钮 - 始终可用
        actions.push(
          <Tooltip
            key="detail"
            title={intl.formatMessage({
              id: 'pages.checkinRecord.viewDetail',
              defaultMessage: '查看详情',
            })}
          >
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              style={{ padding: 0 }}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
        );

        // 审核按钮 - 需要审核权限且状态为待审核
        if (canAuditCheckin && record.auditStatus === 0) {
          actions.push(
            <Tooltip
              key="approve"
              title={intl.formatMessage({
                id: 'pages.checkinRecord.approve',
                defaultMessage: '审核通过',
              })}
            >
              <Button
                type="link"
                size="small"
                icon={<CheckOutlined />}
                style={{ padding: 0, color: '#52c41a' }}
                onClick={() => handleAudit(record, 1)}
              />
            </Tooltip>
          );

          actions.push(
            <Tooltip
              key="reject"
              title={intl.formatMessage({
                id: 'pages.checkinRecord.reject',
                defaultMessage: '审核拒绝',
              })}
            >
              <Button
                type="link"
                size="small"
                icon={<CloseOutlined />}
                style={{ padding: 0, color: '#ff4d4f' }}
                onClick={() => handleAudit(record, 2)}
              />
            </Tooltip>
          );
        }

        return actions;
      },
    },
  ];

  // 查看详情
  const handleViewDetail = async (record: MuseumsAPI.CheckinRecordResponse) => {
    setDetailLoading(true);
    setDetailVisible(true);
    setCurrentImageIndex(0); // 重置图片索引
    
    try {
      // 调用详情接口获取完整信息
      const detailResponse = await museumInfoApi.checkinRecordController.getCheckinRecordDetail({ id: record.id! });
      if (detailResponse.success) {
        setCurrentRecord(detailResponse.data);
      } else {
        setCurrentRecord(record); // 如果接口调用失败，使用列表数据
      }
    } catch (error) {
      console.error('获取打卡记录详情失败:', error);
      setCurrentRecord(record); // 如果接口调用失败，使用列表数据
    } finally {
      setDetailLoading(false);
    }
  };

  // 审核打卡记录
  const handleAudit = (record: MuseumsAPI.CheckinRecordResponse, auditStatus: number) => {
    const statusText = auditStatus === 1 ? 
      intl.formatMessage({ id: 'pages.checkinRecord.approveAction', defaultMessage: '通过' }) : 
      intl.formatMessage({ id: 'pages.checkinRecord.rejectAction', defaultMessage: '拒绝' });
    confirm({
      title: intl.formatMessage(
        {
          id: 'pages.checkinRecord.auditConfirm',
          defaultMessage: '确认{action}这条打卡记录吗？',
        },
        { action: statusText }
      ),
      icon: <ExclamationCircleOutlined />,
      content: intl.formatMessage(
        {
          id: 'pages.checkinRecord.auditContent',
          defaultMessage: '用户：{userName}，博物馆：{museumName}',
        },
        { userName: record.userName, museumName: record.museumName }
      ),
      onOk: async () => {
        try {
          await museumInfoApi.checkinRecordController.auditCheckinRecord(
            { id: record.id! },
            { auditStatus, auditRemark: `管理员${statusText}` }
          );
          message.success(`${statusText}成功`);
          actionRef.current?.reload();
        } catch (error) {
          message.error(`${statusText}失败`);
        }
      },
    });
  };

  // 批量审核
  const handleBatchAudit = (auditStatus: number) => {
    if (selectedRows.length === 0) {
      message.warning(
        intl.formatMessage({
          id: 'pages.checkinRecord.pleaseSelectAudit',
          defaultMessage: '请选择要审核的记录',
        })
      );
      return;
    }

    const statusText = auditStatus === 1 ? 
      intl.formatMessage({ id: 'pages.checkinRecord.approveAction', defaultMessage: '通过' }) : 
      intl.formatMessage({ id: 'pages.checkinRecord.rejectAction', defaultMessage: '拒绝' });
    confirm({
      title: intl.formatMessage(
        {
          id: 'pages.checkinRecord.batchAuditConfirm',
          defaultMessage: '确认批量{action}这些打卡记录吗？',
        },
        { action: statusText }
      ),
      icon: <ExclamationCircleOutlined />,
      content: intl.formatMessage(
        {
          id: 'pages.checkinRecord.batchAuditContent',
          defaultMessage: '共选中 {count} 条记录',
        },
        { count: selectedRows.length }
      ),
      onOk: async () => {
        try {
          await museumInfoApi.checkinRecordController.batchAuditCheckinRecords({
            ids: selectedRows.map(row => row.id!),
            auditStatus,
            auditRemark: `管理员批量${statusText}`,
          });
          message.success(`批量${statusText}成功`);
          setSelectedRows([]);
          actionRef.current?.reload();
        } catch (error) {
          message.error(`批量${statusText}失败`);
        }
      },
    });
  };

  return (
    <PageContainer>
      <ProTable<MuseumsAPI.CheckinRecordResponse>
        headerTitle={intl.formatMessage({
          id: 'pages.checkinRecord.title',
          defaultMessage: '打卡记录管理',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
          layout: 'vertical',
          defaultCollapsed: true,
        }}
        scroll={{
          x: 1200,
        }}
        toolBarRender={() => []}
        request={async (params, sort, filter) => {
          try {
            // 构造查询参数
            const queryParams = {
              page: params.current || 1,
              size: params.pageSize || 10,
              userName: params.userName || undefined,
              museumName: params.museumName || undefined,
              auditStatus: params.auditStatus,
              startTime: params.checkinTime?.[0],
              endTime: params.checkinTime?.[1],
            };

            const response = await museumInfoApi.checkinRecordController.getCheckinRecords({ query: queryParams });

            return {
              data: response.data?.records || [],
              success: response.success,
              total: response.data?.total || 0,
            };
          } catch (error) {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (selectedRowKeys, rows) => {
            setSelectedRows(rows);
          },
        }}
        pagination={{
          defaultPageSize: 10,
          showQuickJumper: true,
          showSizeChanger: true,
            showTotal: (total, range) => 
              intl.formatMessage(
                {
                  id: 'pages.common.pagination.total',
                  defaultMessage: '第 {start}-{end} 条/总共 {total} 条',
                },
                {
                  start: range[0],
                  end: range[1],
                  total,
                }
              ),
        }}
        dateFormatter="string"
        toolbar={{
          title: intl.formatMessage({
            id: 'pages.checkinRecord.advancedTable',
            defaultMessage: '打卡记录列表',
          }),
        }}
      />
      {selectedRows?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Selected" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRows.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="items" />
            </div>
          }
        >
          <Button
            onClick={() => {
              handleBatchAudit(1);
            }}
          >
            <FormattedMessage id="pages.checkinRecord.batchApprove" defaultMessage="Batch approval" />
          </Button>
          <Button
            onClick={() => {
              handleBatchAudit(2);
            }}
            type="primary"
            danger
          >
            <FormattedMessage id="pages.checkinRecord.batchReject" defaultMessage="Batch rejection" />
          </Button>
        </FooterToolbar>
      )}

      {/* 详情抽屉 */}
      <Drawer
        title={intl.formatMessage({
          id: 'pages.checkinRecord.detailTitle',
          defaultMessage: '打卡记录详情',
        })}
        width={600}
        open={detailVisible}
        onClose={() => {
          setCurrentRecord(undefined);
          setDetailVisible(false);
          setDetailLoading(false);
        }}
        destroyOnHidden
      >
        <Spin spinning={detailLoading} tip={intl.formatMessage({ id: 'pages.common.loading', defaultMessage: '加载中...' })}>
          {currentRecord ? (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* 基本信息表格 */}
            <ProDescriptions<MuseumsAPI.CheckinRecordResponse>
              title={intl.formatMessage({
                id: 'pages.checkinRecord.basicInfo',
                defaultMessage: '基本信息',
              })}
              column={2}
              bordered
              size="small"
              labelStyle={{ width: '120px', fontWeight: 'bold' }}
            >
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.checkinRecord.userName',
                  defaultMessage: 'User Name',
                })}
              >
                {currentRecord.userName}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.checkinRecord.auditStatus',
                  defaultMessage: 'Audit Status',
                })}
              >
                {(() => {
                  const statusText = auditStatusEnum[currentRecord.auditStatus as keyof typeof auditStatusEnum]?.text || 
                    intl.formatMessage({ id: 'pages.common.unknown', defaultMessage: '未知' });
                  const statusColor = currentRecord.auditStatus === 0 ? 'orange' : 
                                     currentRecord.auditStatus === 1 ? 'green' : 
                                     currentRecord.auditStatus === 2 ? 'red' : 'purple';
                  return <Tag color={statusColor}>{statusText}</Tag>;
                })()}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.checkinRecord.museumName',
                  defaultMessage: 'Museum Name',
                })}
                span={2}
              >
                {currentRecord.museumName}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.checkinRecord.location',
                  defaultMessage: 'Location',
                })}
              >
                {currentRecord.latitude && currentRecord.longitude
                  ? `${currentRecord.latitude}, ${currentRecord.longitude}`
                  : '-'}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.checkinRecord.mood',
                  defaultMessage: 'Mood',
                })}
              >
                {currentRecord.mood ? moodEnum[currentRecord.mood as keyof typeof moodEnum] : '-'}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.checkinRecord.checkinTime',
                  defaultMessage: 'Checkin Time',
                })}
              >
                {currentRecord.checkinTime ? currentRecord.checkinTime.split('T').join(' ') : '-'}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.checkinRecord.distance',
                  defaultMessage: 'Distance',
                })}
              >
                {currentRecord.distance ? `${Math.round(currentRecord.distance)}m` : '-'}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.checkinRecord.anomalyType',
                  defaultMessage: 'Anomaly Type',
                })}
                span={2}
              >
                {currentRecord.anomalyType ? (
                  <Tag color="orange">
                    {anomalyTypeEnum[currentRecord.anomalyType as keyof typeof anomalyTypeEnum]}
                  </Tag>
                ) : '-'}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.checkinRecord.remark',
                  defaultMessage: 'Remark',
                })}
                span={2}
              >
                {currentRecord.remark || intl.formatMessage({ id: 'pages.common.noRemark', defaultMessage: '无备注' })}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.checkinRecord.imageInfo',
                  defaultMessage: '图像信息',
                })}
                span={2}
              >
              {(() => {
                let photoUrls: string[] = [];
                try {
                  photoUrls = currentRecord.photoUrls ? JSON.parse(currentRecord.photoUrls) : [];
                } catch (e) {
                  photoUrls = [];
                }
                  
                  if (photoUrls.length === 0) {
                    return '-';
                  }

                  const onDownload = () => {
                    const url = photoUrls[currentImageIndex];
                    const suffix = url.slice(url.lastIndexOf('.'));
                    const filename = `checkin-photo-${Date.now()}${suffix}`;

                    fetch(url)
                      .then((response) => response.blob())
                      .then((blob) => {
                        const blobUrl = URL.createObjectURL(new Blob([blob]));
                        const link = document.createElement('a');
                        link.href = blobUrl;
                        link.download = filename;
                        document.body.appendChild(link);
                        link.click();
                        URL.revokeObjectURL(blobUrl);
                        link.remove();
                      })
                      .catch((error) => {
                        console.error('Download failed:', error);
                        message.error(intl.formatMessage({
                          id: 'pages.checkinRecord.downloadFailed',
                          defaultMessage: '下载失败',
                        }));
                      });
                  };

                  return (
                    <Image.PreviewGroup
                      preview={{
                        toolbarRender: (
                          _,
                          {
                            transform: { scale },
                            actions: {
                              onActive,
                              onFlipY,
                              onFlipX,
                              onRotateLeft,
                              onRotateRight,
                              onZoomOut,
                              onZoomIn,
                              onReset,
                            },
                          },
                        ) => (
                          <Space size={12} className="toolbar-wrapper">
                            <LeftOutlined 
                              disabled={currentImageIndex === 0} 
                              onClick={() => onActive?.(-1)} 
                            />
                            <RightOutlined
                              disabled={currentImageIndex === photoUrls.length - 1}
                              onClick={() => onActive?.(1)}
                            />
                            <DownloadOutlined onClick={onDownload} />
                            <SwapOutlined rotate={90} onClick={onFlipY} />
                            <SwapOutlined onClick={onFlipX} />
                            <RotateLeftOutlined onClick={onRotateLeft} />
                            <RotateRightOutlined onClick={onRotateRight} />
                            <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
                            <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
                            <UndoOutlined onClick={onReset} />
                          </Space>
                        ),
                        onChange: (index) => {
                          setCurrentImageIndex(index);
                        },
                      }}
                    >
                        {photoUrls.map((url: string, index: number) => (
                          <Image
                            key={index}
                          width={120}
                          height={120}
                            src={url}
                          style={{ 
                            margin: '0 12px 12px 0', 
                            objectFit: 'cover',
                            borderRadius: '6px'
                          }}
                          />
                        ))}
                      </Image.PreviewGroup>
                );
              })()}
              </ProDescriptions.Item>
            </ProDescriptions>

            {/* 审核信息表格 - 放在最下面 */}
            <ProDescriptions<MuseumsAPI.CheckinRecordResponse>
              title={intl.formatMessage({
                id: 'pages.checkinRecord.auditInfo',
                defaultMessage: '审核信息',
              })}
              column={2}
              bordered
              size="small"
              labelStyle={{ width: '120px', fontWeight: 'bold' }}
            >
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.checkinRecord.auditTime',
                  defaultMessage: 'Audit Time',
                })}
              >
                {currentRecord.auditTime ? currentRecord.auditTime.split('T').join(' ') : '-'}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.checkinRecord.auditUserName',
                  defaultMessage: 'Audit User',
                })}
              >
                {currentRecord.auditUserName || '-'}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.checkinRecord.auditRemark',
                  defaultMessage: 'Audit Remark',
                })}
                span={2}
              >
                {currentRecord.auditRemark || intl.formatMessage({ id: 'pages.common.noRemark', defaultMessage: '无备注' })}
              </ProDescriptions.Item>
            </ProDescriptions>
          </Space>
          ) : (
            <div style={{ padding: '50px', textAlign: 'center' }}>
              {intl.formatMessage({ id: 'pages.common.noData', defaultMessage: '暂无详情数据' })}
            </div>
          )}
        </Spin>
      </Drawer>
    </PageContainer>
  );
};

export default CheckinRecordsPage;
