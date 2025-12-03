import { FormattedMessage, useIntl } from '@umijs/max';
import { 
  Drawer, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Row, 
  Col, 
  Button,
  Space,
  Spin,
  App,
  Switch
} from 'antd';
import React, { cloneElement, useCallback, useState, useEffect } from 'react';
import museumInfoApi from '@/services/museum-service-api';
import dayjs from 'dayjs';

export type UpdateFormProps = {
  trigger?: React.ReactElement<any>;
  onOk?: () => void;
  values: Partial<MuseumsAPI.AnnouncementResponse>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { onOk, values, trigger } = props;

  const intl = useIntl();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { message } = App.useApp();

  // 提交表单
  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
      const formValues = await form.validateFields();
      
      // 确保数据类型正确
      const submitData = {
        ...formValues,
        status: formValues.status !== undefined ? formValues.status : values?.status || 0, // 确保status字段不为空
        priority: Number(formValues.priority), // 确保是数字类型
        enabled: formValues.enabled === true ? 1 : (formValues.enabled === false ? 0 : formValues.enabled), // 布尔值转数字
        // 日期转换为时间戳
        publishTime: formValues.publishTime ? 
          new Date(formValues.publishTime).getTime() : undefined,
        expireTime: formValues.expireTime ? 
          new Date(formValues.expireTime).getTime() : undefined,
      };
      
      await museumInfoApi.announcementController.updateAnnouncement({
        id: values?.id!,
      }, submitData);
      
      message.success(
        intl.formatMessage({
          id: 'pages.content.announcement.updateSuccess',
          defaultMessage: '更新成功',
        }),
      );
      
      form.resetFields();
      setOpen(false);
      onOk?.();
    } catch (error) {
      message.error(
        intl.formatMessage({
          id: 'pages.content.announcement.updateFailed',
          defaultMessage: '更新失败',
        }),
      );
    } finally {
      setLoading(false);
    }
  }, [form, intl, message, onOk, values?.id]);

  // 取消操作
  const handleCancel = useCallback(() => {
    form.resetFields();
    setOpen(false);
  }, [form]);

  // 设置表单初始值
  useEffect(() => {
    if (open && values) {
      form.setFieldsValue({
        ...values,
        publishTime: values.publishTime ? dayjs(values.publishTime) : undefined,
        expireTime: values.expireTime ? dayjs(values.expireTime) : undefined,
      });
    }
  }, [form, values, open]);

  return (
    <>
      {trigger && cloneElement(trigger, { onClick: () => setOpen(true) })}
      
      <Drawer
        title={intl.formatMessage({
          id: 'pages.content.announcement.updateTitle',
          defaultMessage: '编辑公告',
        })}
        width={720}
        open={open}
        onClose={handleCancel}
        destroyOnClose
        extra={
          <Space>
            <Button onClick={handleCancel}>
              <FormattedMessage id="pages.common.cancel" defaultMessage="取消" />
            </Button>
            <Button type="primary" loading={loading} onClick={handleSubmit}>
              <FormattedMessage id="pages.common.submit" defaultMessage="提交" />
            </Button>
          </Space>
        }
      >
        <Spin spinning={loading}>
        <Form form={form} layout="vertical" autoComplete="off">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="title"
                label={intl.formatMessage({
                  id: 'pages.content.announcement.title',
                  defaultMessage: '公告标题',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.content.announcement.titleRequired',
                      defaultMessage: '公告标题为必填项',
                    }),
                  },
                  {
                    max: 100,
                    message: intl.formatMessage({
                      id: 'pages.content.announcement.titleMaxLength',
                      defaultMessage: '公告标题不能超过100个字符',
                    }),
                  },
                ]}
              >
                <Input
                  placeholder={intl.formatMessage({
                    id: 'pages.content.announcement.titlePlaceholder',
                    defaultMessage: '请输入公告标题',
                  })}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label={intl.formatMessage({
                  id: 'pages.content.announcement.type',
                  defaultMessage: '公告类型',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.content.announcement.typeRequired',
                      defaultMessage: '公告类型为必填项',
                    }),
                  },
                ]}
              >
                <Select
                  placeholder={intl.formatMessage({
                    id: 'pages.content.announcement.typePlaceholder',
                    defaultMessage: '请选择公告类型',
                  })}
                >
                  <Select.Option value="general">
                    {intl.formatMessage({
                      id: 'pages.content.announcement.type.general',
                      defaultMessage: '普通公告',
                    })}
                  </Select.Option>
                  <Select.Option value="maintenance">
                    {intl.formatMessage({
                      id: 'pages.content.announcement.type.maintenance',
                      defaultMessage: '维护公告',
                    })}
                  </Select.Option>
                  <Select.Option value="activity">
                    {intl.formatMessage({
                      id: 'pages.content.announcement.type.activity',
                      defaultMessage: '活动公告',
                    })}
                  </Select.Option>
                  <Select.Option value="emergency">
                    {intl.formatMessage({
                      id: 'pages.content.announcement.type.emergency',
                      defaultMessage: '紧急公告',
                    })}
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="priority"
                label={intl.formatMessage({
                  id: 'pages.content.announcement.priority',
                  defaultMessage: '优先级',
                })}
              >
                <Select
                  placeholder={intl.formatMessage({
                    id: 'pages.content.announcement.priorityPlaceholder',
                    defaultMessage: '请选择优先级',
                  })}
                >
                  <Select.Option value={0}>
                    {intl.formatMessage({
                      id: 'pages.content.announcement.priority.low',
                      defaultMessage: '普通',
                    })}
                  </Select.Option>
                  <Select.Option value={1}>
                    {intl.formatMessage({
                      id: 'pages.content.announcement.priority.medium',
                      defaultMessage: '重要',
                    })}
                  </Select.Option>
                  <Select.Option value={2}>
                    {intl.formatMessage({
                      id: 'pages.content.announcement.priority.high',
                      defaultMessage: '紧急',
                    })}
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label={intl.formatMessage({
                  id: 'pages.content.announcement.status',
                  defaultMessage: '发布状态',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.content.announcement.statusRequired',
                      defaultMessage: '发布状态为必填项',
                    }),
                  },
                ]}
              >
                <Select
                  placeholder={intl.formatMessage({
                    id: 'pages.content.announcement.statusPlaceholder',
                    defaultMessage: '请选择发布状态',
                  })}
                >
                  <Select.Option value={0}>
                    {intl.formatMessage({
                      id: 'pages.content.announcement.status.draft',
                      defaultMessage: '草稿',
                    })}
                  </Select.Option>
                  <Select.Option value={1}>
                    {intl.formatMessage({
                      id: 'pages.content.announcement.status.published',
                      defaultMessage: '已发布',
                    })}
                  </Select.Option>
                  <Select.Option value={2}>
                    {intl.formatMessage({
                      id: 'pages.content.announcement.status.expired',
                      defaultMessage: '已过期',
                    })}
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="publishTime"
                label={intl.formatMessage({
                  id: 'pages.content.announcement.publishTime',
                  defaultMessage: '发布时间',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.content.announcement.publishTimeRequired',
                      defaultMessage: '发布时间为必填项',
                    }),
                  },
                ]}
              >
                <DatePicker
                  showTime
                  style={{ width: '100%' }}
                  placeholder={intl.formatMessage({
                    id: 'pages.content.announcement.publishTimePlaceholder',
                    defaultMessage: '请选择发布时间',
                  })}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="expireTime"
                label={intl.formatMessage({
                  id: 'pages.content.announcement.expireTime',
                  defaultMessage: '过期时间',
                })}
              >
                <DatePicker
                  showTime
                  style={{ width: '100%' }}
                  placeholder={intl.formatMessage({
                    id: 'pages.content.announcement.expireTimePlaceholder',
                    defaultMessage: '请选择过期时间',
                  })}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="content"
                label={intl.formatMessage({
                  id: 'pages.content.announcement.content',
                  defaultMessage: '公告内容',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.content.announcement.contentRequired',
                      defaultMessage: '公告内容为必填项',
                    }),
                  },
                ]}
              >
                <Input.TextArea
                  rows={6}
                  maxLength={2000}
                  showCount
                  placeholder={intl.formatMessage({
                    id: 'pages.content.announcement.contentPlaceholder',
                    defaultMessage: '请输入公告内容',
                  })}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="enabled"
                label={intl.formatMessage({
                  id: 'pages.content.announcement.enabled',
                  defaultMessage: '启用状态',
                })}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

        </Form>
        </Spin>
      </Drawer>
    </>
  );
};

export default UpdateForm;
