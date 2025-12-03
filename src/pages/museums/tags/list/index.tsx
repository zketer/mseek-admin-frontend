import { getTagPage, deleteTag } from '@/services/museum-service-api/museumTagController';
import { PageContainer, ProColumns, ProTable, FooterToolbar, ProDescriptions } from '@ant-design/pro-components';
import { Button, Drawer, Tag, Tooltip, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from '@umijs/max';
import React, { useState } from 'react';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { usePermission } from '@/utils/authUtils';
import { PermissionButton } from '@/components/PermissionControl';
import { useCRUD } from '@/hooks';

/**
 * 博物馆标签列表页面
 */
const TagList: React.FC = () => {
  const [selectedRowsState, setSelectedRows] = useState<MuseumsAPI.TagResponse[]>([]);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<MuseumsAPI.TagResponse>();
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  // 权限检查
  const { hasAuth: canCreateTag } = usePermission('museums:tags:add');
  const { hasAuth: canUpdateTag } = usePermission('museums:tags:edit');
  const { hasAuth: canDeleteTag } = usePermission('museums:tags:delete');

  // ✅ 使用 useCRUD Hook 简化代码
  const {
    actionRef,
    handleDelete: crudHandleDelete,
    handleBatchDelete: crudHandleBatchDelete,
  } = useCRUD<MuseumsAPI.TagResponse>({
    deleteAPI: async (id) => {
      const response = await deleteTag({ id: Number(id) });
      return response;
    },
    batchDeleteAPI: async (ids) => {
      const promises = ids.map((id) => deleteTag({ id: Number(id) }));
      await Promise.all(promises);
      return { success: true, code: 200, message: '批量删除成功', data: null, timestamp: Date.now() };
    },
    messages: {
      deleteSuccess: intl.formatMessage({
            id: 'pages.museumInfo.tag.deleteSuccess',
            defaultMessage: '删除成功',
      }),
    },
  });

  // 包装删除方法（保持原有 API）
  const handleDelete = (record: MuseumsAPI.TagResponse) => {
    crudHandleDelete(record.id!);
  };

  const handleBatchDelete = (selectedRows: MuseumsAPI.TagResponse[]) => {
    const ids = selectedRows.map((row) => row.id!);
    crudHandleBatchDelete(ids).then((success) => {
      if (success) {
        setSelectedRows([]);
      }
    });
  };


  /**
   * 表格列定义
   */
  const columns: ProColumns<MuseumsAPI.TagResponse>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.tag.index',
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
        id: 'pages.museumInfo.tag.name',
        defaultMessage: 'Tag Name',
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
        id: 'pages.museumInfo.tag.code',
        defaultMessage: 'Tag Code',
      }),
      dataIndex: 'code',
      copyable: true,
      ellipsis: true,
      search: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.tag.description',
        defaultMessage: 'Description',
      }),
      dataIndex: 'description',
      ellipsis: true,
      search: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.tag.color',
        defaultMessage: 'Color',
      }),
      dataIndex: 'color',
      search: false,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              backgroundColor: record.color || '#000000',
              marginRight: 8,
            }}
          />
          <span>{record.color || '#000000'}</span>
        </div>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.tag.preview',
        defaultMessage: 'Preview',
      }),
      dataIndex: 'preview',
      search: false,
      render: (_, record) => (
        <Tag color={record.color || '#000000'}>{record.name}</Tag>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.tag.createAt',
        defaultMessage: 'Created At',
      }),
      dataIndex: 'createAt',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.tag.actions',
        defaultMessage: 'Actions',
      }),
      valueType: 'option',
      width: 80,
      key: 'option',
      fixed: 'right',
      render: (_, record) => [
        <PermissionButton
          key="edit"
          hasPermission={canUpdateTag}
          permissionName="编辑标签"
        >
          <UpdateForm
            trigger={
              <Tooltip
                title={intl.formatMessage({
                  id: 'pages.museumInfo.tag.edit',
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
        <PermissionButton
          key="delete"
          hasPermission={canDeleteTag}
          permissionName="删除标签"
        >
          <Popconfirm
            title={intl.formatMessage({
              id: 'pages.museumInfo.tag.deleteConfirmText',
              defaultMessage: '确定要删除这个标签吗？',
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
                id: 'pages.museumInfo.tag.delete',
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
      <ProTable<MuseumsAPI.TagResponse>
        headerTitle={intl.formatMessage({
          id: 'pages.museumInfo.tag.title',
          defaultMessage: 'Tag Management',
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
            hasPermission={canCreateTag}
            permissionName="新建标签"
          >
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
            const response = await getTagPage({ query });
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
            <FormattedMessage id="pages.museumInfo.tag.batchDeletion" defaultMessage="Batch deletion" />
          </Button>
        </FooterToolbar>
      )}

      {/* 标签详情抽屉 */}
      <Drawer
        title={intl.formatMessage(
          {
            id: 'pages.museumInfo.tag.detailDrawerTitle',
            defaultMessage: 'Tag Details: {name}',
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
          <ProDescriptions<MuseumsAPI.TagResponse>
            column={1}
            bordered
            size="small"
            labelStyle={{ width: '130px', fontWeight: 'bold' }}
          >
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.tag.name',
                defaultMessage: 'Tag Name',
              })}
            >
              {currentRow.name}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.tag.code',
                defaultMessage: 'Tag Code',
              })}
            >
              {currentRow.code}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.tag.description',
                defaultMessage: 'Description',
              })}
            >
              {currentRow.description || '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.tag.color',
                defaultMessage: 'Color',
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    backgroundColor: currentRow.color || '#000000',
                    marginRight: 8,
                  }}
                />
                <span>{currentRow.color || '#000000'}</span>
              </div>
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.tag.preview',
                defaultMessage: 'Preview',
              })}
            >
              <Tag color={currentRow.color || '#000000'}>{currentRow.name}</Tag>
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.tag.createAt',
                defaultMessage: 'Created At',
              })}
            >
              {currentRow.createAt ? currentRow.createAt.split('T').join(' ') : '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.tag.updateAt',
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

export default TagList;
