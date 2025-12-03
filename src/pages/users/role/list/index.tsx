import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, Tag, App, Avatar, Popconfirm, Tooltip } from 'antd';
import React, { useCallback, useState } from 'react';
import { usePermission } from '@/utils/authUtils';
import UsersAPI from '@/services/user-service-api';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { PermissionButton, PermissionSwitch } from '@/components/PermissionControl';
import { useCRUD } from '@/hooks';

const RoleList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<UsersAPI.RoleResponse>();
  const [selectedRowsState, setSelectedRows] = useState<UsersAPI.RoleResponse[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();
  const { message } = App.useApp();

  // 权限检查
  const { hasAuth: canCreateRole } = usePermission('users:roles:add');
  const { hasAuth: canUpdateRole } = usePermission('users:roles:edit');
  const { hasAuth: canDeleteRole } = usePermission('users:roles:delete');

  // ✅ 使用 useCRUD Hook 简化代码
  const {
    actionRef,
    handleDelete: crudHandleDelete,
    handleBatchDelete: crudHandleBatchDelete,
    handleStatusUpdate: crudHandleStatusUpdate,
  } = useCRUD<UsersAPI.RoleResponse>({
    deleteAPI: async (id) => {
      const response = await UsersAPI.roleController.deleteRole({ id: Number(id) });
      return response;
    },
    batchDeleteAPI: async (ids) => {
      const response = await UsersAPI.roleController.deleteBatchRoles(ids.map(Number));
      return response;
    },
    updateStatusAPI: async (id, status) => {
      const response = await UsersAPI.roleController.updateRoleStatus({
        id: Number(id),
        status,
      });
      return response;
    },
    messages: {
      deleteSuccess: intl.formatMessage({
        id: 'pages.museumIdentity.role.deleteSuccess',
        defaultMessage: 'Deleted successfully and will refresh soon',
      }),
      statusUpdateSuccess: intl.formatMessage({
        id: 'pages.museumIdentity.role.statusUpdateSuccess',
        defaultMessage: '状态更新成功',
      }),
    },
  });

  const columns: ProColumns<UsersAPI.RoleResponse>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.museumIdentity.role.index',
        defaultMessage: 'No.',
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
        id: 'pages.museumIdentity.role.name',
        defaultMessage: 'Role Name',
      }),
      dataIndex: 'roleName',
      render: (dom, entity) => {
        return (
          <a
            onClick={async () => {
                if (!entity.id) {
                message.error(
                  intl.formatMessage({
                    id: 'pages.museumIdentity.role.invalidRoleId',
                    defaultMessage: '角色ID无效',
                  })
                );
                return;
              }
              
              setLoadingDetail(true);
              setShowDetail(true);
              
              try {
                // Call API to get role details
                const response = await UsersAPI.roleController.getRoleById({ id: entity.id });
                if (response.success && response.data) {
                  setCurrentRow(response.data);
                } else {
                  message.error(
                    intl.formatMessage({
                      id: 'pages.museumIdentity.role.getRoleDetailFailed',
                      defaultMessage: '获取角色详情失败',
                    })
                  );
                  setShowDetail(false);
                }
              } catch (error) {
                message.error(
                  intl.formatMessage({
                    id: 'pages.museumIdentity.role.getRoleDetailFailed',
                    defaultMessage: '获取角色详情失败',
                  })
                );
                setShowDetail(false);
              } finally {
                setLoadingDetail(false);
              }
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumIdentity.role.code',
        defaultMessage: 'Role Code',
      }),
      dataIndex: 'roleCode',
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumIdentity.role.description',
        defaultMessage: 'Description',
      }),
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumIdentity.role.status',
        defaultMessage: 'Status',
      }),
      dataIndex: 'status',
      hideInForm: true,
      initialValue: 'all',
      filters: true,
      onFilter: true,
      valueEnum: {
        all: { text: intl.formatMessage({ id: 'pages.museumIdentity.role.status.all', defaultMessage: '全部' }), status: 'Default' },
        '0': {
          text: intl.formatMessage({ id: 'pages.museumIdentity.role.status.disabled', defaultMessage: '禁用' }),
          status: 'Error',
        },
        '1': {
          text: intl.formatMessage({ id: 'pages.museumIdentity.role.status.enabled', defaultMessage: '启用' }),
          status: 'Success',
        },
      },
      render: (_, record) => (
        <PermissionSwitch
          hasPermission={canUpdateRole}
          checked={record.status === 1}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          onChange={(checked) => crudHandleStatusUpdate(record.id!, checked ? 1 : 0)}
          permissionName="角色状态切换"
        />
      ),
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumIdentity.role.createAt',
        defaultMessage: 'Created At',
      }),
      dataIndex: 'createAt',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumIdentity.role.updateAt',
        defaultMessage: 'Updated At',
      }),
      dataIndex: 'updateAt',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumIdentity.role.actions',
        defaultMessage: 'Actions',
      }),
      dataIndex: 'option',
      valueType: 'option',
      width: 80,
      fixed: 'right',
      render: (_, record) => {
        const actions = [];

        // 编辑按钮 - 统一样式，使用PermissionButton
        actions.push(
          <PermissionButton
            key="edit"
            hasPermission={canUpdateRole}
            permissionName="编辑角色"
          >
            <UpdateForm
              trigger={
                <Tooltip 
                  title={intl.formatMessage({
                    id: 'pages.museumIdentity.role.edit',
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
              onOk={async () => {
                return actionRef.current?.reload?.() || Promise.resolve();
              }}
              values={record}
            />
          </PermissionButton>
        );

        // 删除按钮 - 统一样式，使用PermissionButton
        actions.push(
          <PermissionButton
            key="delete"
            hasPermission={canDeleteRole}
            permissionName="删除角色"
          >
            <Tooltip
              title={intl.formatMessage({
                id: 'pages.museumIdentity.role.delete',
                defaultMessage: '删除',
              })}
            >
              <Popconfirm
                title={intl.formatMessage({
                  id: 'pages.museumIdentity.role.deleteConfirm',
                  defaultMessage: '确定要删除这个角色吗？',
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
                <Button
                  type="link"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  style={{ padding: 0 }}
                />
              </Popconfirm>
            </Tooltip>
          </PermissionButton>
        );

        return actions;
      },
    },
  ];

  /**
   * 批量删除角色
   */
  const handleRemove = useCallback(
    async (selectedRows: UsersAPI.RoleResponse[]) => {
      if (!selectedRows?.length) {
        message.warning(intl.formatMessage({
          id: 'pages.museumIdentity.role.pleaseSelectDelete',
          defaultMessage: 'Please select items to delete',
        }));
        return;
      }

      const ids = selectedRows.map((row) => row.id!);
      const success = await crudHandleBatchDelete(ids);
      if (success) {
        setSelectedRows([]);
      }
    },
    [crudHandleBatchDelete, message, intl],
  );

  return (
    <PageContainer>
      <ProTable<UsersAPI.RoleResponse, any>
        headerTitle={intl.formatMessage({
          id: 'pages.museumIdentity.role.title',
          defaultMessage: '角色列表',
        })}
        actionRef={actionRef}
        skeleton={true}
        rowKey="id"
        search={{
          labelWidth: 120,
          layout: 'vertical',
          defaultCollapsed: true,
        }}
        scroll={{ x: 1200 }}
        dateFormatter="string"
        toolBarRender={() => [
          <PermissionButton
            key="create"
            hasPermission={canCreateRole}
            permissionName="新建角色"
          >
            <CreateForm 
              reload={async () => { 
                return actionRef.current?.reload?.() || Promise.resolve(); 
              }} 
            />
          </PermissionButton>,
        ]}
        request={async (params, sorter, filter) => {
          try {
            const queryParams = {
              pageNum: params.current || 1,
              pageSize: params.pageSize || 10,
              roleName: params.roleName,
              roleCode: params.roleCode,
              status: params.status === 'all' ? undefined : (params.status ? parseInt(params.status) : undefined),
              orderBy: 'createAt',
              orderDirection: 'desc',
            };
            
            const response = await UsersAPI.roleController.getRolePage({
              query: queryParams,
            });
            
            return {
              data: response.data?.records || [],
              success: response.success,
              total: response.data?.total || 0,
            };
          } catch (error) {
            message.error(
              intl.formatMessage({
                id: 'pages.museumIdentity.role.getRoleListFailed',
                defaultMessage: '获取角色列表失败',
              })
            );
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        pagination={{
          defaultPageSize: 10,
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total, range) => 
            intl.formatMessage(
              {
                id: 'pages.common.pagination.total',
                defaultMessage: '{start}-{end} 共 {total} 条',
              },
              {
                start: range[0],
                end: range[1], 
                total: total,
              }
            ),
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
              handleRemove(selectedRowsState);
            }}
          >
            <FormattedMessage id="pages.museumIdentity.role.batchDeletion" defaultMessage="Batch deletion" />
          </Button>
        </FooterToolbar>
      )}

      <Drawer
        title={intl.formatMessage({
          id: 'pages.museumIdentity.role.roleDetail',
          defaultMessage: '角色详情',
        })}
        width={600}
        open={showDetail}
        onClose={() => {
            setCurrentRow(undefined);
            setShowDetail(false);
        }}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        {loadingDetail ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <span>
              {intl.formatMessage({
                id: 'pages.common.loading',
                defaultMessage: '加载中...',
              })}
            </span>
          </div>
        ) : currentRow ? (
          <div style={{ padding: '20px 0' }}>
            {/* Role basic info */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
              <h2 style={{ margin: '16px 0 8px' }}>{currentRow.roleName}</h2>
              <p style={{ color: '#666', margin: 0 }}>
                {currentRow.description || intl.formatMessage({
                  id: 'pages.museumIdentity.role.noDescription', 
                  defaultMessage: '暂无描述',
                })}
              </p>
            </div>
            
            {/* Role Details */}
            <ProDescriptions
            column={1}
            bordered
            size="small"
            labelStyle={{ width: '130px', fontWeight: 'bold' }}
          >
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumIdentity.role.name',
                defaultMessage: 'Role Name',
              })}
            >
              {currentRow.roleName}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumIdentity.role.code',
                defaultMessage: 'Role Code',
              })}
            >
              {currentRow.roleCode}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumIdentity.role.status',
                defaultMessage: 'Status',
              })}
            >
              <Tag color={currentRow.status === 1 ? 'success' : 'default'}>
                {currentRow.status === 1
                  ? intl.formatMessage({
                      id: 'pages.museumIdentity.role.status.active',
                      defaultMessage: 'Active',
                    })
                  : intl.formatMessage({
                      id: 'pages.museumIdentity.role.status.inactive',
                      defaultMessage: 'Inactive',
                    })
                }
              </Tag>
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumIdentity.role.createAt',
                defaultMessage: 'Created',
              })}
            >
              {currentRow.createAt ? currentRow.createAt.split('T').join(' ') : '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumIdentity.role.updateAt',
                defaultMessage: 'Updated',
              })}
            >
              {currentRow.updateAt ? currentRow.updateAt.split('T').join(' ') : '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumIdentity.role.sortOrder',
                defaultMessage: 'Sort Order',
              })}
            >
              {currentRow.sortOrder || '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumIdentity.role.remark',
                defaultMessage: 'Remark',
              })}
            >
              {currentRow.remark || '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumIdentity.role.createBy',
                defaultMessage: 'Created By',
              })}
            >
              {currentRow.createBy || '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumIdentity.role.updateBy',
                defaultMessage: 'Updated By',
              })}
            >
              {currentRow.updateBy || '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumIdentity.role.description',
                defaultMessage: 'Description',
              })}
              span={2}
            >
              {currentRow.description || '-'}
            </ProDescriptions.Item>
          </ProDescriptions>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <span>
              {intl.formatMessage({
                id: 'pages.museumIdentity.role.noRoleDetail',
                defaultMessage: '暂无角色详情',
              })}
            </span>
          </div>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default RoleList;
