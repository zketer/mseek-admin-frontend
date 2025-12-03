import { FormattedMessage, useIntl } from '@umijs/max';
import { 
  Drawer, 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  Row, 
  Col, 
  Button,
  Space,
  App 
} from 'antd';
import React, { cloneElement, useCallback, useState } from 'react';
import { updateCategory, checkCode2 } from '@/services/museum-service-api/museumCategoryController';

export type UpdateFormProps = {
  trigger?: React.ReactElement<any>;
  onOk?: () => void;
  values: Partial<MuseumsAPI.CategoryResponse>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { onOk, values, trigger } = props;

  const intl = useIntl();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { message } = App.useApp();

  const onClose = useCallback(() => {
    setOpen(false);
    form.resetFields();
  }, [form]);

  const onOpen = useCallback(() => {
    setOpen(true);
    // 设置表单初始值
    form.setFieldsValue(values);
  }, [form, values]);

  // 提交表单
  const onFinish = useCallback(async (formValues: any) => {
    if (!values.id) return;
    
    try {
      setLoading(true);
      
      await updateCategory(
        { id: values.id },
        {
          id: values.id!,
          ...formValues,
        } as MuseumsAPI.CategoryUpdateRequest
      );
      
      message.success(intl.formatMessage({
        id: 'pages.museumInfo.category.updateSuccess',
        defaultMessage: 'Category updated successfully',
      }));
      onClose();
      onOk?.();
    } catch (error) {
      console.error('Failed to update category:', error);
      message.error(intl.formatMessage({
        id: 'pages.museumInfo.category.updateFailed',
        defaultMessage: 'Update failed, please try again!',
      }));
    } finally {
      setLoading(false);
    }
  }, [values.id, form, message, intl, onClose, onOk]);

  return (
    <>
      {trigger
        ? cloneElement(trigger, {
            onClick: onOpen,
          })
        : null}
      
      <Drawer
        title={intl.formatMessage({
          id: 'pages.museumInfo.category.editCategory',
          defaultMessage: 'Edit Category',
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
          initialValues={values}
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
              >
                <Input
                  disabled
                  placeholder={intl.formatMessage({
                    id: 'pages.museumInfo.category.form.code.disabled',
                    defaultMessage: 'Category code cannot be modified',
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

export default UpdateForm;
