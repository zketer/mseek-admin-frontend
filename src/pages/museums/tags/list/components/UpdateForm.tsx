import { FormattedMessage, useIntl } from '@umijs/max';
import { 
  Drawer, 
  Form, 
  Input, 
  Row, 
  Col, 
  Button,
  Space,
  ColorPicker,
  Tag,
  App 
} from 'antd';
import React, { cloneElement, useCallback, useState, useEffect } from 'react';
import { updateTag, checkCode } from '@/services/museum-service-api/museumTagController';

export type UpdateFormProps = {
  trigger?: React.ReactElement<any>;
  onOk?: () => void;
  values: Partial<MuseumsAPI.TagResponse>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { onOk, values, trigger } = props;

  const intl = useIntl();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewColor, setPreviewColor] = useState('#1677ff');

  const { message } = App.useApp();

  // 打开抽屉时初始化表单
  const onOpen = useCallback(() => {
    setOpen(true);
    form.setFieldsValue({
      name: values.name,
      code: values.code,
      color: values.color || '#1677ff',
      description: values.description,
    });
    setPreviewColor(values.color || '#1677ff');
  }, [form, values]);

  // 关闭抽屉
  const onClose = useCallback(() => {
    setOpen(false);
    form.resetFields();
  }, [form]);

  // 提交表单
  const onFinish = useCallback(
    async (formValues: any) => {
      setLoading(true);
      try {
        // 如果编码有变化，检查是否存在
        if (formValues.code !== values.code) {
          const response = await checkCode({ code: formValues.code });
          if (response.success && response.data === true) {
            message.error(
              intl.formatMessage({
                id: 'pages.museumInfo.tag.form.code.exists',
                defaultMessage: '该标签编码已存在',
              })
            );
            setLoading(false);
            return;
          }
        }

        await updateTag(
          { id: values.id! },
          formValues
        );
        
        message.success(
          intl.formatMessage({
            id: 'pages.museumInfo.tag.updateSuccess',
            defaultMessage: '标签更新成功',
          })
        );
        onClose();
        onOk?.();
      } catch (error) {
        console.error('Failed to update tag:', error);
        message.error(
          intl.formatMessage({
            id: 'pages.museumInfo.tag.updateFailed',
            defaultMessage: '标签更新失败',
          })
        );
      } finally {
        setLoading(false);
      }
    },
    [intl, message, onClose, onOk, values]
  );

  return (
    <App>
      {trigger &&
        cloneElement(trigger, {
          onClick: onOpen,
        })}
      
      <Drawer
        title={intl.formatMessage({
          id: 'pages.museumInfo.tag.editTag',
          defaultMessage: '编辑标签',
        })}
        width={600}
        open={open}
        onClose={onClose}
        destroyOnClose
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={onClose}>
                <FormattedMessage id="pages.common.cancel" defaultMessage="取消" />
              </Button>
              <Button type="primary" loading={loading} onClick={() => form.submit()}>
                <FormattedMessage id="pages.common.confirm" defaultMessage="确定" />
              </Button>
            </Space>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          preserve={false}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.tag.name',
                  defaultMessage: '标签名称',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.museumInfo.tag.form.name.required',
                      defaultMessage: '请输入标签名称',
                    }),
                  },
                ]}
              >
                <Input
                  placeholder={intl.formatMessage({
                    id: 'pages.museumInfo.tag.form.name.placeholder',
                    defaultMessage: '请输入标签名称',
                  })}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.tag.code',
                  defaultMessage: '标签编码',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.museumInfo.tag.form.code.required',
                      defaultMessage: '请输入标签编码',
                    }),
                  },
                ]}
              >
                <Input
                  disabled
                  placeholder={intl.formatMessage({
                    id: 'pages.museumInfo.tag.form.code.disabled',
                    defaultMessage: '标签编码不可修改',
                  })}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="color"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.tag.color',
                  defaultMessage: '标签颜色',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.museumInfo.tag.form.color.required',
                      defaultMessage: '请选择标签颜色',
                    }),
                  },
                ]}
              >
                <ColorPicker
                  showText
                  onChange={(color) => {
                    const hexColor = color.toHexString();
                    setPreviewColor(hexColor);
                    form.setFieldsValue({ color: hexColor });
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={intl.formatMessage({
                  id: 'pages.museumInfo.tag.preview',
                  defaultMessage: '预览',
                })}
              >
                <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => 
                  prevValues.name !== currentValues.name || prevValues.color !== currentValues.color
                }>
                  {({ getFieldValue }) => {
                    const name = getFieldValue('name') || values.name || '标签预览';
                    const color = getFieldValue('color') || previewColor;
                    return <Tag color={color}>{name}</Tag>;
                  }}
                </Form.Item>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label={intl.formatMessage({
              id: 'pages.museumInfo.tag.description',
              defaultMessage: '描述',
            })}
          >
            <Input.TextArea
              rows={4}
              placeholder={intl.formatMessage({
                id: 'pages.museumInfo.tag.form.description.placeholder',
                defaultMessage: '请输入描述',
              })}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </App>
  );
};

export default UpdateForm;