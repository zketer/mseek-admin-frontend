import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, Popconfirm, Tag, Tooltip, App, Spin, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import React, { useCallback, useState } from 'react';
import { usePermission } from '@/utils/authUtils';
import museumInfoApi from '@/services/museum-service-api';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { PermissionButton, PermissionSwitch } from '@/components/PermissionControl';
import { useCRUD } from '@/hooks';

/**
 * 公告管理页面
 */
const AnnouncementManagement: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<MuseumsAPI.AnnouncementResponse>();
  const [selectedRowsState, setSelectedRows] = useState<MuseumsAPI.AnnouncementResponse[]>([]);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();
  
  const { message } = App.useApp();

  // 权限检查
  const { hasAuth: canCreateAnnouncement } = usePermission('content:announcements:add');
  const { hasAuth: canUpdateAnnouncement } = usePermission('content:announcements:edit');
  const { hasAuth: canDeleteAnnouncement } = usePermission('content:announcements:delete');
  const { hasAuth: canPublishAnnouncement } = usePermission('content:announcements:publish');

  // ✅ 使用 useCRUD Hook 简化代码
  const {
    actionRef,
    handleDelete: crudHandleDelete,
    handleBatchDelete: crudHandleBatchDelete,
  } = useCRUD<MuseumsAPI.AnnouncementResponse>({
    deleteAPI: async (id) => {
      const response = await museumInfoApi.announcementController.deleteAnnouncement({ id: Number(id) });
      // 类型适配：确保 code 有默认值
      return { ...response, code: response.code ?? 200 } as any;
    },
    batchDeleteAPI: async (ids) => {
      const promises = ids.map((id) => museumInfoApi.announcementController.deleteAnnouncement({ id: Number(id) }));
      await Promise.all(promises);
      return { success: true, code: 200, message: '批量删除成功', data: null, timestamp: Date.now() };
    },
    messages: {
      deleteSuccess: intl.formatMessage({
        id: 'pages.content.announcement.deleteSuccess',
        defaultMessage: '删除成功',
      }),
    },
  });

  // 格式化时间戳为可读日期
  const formatTimestamp = (timestamp?: number): string => {
    // 处理空值、0、undefined、null
    if (!timestamp || timestamp === 0) return '-';
    
    // 处理无效时间戳
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '-';
    
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  // 公告类型枚举
  const typeEnum = {
    general: intl.formatMessage({ id: 'pages.content.announcement.type.general', defaultMessage: '普通公告' }),
    maintenance: intl.formatMessage({ id: 'pages.content.announcement.type.maintenance', defaultMessage: '维护公告' }),
    activity: intl.formatMessage({ id: 'pages.content.announcement.type.activity', defaultMessage: '活动公告' }),
    emergency: intl.formatMessage({ id: 'pages.content.announcement.type.emergency', defaultMessage: '紧急公告' }),
  };

  // 公告状态枚举
  const statusEnum = {
    0: { text: intl.formatMessage({ id: 'pages.content.announcement.status.draft', defaultMessage: '草稿' }), status: 'Default' },
    1: { text: intl.formatMessage({ id: 'pages.content.announcement.status.published', defaultMessage: '已发布' }), status: 'Success' },
    2: { text: intl.formatMessage({ id: 'pages.content.announcement.status.expired', defaultMessage: '已过期' }), status: 'Error' },
  };

  // Handle enabled toggle (启用状态切换)
  const handleEnabledToggle = useCallback(
    async (record: MuseumsAPI.AnnouncementResponse, checked: boolean) => {
      try {
        const enabled = checked ? 1 : 0; // 1=启用，0=禁用
        await museumInfoApi.announcementController.updateAnnouncementEnabled({ 
          id: record.id!, 
          enabled: enabled 
        });
        message.success(
          intl.formatMessage({
            id: 'pages.content.announcement.statusUpdateSuccess',
            defaultMessage: '状态更新成功',
          }),
        );
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } catch (error) {
        message.error(
          intl.formatMessage({
            id: 'pages.content.announcement.statusUpdateFailed',
            defaultMessage: '状态更新失败',
          }),
        );
      }
    },
    [intl, message],
  );

  // Handle publish status change (发布状态切换)
  const handlePublishStatusChange = useCallback(
    async (record: MuseumsAPI.AnnouncementResponse, newStatus: number) => {
      try {
        await museumInfoApi.announcementController.updateAnnouncementStatus({ 
          id: record.id!, 
          status: newStatus 
        });
        message.success(
          intl.formatMessage({
            id: 'pages.content.announcement.statusUpdateSuccess',
            defaultMessage: '状态更新成功',
          }),
        );
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } catch (error) {
        message.error(
          intl.formatMessage({
            id: 'pages.content.announcement.statusUpdateFailed',
            defaultMessage: '状态更新失败',
          }),
        );
      }
    },
    [intl, message],
  );

  // 批量删除公告
  const handleBatchDelete = useCallback(async () => {
    if (!selectedRowsState?.length) {
      message.warning(
        intl.formatMessage({
          id: 'pages.content.announcement.pleaseSelectDelete',
          defaultMessage: '请选择要删除的项目',
        }),
      );
      return;
    }

    const ids = selectedRowsState.map((record) => record.id!);
    const success = await crudHandleBatchDelete(ids);
    if (success) {
      setSelectedRows([]);
    }
  }, [selectedRowsState, crudHandleBatchDelete, message, intl]);


  // Handle view detail
  const handleViewDetail = useCallback(async (record: MuseumsAPI.AnnouncementResponse) => {
    setLoadingDetail(true);
    setShowDetail(true);
    
    try {
      // 这里可以调用详情接口获取完整信息
      setCurrentRow(record);
    } catch (error) {
      console.error('获取公告详情失败:', error);
      setCurrentRow(record);
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  const columns: ProColumns<MuseumsAPI.AnnouncementResponse>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.content.announcement.index',
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
        id: 'pages.content.announcement.title',
        defaultMessage: '公告标题',
      }),
      dataIndex: 'title',
      width: 200,
      render: (text, record) => (
        <a onClick={() => handleViewDetail(record)}>{text}</a>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'pages.content.announcement.type',
        defaultMessage: '公告类型',
      }),
      dataIndex: 'type',
      width: 100,
      render: (text) => (
        <Tag color="blue">{typeEnum[text as keyof typeof typeEnum] || text}</Tag>
      ),
      valueEnum: typeEnum,
    },
    {
      title: intl.formatMessage({
        id: 'pages.content.announcement.status',
        defaultMessage: '发布状态',
      }),
      dataIndex: 'status',
      width: 120,
      render: (_, record) => {
        const status = statusEnum[record.status as keyof typeof statusEnum];
        const canPublish = record.status === 0; // 草稿状态可以发布
        const canWithdraw = record.status === 1; // 已发布状态可以撤回到草稿
        
        return (
          <Space>
            <Tag color={status?.status === 'Success' ? 'green' : status?.status === 'Error' ? 'red' : 'default'}>
              {status?.text || '-'}
            </Tag>
            {canPublish && (
              <PermissionButton hasPermission={canPublishAnnouncement ?? false} permissionName="发布公告">
                <Button
                  type="link"
                  size="small"
                  style={{ padding: 0, fontSize: '12px' }}
                  onClick={() => handlePublishStatusChange(record, 1)}
                >
                  {intl.formatMessage({
                    id: 'pages.content.announcement.publish',
                    defaultMessage: '发布',
                  })}
                </Button>
              </PermissionButton>
            )}
            {canWithdraw && (
              <PermissionButton hasPermission={canPublishAnnouncement ?? false} permissionName="撤回公告">
                <Button
                  type="link"
                  size="small"
                  style={{ padding: 0, fontSize: '12px' }}
                  onClick={() => handlePublishStatusChange(record, 0)}
                >
                  {intl.formatMessage({
                    id: 'pages.content.announcement.withdraw',
                    defaultMessage: '撤回',
                  })}
                </Button>
              </PermissionButton>
            )}
          </Space>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.content.announcement.priority',
        defaultMessage: '优先级',
      }),
      dataIndex: 'priority',
      width: 80,
      render: (priority) => (
        <Tag color={priority === 2 ? 'red' : priority === 1 ? 'orange' : 'default'}>
          {priority === 2 ? intl.formatMessage({ id: 'pages.content.announcement.priority.high', defaultMessage: '紧急' }) 
           : priority === 1 ? intl.formatMessage({ id: 'pages.content.announcement.priority.medium', defaultMessage: '重要' }) 
           : intl.formatMessage({ id: 'pages.content.announcement.priority.low', defaultMessage: '普通' })}
        </Tag>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'pages.content.announcement.publishTime',
        defaultMessage: '发布时间',
      }),
      dataIndex: 'publishTime',
      width: 150,
      sorter: true,
      render: (publishTime) => formatTimestamp(publishTime as number),
    },
    {
      title: intl.formatMessage({
        id: 'pages.content.announcement.expireTime',
        defaultMessage: '过期时间',
      }),
      dataIndex: 'expireTime',
      width: 150,
      render: (expireTime) => formatTimestamp(expireTime as number),
    },
    {
      title: intl.formatMessage({
        id: 'pages.content.announcement.enabled',
        defaultMessage: '启用状态',
      }),
      dataIndex: 'enabled',
      width: 80,
      render: (_, record) => (
        <PermissionSwitch
          hasPermission={canUpdateAnnouncement ?? false}
          checked={(record as any).enabled === 1}
          onChange={(checked) => handleEnabledToggle(record, checked)}
          size="small"
          permissionName="启用状态切换"
        />
      ),
    },
    {
      title: intl.formatMessage({
        id: 'pages.content.announcement.actions',
        defaultMessage: '操作',
      }),
      dataIndex: 'option',
      valueType: 'option',
      width: 80,
      key: 'option',
      fixed: 'right',
      render: (_, record) => [
        <PermissionButton
          key="edit"
          hasPermission={canUpdateAnnouncement ?? false}
          permissionName="编辑公告"
        >
          <UpdateForm
            trigger={
              <Tooltip
                title={intl.formatMessage({
                  id: 'pages.content.announcement.edit',
                  defaultMessage: '编辑',
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
          hasPermission={canDeleteAnnouncement ?? false}
          permissionName="删除公告"
        >
          <Popconfirm
            title={intl.formatMessage({
              id: 'pages.content.announcement.deleteConfirm',
              defaultMessage: '确定要删除这个公告吗？',
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
                id: 'pages.content.announcement.delete',
                defaultMessage: '删除',
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
      <ProTable<MuseumsAPI.AnnouncementResponse>
        headerTitle={intl.formatMessage({
          id: 'pages.content.announcement.title',
          defaultMessage: '公告管理',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <PermissionButton key="create" hasPermission={canCreateAnnouncement ?? false} permissionName="新建公告">
            <CreateForm
              reload={actionRef.current?.reload}
            />
          </PermissionButton>,
        ]}
        request={async (params, sort, filter) => {
          try {
            const response = await museumInfoApi.announcementController.getAnnouncements({
              request: {
                current: params.current || 1,
                pageSize: params.pageSize || 20,
                ...params,
              },
            });
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
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        scroll={{ x: 1200 }}
      />
      
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="已选择" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
            </div>
          }
        >
          <Button
            type="primary"
            danger
            onClick={handleBatchDelete}
          >
            <FormattedMessage id="pages.content.announcement.batchDelete" defaultMessage="批量删除" />
          </Button>
        </FooterToolbar>
      )}

      <Drawer
        title={intl.formatMessage({
          id: 'pages.content.announcement.detailTitle',
          defaultMessage: '公告详情',
        })}
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
          setLoadingDetail(false);
        }}
        destroyOnClose
      >
        <Spin spinning={loadingDetail} tip={intl.formatMessage({ id: 'pages.common.loading', defaultMessage: '加载中...' })}>
          {currentRow ? (
            <ProDescriptions<MuseumsAPI.AnnouncementResponse>
              column={1}
              bordered
              size="small"
              labelStyle={{ width: '120px', fontWeight: 'bold' }}
            >
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.content.announcement.title',
                  defaultMessage: '公告标题',
                })}
              >
                {currentRow.title}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.content.announcement.type',
                  defaultMessage: '公告类型',
                })}
              >
                <Tag color="blue">{typeEnum[currentRow.type as keyof typeof typeEnum] || currentRow.type}</Tag>
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.content.announcement.priority',
                  defaultMessage: '优先级',
                })}
              >
                <Tag color={currentRow.priority === 2 ? 'red' : currentRow.priority === 1 ? 'orange' : 'default'}>
                  {currentRow.priority === 2 ? intl.formatMessage({ id: 'pages.content.announcement.priority.high', defaultMessage: '紧急' }) :
                   currentRow.priority === 1 ? intl.formatMessage({ id: 'pages.content.announcement.priority.medium', defaultMessage: '重要' }) :
                   intl.formatMessage({ id: 'pages.content.announcement.priority.low', defaultMessage: '普通' })}
                </Tag>
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.content.announcement.status',
                  defaultMessage: '发布状态',
                })}
              >
                {(() => {
                  const status = statusEnum[currentRow.status as keyof typeof statusEnum];
                  return status ? (
                    <Tag color={status.status === 'Success' ? 'green' : status.status === 'Error' ? 'red' : 'default'}>
                      {status.text}
                    </Tag>
                  ) : '-';
                })()}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.content.announcement.enabled',
                  defaultMessage: '启用状态',
                })}
              >
                <Tag color={currentRow.status === 1 ? 'green' : 'default'}>
                  {currentRow.status === 1 ? intl.formatMessage({ id: 'pages.common.enabled', defaultMessage: '启用' }) : 
                   intl.formatMessage({ id: 'pages.common.disabled', defaultMessage: '禁用' })}
                </Tag>
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.content.announcement.publishTime',
                  defaultMessage: '发布时间',
                })}
              >
                {formatTimestamp(currentRow.publishTime)}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.content.announcement.expireTime',
                  defaultMessage: '过期时间',
                })}
              >
                {formatTimestamp(currentRow.expireTime)}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.content.announcement.content',
                  defaultMessage: '公告内容',
                })}
              >
                <div style={{
                  maxHeight: '200px', 
                  overflowY: 'auto',
                  padding: '8px',
                  backgroundColor: '#fafafa',
                  borderRadius: '4px',
                  whiteSpace: 'pre-wrap'
                }}>
                  {currentRow.content || intl.formatMessage({ id: 'pages.common.noContent', defaultMessage: '无内容' })}
                </div>
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.common.createdAt',
                  defaultMessage: '创建时间',
                })}
              >
                {(currentRow as any).createdAt || '-'}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.common.updatedAt',
                  defaultMessage: '更新时间',
                })}
              >
                {(currentRow as any).updatedAt || '-'}
              </ProDescriptions.Item>
            </ProDescriptions>
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

export default AnnouncementManagement;