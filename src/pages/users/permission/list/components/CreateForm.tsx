import { PlusOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, Col, Drawer, Form, Input, Row, Select, Space, TreeSelect, message } from 'antd';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import UsersAPI from '@/services/user-service-api';

const { TextArea } = Input;

interface CreateFormProps {
  reload?: () => Promise<void>;
  permissionType?: number;
}

const CreateForm: FC<CreateFormProps> = (props) => {
  const { reload, permissionType } = props;
  
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [parentTreeData, setParentTreeData] = useState<Array<{ title: string; value: number; key: number }>>([]);
  const intl = useIntl();

  const { run, loading } = useRequest(UsersAPI.permissionController.createPermission, {
    manual: true,
    onSuccess: () => {
      message.success(intl.formatMessage({
        id: 'pages.museumIdentity.permission.addSuccess',
        defaultMessage: '权限创建成功',
      }));
      form.resetFields();
      setOpen(false);
      reload?.();
    },
    onError: () => {
      message.error(intl.formatMessage({
        id: 'pages.museumIdentity.permission.addFailed',
        defaultMessage: '权限创建失败',
      }));
    },
  });

  // 加载父权限树数据
  useEffect(() => {
    const loadParentTreeData = async () => {
      try {
        const res = await UsersAPI.permissionController.getPermissionTree({});
        
        // 转换数据格式以适应 TreeSelect
        const buildTreeData = (items: any[]): any[] => {
          return items.map((item: any) => ({
            title: item.permissionName,
            value: item.id,
            key: item.id,
            children: item.children ? buildTreeData(item.children) : undefined,
          }));
        };
        
        setParentTreeData(buildTreeData(res.data || []));
      } catch (error) {
        console.error('加载父权限树数据失败:', error);
      }
    };

    loadParentTreeData();
  }, []);

  // 设置默认值
  useEffect(() => {
    if (permissionType && open) {
      form.setFieldsValue({
        permissionType: permissionType.toString(),
        status: 1, // 默认启用
      });
    }
  }, [permissionType, open, form]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    form.resetFields();
    setOpen(false);
  };

  const handleFinish = async (values: any) => {
    try {
      const formData = {
        ...values,
        permissionType: parseInt(values.permissionType),
        status: values.status || 1,
      };
      await run(formData);
    } catch (error) {
      console.error('权限创建失败:', error);
    }
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
        <FormattedMessage 
          id="pages.museumIdentity.permission.newPermission" 
          defaultMessage="新建权限" 
        />
      </Button>
      
      <Drawer
        title={intl.formatMessage({
          id: 'pages.museumIdentity.permission.newPermission',
          defaultMessage: '新建权限',
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
              <FormattedMessage id="pages.common.cancel" defaultMessage="取消" />
            </Button>
            <Button onClick={() => form.submit()} type="primary" loading={loading}>
              <FormattedMessage id="pages.common.submit" defaultMessage="提交" />
            </Button>
          </Space>
        }
      >
        <Form 
          form={form}
          layout="vertical" 
          hideRequiredMark 
          onFinish={handleFinish}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="permissionName"
                label={intl.formatMessage({
                  id: 'pages.museumIdentity.permission.name',
                  defaultMessage: '权限名称',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.museumIdentity.permission.form.name.required',
                      defaultMessage: '请输入权限名称',
                    }),
                  },
                ]}
              >
                <Input placeholder={intl.formatMessage({
                  id: 'pages.museumIdentity.permission.form.name.placeholder',
                  defaultMessage: '请输入权限名称',
                })} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="permissionCode"
                label={intl.formatMessage({
                  id: 'pages.museumIdentity.permission.code',
                  defaultMessage: '权限编码',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.museumIdentity.permission.form.code.required',
                      defaultMessage: '请输入权限编码',
                    }),
                  },
                ]}
              >
                <Input placeholder={intl.formatMessage({
                  id: 'pages.museumIdentity.permission.form.code.placeholder',
                  defaultMessage: '请输入权限编码',
                })} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="permissionType"
                label={intl.formatMessage({
                  id: 'pages.museumIdentity.permission.type',
                  defaultMessage: '权限类型',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.museumIdentity.permission.form.type.required',
                      defaultMessage: '请选择权限类型',
                    }),
                  },
                ]}
              >
                <Select 
                  disabled={!!permissionType}
                  placeholder={intl.formatMessage({
                    id: 'pages.museumIdentity.permission.form.type.placeholder',
                    defaultMessage: '请选择权限类型',
                  })}
                >
                  <Select.Option value="1">
                    {intl.formatMessage({
                      id: 'pages.museumIdentity.permission.type.menu',
                      defaultMessage: '菜单',
                    })}
                  </Select.Option>
                  <Select.Option value="2">
                    {intl.formatMessage({
                      id: 'pages.museumIdentity.permission.type.operation',
                      defaultMessage: '操作',
                    })}
                  </Select.Option>
                  <Select.Option value="3">
                    {intl.formatMessage({
                      id: 'pages.museumIdentity.permission.type.api',
                      defaultMessage: '接口',
                    })}
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="parentId"
                label={intl.formatMessage({
                  id: 'pages.museumIdentity.permission.parentId',
                  defaultMessage: '父权限',
                })}
              >
                <TreeSelect
                  treeData={parentTreeData}
                  placeholder={intl.formatMessage({
                    id: 'pages.museumIdentity.permission.form.parentId.placeholder',
                    defaultMessage: '请选择父权限',
                  })}
                  showSearch
                  treeDefaultExpandAll
                  allowClear
                  treeNodeFilterProp="title"
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label={intl.formatMessage({
                  id: 'pages.museumIdentity.permission.status',
                  defaultMessage: '状态',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.museumIdentity.permission.form.status.required',
                      defaultMessage: '请选择状态',
                    }),
                  },
                ]}
              >
                <Select placeholder={intl.formatMessage({
                  id: 'pages.museumIdentity.permission.form.status.placeholder',
                  defaultMessage: '请选择状态',
                })}>
                  <Select.Option value={1}>
                    {intl.formatMessage({
                      id: 'pages.museumIdentity.permission.status.active',
                      defaultMessage: '启用',
                    })}
                  </Select.Option>
                  <Select.Option value={0}>
                    {intl.formatMessage({
                      id: 'pages.museumIdentity.permission.status.inactive',
                      defaultMessage: '禁用',
                    })}
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label={intl.formatMessage({
                  id: 'pages.museumIdentity.permission.description',
                  defaultMessage: '描述',
                })}
              >
                <TextArea 
                  rows={4} 
                  placeholder={intl.formatMessage({
                    id: 'pages.museumIdentity.permission.form.description.placeholder',
                    defaultMessage: '请输入权限描述',
                  })} 
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