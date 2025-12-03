import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { 
  Button, 
  Drawer, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Row, 
  Col, 
  Space,
  Spin,
  App,
  Switch
} from 'antd';
import type { FC } from 'react';
import { useState, useCallback } from 'react';
import museumInfoApi from '@/services/museum-service-api';

interface CreateFormProps {
  reload?: ActionType['reload'];
}

const CreateForm: FC<CreateFormProps> = (props) => {
  const { reload } = props;

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();
  
  const { message } = App.useApp();

  // 提交表单
  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // 确保数据类型正确
      const submitData = {
        ...values,
        status: values.status || 0, // 默认为草稿状态
        enabled: values.enabled === true ? 1 : (values.enabled === false ? 0 : 1), // 布尔值转数字
        priority: Number(values.priority), // 确保是数字类型
        // 日期转换为时间戳
        publishTime: values.publishTime ? 
          new Date(values.publishTime).getTime() : undefined,
        expireTime: values.expireTime ? 
          new Date(values.expireTime).getTime() : undefined,
      };
      
      await museumInfoApi.announcementController.createAnnouncement(submitData);
      
      message.success(
        intl.formatMessage({
          id: 'pages.content.announcement.createSuccess',
          defaultMessage: '创建成功',
        }),
      );
      
      form.resetFields();
      setOpen(false);
      reload?.();
    } catch (error) {
      message.error(
        intl.formatMessage({
          id: 'pages.content.announcement.createFailed',
          defaultMessage: '创建失败',
        }),
      );
    } finally {
      setLoading(false);
    }
  }, [form, intl, message, reload]);

  // 取消操作
  const handleCancel = useCallback(() => {
    form.resetFields();
    setOpen(false);
  }, [form]);

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
        <FormattedMessage id="pages.content.announcement.new" defaultMessage="新建公告" />
      </Button>
      
      <Drawer
        title={intl.formatMessage({
          id: 'pages.content.announcement.createTitle',
          defaultMessage: '新建公告',
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
                initialValue={1}
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
                initialValue={0}
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
                initialValue={true}
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

export default CreateForm;
