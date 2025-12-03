import React, { useState, useCallback, useEffect } from 'react';
import { 
  Button, 
  Col, 
  Drawer, 
  Form, 
  Input, 
  Row, 
  Select, 
  Space, 
  TreeSelect, 
  Tabs, 
  Tag, 
  message 
} from 'antd';
import { PlusOutlined, MenuOutlined, FileOutlined, ApiOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import type { ActionType } from '@ant-design/pro-components';
import UsersAPI from '@/services/user-service-api';

const { Option } = Select;
const { TextArea } = Input;

interface CreateFormProps {
  reload?: ActionType['reload'];
}

interface PermissionSelectorProps {
  value?: number[];
  onChange?: (value: number[]) => void;
  permissionTreeData: {
    menu: any[];
    operation: any[];
    api: any[];
  };
  loading?: boolean;
}

const PermissionSelector: React.FC<PermissionSelectorProps> = ({ 
  value = [], 
  onChange, 
  permissionTreeData, 
  loading = false 
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState<{
    menu: number[];
    operation: number[];
    api: number[];
  }>({
    menu: [],
    operation: [],
    api: [],
  });

  // 初始化时拆分已选权限到不同类型
  useEffect(() => {
    if (value && value.length > 0) {
      // 这里需要根据权限ID判断权限类型，暂时简化处理
      setSelectedPermissions({
        menu: value.filter(id => {
          // 简化处理：通过ID范围判断类型，实际应该查询权限详情
          return permissionTreeData.menu.some(item => findPermissionInTree(item, id));
        }),
        operation: value.filter(id => {
          return permissionTreeData.operation.some(item => findPermissionInTree(item, id));
        }),
        api: value.filter(id => {
          return permissionTreeData.api.some(item => findPermissionInTree(item, id));
        }),
      });
    }
  }, [value, permissionTreeData]);

  // 递归查找权限节点
  const findPermissionInTree = (node: any, targetId: number): boolean => {
    if (node.value === targetId) return true;
    if (node.children) {
      return node.children.some((child: any) => findPermissionInTree(child, targetId));
    }
    return false;
  };

  // 处理权限选择变化
  const handlePermissionChange = (type: 'menu' | 'operation' | 'api', selectedIds: number[]) => {
    const newSelected = {
      ...selectedPermissions,
      [type]: selectedIds,
    };
    setSelectedPermissions(newSelected);
    
    // 合并所有类型的权限
    const allSelected = [
      ...newSelected.menu,
      ...newSelected.operation,
      ...newSelected.api,
    ];
    
    onChange?.(allSelected);
  };

  return (
    <Tabs
      defaultActiveKey="menu"
      type="card"
      size="small"
      style={{ minHeight: 320 }}
      items={[
        {
          key: 'menu',
          label: (
            <span>
              <MenuOutlined style={{ color: '#1890ff' }} />
              菜单权限
              {selectedPermissions.menu.length > 0 && (
                <Tag style={{ marginLeft: 8, fontSize: '12px' }}>
                  {selectedPermissions.menu.length}
                </Tag>
              )}
            </span>
          ),
          children: (
            <TreeSelect
              value={selectedPermissions.menu}
              onChange={(values) => handlePermissionChange('menu', values)}
              treeData={permissionTreeData.menu}
              placeholder="请选择菜单权限"
              multiple
              treeCheckable
              showCheckedStrategy={TreeSelect.SHOW_PARENT}
              treeDefaultExpandAll
              loading={loading}
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
              treeNodeFilterProp="title"
              showSearch
            />
          ),
        },
        {
          key: 'operation',
          label: (
            <span>
              <FileOutlined style={{ color: '#52c41a' }} />
              操作权限
              {selectedPermissions.operation.length > 0 && (
                <Tag style={{ marginLeft: 8, fontSize: '12px' }}>
                  {selectedPermissions.operation.length}
                </Tag>
              )}
            </span>
          ),
          children: (
            <TreeSelect
              value={selectedPermissions.operation}
              onChange={(values) => handlePermissionChange('operation', values)}
              treeData={permissionTreeData.operation}
              placeholder="请选择操作权限"
              multiple
              treeCheckable
              showCheckedStrategy={TreeSelect.SHOW_PARENT}
              treeDefaultExpandAll
              loading={loading}
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
              treeNodeFilterProp="title"
              showSearch
            />
          ),
        },
        {
          key: 'api',
          label: (
            <span>
              <ApiOutlined style={{ color: '#faad14' }} />
              接口权限
              {selectedPermissions.api.length > 0 && (
                <Tag style={{ marginLeft: 8, fontSize: '12px' }}>
                  {selectedPermissions.api.length}
                </Tag>
              )}
            </span>
          ),
          children: (
            <TreeSelect
              value={selectedPermissions.api}
              onChange={(values) => handlePermissionChange('api', values)}
              treeData={permissionTreeData.api}
              placeholder="请选择接口权限"
              multiple
              treeCheckable
              showCheckedStrategy={TreeSelect.SHOW_PARENT}
              treeDefaultExpandAll
              loading={loading}
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
              treeNodeFilterProp="title"
              showSearch
            />
          ),
        },
      ]}
    />
  );
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { reload } = props;
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [permissionTreeData, setPermissionTreeData] = useState<{
    menu: any[];
    operation: any[];
    api: any[];
  }>({ menu: [], operation: [], api: [] });
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('menu');
  
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  // 获取权限类型图标
  const getPermissionTypeIcon = (type: number) => {
    switch (type) {
      case 1:
        return <MenuOutlined style={{ color: '#1890ff' }} />;
      case 2:
        return <FileOutlined style={{ color: '#52c41a' }} />;
      case 3:
        return <ApiOutlined style={{ color: '#faad14' }} />;
      default:
        return null;
    }
  };

  // 获取权限类型标签
  const getPermissionTypeTag = (type: number) => {
    switch (type) {
      case 1:
        return <Tag color="blue">菜单</Tag>;
      case 2:
        return <Tag color="green">操作</Tag>;
      case 3:
        return <Tag color="orange">接口</Tag>;
      default:
        return null;
    }
  };

  // 获取权限列表 - 直接使用后端的树形结构
  const fetchPermissions = useCallback(async () => {
    setLoadingPermissions(true);
    try {
      // 并行请求三种类型的权限树（后端已构建好父子关系）
      const [menuResponse, operationResponse, apiResponse] = await Promise.all([
        UsersAPI.permissionController.getPermissionTree({ permissionType: 1 }), // 菜单权限
        UsersAPI.permissionController.getPermissionTree({ permissionType: 2 }), // 操作权限（包含父级菜单）
        UsersAPI.permissionController.getPermissionTree({ permissionType: 3 }), // 接口权限（包含父级菜单）
      ]);
      
      if (menuResponse.success && operationResponse.success && apiResponse.success) {
        setPermissionTreeData({
          menu: formatTreeData(menuResponse.data || []),
          operation: formatTreeData(operationResponse.data || []),
          api: formatTreeData(apiResponse.data || []),
        });
      }
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
      message.error(
        intl.formatMessage({
          id: 'pages.museumIdentity.role.fetchPermissionsFailed',
          defaultMessage: '获取权限列表失败',
        })
      );
    } finally {
      setLoadingPermissions(false);
    }
  }, [intl]);

  // 格式化后端返回的树形数据为前端TreeSelect需要的格式
  const formatTreeData = (permissions: UsersAPI.PermissionResponse[]): any[] => {
    if (!permissions || permissions.length === 0) return [];
    
    return permissions.map(permission => {
      const icon = getPermissionTypeIcon(permission.permissionType!);
      const tag = getPermissionTypeTag(permission.permissionType!);
      
      const node: any = {
        title: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {icon}
            <span>{permission.permissionName}</span>
            {tag}
          </div>
        ),
        value: permission.id,
        key: permission.id,
        disabled: permission.status !== 1, // 禁用状态的权限不可选择
        permissionType: permission.permissionType,
      };
      
      // 如果是父级菜单（不是目标类型），设置为不可勾选，只用于展示层级
      // 后端的树中，如果当前节点的类型与子节点类型不同，说明这是父级菜单节点
      if (permission.children && permission.children.length > 0) {
        const firstChildType = permission.children[0]?.permissionType;
        if (firstChildType && permission.permissionType !== firstChildType) {
          // 这是父级菜单节点，设置为不可勾选
          node.checkable = false;
          node.selectable = false;
        }
        // 递归格式化子节点
        node.children = formatTreeData(permission.children);
      }
      
      return node;
    });
  };

  const { run, loading } = useRequest(UsersAPI.roleController.createRole, {
    manual: true,
    onSuccess: async (result, params) => {
      message.success(
        intl.formatMessage({
          id: 'pages.museumIdentity.role.createSuccess',
          defaultMessage: '创建成功',
        }),
      );
      
      setOpen(false);
      form.resetFields();
      reload?.();
    },
    onError: () => {
      message.error(
        intl.formatMessage({
          id: 'pages.museumIdentity.role.createFailed',
          defaultMessage: '创建失败',
        }),
      );
    },
  });

  const showDrawer = useCallback(async () => {
    setOpen(true);
    await fetchPermissions();
  }, [fetchPermissions]);

  const onClose = () => {
    setOpen(false);
    form.resetFields();
  };

  // Form submission
  const onFinish = useCallback(
    async (formValues: any) => {
      try {
        const submitData: UsersAPI.RoleCreateRequest = {
          roleName: formValues.roleName,
          roleCode: formValues.roleCode,
          description: formValues.description,
          status: formValues.status || 1, // 默认启用状态
          permissionIds: formValues.permissionIds, // 添加权限ID列表
        };
        
        // 创建角色
        const response = await UsersAPI.roleController.createRole(submitData);
        
        if (response.success && response.data) {
          message.success(
            intl.formatMessage({
              id: 'pages.museumIdentity.role.createSuccess',
              defaultMessage: '创建成功',
            }),
          );
          
          setOpen(false);
          form.resetFields();
          reload?.();
        }
      } catch (error) {
        console.error('Failed to create role:', error);
        message.error(
          intl.formatMessage({
            id: 'pages.museumIdentity.role.createFailed',
            defaultMessage: '创建失败',
          }),
        );
      }
    },
    [intl, reload, form],
  );

  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
        <FormattedMessage id="pages.museumIdentity.role.newRole" defaultMessage="新建角色" />
      </Button>
      <Drawer
        title={intl.formatMessage({
          id: 'pages.museumIdentity.role.newRole',
          defaultMessage: '新建角色',
        })}
        width={720}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>
              {intl.formatMessage({
                id: 'pages.common.cancel',
                defaultMessage: '取消',
              })}
            </Button>
            <Button onClick={() => form.submit()} type="primary" loading={loading}>
              {intl.formatMessage({
                id: 'pages.common.submit',
                defaultMessage: '提交',
              })}
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical" 
          hideRequiredMark 
          onFinish={onFinish}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="roleName"
                label={intl.formatMessage({
                  id: 'pages.museumIdentity.role.name',
                  defaultMessage: '角色名称',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.museumIdentity.role.form.name.required',
                      defaultMessage: '请输入角色名称',
                    }),
                  },
                  {
                    max: 50,
                    message: intl.formatMessage({
                      id: 'pages.museumIdentity.role.form.name.max',
                      defaultMessage: '角色名称不能超过50个字符',
                    }),
                  },
                ]}
              >
                <Input placeholder={intl.formatMessage({
                  id: 'pages.museumIdentity.role.form.name.placeholder',
                  defaultMessage: '请输入角色名称',
                })} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="roleCode"
                label={intl.formatMessage({
                  id: 'pages.museumIdentity.role.code',
                  defaultMessage: '角色编码',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.museumIdentity.role.form.code.required',
                      defaultMessage: '请输入角色编码',
                    }),
                  },
                  {
                    pattern: /^[A-Z_]+$/,
                    message: intl.formatMessage({
                      id: 'pages.museumIdentity.role.form.code.pattern',
                      defaultMessage: '角色编码只能包含大写字母和下划线',
                    }),
                  },
                  {
                    max: 50,
                    message: intl.formatMessage({
                      id: 'pages.museumIdentity.role.form.code.max',
                      defaultMessage: '角色编码不能超过50个字符',
                    }),
                  },
                ]}
              >
                <Input placeholder={intl.formatMessage({
                  id: 'pages.museumIdentity.role.form.code.placeholder',
                  defaultMessage: '请输入角色编码',
                })} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label={intl.formatMessage({
                  id: 'pages.museumIdentity.role.status',
                  defaultMessage: '状态',
                })}
                initialValue={1}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.museumIdentity.role.form.status.required',
                      defaultMessage: '请选择状态',
                    }),
                  },
                ]}
              >
                <Select placeholder={intl.formatMessage({
                  id: 'pages.museumIdentity.role.form.status.placeholder',
                  defaultMessage: '请选择状态',
                })}>
                  <Option value={1}>
                    {intl.formatMessage({
                      id: 'pages.museumIdentity.role.status.enabled',
                      defaultMessage: '启用',
                    })}
                  </Option>
                  <Option value={0}>
                    {intl.formatMessage({
                      id: 'pages.museumIdentity.role.status.disabled',
                      defaultMessage: '禁用',
                    })}
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label={intl.formatMessage({
                  id: 'pages.museumIdentity.role.description',
                  defaultMessage: '描述',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.museumIdentity.role.form.description.required',
                      defaultMessage: '请输入描述',
                    }),
                  },
                  {
                    max: 200,
                    message: intl.formatMessage({
                      id: 'pages.museumIdentity.role.form.description.max',
                      defaultMessage: '描述不能超过200个字符',
                    }),
                  },
                ]}
              >
                <TextArea 
                  rows={4} 
                  placeholder={intl.formatMessage({
                    id: 'pages.museumIdentity.role.form.description.placeholder',
                    defaultMessage: '请输入角色描述',
                  })} 
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="permissionIds"
                label={intl.formatMessage({
                  id: 'pages.museumIdentity.role.permissions',
                  defaultMessage: '权限分配',
                })}
              >
                <PermissionSelector
                  permissionTreeData={permissionTreeData}
                  loading={loadingPermissions}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};

export default CreateForm;
