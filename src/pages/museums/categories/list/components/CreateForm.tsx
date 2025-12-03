import { PlusOutlined } from '@ant-design/icons';
import { type ActionType } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { 
  Button, 
  Drawer, 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  Row, 
  Col, 
  Space,
  App 
} from 'antd';
import type { FC } from 'react';
import { useState, useCallback } from 'react';
import { createCategory, checkCode2 } from '@/services/museum-service-api/museumCategoryController';

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

  // 显示抽屉
  const showDrawer = useCallback(() => {
    setOpen(true);
  }, []);

  // 关闭抽屉
  const onClose = useCallback(() => {
    setOpen(false);
    form.resetFields();
  }, [form]);

  // 提交表单
  const onFinish = useCallback(async (values: any) => {
    try {
      setLoading(true);
      
      // 检查编码是否已存在
      if (values.code) {
        const response = await checkCode2({ code: values.code });
        if (response.success && response.data) {
          message.error(intl.formatMessage({
            id: 'pages.museumInfo.category.form.code.exists',
            defaultMessage: 'Category code already exists',
          }));
          return;
        }
      }

      await createCategory(values);
      message.success(intl.formatMessage({
        id: 'pages.museumInfo.category.addSuccess',
        defaultMessage: 'Category added successfully',
      }));
      onClose();
      reload?.();
    } catch (error) {
      console.error('Failed to create category:', error);
      message.error(intl.formatMessage({
        id: 'pages.museumInfo.category.addFailed',
        defaultMessage: 'Adding category failed, please try again!',
      }));
    } finally {
      setLoading(false);
    }
  }, [form, message, intl, reload, onClose]);

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={showDrawer}>
        <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
      </Button>
      
      <Drawer
        title={intl.formatMessage({
          id: 'pages.museumInfo.category.newCategory',
          defaultMessage: 'New Category',
        })}
        width={600}
        open={open}
        onClose={onClose}
        destroyOnClose
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={onClose}>
                {intl.formatMessage({
                  id: 'pages.common.cancel',
                  defaultMessage: 'Cancel',
                })}
              </Button>
              <Button type="primary" loading={loading} onClick={() => form.submit()}>
                {intl.formatMessage({
                  id: 'pages.common.confirm',
                  defaultMessage: 'Confirm',
                })}
              </Button>
            </Space>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ status: 1 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.category.name',
                  defaultMessage: 'Category Name',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.museumInfo.category.form.name.required',
                      defaultMessage: 'Please enter category name',
                    }),
                  },
                ]}
              >
                <Input
                  placeholder={intl.formatMessage({
                    id: 'pages.museumInfo.category.form.name.placeholder',
                    defaultMessage: 'Please enter category name',
                  })}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.category.code',
                  defaultMessage: 'Category Code',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.museumInfo.category.form.code.required',
                      defaultMessage: 'Please enter category code',
                    }),
                  },
                ]}
              >
                <Input
                  placeholder={intl.formatMessage({
                    id: 'pages.museumInfo.category.form.code.placeholder',
                    defaultMessage: 'Please enter category code',
                  })}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="sortOrder"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.category.sortOrder',
                  defaultMessage: 'Sort Order',
                })}
              >
                <InputNumber
                  min={0}
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder={intl.formatMessage({
                    id: 'pages.museumInfo.category.form.sortOrder.placeholder',
                    defaultMessage: 'Please enter sort order',
                  })}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.category.status',
                  defaultMessage: 'Status',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.museumInfo.category.form.status.required',
                      defaultMessage: 'Please select a status',
                    }),
                  },
                ]}
              >
                <Select
                  placeholder={intl.formatMessage({
                    id: 'pages.museumInfo.category.form.status.placeholder',
                    defaultMessage: 'Please select status',
                  })}
                  options={[
                    {
                      label: intl.formatMessage({
                        id: 'pages.museumInfo.category.status.disabled',
                        defaultMessage: 'Disabled',
                      }),
                      value: 0,
                    },
                    {
                      label: intl.formatMessage({
                        id: 'pages.museumInfo.category.status.enabled',
                        defaultMessage: 'Enabled',
                      }),
                      value: 1,
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label={intl.formatMessage({
              id: 'pages.museumInfo.category.description',
              defaultMessage: 'Description',
            })}
          >
            <Input.TextArea
              rows={4}
              placeholder={intl.formatMessage({
                id: 'pages.museumInfo.category.form.description.placeholder',
                defaultMessage: 'Please enter description',
              })}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default CreateForm;
