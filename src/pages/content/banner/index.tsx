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
import { Button, Drawer, Popconfirm, Tag, Tooltip, App, Spin, Image } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import React, { useCallback, useState } from 'react';
import { usePermission } from '@/utils/authUtils';
import museumInfoApi from '@/services/museum-service-api';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { PermissionButton, PermissionSwitch } from '@/components/PermissionControl';
import { useCRUD } from '@/hooks';

/**
 * 横幅管理页面
 */
const BannerManagement: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<MuseumsAPI.BannerResponse>();
  const [selectedRowsState, setSelectedRows] = useState<MuseumsAPI.BannerResponse[]>([]);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState<MuseumsAPI.BannerResponse>();

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();
  
  const { message } = App.useApp();

  // 权限检查
  const { hasAuth: canCreateBanner } = usePermission('content:banners:add');
  const { hasAuth: canUpdateBanner } = usePermission('content:banners:edit');
  const { hasAuth: canDeleteBanner } = usePermission('content:banners:delete');
  const { hasAuth: canUpdateStatus } = usePermission('content:banners:status');

  // ✅ 使用 useCRUD Hook 简化代码
  const {
    actionRef,
    handleDelete: crudHandleDelete,
    handleBatchDelete: crudHandleBatchDelete,
    handleStatusUpdate: crudHandleStatusUpdate,
  } = useCRUD<MuseumsAPI.BannerResponse>({
    deleteAPI: async (id) => {
      const response = await museumInfoApi.bannerController.deleteBanner({ id: Number(id) });
      return response;
    },
    batchDeleteAPI: async (ids) => {
      const promises = ids.map((id) => museumInfoApi.bannerController.deleteBanner({ id: Number(id) }));
      await Promise.all(promises);
      return { success: true, code: 200, message: '批量删除成功', data: null, timestamp: Date.now() };
    },
    updateStatusAPI: async (id, status) => {
      const response = await museumInfoApi.bannerController.updateBannerStatus({
        id: Number(id),
        status,
      });
      return response;
    },
    messages: {
      deleteSuccess: intl.formatMessage({
        id: 'pages.content.banner.deleteSuccess',
        defaultMessage: '删除成功',
      }),
      statusUpdateSuccess: intl.formatMessage({
        id: 'pages.content.banner.statusUpdateSuccess',
        defaultMessage: '状态更新成功',
      }),
    },
  });

  // 状态枚举
  const statusEnum = {
    0: { text: intl.formatMessage({ id: 'pages.content.banner.status.offline', defaultMessage: '下线' }), status: 'Default' },
    1: { text: intl.formatMessage({ id: 'pages.content.banner.status.online', defaultMessage: '上线' }), status: 'Success' },
  };

  // 链接类型枚举
  const linkTypeEnum = {
    none: intl.formatMessage({ id: 'pages.content.banner.linkType.none', defaultMessage: '无链接' }),
    museum: intl.formatMessage({ id: 'pages.content.banner.linkType.museum', defaultMessage: '博物馆详情' }),
    exhibition: intl.formatMessage({ id: 'pages.content.banner.linkType.exhibition', defaultMessage: '展览详情' }),
    external: intl.formatMessage({ id: 'pages.content.banner.linkType.external', defaultMessage: '外部链接' }),
  };

  // 批量删除横幅
  const handleBatchDelete = useCallback(async () => {
    if (selectedRowsState.length === 0) {
      message.warning(
        intl.formatMessage({
          id: 'pages.content.banner.pleaseSelectDelete',
          defaultMessage: '请选择要删除的横幅',
        }),
      );
      return;
    }

    const ids = selectedRowsState.map(row => row.id!);
    const success = await crudHandleBatchDelete(ids);
    if (success) {
      setSelectedRows([]);
    }
  }, [selectedRowsState, crudHandleBatchDelete, message, intl]);

  // Handle view detail
  const handleViewDetail = useCallback(async (record: MuseumsAPI.BannerResponse) => {
    setLoadingDetail(true);
    setShowDetail(true);
    
    try {
      // 这里可以调用详情接口获取完整信息
      setCurrentRow(record);
    } catch (error) {
      console.error('获取横幅详情失败:', error);
      setCurrentRow(record);
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  // Handle create
  const handleCreate = useCallback(() => {
    setShowCreateForm(true);
  }, []);

  // Handle edit
  const handleEdit = useCallback((record: MuseumsAPI.BannerResponse) => {
    setUpdateFormValues(record);
    setShowUpdateForm(true);
  }, []);

  // Handle form success
  const handleFormSuccess = useCallback(() => {
    if (actionRef.current) {
      actionRef.current.reload();
    }
  }, []);

  const columns: ProColumns<MuseumsAPI.BannerResponse>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.content.banner.index',
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
        id: 'pages.content.banner.image',
        defaultMessage: '横幅图片',
      }),
      dataIndex: 'imageUrl',
      width: 120,
      search: false,
      render: (_, record) => (
        <Image
          width={80}
          height={45}
          src={record.imageUrl}
          style={{ objectFit: 'cover', borderRadius: 4 }}
          placeholder={
            <div style={{ 
              width: 80, 
              height: 45, 
              backgroundColor: '#f5f5f5', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: 4
            }}>
              暂无图片
            </div>
          }
        />
      ),
    },
    {
      title: intl.formatMessage({
        id: 'pages.content.banner.title',
        defaultMessage: '横幅标题',
      }),
      dataIndex: 'title',
      width: 200,
      render: (text, record) => (
        <a onClick={() => handleViewDetail(record)}>{text}</a>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'pages.content.banner.linkType',
        defaultMessage: '链接类型',
      }),
      dataIndex: 'linkType',
      width: 100,
      render: (text) => (
        <Tag color="blue">{linkTypeEnum[text as keyof typeof linkTypeEnum] || text}</Tag>
      ),
      valueEnum: linkTypeEnum,
    },
    {
      title: intl.formatMessage({
        id: 'pages.content.banner.sort',
        defaultMessage: '排序',
      }),
      dataIndex: 'sort',
      width: 80,
      sorter: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.content.banner.status',
        defaultMessage: '状态',
      }),
      dataIndex: 'status',
      width: 100,
      render: (_, record) => {
        const status = statusEnum[record.status as keyof typeof statusEnum];
        return status ? <Tag color={status.status === 'Success' ? 'green' : 'default'}>{status.text}</Tag> : '-';
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.content.banner.startTime',
        defaultMessage: '开始时间',
      }),
      dataIndex: 'startTime',
      width: 150,
      valueType: 'dateTime',
      sorter: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.content.banner.endTime',
        defaultMessage: '结束时间',
      }),
      dataIndex: 'endTime',
      width: 150,
      valueType: 'dateTime',
    },
    {
      title: intl.formatMessage({
        id: 'pages.content.banner.enabled',
        defaultMessage: '启用状态',
      }),
      dataIndex: 'enabled',
      width: 80,
      render: (_, record) => (
        <PermissionSwitch
          hasPermission={canUpdateStatus}
          checked={record.status === 1}
          onChange={(checked) => crudHandleStatusUpdate(record.id!, checked ? 1 : 0)}
          size="small"
          permissionName="横幅状态切换"
        />
      ),
    },
    {
      title: intl.formatMessage({
        id: 'pages.content.banner.actions',
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
          hasPermission={canUpdateBanner}
          permissionName="编辑横幅"
        >
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.content.banner.edit',
              defaultMessage: '编辑',
            })}
          >
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              style={{ padding: 0 }}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
        </PermissionButton>,
        <PermissionButton
          key="delete"
          hasPermission={canDeleteBanner}
          permissionName="删除横幅"
        >
          <Popconfirm
            title={intl.formatMessage({
              id: 'pages.content.banner.deleteConfirm',
              defaultMessage: '确定要删除这个横幅吗？',
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
                id: 'pages.content.banner.delete',
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
      <ProTable<MuseumsAPI.BannerResponse, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.content.banner.title',
          defaultMessage: '横幅管理',
        })}
        actionRef={actionRef}
        skeleton={true}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <PermissionButton
            key="create"
            hasPermission={canCreateBanner}
            permissionName="新建横幅"
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              <FormattedMessage id="pages.content.banner.new" defaultMessage="新建横幅" />
            </Button>
          </PermissionButton>,
        ]}
        request={async (params, sort, filter) => {
          try {
            const response = await museumInfoApi.bannerController.getBanners({
              query: {
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
            <FormattedMessage id="pages.content.banner.batchDelete" defaultMessage="批量删除" />
          </Button>
        </FooterToolbar>
      )}

      <Drawer
        title={intl.formatMessage({
          id: 'pages.content.banner.detailTitle',
          defaultMessage: '横幅详情',
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
            <ProDescriptions<MuseumsAPI.BannerResponse>
              column={2}
              bordered
              size="small"
              labelStyle={{ width: '120px', fontWeight: 'bold' }}
            >
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.content.banner.title',
                  defaultMessage: '横幅标题',
                })}
                span={2}
              >
                {currentRow.title}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.content.banner.linkType',
                  defaultMessage: '链接类型',
                })}
              >
                <Tag color="blue">{linkTypeEnum[currentRow.linkType as keyof typeof linkTypeEnum] || currentRow.linkType}</Tag>
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.content.banner.sort',
                  defaultMessage: '排序',
                })}
              >
                {currentRow.sort || '-'}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.content.banner.status',
                  defaultMessage: '状态',
                })}
              >
                {(() => {
                  const status = statusEnum[currentRow.status as keyof typeof statusEnum];
                  return status ? (
                    <Tag color={status.status === 'Success' ? 'green' : 'default'}>
                      {status.text}
                    </Tag>
                  ) : '-';
                })()}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.content.banner.enabled',
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
                  id: 'pages.content.banner.startTime',
                  defaultMessage: '开始时间',
                })}
              >
                {currentRow.startTime || '-'}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.content.banner.endTime',
                  defaultMessage: '结束时间',
                })}
              >
                {currentRow.endTime || '-'}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.content.banner.linkUrl',
                  defaultMessage: '链接地址',
                })}
                span={2}
              >
                {currentRow.linkUrl || '-'}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.content.banner.description',
                  defaultMessage: '描述',
                })}
                span={2}
              >
                {(currentRow as any).description || intl.formatMessage({ id: 'pages.common.noContent', defaultMessage: '无内容' })}
              </ProDescriptions.Item>
              {/* 横幅图片 - 移动到最后 */}
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.content.banner.image',
                  defaultMessage: '横幅图片',
                })}
                span={2}
              >
                <Image
                  width={200}
                  height={112}
                  src={currentRow.imageUrl}
                  style={{ objectFit: 'cover', borderRadius: 4 }}
                />
              </ProDescriptions.Item>
            </ProDescriptions>
          ) : (
            <div style={{ padding: '50px', textAlign: 'center' }}>
              {intl.formatMessage({ id: 'pages.common.noData', defaultMessage: '暂无详情数据' })}
            </div>
          )}
        </Spin>
      </Drawer>

      <CreateForm
        visible={showCreateForm}
        onVisibleChange={setShowCreateForm}
        onSuccess={handleFormSuccess}
      />

      <UpdateForm
        visible={showUpdateForm}
        onVisibleChange={setShowUpdateForm}
        onSuccess={handleFormSuccess}
        values={updateFormValues}
      />
    </PageContainer>
  );
};

export default BannerManagement;
