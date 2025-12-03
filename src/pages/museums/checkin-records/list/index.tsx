import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import { PageContainer, ProTable, ProDescriptions, FooterToolbar } from '@ant-design/pro-components';
import { useIntl, FormattedMessage } from '@umijs/max';
import { Button, Popconfirm, Tag, Tooltip, App, Badge, Drawer, Image } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import React, { useCallback, useState } from 'react';
import { getCheckinRecords1 as getCheckinRecords, deleteCheckinRecord1 as deleteCheckinRecord, auditCheckinRecord, batchAuditCheckinRecords } from '@/services/museum-service-api/checkinRecordController';
import AuditForm from './components/AuditForm';
import { useCRUD } from '@/hooks';
import { usePermission } from '@/utils/authUtils';
import { PermissionButton } from '@/components/PermissionControl';

/**
 * 打卡记录管理页面
 */
const CheckinRecordList: React.FC = () => {
  console.log('🎯 [打卡记录列表] 组件已加载');
  
  const [currentRow, setCurrentRow] = useState<MuseumsAPI.CheckinRecordResponse>();
  const [selectedRowsState, setSelectedRows] = useState<MuseumsAPI.CheckinRecordResponse[]>([]);
  const [showDetail, setShowDetail] = useState<boolean>(false);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();
  
  const { message } = App.useApp();

  // 权限检查
  const { hasAuth: canAuditCheckin } = usePermission('checkins:records:audit');
  const { hasAuth: canDeleteCheckin } = usePermission('checkins:records:delete');

  // ✅ 使用 useCRUD Hook 简化代码
  // TODO: 等API实现后，取消注释并替换相应的API调用
  const {
    actionRef,
    handleDelete: crudHandleDelete,
    handleBatchDelete: crudHandleBatchDelete,
  } = useCRUD<MuseumsAPI.CheckinRecordResponse>({
    deleteAPI: async (id) => {
      const response = await deleteCheckinRecord({ id: Number(id) });
      return { 
        success: response.success || false, 
        code: response.code || 200, 
        message: response.message || '删除成功', 
        data: response.data,
        timestamp: Date.now() 
      };
    },
    batchDeleteAPI: async (ids) => {
      const promises = ids.map((id) => deleteCheckinRecord({ id: Number(id) }));
      await Promise.all(promises);
      return { success: true, code: 200, message: '批量删除成功', data: null, timestamp: Date.now() };
    },
    messages: {
      deleteSuccess: intl.formatMessage({
        id: 'pages.checkinRecord.deleteSuccess',
        defaultMessage: '删除成功',
      }),
    },
  });

  // Handle audit status change
  const handleAuditChange = useCallback(
    async (record: MuseumsAPI.CheckinRecordResponse, auditStatus: number) => {
      try {
        await auditCheckinRecord({ id: record.id! }, { auditStatus, auditRemark: '管理员操作' });
        message.success(
          intl.formatMessage({
            id: 'pages.checkinRecord.auditSuccess',
            defaultMessage: '审核状态更新成功',
          })
        );
        actionRef.current?.reload();
      } catch (error) {
        console.error('Failed to update audit status:', error);
        message.error(
          intl.formatMessage({
            id: 'pages.checkinRecord.auditFailed',
            defaultMessage: '审核状态更新失败',
          })
        );
      }
    },
    [intl, message, actionRef]
  );

  // 批量删除打卡记录
  const handleBatchDelete = useCallback(
    async (selectedRows: MuseumsAPI.CheckinRecordResponse[]) => {
      if (!selectedRows?.length) {
        message.warning(
          intl.formatMessage({
            id: 'pages.checkinRecord.pleaseSelectDelete',
            defaultMessage: '请选择要删除的项',
          })
        );
        return;
      }

      const ids = selectedRows.map((row) => row.id!);
      const success = await crudHandleBatchDelete(ids);
      if (success) {
        setSelectedRows([]);
      }
    },
    [crudHandleBatchDelete, message, intl]
  );

  // 获取审核状态标签
  const getAuditStatusTag = (status: number) => {
    const statusMap: Record<number, { color: string; textId: string; defaultText: string }> = {
      0: { color: 'orange', textId: 'pages.checkinRecord.auditStatus.pending', defaultText: 'Pending' },
      1: { color: 'green', textId: 'pages.checkinRecord.auditStatus.approved', defaultText: 'Approved' },
      2: { color: 'red', textId: 'pages.checkinRecord.auditStatus.rejected', defaultText: 'Rejected' },
      3: { color: 'purple', textId: 'pages.checkinRecord.auditStatus.anomaly', defaultText: 'Anomaly' },
    };
    const config = statusMap[status];
    if (!config) return <Tag>{intl.formatMessage({ id: 'pages.common.unknown', defaultMessage: 'Unknown' })}</Tag>;
    return (
      <Tag color={config.color}>
        {intl.formatMessage({ id: config.textId, defaultMessage: config.defaultText })}
      </Tag>
    );
  };

  // 获取异常类型标签
  const getAnomalyTypeTag = (type: string) => {
    if (!type) return null;
    
    const typeMap: Record<string, { color: string; textId: string; defaultText: string }> = {
      distance_anomaly: { color: 'orange', textId: 'pages.checkinRecord.anomalyType.distance', defaultText: 'Distance Anomaly' },
      time_anomaly: { color: 'blue', textId: 'pages.checkinRecord.anomalyType.time', defaultText: 'Time Anomaly' },
      frequency_anomaly: { color: 'purple', textId: 'pages.checkinRecord.anomalyType.frequency', defaultText: 'Frequency Anomaly' },
      content_anomaly: { color: 'red', textId: 'pages.checkinRecord.anomalyType.content', defaultText: 'Content Anomaly' },
      system_error: { color: 'gray', textId: 'pages.checkinRecord.anomalyType.system', defaultText: 'System Error' },
    };

    const anomaly = typeMap[type];
    if (!anomaly) return <Tag color="default">{type}</Tag>;
    return (
      <Tag color={anomaly.color}>
        {intl.formatMessage({ id: anomaly.textId, defaultMessage: anomaly.defaultText })}
      </Tag>
    );
  };

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
        defaultMessage: 'User Name',
      }),
      dataIndex: 'userName',
      width: 120,
      ellipsis: true,
      render: (dom, entity) => {
        return (
          <a
            onClick={async () => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.checkinRecord.museumName',
        defaultMessage: 'Museum Name',
      }),
      dataIndex: 'museumName',
      width: 200,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.checkinRecord.photos',
        defaultMessage: '照片',
      }),
      dataIndex: 'photos',
      width: 80,
      hideInSearch: true,
      render: (_, record) => {
        try {
          const photos = record.photos ? JSON.parse(record.photos) : [];
          return photos.length > 0 ? (
            <Tag color="blue">📷 {photos.length}</Tag>
          ) : (
            <span style={{ color: '#999' }}>-</span>
          );
        } catch {
          return '-';
        }
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.checkinRecord.feeling',
        defaultMessage: '打卡感受',
      }),
      dataIndex: 'feeling',
      width: 200,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.checkinRecord.rating',
        defaultMessage: '评分',
      }),
      dataIndex: 'rating',
      width: 100,
      hideInSearch: true,
      render: (_, record) => {
        if (!record.rating) return '-';
        return '⭐'.repeat(record.rating);
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.checkinRecord.mood',
        defaultMessage: '心情',
      }),
      dataIndex: 'mood',
      width: 100,
      hideInSearch: true,
      render: (_, record) => {
        const moodMap: Record<string, { emoji: string; textId: string; defaultText: string }> = {
          excited: { emoji: '😆', textId: 'pages.checkinRecord.mood.excited', defaultText: 'Excited' },
          happy: { emoji: '😊', textId: 'pages.checkinRecord.mood.happy', defaultText: 'Happy' },
          peaceful: { emoji: '😌', textId: 'pages.checkinRecord.mood.peaceful', defaultText: 'Peaceful' },
          thoughtful: { emoji: '🤔', textId: 'pages.checkinRecord.mood.thoughtful', defaultText: 'Thoughtful' },
          amazed: { emoji: '😲', textId: 'pages.checkinRecord.mood.amazed', defaultText: 'Amazed' },
        };
        const mood = moodMap[record.mood || ''];
        return mood ? `${mood.emoji} ${intl.formatMessage({ id: mood.textId, defaultMessage: mood.defaultText })}` : '-';
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.checkinRecord.weather',
        defaultMessage: '天气',
      }),
      dataIndex: 'weather',
      width: 100,
      hideInSearch: true,
      render: (_, record) => {
        const weatherMap: Record<string, { emoji: string; textId: string; defaultText: string }> = {
          sunny: { emoji: '☀️', textId: 'pages.checkinRecord.weather.sunny', defaultText: 'Sunny' },
          cloudy: { emoji: '☁️', textId: 'pages.checkinRecord.weather.cloudy', defaultText: 'Cloudy' },
          rainy: { emoji: '🌧️', textId: 'pages.checkinRecord.weather.rainy', defaultText: 'Rainy' },
          snowy: { emoji: '❄️', textId: 'pages.checkinRecord.weather.snowy', defaultText: 'Snowy' },
          windy: { emoji: '💨', textId: 'pages.checkinRecord.weather.windy', defaultText: 'Windy' },
        };
        const weather = weatherMap[record.weather || ''];
        return weather ? `${weather.emoji} ${intl.formatMessage({ id: weather.textId, defaultMessage: weather.defaultText })}` : '-';
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.checkinRecord.companions',
        defaultMessage: '同行人',
      }),
      dataIndex: 'companions',
      width: 120,
      hideInSearch: true,
      render: (_, record) => {
        try {
          const companions = record.companions ? JSON.parse(record.companions) : [];
          return companions.length > 0 ? (
            <Tag color="blue">👥 {companions.length} {intl.formatMessage({ id: 'pages.checkinRecord.companions.count', defaultMessage: 'people' })}</Tag>
          ) : '-';
        } catch {
          return '-';
        }
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.checkinRecord.tags',
        defaultMessage: '标签',
      }),
      dataIndex: 'tags',
      width: 150,
      hideInSearch: true,
      render: (_, record) => {
        try {
          const tags = record.tags ? JSON.parse(record.tags) : [];
          return tags.length > 0 ? (
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {tags.slice(0, 2).map((tag: string, index: number) => (
                <Tag key={index} color="cyan">{tag}</Tag>
              ))}
              {tags.length > 2 && <Tag>+{tags.length - 2}</Tag>}
            </div>
          ) : '-';
        } catch {
          return '-';
        }
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.checkinRecord.location',
        defaultMessage: '位置',
      }),
      dataIndex: 'address',
      width: 200,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.checkinRecord.checkinTime',
        defaultMessage: 'Checkin Time',
      }),
      dataIndex: 'checkinTime',
      valueType: 'dateTime',
      width: 160,
      sorter: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.checkinRecord.auditStatus',
        defaultMessage: 'Audit Status',
      }),
      dataIndex: 'auditStatus',
      width: 100,
      valueEnum: {
        0: { text: intl.formatMessage({ id: 'pages.checkinRecord.auditStatus.pending', defaultMessage: 'Pending' }), status: 'Warning' },
        1: { text: intl.formatMessage({ id: 'pages.checkinRecord.auditStatus.approved', defaultMessage: 'Approved' }), status: 'Success' },
        2: { text: intl.formatMessage({ id: 'pages.checkinRecord.auditStatus.rejected', defaultMessage: 'Rejected' }), status: 'Error' },
        3: { text: intl.formatMessage({ id: 'pages.checkinRecord.auditStatus.anomaly', defaultMessage: 'Anomaly' }), status: 'Processing' },
      },
      render: (_, record) => getAuditStatusTag(record.auditStatus || 0),
    },
    {
      title: intl.formatMessage({
        id: 'pages.checkinRecord.anomalyType',
        defaultMessage: 'Anomaly Type',
      }),
      dataIndex: 'anomalyType',
      width: 120,
      hideInSearch: true,
      render: (_, record) => record.anomalyType ? getAnomalyTypeTag(record.anomalyType) : '-',
    },
    {
      title: intl.formatMessage({
        id: 'pages.checkinRecord.auditTime',
        defaultMessage: 'Audit Time',
      }),
      dataIndex: 'auditTime',
      valueType: 'dateTime',
      width: 160,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.checkinRecord.actions',
        defaultMessage: 'Actions',
      }),
      dataIndex: 'option',
      valueType: 'option',
      width: 80,
      key: 'option',
      fixed: 'right',
      render: (_, record) => [
        <Tooltip
          key="detail"
          title={intl.formatMessage({
            id: 'pages.checkinRecord.detail',
            defaultMessage: '查看详情',
          })}
        >
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            style={{ padding: 0 }}
            onClick={() => {
              setCurrentRow(record);
              setShowDetail(true);
            }}
          />
        </Tooltip>,
        <PermissionButton
          key="audit"
          hasPermission={canAuditCheckin}
          permissionName="审核打卡"
        >
          <AuditForm
            trigger={
              <Tooltip
                title={intl.formatMessage({
                  id: 'pages.checkinRecord.audit',
                  defaultMessage: 'Audit',
                })}
              >
                <Button
                  type="link"
                  size="small"
                  icon={<EditOutlined />}
                  style={{ padding: 0 }}
                />
              </Tooltip>
            }
            onOk={actionRef.current?.reload}
            values={record}
          />
        </PermissionButton>,
        <PermissionButton
          key="delete"
          hasPermission={canDeleteCheckin}
          permissionName="删除打卡记录"
        >
          <Popconfirm
            title={intl.formatMessage({
              id: 'pages.checkinRecord.deleteConfirm',
              defaultMessage: '确定要删除这条打卡记录吗？',
            })}
            onConfirm={() => crudHandleDelete(record.id!)}
            okText={intl.formatMessage({
              id: 'pages.common.confirm',
              defaultMessage: '确定',
            })}
            cancelText={intl.formatMessage({
              id: 'pages.common.cancel',
              defaultMessage: '取消',
            })}
          >
            <Tooltip
              title={intl.formatMessage({
                id: 'pages.checkinRecord.delete',
                defaultMessage: 'Delete',
              })}
            >
              <Button
                type="link"
                size="small"
                icon={<DeleteOutlined />}
                style={{ padding: 0, color: '#ff4d4f' }}
              />
            </Tooltip>
          </Popconfirm>
        </PermissionButton>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<MuseumsAPI.CheckinRecordResponse, any>
        headerTitle={intl.formatMessage({
          id: 'pages.checkinRecord.title',
          defaultMessage: 'Checkin Record Management',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
          layout: 'vertical',
          defaultCollapsed: true,
        }}
        pagination={{
          defaultPageSize: 10,
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total, range) => 
            intl.formatMessage(
              {
                id: 'pages.common.pagination.total',
                defaultMessage: '{start}-{end} of {total} items',
              },
              {
                start: range[0],
                end: range[1],
                total,
              }
            ),
        }}
        scroll={{ x: 1200 }}
        dateFormatter="string"
        toolbar={{
          title: intl.formatMessage({
            id: 'pages.checkinRecord.advancedTable',
            defaultMessage: '打卡记录列表',
          }),
        }}
        toolBarRender={() => []}
        request={async (params, sort, filter) => {
          console.log('📋 [打卡记录列表] 开始请求数据', params);

          // 直接构造查询参数，匹配后端CheckinRecordQueryRequest
          const queryParams: any = {
            current: params.current || 1,
            pageSize: params.pageSize || 10,
          };

          // 添加可选参数
          if (params.userName) queryParams.userName = params.userName;
          if (params.museumName) queryParams.museumName = params.museumName;
          if (params.auditStatus !== undefined) queryParams.auditStatus = params.auditStatus;
          if (params.checkinTime?.[0]) queryParams.startDate = params.checkinTime[0];
          if (params.checkinTime?.[1]) queryParams.endDate = params.checkinTime[1];

          console.log('📤 [打卡记录列表] 请求参数:', queryParams);

          try {
            const response = await getCheckinRecords({ query: queryParams });
            console.log('✅ [打卡记录列表] API响应:', response);
            
            return {
              data: response.data?.records || [],
              success: response.success,
              total: response.data?.total || 0,
            };
          } catch (error) {
            console.error('❌ [打卡记录列表] API请求失败:', error);
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Selected" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="items" />
            </div>
          }
        >
          <Button
            onClick={() => {
              handleBatchDelete(selectedRowsState);
            }}
          >
            <FormattedMessage id="pages.checkinRecord.batchDeletion" defaultMessage="Batch deletion" />
          </Button>
        </FooterToolbar>
      )}

      <Drawer
        title={intl.formatMessage(
          {
            id: 'pages.checkinRecord.detailTitle',
            defaultMessage: 'Checkin Record Details: {id}',
          },
          { id: currentRow?.id }
        )}
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        destroyOnClose
      >
        {showDetail && currentRow ? (
          <ProDescriptions<MuseumsAPI.CheckinRecordResponse>
            column={1}
            bordered
            size="small"
            styles={{ label: { width: '130px', fontWeight: 'bold' } }}
          >
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.checkinRecord.id',
                defaultMessage: 'Record ID',
              })}
            >
              {currentRow.id}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.checkinRecord.userName',
                defaultMessage: 'User Name',
              })}
            >
              {currentRow.userName}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.checkinRecord.museumName',
                defaultMessage: 'Museum Name',
              })}
            >
              {currentRow.museumName}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.checkinRecord.photos',
                defaultMessage: '打卡照片',
              })}
              span={2}
            >
              {(() => {
                try {
                  const photos = currentRow.photos ? JSON.parse(currentRow.photos) : [];
                  return photos.length > 0 ? (
                    <Image.PreviewGroup>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {photos.map((url: string, index: number) => (
                          <Image
                            key={index}
                            src={url}
                            alt={`照片${index + 1}`}
                            width={100}
                            height={100}
                            style={{ objectFit: 'cover', borderRadius: 4 }}
                          />
                        ))}
                      </div>
                    </Image.PreviewGroup>
                  ) : (
                    <span style={{ color: '#999' }}>{intl.formatMessage({ id: 'pages.checkinRecord.photos.empty', defaultMessage: 'No photos uploaded' })}</span>
                  );
                } catch {
                  return '-';
                }
              })()}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.checkinRecord.feeling',
                defaultMessage: '打卡感受',
              })}
              span={2}
            >
              {currentRow.feeling || '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.checkinRecord.rating',
                defaultMessage: '评分',
              })}
            >
              {currentRow.rating ? '⭐'.repeat(currentRow.rating) : '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.checkinRecord.mood',
                defaultMessage: '心情',
              })}
            >
              {(() => {
                const moodMap: Record<string, { emoji: string; textId: string; defaultText: string }> = {
                  excited: { emoji: '😆', textId: 'pages.checkinRecord.mood.excited', defaultText: 'Excited' },
                  happy: { emoji: '😊', textId: 'pages.checkinRecord.mood.happy', defaultText: 'Happy' },
                  peaceful: { emoji: '😌', textId: 'pages.checkinRecord.mood.peaceful', defaultText: 'Peaceful' },
                  thoughtful: { emoji: '🤔', textId: 'pages.checkinRecord.mood.thoughtful', defaultText: 'Thoughtful' },
                  amazed: { emoji: '😲', textId: 'pages.checkinRecord.mood.amazed', defaultText: 'Amazed' },
                };
                const mood = moodMap[currentRow.mood || ''];
                return mood ? `${mood.emoji} ${intl.formatMessage({ id: mood.textId, defaultMessage: mood.defaultText })}` : '-';
              })()}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.checkinRecord.weather',
                defaultMessage: '天气',
              })}
            >
              {(() => {
                const weatherMap: Record<string, { emoji: string; textId: string; defaultText: string }> = {
                  sunny: { emoji: '☀️', textId: 'pages.checkinRecord.weather.sunny', defaultText: 'Sunny' },
                  cloudy: { emoji: '☁️', textId: 'pages.checkinRecord.weather.cloudy', defaultText: 'Cloudy' },
                  rainy: { emoji: '🌧️', textId: 'pages.checkinRecord.weather.rainy', defaultText: 'Rainy' },
                  snowy: { emoji: '❄️', textId: 'pages.checkinRecord.weather.snowy', defaultText: 'Snowy' },
                  windy: { emoji: '💨', textId: 'pages.checkinRecord.weather.windy', defaultText: 'Windy' },
                };
                const weather = weatherMap[currentRow.weather || ''];
                return weather ? `${weather.emoji} ${intl.formatMessage({ id: weather.textId, defaultMessage: weather.defaultText })}` : '-';
              })()}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.checkinRecord.companions',
                defaultMessage: '同行人',
              })}
            >
              {(() => {
                try {
                  const companions = currentRow.companions ? JSON.parse(currentRow.companions) : [];
                  return companions.length > 0 ? (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {companions.map((name: string, index: number) => (
                        <Tag key={index} color="blue">{name}</Tag>
                      ))}
                    </div>
                  ) : '-';
                } catch {
                  return '-';
                }
              })()}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.checkinRecord.tags',
                defaultMessage: '标签',
              })}
            >
              {(() => {
                try {
                  const tags = currentRow.tags ? JSON.parse(currentRow.tags) : [];
                  return tags.length > 0 ? (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {tags.map((tag: string, index: number) => (
                        <Tag key={index} color="cyan">{tag}</Tag>
                      ))}
                    </div>
                  ) : '-';
                } catch {
                  return '-';
                }
              })()}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.checkinRecord.address',
                defaultMessage: '打卡地址',
              })}
            >
              {currentRow.address || '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.checkinRecord.checkinTime',
                defaultMessage: 'Checkin Time',
              })}
            >
              {currentRow.checkinTime ? currentRow.checkinTime.split('T').join(' ') : '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.checkinRecord.auditStatus',
                defaultMessage: 'Audit Status',
              })}
            >
              {getAuditStatusTag(currentRow.auditStatus || 0)}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.checkinRecord.anomalyType',
                defaultMessage: 'Anomaly Type',
              })}
            >
              {currentRow.anomalyType ? getAnomalyTypeTag(currentRow.anomalyType) : '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.checkinRecord.auditTime',
                defaultMessage: 'Audit Time',
              })}
            >
              {currentRow.auditTime ? currentRow.auditTime.split('T').join(' ') : '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.checkinRecord.auditRemark',
                defaultMessage: 'Audit Remark',
              })}
            >
              {currentRow.auditRemark || '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.checkinRecord.createAt',
                defaultMessage: '创建时间',
              })}
            >
              {currentRow.createAt ? currentRow.createAt.split('T').join(' ') : '-'}
            </ProDescriptions.Item>
          </ProDescriptions>
        ) : (
          <div style={{ padding: '50px', textAlign: 'center' }}>{intl.formatMessage({ id: 'pages.common.noData', defaultMessage: 'No data available' })}</div>
        )}
      </Drawer>
      </PageContainer>
  );
};

export default CheckinRecordList;