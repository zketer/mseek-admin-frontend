import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Upload, Avatar, message, Row, Col, DatePicker, Modal, Tabs } from 'antd';
import { UserOutlined, UploadOutlined, LockOutlined } from '@ant-design/icons';
import { useModel, useIntl, history } from '@umijs/max';
import type { DatePickerProps } from 'antd';
import type { Dayjs } from 'dayjs';
import { getUserProfile, updateUserProfile, uploadAvatarBase64, changePassword } from '@/services/user-service-api/userController';
import { convertImageToBase64 } from '@/utils/imageUtils';
import type { UserInfo } from '@/types/user';

const ProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const { initialState, setInitialState } = useModel('@@initialState');
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (initialState?.currentUser) {
      fetchUserInfo();
    }
  }, [initialState?.currentUser]);

  const fetchUserInfo = async () => {
    try {
      // 确保用户ID存在 - 使用userid字段
      const userId = initialState?.currentUser?.userid;
      if (!userId) {
        message.error(intl.formatMessage({
          id: 'profile.fetch.noUser',
          defaultMessage: '用户ID不存在',
        }));
        return;
      }
      
      // 确保id是数字类型
      const response = await getUserProfile({ id: Number(userId) });
      if (response.code === 200 && response.data) {
        setCurrentUser(response.data as UserInfo);
        form.setFieldsValue({
          username: response.data.username,
          nickname: response.data.nickname,
          email: response.data.email,
          phone: response.data.phone,
          gender: response.data.gender,
          birthday: response.data.birthday,
        });
      }
    } catch (error) {
      message.error(intl.formatMessage({
        id: 'profile.fetch.error',
        defaultMessage: '获取用户信息失败',
      }));
    }
  };

  const handleAvatarChange = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      message.error(intl.formatMessage({
        id: 'profile.avatar.invalid',
        defaultMessage: '请选择图片文件',
      }));
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error(intl.formatMessage({
        id: 'profile.avatar.size',
        defaultMessage: '图片大小不能超过2MB',
      }));
      return false;
    }

    try {
      setAvatarLoading(true);
      const base64 = await convertImageToBase64(file);
      
      // 确保用户ID存在 - 使用userid字段
      const userId = currentUser?.id || initialState?.currentUser?.userid;
      if (!userId) {
        message.error(intl.formatMessage({
          id: 'profile.avatar.noUser',
          defaultMessage: '用户ID不存在',
        }));
        return false;
      }
      
      const response = await uploadAvatarBase64(
        { id: String(userId) },
        { avatar: base64 }
      );

      if (response.code === 200) {
        message.success(intl.formatMessage({
          id: 'profile.avatar.success',
          defaultMessage: '头像上传成功',
        }));
        
        // 更新本地用户信息
        const updatedUser = { ...currentUser!, avatar: response.data };
        setCurrentUser(updatedUser);
        
        // 更新全局状态
        if (initialState?.currentUser) {
          setInitialState({
            ...initialState,
            currentUser: { ...initialState.currentUser, avatar: response.data }
          });
        }
      }
    } catch (error) {
      message.error(intl.formatMessage({
        id: 'profile.avatar.error',
        defaultMessage: '头像上传失败',
      }));
    } finally {
      setAvatarLoading(false);
    }

    return false; // 阻止自动上传
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      // 确保用户ID存在 - 使用userid字段
      const userId = currentUser?.id || initialState?.currentUser?.userid;
      if (!userId) {
        message.error(intl.formatMessage({
          id: 'profile.update.noUser',
          defaultMessage: '用户ID不存在',
        }));
        return;
      }
      
      const response = await updateUserProfile(
        { id: Number(userId) },
        values
      );

      if (response.code === 200) {
        message.success(intl.formatMessage({
          id: 'profile.update.success',
          defaultMessage: '个人资料更新成功',
        }));
        
        // 更新本地用户信息
        const updatedUser = { ...currentUser!, ...values };
        setCurrentUser(updatedUser);
        
        // 更新全局状态
        if (initialState?.currentUser) {
          setInitialState({
            ...initialState,
            currentUser: { ...initialState.currentUser, ...values }
          });
        }
      }
    } catch (error) {
      message.error(intl.formatMessage({
        id: 'profile.update.error',
        defaultMessage: '个人资料更新失败',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values: any) => {
    try {
      setPasswordLoading(true);

      // 确保用户ID存在 - 使用userid字段
      const userId = currentUser?.id || initialState?.currentUser?.userid;
      if (!userId) {
        message.error(intl.formatMessage({
          id: 'profile.password.noUser',
          defaultMessage: '用户ID不存在',
        }));
        return;
      }

      const response = await changePassword({
        id: Number(userId),
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      });

      if (response.code === 200) {
        message.success(intl.formatMessage({
          id: 'profile.password.success',
          defaultMessage: '密码修改成功',
        }));
        setPasswordModalVisible(false);
        passwordForm.resetFields();
      }
    } catch (error: any) {
      // 处理后端返回的错误信息
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error(intl.formatMessage({
          id: 'profile.password.error',
          defaultMessage: '密码修改失败',
        }));
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePasswordModalCancel = () => {
    setPasswordModalVisible(false);
    passwordForm.resetFields();
  };

  return (
    <div style={{ padding: '24px' }}>
      <style>
        {`
          .avatar-uploader .ant-upload-select {
            border: none !important;
            background: transparent !important;
          }
          .avatar-uploader .ant-upload {
            border: none !important;
            background: transparent !important;
            padding: 0 !important;
          }
        `}
      </style>
      <Card
        title={intl.formatMessage({
          id: 'profile.title',
          defaultMessage: '个人资料',
        })}
      >
        <Row gutter={24}>
          <Col xs={24} md={6}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ 
                position: 'relative', 
                display: 'inline-block',
                borderRadius: '50%',
                overflow: 'hidden'
              }}>
                <Upload
                  name="avatar"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={handleAvatarChange}
                  accept="image/*"
                  style={{ border: 'none', background: 'transparent' }}
                >
                  <div
                    onMouseEnter={(e) => {
                      const avatar = e.currentTarget.querySelector('.ant-avatar') as HTMLElement;
                      if (avatar) {
                        avatar.style.transform = 'scale(1.05)';
                        avatar.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      const avatar = e.currentTarget.querySelector('.ant-avatar') as HTMLElement;
                      if (avatar) {
                        avatar.style.transform = 'scale(1)';
                        avatar.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                      }
                    }}
                >
                  {currentUser?.avatar ? (
                    <Avatar
                      size={128}
                      src={currentUser.avatar}
                      style={{ 
                        cursor: 'pointer',
                        border: '2px solid #f0f0f0',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ) : (
                    <Avatar
                      size={128}
                      icon={<UserOutlined />}
                      style={{ 
                        cursor: 'pointer',
                        backgroundColor: '#1890ff',
                        border: '2px solid #f0f0f0',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  )}
                  </div>
                </Upload>
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    cursor: 'pointer',
                    borderRadius: '50%'
                  }}
                  onClick={() => {
                    const uploadElement = document.querySelector('.avatar-uploader input[type="file"]') as HTMLInputElement;
                    if (uploadElement) {
                      uploadElement.click();
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0';
                  }}
                >
                  <div style={{ color: 'white', textAlign: 'center' }}>
                    <UploadOutlined style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }} />
                    <span style={{ fontSize: '14px' }}>
                      {intl.formatMessage({
                        id: 'profile.avatar.hover',
                        defaultMessage: '点击更换头像',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} md={18}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                username: currentUser?.username,
                nickname: currentUser?.nickname,
                email: currentUser?.email,
                phone: currentUser?.phone,
                gender: currentUser?.gender,
                birthday: currentUser?.birthday,
              }}
            >
              <Form.Item
                label={intl.formatMessage({
                  id: 'profile.username',
                  defaultMessage: '用户名',
                })}
                name="username"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'profile.username.required',
                      defaultMessage: '请输入用户名',
                    }),
                  },
                ]}
              >
                <Input disabled />
              </Form.Item>

              <Form.Item
                label={intl.formatMessage({
                  id: 'profile.nickname',
                  defaultMessage: '昵称',
                })}
                name="nickname"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'profile.nickname.required',
                      defaultMessage: '请输入昵称',
                    }),
                  },
                ]}
              >
                <Input
                  placeholder={intl.formatMessage({
                    id: 'profile.nickname.placeholder',
                    defaultMessage: '请输入昵称',
                  })}
                />
              </Form.Item>

              <Form.Item
                label={intl.formatMessage({
                  id: 'profile.email',
                  defaultMessage: '邮箱',
                })}
                name="email"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'profile.email.required',
                      defaultMessage: '请输入邮箱',
                    }),
                  },
                  {
                    type: 'email',
                    message: intl.formatMessage({
                      id: 'profile.email.invalid',
                      defaultMessage: '请输入有效的邮箱地址',
                    }),
                  },
                ]}
              >
                <Input
                  placeholder={intl.formatMessage({
                    id: 'profile.email.placeholder',
                    defaultMessage: '请输入邮箱',
                  })}
                />
              </Form.Item>

              <Form.Item
                label={intl.formatMessage({
                  id: 'profile.phone',
                  defaultMessage: '手机号',
                })}
                name="phone"
                rules={[
                  {
                    pattern: /^1[3-9]\d{9}$/,
                    message: intl.formatMessage({
                      id: 'profile.phone.invalid',
                      defaultMessage: '请输入有效的手机号',
                    }),
                  },
                ]}
              >
                <Input
                  placeholder={intl.formatMessage({
                    id: 'profile.phone.placeholder',
                    defaultMessage: '请输入手机号',
                  })}
                />
              </Form.Item>

              <Form.Item
                label={intl.formatMessage({
                  id: 'profile.gender',
                  defaultMessage: '性别',
                })}
                name="gender"
              >
                <select style={{ width: '100%', padding: '8px', border: '1px solid #d9d9d9', borderRadius: '6px' }}>
                  <option value={0}>{intl.formatMessage({ id: 'profile.gender.unknown', defaultMessage: '未知' })}</option>
                  <option value={1}>{intl.formatMessage({ id: 'profile.gender.male', defaultMessage: '男' })}</option>
                  <option value={2}>{intl.formatMessage({ id: 'profile.gender.female', defaultMessage: '女' })}</option>
                </select>
              </Form.Item>

              <Form.Item
                label={intl.formatMessage({
                  id: 'profile.birthday',
                  defaultMessage: '生日',
                })}
                name="birthday"
              >
                <DatePicker 
                  format="YYYY-MM-DD"
                  placeholder={intl.formatMessage({
                    id: 'profile.birthday.placeholder',
                    defaultMessage: '请选择生日',
                  })}
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item>
                <div style={{ display: 'flex', gap: '16px' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  disabled={loading}
                >
                  {intl.formatMessage({
                    id: 'profile.submit',
                    defaultMessage: '保存修改',
                  })}
                </Button>
                  <Button
                    icon={<LockOutlined />}
                    onClick={() => setPasswordModalVisible(true)}
                  >
                    {intl.formatMessage({
                      id: 'profile.changePassword',
                      defaultMessage: '修改密码',
                    })}
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>

      {/* 修改密码模态框 */}
      <Modal
        title={intl.formatMessage({
          id: 'profile.changePassword',
          defaultMessage: '修改密码',
        })}
        open={passwordModalVisible}
        onCancel={handlePasswordModalCancel}
        footer={null}
        destroyOnHidden
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
          autoComplete="off"
        >
          <Form.Item
            label={intl.formatMessage({
              id: 'profile.oldPassword',
              defaultMessage: '当前密码',
            })}
            name="oldPassword"
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'profile.oldPassword.required',
                  defaultMessage: '请输入当前密码',
                }),
              },
            ]}
          >
            <Input.Password
              placeholder={intl.formatMessage({
                id: 'profile.oldPassword.placeholder',
                defaultMessage: '请输入当前密码',
              })}
            />
          </Form.Item>

          <Form.Item
            label={intl.formatMessage({
              id: 'profile.newPassword',
              defaultMessage: '新密码',
            })}
            name="newPassword"
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'profile.newPassword.required',
                  defaultMessage: '请输入新密码',
                }),
              },
              {
                min: 6,
                message: intl.formatMessage({
                  id: 'profile.newPassword.minLength',
                  defaultMessage: '密码长度至少6位',
                }),
              },
            ]}
          >
            <Input.Password
              placeholder={intl.formatMessage({
                id: 'profile.newPassword.placeholder',
                defaultMessage: '请输入新密码',
              })}
            />
          </Form.Item>

          <Form.Item
            label={intl.formatMessage({
              id: 'profile.confirmPassword',
              defaultMessage: '确认新密码',
            })}
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'profile.confirmPassword.required',
                  defaultMessage: '请确认新密码',
                }),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(intl.formatMessage({
                      id: 'profile.confirmPassword.mismatch',
                      defaultMessage: '两次输入的密码不一致',
                    }))
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder={intl.formatMessage({
                id: 'profile.confirmPassword.placeholder',
                defaultMessage: '请再次输入新密码',
              })}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button onClick={handlePasswordModalCancel}>
                {intl.formatMessage({
                  id: 'profile.cancel',
                  defaultMessage: '取消',
                })}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={passwordLoading}
                disabled={passwordLoading}
              >
                {intl.formatMessage({
                  id: 'profile.password.confirm',
                  defaultMessage: '确认修改',
                })}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage;