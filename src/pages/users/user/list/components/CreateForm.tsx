import React, { useState, useCallback, useEffect } from 'react';
import { 
  Button, 
  Col, 
  DatePicker, 
  Drawer, 
  Form, 
  Input, 
  Row, 
  Select, 
  Space, 
  Upload, 
  Avatar, 
  message 
} from 'antd';
import { PlusOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { ActionType } from '@ant-design/pro-components';
import UsersAPI from '@/services/user-service-api';
import { clientSideUploadTempAvatar } from '@/utils/userUtils';

const { Option } = Select;
const { TextArea } = Input;

interface CreateFormProps {
  reload?: ActionType['reload'];
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { reload } = props;
  const intl = useIntl();
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);
  const [roleOptions, setRoleOptions] = useState<{ label: string; value: number }[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Create user request
  const { run, loading } = useRequest(UsersAPI.userController.createUser, {
    manual: true,
    onSuccess: () => {
      message.success(
        intl.formatMessage({
          id: 'pages.museumIdentity.user.createSuccess',
          defaultMessage: 'User created successfully',
        }),
      );
      setOpen(false);
      form.resetFields();
      setAvatarUrl(undefined);
      setFileList([]);
      reload?.();
    },
    onError: () => {
      message.error(
        intl.formatMessage({
          id: 'pages.museumIdentity.user.createFailed',
          defaultMessage: 'Failed to create user',
        }),
      );
    },
  });

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    form.resetFields();
    setAvatarUrl(undefined);
    setFileList([]);
  };

  // Get role list
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await UsersAPI.roleController.getEnabledRoles();
        if (response?.success && Array.isArray(response.data)) {
          const options = response.data.map((role: UsersAPI.RoleResponse) => ({
            label: role.roleName || '',
            value: role.id || 0,
          }));
          setRoleOptions(options);
        } else {
          console.error('Invalid response format:', response);
        }
      } catch (error) {
        console.error('Failed to load role data:', error);
      }
    };

    fetchRoles();
  }, []);

  // Avatar upload handling
  const handleAvatarChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const customUpload = async ({ file }: any) => {
    try {
      const avatarBase64 = await clientSideUploadTempAvatar(file);
      setAvatarUrl(avatarBase64);
      message.success(
        intl.formatMessage({
          id: 'pages.museumIdentity.user.uploadSuccess',
          defaultMessage: 'Avatar uploaded successfully',
        }),
      );
    } catch (error: any) {
      message.error(
        error.message ||
          intl.formatMessage({
            id: 'pages.museumIdentity.user.uploadFailed',
            defaultMessage: 'Failed to upload avatar',
          }),
      );
    }
  };

  // Form submission
  const onFinish = useCallback(
    async (formValues: any) => {
      const submitData = {
        ...formValues,
        avatar: avatarUrl,
        birthday: formValues.birthday ? formValues.birthday.format('YYYY-MM-DD') : null,
      };
      
      await run(submitData);
    },
    [run, avatarUrl],
  );

  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
        {intl.formatMessage({
          id: 'pages.museumIdentity.user.newUser',
          defaultMessage: 'New User',
        })}
      </Button>
      <Drawer
        title={intl.formatMessage({
          id: 'pages.museumIdentity.user.createUser',
          defaultMessage: 'Create a new user',
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
                defaultMessage: 'Cancel',
              })}
            </Button>
            <Button 
              onClick={() => form.submit()} 
              type="primary" 
              loading={loading}
            >
              {intl.formatMessage({
                id: 'pages.common.submit',
                defaultMessage: 'Submit',
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
          {/* Avatar upload */}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label={intl.formatMessage({
                  id: 'pages.museumIdentity.user.avatar',
                  defaultMessage: 'Avatar',
                })}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {avatarUrl ? (
                    <Avatar size={64} src={avatarUrl} />
                  ) : (
                    <Avatar size={64} icon={<UserOutlined />} />
                  )}
                  <Upload
                    fileList={fileList}
                    onChange={handleAvatarChange}
                    customRequest={customUpload}
                    showUploadList={false}
                    accept="image/*"
                  >
                    <Button
                      icon={<UploadOutlined />}
                      style={{ marginLeft: '16px' }}
                    >
                      {intl.formatMessage({
                        id: 'pages.museumIdentity.user.uploadAvatar',
                        defaultMessage: 'Upload Avatar',
                      })}
                    </Button>
                  </Upload>
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label={intl.formatMessage({
                  id: 'pages.museumIdentity.user.username',
                  defaultMessage: 'Username',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.museumIdentity.user.form.username.required',
                      defaultMessage: 'Please enter username',
                    }),
                  },
                  {
                    min: 3,
                    max: 20,
                    message: intl.formatMessage({
                      id: 'pages.museumIdentity.user.form.username.length',
                      defaultMessage: 'Username must be 3-20 characters',
                    }),
                  },
                ]}
              >
                <Input 
                  placeholder={intl.formatMessage({
                    id: 'pages.museumIdentity.user.form.username.placeholder',
                    defaultMessage: 'Please enter username',
                  })}
                  autoComplete="off"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="password"
                label={intl.formatMessage({
                  id: 'pages.museumIdentity.user.password',
                  defaultMessage: 'Password',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.museumIdentity.user.form.password.required',
                      defaultMessage: 'Please enter password',
                    }),
                  },
                  {
                    min: 6,
                    message: intl.formatMessage({
                      id: 'pages.museumIdentity.user.form.password.length',
                      defaultMessage: 'Password must be at least 6 characters',
                    }),
                  },
                ]}
              >
                <Input.Password 
                  placeholder={intl.formatMessage({
                    id: 'pages.museumIdentity.user.form.password.placeholder',
                    defaultMessage: 'Please enter password',
                  })}
                  autoComplete="new-password"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="nickname"
                label={intl.formatMessage({
                  id: 'pages.museumIdentity.user.nickname',
                  defaultMessage: 'Nickname',
                })}
              >
                <Input 
                  placeholder={intl.formatMessage({
                    id: 'pages.museumIdentity.user.form.nickname.placeholder',
                    defaultMessage: 'Please enter nickname',
                  })}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label={intl.formatMessage({
                  id: 'pages.museumIdentity.user.email',
                  defaultMessage: 'Email',
                })}
                rules={[
                  {
                    type: 'email',
                    message: intl.formatMessage({
                      id: 'pages.museumIdentity.user.form.email.format',
                      defaultMessage: 'Please enter a valid email',
                    }),
                  },
                ]}
              >
                <Input 
                  placeholder={intl.formatMessage({
                    id: 'pages.museumIdentity.user.form.email.placeholder',
                    defaultMessage: 'Please enter email',
                  })}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label={intl.formatMessage({
                  id: 'pages.museumIdentity.user.phone',
                  defaultMessage: 'Phone',
                })}
                rules={[
                  {
                    pattern: /^1[3-9]\d{9}$/,
                    message: intl.formatMessage({
                      id: 'pages.museumIdentity.user.form.phone.format',
                      defaultMessage: 'Please enter a valid phone number',
                    }),
                  },
                ]}
              >
                <Input 
                  placeholder={intl.formatMessage({
                    id: 'pages.museumIdentity.user.form.phone.placeholder',
                    defaultMessage: 'Please enter phone',
                  })}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gender"
                label={intl.formatMessage({
                  id: 'pages.museumIdentity.user.gender',
                  defaultMessage: 'Gender',
                })}
              >
                <Select 
                  placeholder={intl.formatMessage({
                    id: 'pages.museumIdentity.user.form.gender.placeholder',
                    defaultMessage: 'Please select gender',
                  })}
                >
                  <Option value={0}>
                    {intl.formatMessage({
                      id: 'pages.museumIdentity.user.gender.secret',
                      defaultMessage: 'Secret',
                    })}
                  </Option>
                  <Option value={1}>
                    {intl.formatMessage({
                      id: 'pages.museumIdentity.user.gender.male',
                      defaultMessage: 'Male',
                    })}
                  </Option>
                  <Option value={2}>
                    {intl.formatMessage({
                      id: 'pages.museumIdentity.user.gender.female',
                      defaultMessage: 'Female',
                    })}
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="birthday"
                label={intl.formatMessage({
                  id: 'pages.museumIdentity.user.birthday',
                  defaultMessage: 'Birthday',
                })}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  placeholder={intl.formatMessage({
                    id: 'pages.museumIdentity.user.form.birthday.placeholder',
                    defaultMessage: 'Please select birthday',
                  })}
                  getPopupContainer={(trigger) => trigger.parentElement!}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label={intl.formatMessage({
                  id: 'pages.museumIdentity.user.status',
                  defaultMessage: 'Status',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.museumIdentity.user.form.status.required',
                      defaultMessage: 'Please select a status',
                    }),
                  },
                ]}
                initialValue={1}
              >
                <Select 
                  placeholder={intl.formatMessage({
                    id: 'pages.museumIdentity.user.form.status.placeholder',
                    defaultMessage: 'Please select status',
                  })}
                >
                  <Option value={0}>
                    {intl.formatMessage({
                      id: 'pages.museumIdentity.user.status.inactive',
                      defaultMessage: 'Inactive',
                    })}
                  </Option>
                  <Option value={1}>
                    {intl.formatMessage({
                      id: 'pages.museumIdentity.user.status.active',
                      defaultMessage: 'Active',
                    })}
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="roleIds"
                label={intl.formatMessage({
                  id: 'pages.museumIdentity.user.roles',
                  defaultMessage: 'Roles',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.museumIdentity.user.form.roles.required',
                      defaultMessage: 'Please select roles',
                    }),
                  },
                ]}
              >
                <Select 
                  mode="multiple"
                  placeholder={intl.formatMessage({
                    id: 'pages.museumIdentity.user.form.roles.placeholder',
                    defaultMessage: 'Please select roles',
                  })}
                  options={roleOptions}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="remark"
                label={intl.formatMessage({
                  id: 'pages.museumIdentity.user.remark',
                  defaultMessage: 'Remark',
                })}
              >
                <TextArea 
                  rows={4} 
                  placeholder={intl.formatMessage({
                    id: 'pages.museumIdentity.user.form.remark.placeholder',
                    defaultMessage: 'Please enter remark',
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