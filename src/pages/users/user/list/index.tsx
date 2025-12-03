import { EllipsisOutlined, PlusOutlined, SearchOutlined, UserOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
// 暂时屏蔽导入导出相关图标
// import { ExportOutlined, ImportOutlined, DownloadOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, Tag, App, Avatar, Row, Col, Popconfirm, Tooltip } from 'antd';
// 暂时屏蔽导入导出相关组件
// import { Dropdown, Upload } from 'antd';
import React, { useState, useCallback } from 'react';
import { usePermission } from '@/utils/authUtils';
import UsersAPI from '@/services/user-service-api';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { PermissionButton, PermissionSwitch } from '@/components/PermissionControl';
import { useCRUD } from '@/hooks';

const UserList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<UsersAPI.UserResponse>();
  const [selectedRowsState, setSelectedRows] = useState<UsersAPI.UserResponse[]>([]);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  // 暂时屏蔽导入导出相关状态
  // const [importing, setImporting] = useState<boolean>(false);
  // const [exporting, setExporting] = useState<boolean>(false);

  const { message } = App.useApp();
  const intl = useIntl();

  // 权限检查
  const { hasAuth: canCreateUser } = usePermission('users:list:add');
  const { hasAuth: canUpdateUser } = usePermission('users:list:edit');
  const { hasAuth: canDeleteUser } = usePermission('users:list:delete');
  const { hasAuth: canUpdateStatus } = usePermission('users:list:status');

  // ✅ 使用 useCRUD Hook 简化代码
  const {
    actionRef,
    handleDelete: crudHandleDelete,
    handleBatchDelete: crudHandleBatchDelete,
    handleStatusUpdate: crudHandleStatusUpdate,
  } = useCRUD<UsersAPI.UserResponse>({
    deleteAPI: async (id) => {
      const response = await UsersAPI.userController.deleteUser({ id: Number(id) });
      return response;
    },
    batchDeleteAPI: async (ids) => {
      const response = await UsersAPI.userController.deleteBatchUsers(ids.map(Number));
      return response;
    },
    updateStatusAPI: async (id, status) => {
      const response = await UsersAPI.userController.updateUserStatus({
        id: Number(id),
        status,
      });
      return response;
    },
    messages: {
      deleteSuccess: intl.formatMessage({
        id: 'pages.user.deleteSuccess',
        defaultMessage: 'Deleted successfully',
      }),
      statusUpdateSuccess: intl.formatMessage({
        id: 'pages.user.statusUpdateSuccess',
        defaultMessage: '状态更新成功',
      }),
    },
  });

  // 暂时屏蔽导入导出功能
  // // 处理批量导出
  // const handleExport = async () => {
  //   setExporting(true);
  //   try {
  //     const params = actionRef.current?.pageInfo || {};
  //     const query = {
  //       current: (params as any)?.current || 1,
  //       pageSize: (params as any)?.pageSize || 20,
  //       ...params,
  //     };
  //     
  //     // 调用导出接口
  //     const response = await fetch('/api/v1/users/export?' + new URLSearchParams(query).toString(), {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': localStorage.getItem('token') || '',
  //       },
  //     });
  //     
  //     if (response.ok) {
  //       const blob = await response.blob();
  //       const url = window.URL.createObjectURL(blob);
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = `用户数据_${new Date().toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '_')}.xlsx`;
  //       document.body.appendChild(a);
  //       a.click();
  //       window.URL.revokeObjectURL(url);
  //       document.body.removeChild(a);
  //       
  //       message.success(
  //         intl.formatMessage({
  //           id: 'pages.museumIdentity.user.exportSuccess',
  //           defaultMessage: '导出成功',
  //         })
  //       );
  //     } else {
  //       throw new Error('Export failed');
  //     }
  //   } catch (error) {
  //     message.error(
  //       intl.formatMessage({
  //         id: 'pages.museumIdentity.user.exportFailed',
  //         defaultMessage: '导出失败',
  //       })
  //     );
  //   } finally {
  //     setExporting(false);
  //   }
  // };

  // // 处理文件导入
  // const handleImport = async (file: File) => {
  //   setImporting(true);
  //   try {
  //     const formData = new FormData();
  //     formData.append('file', file);
  //     
  //     const result = await UsersAPI.userController.importUsers(formData);
  //     
  //     message.success(
  //       intl.formatMessage({
  //         id: 'pages.museumIdentity.user.importSuccess',
  //         defaultMessage: '导入成功：{successCount} 条记录，失败：{errorCount} 条',
  //       }, {
  //         successCount: (result as any)?.successCount || 0,
  //         errorCount: (result as any)?.errorCount || 0,
  //       })
  //     );
  //     
  //     // 刷新表格
  //     actionRef.current?.reload();
  //     
  //     // 如果有错误信息，显示详细信息
  //     if ((result as any)?.errorMessages && (result as any).errorMessages.length > 0) {
  //       console.warn('Import errors:', (result as any).errorMessages);
  //     }
  //     
  //   } catch (error) {
  //     message.error(
  //       intl.formatMessage({
  //         id: 'pages.museumIdentity.user.importFailed', 
  //         defaultMessage: '导入失败，请检查文件格式',
  //       })
  //     );
  //   } finally {
  //     setImporting(false);
  //   }
  //   return false; // 阻止自动上传
  // };

  // // 下载导入模板
  // const handleDownloadTemplate = async () => {
  //   try {
  //     const response = await fetch('/api/v1/users/template', {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': localStorage.getItem('token') || '',
  //       },
  //     });
  //     
  //     if (response.ok) {
  //       const blob = await response.blob();
  //       const url = window.URL.createObjectURL(blob);
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = '用户导入模板.xlsx';
  //       document.body.appendChild(a);
  //       a.click();
  //       window.URL.revokeObjectURL(url);
  //       document.body.removeChild(a);
  //       
  //       message.success(
  //         intl.formatMessage({
  //           id: 'pages.museumIdentity.user.templateDownloadSuccess',
  //           defaultMessage: '模板下载成功',
  //         })
  //       );
  //     } else {
  //       throw new Error('Download template failed');
  //     }
  //   } catch (error) {
  //     message.error(
  //       intl.formatMessage({
  //         id: 'pages.museumIdentity.user.templateDownloadFailed',
  //         defaultMessage: '模板下载失败',
  //       })
  //     );
  //   }
  // };

  const columns: ProColumns<UsersAPI.UserResponse>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.museumIdentity.user.index',
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
        id: 'pages.museumIdentity.user.username',
        defaultMessage: '用户名',
      }),
      dataIndex: 'username',
      render: (dom, entity) => {
        return (
          <a
            onClick={async () => {
              if (!entity.id) {
                message.error(
                  intl.formatMessage({
                    id: 'pages.museumIdentity.user.invalidUserId',
                    defaultMessage: '用户ID无效',
                  })
                );
                return;
              }
              
              setLoadingDetail(true);
              setShowDetail(true);
              
              try {
                // Call API to get user details
                const response = await UsersAPI.userController.getUserById({ id: entity.id });
                if (response.success && response.data) {
                  setCurrentRow(response.data);
                } else {
                  message.error(
                    intl.formatMessage({
                      id: 'pages.museumIdentity.user.getUserDetailFailed',
                      defaultMessage: '获取用户详情失败',
                    })
                  );
                  setShowDetail(false);
                }
              } catch (error) {
                message.error(
                  intl.formatMessage({
                    id: 'pages.museumIdentity.user.getUserDetailFailed',
                    defaultMessage: '获取用户详情失败',
                  })
                );
                setShowDetail(false);
                console.error('Failed to get user details:', error);
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
        id: 'pages.museumIdentity.user.nickname',
        defaultMessage: '昵称',
      }),
      dataIndex: 'nickname',
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumIdentity.user.email',
        defaultMessage: '邮箱',
      }),
      dataIndex: 'email',
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumIdentity.user.phone',
        defaultMessage: '电话',
      }),
      dataIndex: 'phone',
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumIdentity.user.roles',
        defaultMessage: 'Roles',
      }),
      dataIndex: 'roles',
      hideInSearch: true,
      render: (_, record) => (
        <>
          {record.roles?.map((role: any) => (
            <Tag color="blue" key={role.id || role.roleId}>
              {role.name || role.roleName || role.displayName}
              </Tag>
          )) || (
            <span style={{ color: '#999' }}>
              {intl.formatMessage({
                id: 'pages.museumIdentity.user.noRoles',
                defaultMessage: 'No roles',
              })}
            </span>
          )}
        </>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumIdentity.user.status',
        defaultMessage: '状态',
      }),
      dataIndex: 'status',
      hideInForm: true,
      initialValue: 'all',
      filters: true,
      onFilter: true,
      valueEnum: {
        all: { text: intl.formatMessage({ id: 'pages.museumIdentity.user.status.all', defaultMessage: '全部' }), status: 'Default' },
        '0': {
          text: intl.formatMessage({ id: 'pages.museumIdentity.user.status.disabled', defaultMessage: '禁用' }),
          status: 'Error',
        },
        '1': {
          text: intl.formatMessage({ id: 'pages.museumIdentity.user.status.enabled', defaultMessage: '启用' }),
          status: 'Success',
        },
      },
      render: (_, record) => (
        <PermissionSwitch
          hasPermission={canUpdateStatus}
          checked={record.status === 1}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          onChange={(checked) => crudHandleStatusUpdate(record.id!, checked ? 1 : 0)}
          permissionName="用户状态切换"
        />
      ),
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumIdentity.user.createAt',
        defaultMessage: 'Created At',
      }),
      sorter: true,
      dataIndex: 'createAt',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumIdentity.user.updateAt',
        defaultMessage: 'Updated At',
      }),
      sorter: true,
      dataIndex: 'updateAt',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumIdentity.user.actions',
        defaultMessage: '操作',
      }),
      width: 80,
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => {
        const actions = [];

        // 编辑按钮 - 统一样式，使用PermissionButton
        actions.push(
          <PermissionButton
            key="edit"
            hasPermission={canUpdateUser}
            permissionName="编辑用户"
          >
            <UpdateForm
              trigger={
                <Tooltip 
                  title={intl.formatMessage({
                    id: 'pages.museumIdentity.user.edit',
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
              onOk={() => actionRef.current?.reload()}
              values={record}
            />
          </PermissionButton>
        );

        // 删除按钮 - 统一样式，使用PermissionButton
        actions.push(
          <PermissionButton
            key="delete"
            hasPermission={canDeleteUser}
            permissionName="删除用户"
          >
            <Tooltip
              title={intl.formatMessage({
                id: 'pages.museumIdentity.user.delete',
                defaultMessage: '删除',
              })}
            >
              <Popconfirm
                title={intl.formatMessage({
                  id: 'pages.museumIdentity.user.deleteUserConfirm',
                  defaultMessage: '确定要删除这个用户吗？',
                })}
                onConfirm={async () => {
                  try {
                    await UsersAPI.userController.deleteUser({ id: record.id! });
                    message.success(
                      intl.formatMessage({
                        id: 'pages.museumIdentity.user.deleteSuccess',
                        defaultMessage: '删除成功',
                      })
                    );
                    actionRef.current?.reload();
                  } catch (error) {
                    message.error(
                      intl.formatMessage({
                        id: 'pages.museumIdentity.user.deleteFailed',
                        defaultMessage: '删除失败',
                      })
                    );
                  }
                }}
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

  return (
    <PageContainer>
      <ProTable<UsersAPI.UserResponse, any>
        headerTitle={intl.formatMessage({
          id: 'pages.museumIdentity.user.title',
          defaultMessage: 'Identity Vault',
        })}
        actionRef={actionRef}
        skeleton={true}
        rowKey="id"
        search={{
          labelWidth: 120,
          layout: 'vertical',
          defaultCollapsed: true,
        }}
        request={async (params, sorter, filter) => {
          try {
          const queryParams = {
              pageNum: params.current || 1,
              pageSize: params.pageSize || 10,
              username: params.username,
              nickname: params.nickname,
              email: params.email,
              phone: params.phone,
              status: params.status === 'all' ? undefined : (params.status ? parseInt(params.status) : undefined),
              orderBy: 'createAt',
              orderDirection: 'desc',
            };
            
            const response = await UsersAPI.userController.getUserPage({
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
                id: 'pages.museumIdentity.user.getUserListFailed',
                defaultMessage: 'Failed to get user list',
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
                defaultMessage: '{start}-{end} of {total} items',
              },
              {
                start: range[0],
                end: range[1],
                total: total,
              }
            ),
        }}
        scroll={{ x: 1200 }}
        dateFormatter="string"
        toolbar={{
          title: intl.formatMessage({
            id: 'pages.museumIdentity.user.advancedTable',
            defaultMessage: 'User List',
          }),
        }}
        toolBarRender={() => [
          <PermissionButton key="create" hasPermission={canCreateUser} permissionName="新建用户">
            <CreateForm 
              reload={async () => { 
                return actionRef.current?.reload?.() || Promise.resolve(); 
              }} 
            />
          </PermissionButton>,
          // 暂时屏蔽导入导出功能
          // <Dropdown
          //   key="menu"
          //   menu={{
          //     items: [
          //       {
          //         label: (
          //           <span>
          //             <ExportOutlined style={{ marginRight: 8 }} />
          //             {intl.formatMessage({
          //               id: 'pages.museumIdentity.user.exportUsers',
          //               defaultMessage: '导出用户',
          //             })}
          //           </span>
          //         ),
          //         key: 'export',
          //       },
          //       {
          //         label: (
          //           <Upload
          //             accept=".xlsx,.xls"
          //             showUploadList={false}
          //             beforeUpload={handleImport}
          //             disabled={importing}
          //             style={{ width: '100%', display: 'block' }}
          //           >
          //             <span style={{ cursor: 'pointer', display: 'block', width: '100%' }}>
          //               <ImportOutlined style={{ marginRight: 8 }} />
          //               {importing 
          //                 ? intl.formatMessage({
          //                     id: 'pages.museumIdentity.user.importing',
          //                     defaultMessage: '正在导入...',
          //                   })
          //                 : intl.formatMessage({
          //                     id: 'pages.museumIdentity.user.importUsers',
          //                     defaultMessage: '导入用户',
          //                   })
          //               }
          //             </span>
          //           </Upload>
          //         ),
          //         key: 'import',
          //       },
          //       {
          //         label: (
          //           <span>
          //             <DownloadOutlined style={{ marginRight: 8 }} />
          //             {intl.formatMessage({
          //               id: 'pages.museumIdentity.user.downloadTemplate',
          //               defaultMessage: '下载模板',
          //             })}
          //           </span>
          //         ),
          //         key: 'template',
          //       },
          //     ],
          //     onClick: ({ key }) => {
          //       switch (key) {
          //         case 'export':
          //           handleExport();
          //           break;
          //         case 'template':
          //           handleDownloadTemplate();
          //           break;
          //         // import 通过 Upload 组件处理
          //         default:
          //           break;
          //       }
          //     },
          //   }}
          // >
          //   <Button loading={exporting}>
          //     <EllipsisOutlined />
          //   </Button>
          // </Dropdown>,
        ]}
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
              &nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              const ids = selectedRowsState.map((row) => row.id!);
              const success = await crudHandleBatchDelete(ids);
              if (success) {
                setSelectedRows([]);
              }
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          {/* 暂时屏蔽批量审批功能 */}
          {/* <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button> */}
        </FooterToolbar>
      )}
      <Drawer
        title={intl.formatMessage({
          id: 'pages.museumIdentity.user.userDetail',
          defaultMessage: 'User Detail',
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
                defaultMessage: 'Loading...',
              })}
            </span>
          </div>
        ) : currentRow ? (
          <div style={{ padding: '20px 0' }}>
            {/* User avatar and basic info */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              {currentRow.avatar ? (
                <Avatar size={80} src={currentRow.avatar} />
              ) : (
                <Avatar size={80} icon={<UserOutlined />} />
              )}
              <h2 style={{ margin: '16px 0 8px' }}>{currentRow.username}</h2>
              <p style={{ color: '#666', margin: 0 }}>
                {currentRow.nickname || intl.formatMessage({
                  id: 'pages.museumIdentity.user.noNickname', 
                  defaultMessage: '暂无昵称',
                })}
              </p>
            </div>
            
            {/* User Details */}
            <ProDescriptions
            column={1}
            bordered
            size="small"
            labelStyle={{ width: '130px', fontWeight: 'bold' }}
          >
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumIdentity.user.username',
                  defaultMessage: '用户名',
              })}
            >
              {currentRow.username}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumIdentity.user.email',
                  defaultMessage: '邮箱',
              })}
            >
                {currentRow.email || '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumIdentity.user.phone',
                  defaultMessage: '电话',
              })}
            >
                {currentRow.phone || '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumIdentity.user.gender',
                  defaultMessage: '性别',
                })}
              >
                {currentRow.gender === 1 ? intl.formatMessage({
                id: 'pages.museumIdentity.user.gender.male',
                  defaultMessage: '男',
                }) : currentRow.gender === 2 ? intl.formatMessage({
                id: 'pages.museumIdentity.user.gender.female',
                  defaultMessage: '女',
                }) : intl.formatMessage({
                  id: 'pages.museumIdentity.user.gender.secret',
                  defaultMessage: '保密',
              })}
            </ProDescriptions.Item>
              <ProDescriptions.Item
                label={intl.formatMessage({
                  id: 'pages.museumIdentity.user.birthday',
                  defaultMessage: '生日',
                })}
              >
                {currentRow.birthday || '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumIdentity.user.status',
                  defaultMessage: '状态',
                })}
              >
                <Tag color={currentRow.status === 1 ? 'green' : currentRow.status === -1 ? 'orange' : 'red'}>
                  {currentRow.status === 1 ? intl.formatMessage({
                    id: 'pages.museumIdentity.user.status.enabled',
                    defaultMessage: '启用',
                  }) : currentRow.status === -1 ? intl.formatMessage({
                    id: 'pages.museumIdentity.user.status.locked',
                    defaultMessage: '锁定',
                  }) : intl.formatMessage({
                    id: 'pages.museumIdentity.user.status.disabled',
                    defaultMessage: '禁用',
                  })}
                </Tag>
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumIdentity.user.roles',
                  defaultMessage: '角色',
                })}
                span={2}
              >
                {currentRow.roles?.map((role: any) => (
                  <Tag color="blue" key={role.id || role.roleId} style={{ marginBottom: '4px', marginRight: '8px' }}>
                    {role.name || role.roleName || role.displayName}
                    </Tag>
                )) || (
                  <span style={{ color: '#999' }}>
                    {intl.formatMessage({
                      id: 'pages.museumIdentity.user.noRoles',
                      defaultMessage: '暂无角色',
                    })}
                  </span>
              )}
            </ProDescriptions.Item>
              {currentRow.remark && (
            <ProDescriptions.Item
              label={intl.formatMessage({
                    id: 'pages.museumIdentity.user.remark',
                    defaultMessage: '备注',
              })}
                  span={2}
            >
                  {currentRow.remark}
            </ProDescriptions.Item>
              )}
            <ProDescriptions.Item
              label={intl.formatMessage({
                  id: 'pages.museumIdentity.user.createAt',
                  defaultMessage: '创建',
              })}
            >
                {currentRow.createAt || '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                  id: 'pages.museumIdentity.user.updateAt',
                  defaultMessage: '更新',
              })}
            >
                {currentRow.updateAt || '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                  id: 'pages.museumIdentity.user.lastLoginTime',
                  defaultMessage: '最后登录',
              })}
            >
                {currentRow.lastLoginTime || '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumIdentity.user.loginCount',
                  defaultMessage: '登录次数',
              })}
            >
                {currentRow.loginCount || 0}
            </ProDescriptions.Item>
            </ProDescriptions>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <span>
              {intl.formatMessage({
                id: 'pages.museumIdentity.user.noUserDetail',
                defaultMessage: '暂无用户详情',
              })}
            </span>
          </div>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default UserList;