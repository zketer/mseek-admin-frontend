import { getCategoryPage, deleteCategory, updateStatus2 } from '@/services/museum-service-api/museumCategoryController';
import { PageContainer, ProColumns, ProTable, FooterToolbar, ProDescriptions } from '@ant-design/pro-components';
import { Button, Drawer, Switch, Popconfirm, Tag, Tooltip, App } from 'antd';
import { EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from '@umijs/max';
import React, { useState } from 'react';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { usePermission } from '@/utils/authUtils';
import { PermissionButton, PermissionSwitch } from '@/components/PermissionControl';
import { useCRUD } from '@/hooks';

/**
 * 分类状态映射
 */
const categoryStatusMap = {
  0: { text: '禁用', color: 'default' },
  1: { text: '启用', color: 'success' },
};

/**
 * 博物馆分类列表页面
 */
const CategoryList: React.FC = () => {
  const [selectedRowsState, setSelectedRows] = useState<MuseumsAPI.CategoryResponse[]>([]);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<MuseumsAPI.CategoryResponse>();
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();
  
  const { message } = App.useApp();

  // 权限检查
  const { hasAuth: canCreateCategory } = usePermission('museums:categories:add');
  const { hasAuth: canUpdateCategory } = usePermission('museums:categories:edit');
  const { hasAuth: canDeleteCategory } = usePermission('museums:categories:delete');
  const { hasAuth: canUpdateStatus } = usePermission('museums:categories:edit'); // 状态切换也属于编辑权限

  // ✅ 使用 useCRUD Hook 简化代码
  const {
    actionRef,
    handleDelete: crudHandleDelete,
    handleBatchDelete: crudHandleBatchDelete,
    handleStatusUpdate: crudHandleStatusUpdate,
  } = useCRUD<MuseumsAPI.CategoryResponse>({
    deleteAPI: async (id) => {
      const response = await deleteCategory({ id: Number(id) });
      return response;
    },
    batchDeleteAPI: async (ids) => {
      const promises = ids.map((id) => deleteCategory({ id: Number(id) }));
      await Promise.all(promises);
      return { success: true, code: 200, message: '批量删除成功', data: null, timestamp: Date.now() };
    },
    updateStatusAPI: async (id, status) => {
      const response = await updateStatus2({ id: Number(id), status });
      return response;
    },
    messages: {
      deleteSuccess: intl.formatMessage({
            id: 'pages.museumInfo.category.deleteSuccess',
            defaultMessage: '删除成功',
      }),
      statusUpdateSuccess: intl.formatMessage({
        id: 'pages.museumInfo.category.statusUpdateSuccess',
        defaultMessage: '状态更新成功',
      }),
    },
  });

  // 包装删除方法
  const handleDelete = (record: MuseumsAPI.CategoryResponse) => {
    crudHandleDelete(record.id!);
  };

  const handleBatchDelete = (selectedRows: MuseumsAPI.CategoryResponse[]) => {
    const ids = selectedRows.map((row) => row.id!);
    crudHandleBatchDelete(ids).then((success) => {
      if (success) {
        setSelectedRows([]);
      }
    });
  };

  const handleStatusChange = (record: MuseumsAPI.CategoryResponse, checked: boolean) => {
    crudHandleStatusUpdate(record.id!, checked ? 1 : 0);
  };


  /**
   * 表格列定义
   */
  const columns: ProColumns<MuseumsAPI.CategoryResponse>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.category.index',
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
        id: 'pages.museumInfo.category.name',
        defaultMessage: 'Category Name',
      }),
      dataIndex: 'name',
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
        id: 'pages.museumInfo.category.code',
        defaultMessage: 'Category Code',
      }),
      dataIndex: 'code',
      copyable: true,
      ellipsis: true,
      search: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.category.description',
        defaultMessage: 'Description',
      }),
      dataIndex: 'description',
      ellipsis: true,
      search: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.category.sortOrder',
        defaultMessage: 'Sort Order',
      }),
      dataIndex: 'sortOrder',
      search: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.category.status',
        defaultMessage: 'Status',
      }),
      dataIndex: 'status',
      width: 100,
      valueEnum: {
        0: {
          text: intl.formatMessage({
            id: 'pages.museumInfo.category.status.disabled',
            defaultMessage: 'Disabled',
          }),
          status: 'Default'
        },
        1: {
          text: intl.formatMessage({
            id: 'pages.museumInfo.category.status.enabled',
            defaultMessage: 'Enabled',
          }),
          status: 'Success'
        },
      },
      render: (_, record) => (
        <PermissionSwitch
          hasPermission={canUpdateStatus}
          checked={record.status === 1}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          onChange={(checked) => handleStatusChange(record, checked)}
          permissionName="状态切换"
        />
      ),
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.category.createAt',
        defaultMessage: 'Created At',
      }),
      dataIndex: 'createAt',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.category.actions',
        defaultMessage: 'Actions',
      }),
      valueType: 'option',
      width: 120,
      key: 'option',
      fixed: 'right',
      render: (_, record) => [
        <PermissionButton key="edit" hasPermission={canUpdateCategory} permissionName="编辑分类">
          <UpdateForm
            trigger={
              <Tooltip
                title={intl.formatMessage({
                  id: 'pages.museumInfo.category.edit',
                  defaultMessage: 'Edit',
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
        <PermissionButton key="delete" hasPermission={canDeleteCategory} permissionName="删除分类">
          <Popconfirm
            title={intl.formatMessage({
              id: 'pages.museumInfo.category.deleteConfirm',
              defaultMessage: '确定要删除这个分类吗？',
            })}
            onConfirm={() => handleDelete(record)}
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
                id: 'pages.museumInfo.category.delete',
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
      <ProTable<MuseumsAPI.CategoryResponse, any>
        headerTitle={intl.formatMessage({
          id: 'pages.museumInfo.category.title',
          defaultMessage: 'Category Management',
        })}
        actionRef={actionRef}
        skeleton={true}
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
            id: 'pages.museumInfo.category.advancedTable',
            defaultMessage: '分类列表',
          }),
        }}
        toolBarRender={() => [
          <PermissionButton key="create" hasPermission={canCreateCategory} permissionName="新建分类">
            <CreateForm reload={actionRef.current?.reload} />
          </PermissionButton>,
        ]}
        request={async (params) => {
            const { current, pageSize, ...rest } = params;
            const query = {
              page: current,
              size: pageSize,
              ...rest,
            };
            const response = await getCategoryPage({ query });
            if (response.success && response.data) {
              return {
                data: response.data.records || [],
                success: true,
                total: response.data.total || 0,
              };
            }
            return {
              data: [],
              success: false,
              total: 0,
            };
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
            <FormattedMessage id="pages.museumInfo.category.batchDeletion" defaultMessage="Batch deletion" />
          </Button>
        </FooterToolbar>
      )}

      {/* 分类详情抽屉 */}
      <Drawer
        title={intl.formatMessage(
          {
            id: 'pages.museumInfo.category.detailTitle',
            defaultMessage: 'Category Details: {name}',
          },
          { name: currentRow?.name }
        )}
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        destroyOnClose
      >
        {loadingDetail ? (
          <div style={{ padding: '50px', textAlign: 'center' }}>加载中...</div>
        ) : showDetail && currentRow ? (
          <ProDescriptions<MuseumsAPI.CategoryResponse>
            column={1}
            bordered
            size="small"
            labelStyle={{ width: '130px', fontWeight: 'bold' }}
          >
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.category.name',
                defaultMessage: 'Category Name',
              })}
            >
              {currentRow.name}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.category.code',
                defaultMessage: 'Category Code',
              })}
            >
              {currentRow.code}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.category.description',
                defaultMessage: 'Description',
              })}
            >
              {currentRow.description || '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.category.sortOrder',
                defaultMessage: 'Sort Order',
              })}
            >
              {currentRow.sortOrder || '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.category.status',
                defaultMessage: 'Status',
              })}
            >
              <Tag color={categoryStatusMap[currentRow.status as keyof typeof categoryStatusMap]?.color}>
                {categoryStatusMap[currentRow.status as keyof typeof categoryStatusMap]?.text}
              </Tag>
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.category.createAt',
                defaultMessage: 'Created At',
              })}
            >
              {currentRow.createAt ? currentRow.createAt.split('T').join(' ') : '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.category.updateAt',
                defaultMessage: 'Updated At',
              })}
            >
              {currentRow.updateAt ? currentRow.updateAt.split('T').join(' ') : '-'}
            </ProDescriptions.Item>
          </ProDescriptions>
        ) : (
          <div style={{ padding: '50px', textAlign: 'center' }}>暂无详情数据</div>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default CategoryList;
