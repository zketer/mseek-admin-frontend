import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { 
  Button, 
  Drawer, 
  Form, 
  Input, 
  Row, 
  Col, 
  Space,
  ColorPicker,
  Tag,
  App 
} from 'antd';
import type { FC } from 'react';
import { useState, useCallback } from 'react';
import { createTag, checkCode } from '@/services/museum-service-api/museumTagController';
import { useFormPersist } from '@/hooks';

interface CreateFormProps {
  reload?: ActionType['reload'];
}

const CreateForm: FC<CreateFormProps> = (props) => {
  const { reload } = props;

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewColor, setPreviewColor] = useState('#1677ff');

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();
  const { message } = App.useApp();
  
  // ✅ 应用表单持久化（自动保存草稿，防止数据丢失）
  const { clearDraft } = useFormPersist(form, 'museum-tag-create', {
    saveInterval: 5000,  // 每5秒自动保存
    enabled: open,       // 只在抽屉打开时启用
  });

  // 打开抽屉
  const showDrawer = useCallback(() => {
    setOpen(true);
    form.resetFields();
    setPreviewColor('#1677ff');
  }, [form]);

  // 关闭抽屉
  const onClose = useCallback(() => {
    setOpen(false);
    form.resetFields();
    setPreviewColor('#1677ff');
  }, [form]);

  // 提交表单
  const onFinish = useCallback(
    async (values: any) => {
      setLoading(true);
      try {
        // 检查编码是否存在
        const response = await checkCode({ code: values.code });
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

        await createTag(values);
        message.success(
          intl.formatMessage({
            id: 'pages.museumInfo.tag.addSuccess',
            defaultMessage: '标签创建成功',
          })
        );
        clearDraft(); // ✅ 提交成功后清除草稿
        onClose();
        reload?.();
      } catch (error) {
        console.error('Failed to create tag:', error);
        message.error(
          intl.formatMessage({
            id: 'pages.museumInfo.tag.addFailed',
            defaultMessage: '标签创建失败',
          })
        );
      } finally {
        setLoading(false);
      }
    },
    [intl, message, onClose, reload]
  );

  return (
    <App>
      <Button type="primary" icon={<PlusOutlined />} onClick={showDrawer}>
        <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
      </Button>
      
      <Drawer
        title={intl.formatMessage({
          id: 'pages.museumInfo.tag.newTag',
          defaultMessage: '新建标签',
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
                  onChange={(e) => {
                    // 当名称改变时，自动更新预览
                    form.setFieldsValue({ name: e.target.value });
                  }}
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
                  placeholder={intl.formatMessage({
                    id: 'pages.museumInfo.tag.form.code.placeholder',
                    defaultMessage: '请输入标签编码',
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
                initialValue="#1677ff"
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
                    const name = getFieldValue('name') || '标签预览';
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

export default CreateForm;