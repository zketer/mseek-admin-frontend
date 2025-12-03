import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, EyeOutlined, UserOutlined, FolderOutlined, FileOutlined, ApiOutlined, MenuOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, Tag, Space, Tree, Tooltip, Tabs, Popconfirm, App } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { usePermission } from '@/utils/authUtils';
import UsersAPI from '@/services/user-service-api';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { PermissionButton, PermissionSwitch } from '@/components/PermissionControl';
import { useCRUD } from '@/hooks';

const PermissionList: React.FC = () => {
  const intl = useIntl();
  const { message } = App.useApp();

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<UsersAPI.PermissionResponse>();
  const [selectedRowsState, setSelectedRows] = useState<UsersAPI.PermissionResponse[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all'); // all: 全部, menu: 菜单, operation: 操作, api: API
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('table'); // 表格模式或树形模式
  const [treeData, setTreeData] = useState<any[]>([]);
  const [treeLoading, setTreeLoading] = useState<boolean>(false);
  const keyToNode = useRef<Map<React.Key, UsersAPI.PermissionResponse>>(new Map());

  // 权限检查
  const { hasAuth: canCreatePermission } = usePermission('users:permissions:add');
  const { hasAuth: canUpdatePermission } = usePermission('users:permissions:edit');
  const { hasAuth: canDeletePermission } = usePermission('users:permissions:delete');

  // ✅ 使用 useCRUD Hook 简化代码
  const {
    actionRef,
    handleDelete: crudHandleDelete,
    handleBatchDelete: crudHandleBatchDelete,
    handleStatusUpdate: crudHandleStatusUpdate,
  } = useCRUD<UsersAPI.PermissionResponse>({
    deleteAPI: async (id) => {
      const response = await UsersAPI.permissionController.deletePermission({ id: Number(id) });
      // 类型适配：确保 code 有默认值
      return { ...response, code: response.code ?? 200 } as any;
    },
    batchDeleteAPI: async (ids) => {
      // 批量删除需要逐个调用删除接口
      const promises = ids.map((id) => UsersAPI.permissionController.deletePermission({ id: Number(id) }));
      await Promise.all(promises);
      return { success: true, code: 200, message: '批量删除成功', data: null, timestamp: Date.now() };
    },
    updateStatusAPI: async (id, status) => {
      const response = await UsersAPI.permissionController.updatePermissionStatus({
        id: Number(id),
        status,
      });
      // 类型适配：确保 code 有默认值
      return { ...response, code: response.code ?? 200 } as any;
    },
    messages: {
      deleteSuccess: intl.formatMessage({
        id: 'pages.museumIdentity.permission.deleteSuccess',
        defaultMessage: 'Deleted successfully and will refresh soon',
      }),
      statusUpdateSuccess: intl.formatMessage({
        id: 'pages.museumIdentity.permission.statusUpdateSuccess',
        defaultMessage: '状态更新成功',
      }),
    },
  });

  // 将activeTab转换为permissionType数值
  const getPermissionType = (tab: string): number => {
    switch (tab) {
      case 'all': return 0;
      case 'menu': return 1;
      case 'operation': return 2;
      case 'api': return 3;
      default: return 0;
    }
  };


  // 加载权限树（懒加载）
  const loadTreeData = useCallback(async () => {
    if (viewMode !== 'tree') return;
    setTreeLoading(true);
    try {
      let res;

      const permissionType = getPermissionType(activeTab);
      // 根据权限类型选择不同的接口
      if (permissionType === 0) {
        // 显示全部类型，使用按类型分组的接口
        res = await UsersAPI.permissionController.getPermissionTreeByType();
      } else {
        // 显示特定类型，使用带类型参数的接口
        res = await UsersAPI.permissionController.getPermissionTree({
          permissionType: permissionType
        });
      }

      const data = res.data || [];

      // 构建 antd Tree 数据
      keyToNode.current.clear();
      const buildTree = (items: UsersAPI.PermissionResponse[]): any[] =>
        (items || []).map((p) => {
          keyToNode.current.set(p.id as React.Key, p);

          // 判断是否为类型分组节点
          const isTypeGroup = p.id === -1 || p.id === -2 || p.id === -3;

          return {
            key: p.id,
            title: (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <Space size={8}>
                {p.permissionType === 1 && <MenuOutlined />}
                {p.permissionType === 2 && <FileOutlined />}
                {p.permissionType === 3 && <ApiOutlined />}
                <Tooltip title={p.permissionCode}>
                  <span style={{ fontWeight: isTypeGroup ? 'bold' : 'normal' }}>
                    {p.permissionName}
                  </span>
                </Tooltip>
                <Tag color={p.status === 1 ? 'success' : 'default'}>
                  {p.status === 1
                    ? intl.formatMessage({ id: 'pages.museumIdentity.permission.status.active', defaultMessage: 'Active' })
                    : intl.formatMessage({ id: 'pages.museumIdentity.permission.status.inactive', defaultMessage: 'Inactive' })}
                </Tag>
              </Space>
              
              {/* 操作按钮（仅对真实权限节点显示，不对类型分组节点显示） */}
              {!isTypeGroup && (
                <Space size={4}>
                  <Tooltip
                    title={intl.formatMessage({
                      id: 'pages.museumIdentity.permission.view',
                      defaultMessage: '查看详情',
                    })}
                  >
                    <Button
                      type="link"
                      size="small"
                      icon={<EyeOutlined />}
                      style={{ padding: 0 }}
                      onClick={(e) => {
                        e.stopPropagation(); // 阻止事件冒泡
                        setCurrentRow(p);
                        setShowDetail(true);
                      }}
                    />
                  </Tooltip>
                  
                  {canUpdatePermission && (
                    <Tooltip
                      title={intl.formatMessage({
                        id: 'pages.museumIdentity.permission.edit',
                        defaultMessage: '编辑',
                      })}
                    >
                      <UpdateForm
                        trigger={
                          <Button
                            type="link"
                            size="small"
                            icon={<EditOutlined />}
                            style={{ padding: 0 }}
                            onClick={(e) => e.stopPropagation()} // 阻止事件冒泡
                          />
                        }
                        values={p}
                        reload={async () => {
                          return handleReload();
                        }}
                        permissionType={getPermissionType(activeTab) === 0 ? undefined : getPermissionType(activeTab)}
                      />
                    </Tooltip>
                  )}
                  
                  {canDeletePermission && (
                    <Tooltip
                      title={intl.formatMessage({
                        id: 'pages.museumIdentity.permission.delete',
                        defaultMessage: '删除',
                      })}
                    >
                      <Popconfirm
                        title={intl.formatMessage({
                          id: 'pages.museumIdentity.permission.deleteConfirm',
                          defaultMessage: '确定要删除这个权限吗？',
                        })}
                        onConfirm={async (e) => {
                          e?.stopPropagation(); // 阻止事件冒泡
                          const success = await crudHandleDelete(p.id!);
                          if (success && viewMode === 'tree') {
                            await loadTreeData();
                          }
                        }}
                        onCancel={(e) => e?.stopPropagation()} // 阻止事件冒泡
                      >
                        <Button
                          type="link"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          style={{ padding: 0 }}
                          onClick={(e) => e.stopPropagation()} // 阻止事件冒泡
                        />
                      </Popconfirm>
                    </Tooltip>
                  )}
                </Space>
              )}
            </div>
            ),
            children: p.children ? buildTree(p.children) : undefined,
            isLeaf: !p.children || p.children.length === 0,
          };
        });

      setTreeData(buildTree(data));
    } catch (error) {
      message.error('加载权限树失败');
    } finally {
      setTreeLoading(false);
    }
  }, [viewMode, activeTab, intl, message]);

  // 懒加载子节点
  const onLoadData = useCallback(async (treeNode: any): Promise<void> => {
    if (treeNode.children && treeNode.children.length > 0) {
      return;
    }

    try {
      const permissionType = getPermissionType(activeTab);
      const res = await UsersAPI.permissionController.getPermissionsByParentId({
        parentId: treeNode.key,
        permissionType: permissionType > 0 ? permissionType : undefined,
      });
      const children = res.data || [];

      const newChildren = children.map((child: UsersAPI.PermissionResponse) => {
        keyToNode.current.set(child.id as React.Key, child);
        return {
          key: child.id,
          title: (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <Space size={8}>
                {child.permissionType === 1 && <MenuOutlined />}
                {child.permissionType === 2 && <FileOutlined />}
                {child.permissionType === 3 && <ApiOutlined />}
                <Tooltip title={child.permissionCode}>
                  <span>{child.permissionName}</span>
                </Tooltip>
                <Tag color={child.status === 1 ? 'success' : 'default'}>
                  {child.status === 1
                    ? intl.formatMessage({ id: 'pages.museumIdentity.permission.status.active', defaultMessage: 'Active' })
                    : intl.formatMessage({ id: 'pages.museumIdentity.permission.status.inactive', defaultMessage: 'Inactive' })}
                </Tag>
              </Space>
              
              {/* 操作按钮 */}
              <Space size={4}>
                <Tooltip
                  title={intl.formatMessage({
                    id: 'pages.museumIdentity.permission.view',
                    defaultMessage: '查看详情',
                  })}
                >
                  <Button
                    type="link"
                    size="small"
                    icon={<EyeOutlined />}
                    style={{ padding: 0 }}
                    onClick={(e) => {
                      e.stopPropagation(); // 阻止事件冒泡
                      setCurrentRow(child);
                      setShowDetail(true);
                    }}
                  />
                </Tooltip>
                
                <Tooltip
                  title={intl.formatMessage({
                    id: 'pages.museumIdentity.permission.edit',
                    defaultMessage: '编辑',
                  })}
                >
                  <UpdateForm
                    trigger={
                      <Button
                        type="link"
                        size="small"
                        icon={<EditOutlined />}
                        style={{ padding: 0 }}
                        onClick={(e) => e.stopPropagation()} // 阻止事件冒泡
                      />
                    }
                    values={child}
                    reload={async () => {
                      return handleReload();
                    }}
                    permissionType={getPermissionType(activeTab) === 0 ? undefined : getPermissionType(activeTab)}
                  />
                </Tooltip>
                
                <Tooltip
                  title={intl.formatMessage({
                    id: 'pages.museumIdentity.permission.delete',
                    defaultMessage: '删除',
                  })}
                >
                  <Popconfirm
                    title={intl.formatMessage({
                      id: 'pages.museumIdentity.permission.deleteConfirm',
                      defaultMessage: '确定要删除这个权限吗？',
                    })}
                    onConfirm={async (e) => {
                      e?.stopPropagation(); // 阻止事件冒泡
                      const success = await crudHandleDelete(child.id!);
                      if (success && viewMode === 'tree') {
                        await loadTreeData();
                      }
                    }}
                    onCancel={(e) => e?.stopPropagation()} // 阻止事件冒泡
                  >
                    <Button
                      type="link"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      style={{ padding: 0 }}
                      onClick={(e) => e.stopPropagation()} // 阻止事件冒泡
                    />
                  </Popconfirm>
                </Tooltip>
              </Space>
            </div>
          ),
          isLeaf: true, // 假设子节点都是叶子节点，如果需要继续懒加载可以改为 false
        };
      });

      // 更新树数据
      const updateTreeData = (nodes: any[], targetKey: React.Key, newChildren: any[]): any[] => {
        return nodes.map(node => {
          if (node.key === targetKey) {
            return { ...node, children: newChildren };
          }
          if (node.children) {
            return { ...node, children: updateTreeData(node.children, targetKey, newChildren) };
          }
          return node;
        });
      };

      setTreeData(prevData => updateTreeData(prevData, treeNode.key, newChildren));
    } catch (error) {
      message.error('加载子节点失败');
    }
  }, [activeTab, intl, message]);

  // 当权限类型或视图模式变化时，重新加载树数据
  useEffect(() => {
    loadTreeData();
  }, [loadTreeData]);

  // 创建一个稳定的 reload 函数
  const handleReload = useCallback(async () => {
    if (viewMode === 'table') {
      await actionRef.current?.reload?.();
    } else {
      await loadTreeData();
    }
  }, [viewMode, loadTreeData]);

  const columns: ProColumns<UsersAPI.PermissionResponse>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.museumIdentity.permission.index',
        defaultMessage: 'No.',
      }),
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
      hideInSearch: true,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumIdentity.permission.name',
        defaultMessage: 'Permission Name',
      }),
      dataIndex: 'permissionName',
      render: (dom, entity) => {
        return (
          <a
            onClick={async () => {
              if (!entity.id) {
                message.error(
                  intl.formatMessage({
                    id: 'pages.museumIdentity.permission.invalidPermissionId',
                    defaultMessage: '权限ID无效',
                  })
                );
                return;
              }
              
              setLoadingDetail(true);
              setShowDetail(true);
              
              try {
                // Call API to get permission details
                const response = await UsersAPI.permissionController.getPermissionById({ id: entity.id });
                if (response.success && response.data) {
                  setCurrentRow(response.data);
                } else {
                  message.error(
                    intl.formatMessage({
                      id: 'pages.museumIdentity.permission.getPermissionDetailFailed',
                      defaultMessage: '获取权限详情失败',
                    })
                  );
                  setShowDetail(false);
                }
              } catch (error) {
                message.error(
                  intl.formatMessage({
                    id: 'pages.museumIdentity.permission.getPermissionDetailFailed',
                    defaultMessage: '获取权限详情失败',
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
        id: 'pages.museumIdentity.permission.code',
        defaultMessage: 'Permission Code',
      }),
      dataIndex: 'permissionCode',
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumIdentity.permission.type',
        defaultMessage: 'Permission Type',
      }),
      dataIndex: 'permissionType',
      hideInSearch: true,
      valueEnum: {
        1: {
          text: intl.formatMessage({
            id: 'pages.museumIdentity.permission.type.menu',
            defaultMessage: 'Menu',
          }),
        },
        2: {
          text: intl.formatMessage({
            id: 'pages.museumIdentity.permission.type.operation',
            defaultMessage: 'Operation',
          }),
        },
        3: {
          text: intl.formatMessage({
            id: 'pages.museumIdentity.permission.type.api',
            defaultMessage: 'API',
          }),
        },
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumIdentity.permission.description',
        defaultMessage: 'Description',
      }),
      dataIndex: 'description',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumIdentity.permission.status',
        defaultMessage: 'Status',
      }),
      dataIndex: 'status',
      hideInForm: true,
      initialValue: 'all',
      filters: true,
      onFilter: true,
      valueEnum: {
        all: { text: intl.formatMessage({ id: 'pages.museumIdentity.permission.status.all', defaultMessage: '全部' }), status: 'Default' },
        '0': {
          text: intl.formatMessage({ id: 'pages.museumIdentity.permission.status.disabled', defaultMessage: '禁用' }),
          status: 'Error',
        },
        '1': {
          text: intl.formatMessage({ id: 'pages.museumIdentity.permission.status.enabled', defaultMessage: '启用' }),
          status: 'Success',
        },
      },
      render: (_, record) => (
        <PermissionSwitch
          hasPermission={canUpdatePermission ?? false}
          checked={record.status === 1}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          onChange={(checked: boolean) => crudHandleStatusUpdate(record.id!, checked ? 1 : 0)}
          permissionName="权限状态切换"
        />
      ),
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumIdentity.permission.createAt',
        defaultMessage: 'Created At',
      }),
      dataIndex: 'createAt',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumIdentity.permission.updateAt',
        defaultMessage: 'Updated At',
      }),
      dataIndex: 'updateAt',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumIdentity.permission.actions',
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
            hasPermission={canUpdatePermission ?? false}
            permissionName="编辑权限"
          >
            <UpdateForm
              trigger={
                <Tooltip 
                  title={intl.formatMessage({
                    id: 'pages.museumIdentity.permission.edit',
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
              values={{
                ...record,
                permissionType: record.permissionType,
              }}
            />
          </PermissionButton>
        );

        // 删除按钮 - 统一样式，使用PermissionButton
        actions.push(
          <PermissionButton
            key="delete"
            hasPermission={canDeletePermission ?? false}
            permissionName="删除权限"
          >
            <Tooltip
              title={intl.formatMessage({
                id: 'pages.museumIdentity.permission.delete',
                defaultMessage: '删除',
              })}
            >
              <Popconfirm
                title={intl.formatMessage({
                  id: 'pages.museumIdentity.permission.deleteConfirm',
                  defaultMessage: '确定要删除这个权限吗？',
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
   * 批量删除权限
   */
  const handleRemove = useCallback(
    async (selectedRows: UsersAPI.PermissionResponse[]) => {
      if (!selectedRows?.length) {
        message.warning(intl.formatMessage({
          id: 'pages.museumIdentity.permission.pleaseSelectDelete',
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
    <PageContainer
      extra={[
        <Space.Compact key="view-mode">
          <Button
            type={viewMode === 'table' ? 'primary' : 'default'}
            onClick={() => setViewMode('table')}
          >
            表格视图
          </Button>
          <Button
            type={viewMode === 'tree' ? 'primary' : 'default'}
            onClick={() => setViewMode('tree')}
          >
            树形视图
          </Button>
        </Space.Compact>
      ]}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'all',
            label: (
              <span>
                <FolderOutlined />
                {intl.formatMessage({
                  id: 'pages.museumIdentity.permission.type.all',
                  defaultMessage: 'All',
                })}
              </span>
            ),
          },
          {
            key: 'menu',
            label: (
              <span>
                <MenuOutlined />
                {intl.formatMessage({
                  id: 'pages.museumIdentity.permission.type.menu',
                  defaultMessage: 'Menu',
                })}
              </span>
            ),
          },
          {
            key: 'operation',
            label: (
              <span>
                <FileOutlined />
                {intl.formatMessage({
                  id: 'pages.museumIdentity.permission.type.operation',
                  defaultMessage: 'Operation',
                })}
              </span>
            ),
          },
          {
            key: 'api',
            label: (
              <span>
                <ApiOutlined />
                {intl.formatMessage({
                  id: 'pages.museumIdentity.permission.type.api',
                  defaultMessage: 'API',
                })}
              </span>
            ),
          },
        ]}
      />
      {viewMode === 'table' ? (
        <ProTable<UsersAPI.PermissionResponse, any>
          headerTitle={intl.formatMessage({
            id: 'pages.museumIdentity.permission.title',
            defaultMessage: '权限列表',
          })}
          actionRef={actionRef}
          rowKey="id"
          params={{
            activeTab: activeTab,
          }}
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
              hasPermission={canCreatePermission ?? false}
              permissionName="新建权限"
            >
              <CreateForm 
                reload={async () => { 
                  return actionRef.current?.reload?.() || Promise.resolve(); 
                }} 
                permissionType={getPermissionType(activeTab) === 0 ? undefined : getPermissionType(activeTab)} 
              />
            </PermissionButton>,
          ]}
          request={async (params, sorter, filter) => {
            try {
              // 从params中获取activeTab，保持和用户列表、角色列表一致的逻辑
              const currentActiveTab = params.activeTab || 'all';
              const permissionType = getPermissionType(currentActiveTab);
              
              const queryParams = {
                pageNum: params.current || 1,
                pageSize: params.pageSize || 10,
                permissionName: params.permissionName,
                permissionCode: params.permissionCode,
                status: params.status === 'all' ? undefined : (params.status ? parseInt(params.status) : undefined),
                permissionType: permissionType > 0 ? permissionType : undefined,
                orderBy: 'createAt',
                orderDirection: 'desc',
              };
              
              const response = await UsersAPI.permissionController.getPermissionPage({
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
                  id: 'pages.museumIdentity.permission.getPermissionListFailed',
                  defaultMessage: '获取权限列表失败',
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
      ) : (
        <div style={{ background: '#fff', padding: 24, minHeight: 600 }}>
          <div style={{ marginBottom: 16 }}>
            <PermissionButton
              hasPermission={canCreatePermission ?? false}
              permissionName="新建权限"
            >
              <CreateForm 
                reload={handleReload} 
                permissionType={getPermissionType(activeTab) === 0 ? undefined : getPermissionType(activeTab)} 
              />
            </PermissionButton>
          </div>
          <Tree
            showLine
            loadData={onLoadData}
            treeData={treeData}
            onSelect={() => {
              // 不处理选择事件，详情查看通过眼睛图标按钮完成
            }}
            style={{ background: '#fff' }}
          />
        </div>
      )}
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
            <FormattedMessage id="pages.museumIdentity.permission.batchDeletion" defaultMessage="Batch deletion" />
          </Button>
        </FooterToolbar>
      )}

      <Drawer
        title={intl.formatMessage({
          id: 'pages.museumIdentity.permission.permissionDetail',
          defaultMessage: '权限详情',
        })}
        width={600}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        open={showDetail}
        destroyOnClose
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
          <ProDescriptions
            column={1}
            bordered
            size="small"
            labelStyle={{ width: '130px', fontWeight: 'bold' }}
          >
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumIdentity.permission.name',
                defaultMessage: 'Permission Name',
              })}
            >
              {currentRow.permissionName || 
                intl.formatMessage({
                  id: 'pages.museumIdentity.permission.noPermissionDetail',
                  defaultMessage: '暂无权限详情',
                })
              }
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumIdentity.permission.code',
                defaultMessage: 'Permission Code',
              })}
            >
              {currentRow.permissionCode || '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumIdentity.permission.type',
                defaultMessage: 'Permission Type',
              })}
            >
              {currentRow.permissionType === 1
                ? intl.formatMessage({
                    id: 'pages.museumIdentity.permission.type.menu',
                    defaultMessage: 'Menu',
                  })
                : currentRow.permissionType === 2
                ? intl.formatMessage({
                    id: 'pages.museumIdentity.permission.type.operation',
                    defaultMessage: 'Operation',
                  })
                : intl.formatMessage({
                    id: 'pages.museumIdentity.permission.type.api',
                    defaultMessage: 'API',
                  })
              }
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumIdentity.permission.status',
                defaultMessage: 'Status',
              })}
            >
              <Tag color={currentRow.status === 1 ? 'success' : 'default'}>
                {currentRow.status === 1
                  ? intl.formatMessage({
                      id: 'pages.museumIdentity.permission.status.active',
                      defaultMessage: 'Active',
                    })
                  : intl.formatMessage({
                      id: 'pages.museumIdentity.permission.status.inactive',
                      defaultMessage: 'Inactive',
                    })
                }
              </Tag>
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumIdentity.permission.createAt',
                defaultMessage: 'Created',
              })}
            >
              {currentRow.createAt ? currentRow.createAt.split('T').join(' ') : '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumIdentity.permission.updateAt',
                defaultMessage: 'Updated',
              })}
            >
              {currentRow.updateAt ? currentRow.updateAt.split('T').join(' ') : '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumIdentity.permission.createBy',
                defaultMessage: 'Created By',
              })}
            >
              {currentRow.createBy || '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumIdentity.permission.updateBy',
                defaultMessage: 'Updated By',
              })}
            >
              {currentRow.updateBy || '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumIdentity.permission.description',
                defaultMessage: 'Description',
              })}
              span={2}
            >
              {currentRow.description || 
                intl.formatMessage({
                  id: 'pages.museumIdentity.permission.noDescription',
                  defaultMessage: '暂无描述',
                })
              }
            </ProDescriptions.Item>
          </ProDescriptions>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <span>
              {intl.formatMessage({
                id: 'pages.museumIdentity.permission.noPermissionDetail',
                defaultMessage: '暂无权限详情',
              })}
            </span>
          </div>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default PermissionList;
