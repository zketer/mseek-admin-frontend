import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, Col, Drawer, Form, Input, Row, Select, Space, TreeSelect, message } from 'antd';
import React, { cloneElement, useCallback, useState, useEffect } from 'react';
import UsersAPI from '@/services/user-service-api';

const { TextArea } = Input;

export type UpdateFormProps = {
  trigger?: React.ReactElement<any>;
  onOk?: () => Promise<void>;
  reload?: () => Promise<void>;
  values: Partial<UsersAPI.PermissionResponse>;
  permissionType?: number;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { onOk, reload, values, trigger, permissionType } = props;

  const intl = useIntl();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [parentTreeData, setParentTreeData] = useState<any[]>([]);
  const [permissionDetail, setPermissionDetail] = useState<UsersAPI.PermissionResponse | null>(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);

  const { run, loading } = useRequest(UsersAPI.permissionController.updatePermission, {
    manual: true,
    onSuccess: () => {
      message.success(intl.formatMessage({
        id: 'pages.museumIdentity.permission.updateSuccess',
        defaultMessage: '权限更新成功',
      }));
      reload?.();
      onOk?.();
      setOpen(false);
    },
    onError: () => {
      message.error(intl.formatMessage({
        id: 'pages.museumIdentity.permission.updateFailed',
        defaultMessage: '权限更新失败',
      }));
    },
  });

  const onClose = useCallback(() => {
    form.resetFields();
    setPermissionDetail(null);
    setOpen(false);
  }, [form]);

  const showDrawer = useCallback(() => {
    setOpen(true);
  }, []);

  // 获取权限详情
  const fetchPermissionDetail = useCallback(async () => {
    if (!values.id) return;
    
    setLoadingDetail(true);
    try {
      const response = await UsersAPI.permissionController.getPermissionById({ id: values.id });
      if (response.success && response.data) {
        setPermissionDetail(response.data);
        // 设置表单初始值
        form.setFieldsValue({
          ...response.data,
          permissionType: response.data.permissionType?.toString(),
        });
      }
    } catch (error) {
      console.error('获取权限详情失败:', error);
      message.error(intl.formatMessage({
        id: 'pages.museumIdentity.permission.getPermissionDetailFailed',
        defaultMessage: '获取权限详情失败',
      }));
    } finally {
      setLoadingDetail(false);
    }
  }, [values.id, form, intl]);

  // 加载父权限树数据
  const loadParentTreeData = useCallback(async () => {
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
  }, []);

  // 当抽屉打开时加载数据
  useEffect(() => {
    if (open) {
      loadParentTreeData();
      fetchPermissionDetail();
    }
  }, [open, loadParentTreeData, fetchPermissionDetail]);

  const handleFinish = async (fields: any) => {
    try {
      const formData = {
        id: values.id,
        ...fields,
        permissionType: parseInt(fields.permissionType),
      };
      await run(formData);
    } catch (error) {
      console.error('权限更新失败:', error);
    }
  };

  return (
    <>
      {trigger &&
        cloneElement(trigger, {
          onClick: showDrawer,
        } as any)}
      
      <Drawer
        title={intl.formatMessage({
          id: 'pages.museumIdentity.permission.editPermission',
          defaultMessage: '编辑权限',
        })}
        width={720}
        onClose={onClose}
        open={open}
        key={permissionDetail ? permissionDetail.id : values.id}
        destroyOnClose
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
        {loadingDetail ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <FormattedMessage id="pages.common.loading" defaultMessage="加载中..." />
          </div>
        ) : (
          <Form 
            form={form}
            layout="vertical" 
            hideRequiredMark 
            onFinish={handleFinish}
            initialValues={{
              ...permissionDetail,
              permissionType: permissionDetail?.permissionType?.toString(),
            }}
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
                  <Select placeholder={intl.formatMessage({
                    id: 'pages.museumIdentity.permission.form.type.placeholder',
                    defaultMessage: '请选择权限类型',
                  })}>
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
        )}
      </Drawer>
    </>
  );
};

export default UpdateForm;