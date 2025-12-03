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
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import dayjs from 'dayjs';
import UsersAPI from '@/services/user-service-api';
import { clientSideUploadTempAvatar } from '@/utils/userUtils';

const { Option } = Select;
const { TextArea } = Input;

// Define user response type
type UserResponse = {
  /** User ID */
  id?: number;
  /** Username */
  username?: string;
  /** Nickname */
  nickname?: string;
  /** Email */
  email?: string;
  /** Phone */
  phone?: string;
  /** Avatar */
  avatar?: string;
  /** Gender: 0-Secret, 1-Male, 2-Female */
  gender?: number;
  /** Birthday */
  birthday?: string;
  /** Status: 0-Disabled, 1-Enabled */
  status?: number;
  /** Remark */
  remark?: string;
  /** Role list */
  roles?: RoleInfo[];
};

type RoleInfo = {
  /** Role ID */
  roleId?: number;
  /** Role name */
  roleName?: string;
  /** Role code */
  roleCode?: string;
};

export type UpdateFormProps = {
  trigger?: React.ReactElement<any>;
  onOk?: () => void;
  values: Partial<UserResponse>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { onOk, values, trigger } = props;
  const intl = useIntl();
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);
  const [roleOptions, setRoleOptions] = useState<{ label: string; value: number }[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [userDetail, setUserDetail] = useState<UserResponse | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Update user request
  const { run, loading } = useRequest(UsersAPI.userController.updateUser, {
    manual: true,
    onSuccess: () => {
      message.success(
        intl.formatMessage({
          id: 'pages.museumIdentity.user.updateSuccess',
          defaultMessage: 'User updated successfully',
        }),
      );
      setOpen(false);
      onOk?.();
    },
    onError: () => {
      message.error(
        intl.formatMessage({
          id: 'pages.museumIdentity.user.updateFailed',
          defaultMessage: 'Failed to update user',
        }),
      );
    },
  });

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  // Initialize avatar URL
  useEffect(() => {
    if (values.avatar) {
      setAvatarUrl(values.avatar);
    }
  }, [values.avatar]);

  // Get user details
  const fetchUserDetail = useCallback(async () => {
    if (!values.id) {
      message.error('Invalid user ID');
      return;
    }

    setLoadingDetail(true);
    try {
      const response = await UsersAPI.userController.getUserById({ id: values.id });
      if (response.success && response.data) {
        setUserDetail(response.data);
        // Update avatar
        if (response.data.avatar) {
          setAvatarUrl(response.data.avatar);
        }
        // Set form initial values
        form.setFieldsValue({
          ...response.data,
          roleIds: response.data.roles?.map((role: any) => role.roleId) || [],
          birthday: response.data.birthday ? dayjs(response.data.birthday) : null,
        });
      } else {
        message.error('Failed to get user details');
      }
    } catch (error) {
      message.error('Failed to get user details');
      console.error('Failed to get user details:', error);
    } finally {
      setLoadingDetail(false);
    }
  }, [values.id, form]);

  // Get user details when drawer opens
  useEffect(() => {
    if (open) {
      fetchUserDetail();
    }
  }, [open, fetchUserDetail]);

  // Get role list
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await UsersAPI.roleController.getAllRoles();
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
        id: values.id,
        ...formValues,
        avatar: avatarUrl || values.avatar,
        birthday: formValues.birthday ? formValues.birthday.format('YYYY-MM-DD') : null,
      };
      
      await run(submitData);
    },
    [run, values.id, avatarUrl, values.avatar],
  );

  return (
    <>
      {trigger
        ? React.cloneElement(trigger, {
            onClick: showDrawer,
          })
        : null}
      <Drawer
        title={intl.formatMessage({
          id: 'pages.museumIdentity.user.editUser',
          defaultMessage: 'Edit User',
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
        {loadingDetail ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <span>Loading user details...</span>
          </div>
        ) : (
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
                  ]}
                >
                  <Input 
                    placeholder={intl.formatMessage({
                      id: 'pages.museumIdentity.user.form.username.placeholder',
                      defaultMessage: 'Please enter username',
                    })}
                    disabled
                  />
                </Form.Item>
              </Col>
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
            </Row>

            <Row gutter={16}>
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
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label={intl.formatMessage({
                    id: 'pages.museumIdentity.user.phone',
                    defaultMessage: 'Phone',
                  })}
                >
                  <Input 
                    placeholder={intl.formatMessage({
                      id: 'pages.museumIdentity.user.form.phone.placeholder',
                      defaultMessage: 'Please enter phone',
                    })}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
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
            </Row>

            <Row gutter={16}>
              <Col span={12}>
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
                    <Option value={-1}>
                      {intl.formatMessage({
                        id: 'pages.museumIdentity.user.status.locked',
                        defaultMessage: 'Locked',
                      })}
                    </Option>
                  </Select>
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
        )}
      </Drawer>
    </>
  );
};

export default UpdateForm;