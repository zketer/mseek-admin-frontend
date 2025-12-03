import React, { useState } from 'react';
import { 
  Drawer, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  InputNumber, 
  Row, 
  Col, 
  Space, 
  Spin, 
  Button,
  App,
  Switch,
  Tooltip,
  Upload,
  Image
} from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { useIntl } from '@umijs/max';
import { PlusOutlined } from '@ant-design/icons';
import museumInfoApi from '@/services/museum-service-api';
import { uploadFile, getFileUrl } from '@/services/file-service-api/fileController';
import dayjs from 'dayjs';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface CreateFormProps {
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
  onSuccess: () => void;
}

const CreateForm: React.FC<CreateFormProps> = ({
  visible,
  onVisibleChange,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  // 图片上传相关状态（使用官方demo方式，限制单张图片）
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  
  const intl = useIntl();
  const { message } = App.useApp();

  // 官方demo的图片预览处理
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  // 官方demo的文件列表变化处理
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    // 限制只能上传一张图片
    setFileList(newFileList.slice(-1));
    
    // 当图片上传成功后，设置表单的imageUrl字段
    if (newFileList.length > 0 && newFileList[0].status === 'done') {
      const imageUrl = newFileList[0].response?.url || newFileList[0].url;
      if (imageUrl) {
        form.setFieldsValue({ imageUrl: imageUrl });
      }
    } else if (newFileList.length === 0) {
      // 删除图片时清空表单字段
      form.setFieldsValue({ imageUrl: undefined });
    }
  };

  // 自定义上传请求
  const customRequest = async ({ file, onSuccess, onError, onProgress }: any) => {
    try {
      onProgress({ percent: 10 });
      
      // 调用file-service上传接口
      const response = await uploadFile(
        {
          type: 'banner', // 横幅类型
          uploaderId: 1 // 临时使用固定用户ID，实际应该从用户信息中获取
        },
        {},
        file
      );

      onProgress({ percent: 50 });

      if (response.success && response.data && response.data.id) {
        const fileId = response.data.id;
        
        // 获取文件访问URL
        const urlResponse = await getFileUrl({ fileId: fileId });
        onProgress({ percent: 80 });
        
        if (urlResponse.success && urlResponse.data) {
          onProgress({ percent: 100 });
          // 将fileId存储在response中，供后续使用
          onSuccess({ ...response.data, url: urlResponse.data, fileId });
          message.success('图片上传成功');
        } else {
          throw new Error('获取文件URL失败');
        }
      } else {
        throw new Error(response.message || '上传失败');
      }
    } catch (error: any) {
      message.error(`图片上传失败: ${error.message || '未知错误'}`);
      onError(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // 从fileList中获取fileId
      const fileId = fileList.length > 0 && fileList[0].response?.fileId 
        ? fileList[0].response.fileId 
        : null;

      // 转换数据格式
      const submitData = {
        ...values,
        status: values.status ? 1 : 0,
        startTime: values.startTime ? dayjs(values.startTime).format('YYYY-MM-DD HH:mm:ss') : undefined,
        endTime: values.endTime ? dayjs(values.endTime).format('YYYY-MM-DD HH:mm:ss') : undefined,
        fileId: fileId, // 传递文件ID给后端
      };

      await museumInfoApi.bannerController.createBanner(submitData);
      message.success(
        intl.formatMessage({
          id: 'pages.content.banner.createSuccess',
          defaultMessage: '创建成功',
        })
      );
      
      form.resetFields();
      setFileList([]);
      setPreviewImage('');
      setPreviewOpen(false);
      onVisibleChange(false);
      onSuccess();
    } catch (error) {
      message.error(
        intl.formatMessage({
          id: 'pages.content.banner.createFailed',
          defaultMessage: '创建失败',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setPreviewImage('');
    setPreviewOpen(false);
    onVisibleChange(false);
  };

  return (
    <Drawer
      title={intl.formatMessage({
        id: 'pages.content.banner.createTitle',
        defaultMessage: '新建横幅',
      })}
      width={720}
      open={visible}
      onClose={handleCancel}
      destroyOnClose
      extra={
        <Space>
          <Button onClick={handleCancel}>
            {intl.formatMessage({
              id: 'pages.common.cancel',
              defaultMessage: '取消',
            })}
          </Button>
          <Button type="primary" loading={loading} onClick={handleSubmit}>
            {intl.formatMessage({
              id: 'pages.common.confirm',
              defaultMessage: '确定',
            })}
          </Button>
        </Space>
      }
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: false,
            sort: 0,
            linkType: 'none',
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="title"
                label={intl.formatMessage({
                  id: 'pages.content.banner.title',
                  defaultMessage: '横幅标题',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.content.banner.titleRequired',
                      defaultMessage: '横幅标题为必填项',
                    }),
                  },
                  {
                    max: 100,
                    message: intl.formatMessage({
                      id: 'pages.content.banner.titleMaxLength',
                      defaultMessage: '横幅标题不能超过100个字符',
                    }),
                  },
                ]}
              >
                <Input
                  placeholder={intl.formatMessage({
                    id: 'pages.content.banner.titlePlaceholder',
                    defaultMessage: '请输入横幅标题',
                  })}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="linkType"
                label={intl.formatMessage({
                  id: 'pages.content.banner.linkType',
                  defaultMessage: '链接类型',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.content.banner.linkTypeRequired',
                      defaultMessage: '链接类型为必填项',
                    }),
                  },
                ]}
              >
                <Select
                  placeholder={intl.formatMessage({
                    id: 'pages.content.banner.linkTypePlaceholder',
                    defaultMessage: '请选择链接类型',
                  })}
                >
                  <Select.Option value="none">
                    {intl.formatMessage({
                      id: 'pages.content.banner.linkType.none',
                      defaultMessage: '无链接',
                    })}
                  </Select.Option>
                  <Select.Option value="museum">
                    {intl.formatMessage({
                      id: 'pages.content.banner.linkType.museum',
                      defaultMessage: '博物馆详情',
                    })}
                  </Select.Option>
                  <Select.Option value="exhibition">
                    {intl.formatMessage({
                      id: 'pages.content.banner.linkType.exhibition',
                      defaultMessage: '展览详情',
                    })}
                  </Select.Option>
                  <Select.Option value="external">
                    {intl.formatMessage({
                      id: 'pages.content.banner.linkType.external',
                      defaultMessage: '外部链接',
                    })}
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="linkValue"
                label={intl.formatMessage({
                  id: 'pages.content.banner.linkValue',
                  defaultMessage: '链接值',
                })}
              >
                <Input
                  placeholder={intl.formatMessage({
                    id: 'pages.content.banner.linkValuePlaceholder',
                    defaultMessage: '请输入链接值',
                  })}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="sort"
                label={intl.formatMessage({
                  id: 'pages.content.banner.sort',
                  defaultMessage: '排序',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.content.banner.sortRequired',
                      defaultMessage: '排序为必填项',
                    }),
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  max={9999}
                  style={{ width: '100%' }}
                  placeholder={intl.formatMessage({
                    id: 'pages.content.banner.sortPlaceholder',
                    defaultMessage: '请输入排序值',
                  })}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="status"
                label={intl.formatMessage({
                  id: 'pages.content.banner.status',
                  defaultMessage: '状态',
                })}
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={intl.formatMessage({
                    id: 'pages.content.banner.status.online',
                    defaultMessage: '上线',
                  })}
                  unCheckedChildren={intl.formatMessage({
                    id: 'pages.content.banner.status.offline',
                    defaultMessage: '下线',
                  })}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="startTime"
                label={intl.formatMessage({
                  id: 'pages.content.banner.startTime',
                  defaultMessage: '开始时间',
                })}
              >
                <DatePicker
                  showTime
                  style={{ width: '100%' }}
                  placeholder={intl.formatMessage({
                    id: 'pages.content.banner.startTimePlaceholder',
                    defaultMessage: '请选择开始时间',
                  })}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="endTime"
                label={intl.formatMessage({
                  id: 'pages.content.banner.endTime',
                  defaultMessage: '结束时间',
                })}
              >
                <DatePicker
                  showTime
                  style={{ width: '100%' }}
                  placeholder={intl.formatMessage({
                    id: 'pages.content.banner.endTimePlaceholder',
                    defaultMessage: '请选择结束时间',
                  })}
                />
              </Form.Item>
            </Col>

            {/* 横幅图片 - 移动到最后 */}
            <Col span={24}>
              <Form.Item
                name="imageUrl"
                label={intl.formatMessage({
                  id: 'pages.content.banner.image',
                  defaultMessage: '横幅图片',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.content.banner.imageRequired',
                      defaultMessage: '横幅图片为必填项',
                    }),
                  },
                ]}
                extra="支持jpg、png、gif格式，文件大小不超过10MB，只能上传一张图片"
              >
                <>
                  <Upload
                    customRequest={customRequest}
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    beforeUpload={(file) => {
                      const isImage = file.type.startsWith('image/');
                      if (!isImage) {
                        message.error('只能上传图片文件！');
                        return false;
                      }
                      
                      const isLt10M = file.size / 1024 / 1024 < 10;
                      if (!isLt10M) {
                        message.error('图片大小不能超过10MB！');
                        return false;
                      }
                      
                      return true;
                    }}
                    accept="image/*"
                  >
                    {fileList.length >= 1 ? null : (
                      <button style={{ border: 0, background: 'none' }} type="button">
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>上传图片</div>
                      </button>
                    )}
                  </Upload>
                  {previewImage && (
                    <Image
                      wrapperStyle={{ display: 'none' }}
                      preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                      }}
                      src={previewImage}
                    />
                  )}
                </>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Drawer>
  );
};

export default CreateForm;
