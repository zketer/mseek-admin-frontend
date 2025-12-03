import { PlusOutlined } from '@ant-design/icons';
import { type ActionType } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { 
  Button, 
  Drawer, 
  Form, 
  Input, 
  DatePicker, 
  InputNumber, 
  Select, 
  Space,
  Row,
  Col,
  App,
  Upload,
  Image
} from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import type { FC } from 'react';
import { useState, useCallback } from 'react';
import { createExhibition } from '@/services/museum-service-api/museumExhibitionController';
import { uploadFile, getFileUrl } from '@/services/file-service-api/fileController';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface CreateFormProps {
  reload?: ActionType['reload'];
  museumId: number;
  museumName: string;
}

const CreateForm: FC<CreateFormProps> = (props) => {
  const { reload, museumId, museumName } = props;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  
  // 图片上传相关状态
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();
  const { message } = App.useApp();

  // 图片预览处理
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  // 图片上传状态变化处理
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // 自定义上传请求
  const customRequest = async ({ file, onSuccess, onError, onProgress }: any) => {
    try {
      onProgress({ percent: 10 });
      
      // 调用file-service上传接口
      const response = await uploadFile(
        { type: 'exhibition', uploaderId: 1 },
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

  const onClose = () => {
    setOpen(false);
    form.resetFields();
    // 重置图片上传状态
    setFileList([]);
    setPreviewImage('');
    setPreviewOpen(false);
  };

  const onFinish = useCallback(async (values: any) => {
    setLoading(true);
    try {
      // 验证 museumId 的有效性
      if (!museumId || museumId <= 0) {
        message.error(intl.formatMessage({
          id: 'pages.museumInfo.exhibition.noMuseumSelected',
          defaultMessage: '请先选择博物馆',
        }));
        setLoading(false);
        return;
      }
      
      // 提取上传成功的文件ID
      const fileIds = fileList
        .filter(file => file.status === 'done' && file.response?.fileId)
        .map(file => file.response.fileId)
        .filter(fileId => fileId > 0);
      
      // 确保请求体中包含 museumId
      const requestData = {
        museumId, // 请求体中必须包含 museumId
        ...values,
        fileIds: fileIds, // 添加文件ID列表
      };
      
      const response = await createExhibition({ museumId }, requestData);
      
      if (response.success) {
        message.success(intl.formatMessage({
          id: 'pages.museumInfo.exhibition.addSuccess',
          defaultMessage: '展览添加成功',
        }));
        onClose();
        reload?.();
      } else {
        throw new Error(response.message || '创建展览失败');
      }
    } catch (error) {
      console.error('Failed to create exhibition:', error);
      message.error(intl.formatMessage({
        id: 'pages.museumInfo.exhibition.addFailed',
        defaultMessage: '展览添加失败，请重试！',
      }));
    } finally {
      setLoading(false);
    }
  }, [intl, message, museumId, reload, fileList]);

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)} icon={<PlusOutlined />}>
        <FormattedMessage id="pages.museumInfo.exhibition.add" defaultMessage="新增展览" />
      </Button>
      
      <Drawer
        title={intl.formatMessage({
          id: 'pages.museumInfo.exhibition.create',
          defaultMessage: '创建展览',
        })}
        width={720}
        open={open}
        onClose={onClose}
        extra={
          <Space>
            <Button onClick={onClose}>
              {intl.formatMessage({ id: 'pages.common.cancel', defaultMessage: '取消' })}
            </Button>
            <Button onClick={() => form.submit()} type="primary" loading={loading}>
              {intl.formatMessage({ id: 'pages.common.submit', defaultMessage: '提交' })}
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          hideRequiredMark
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.exhibition.title',
                  defaultMessage: '展览标题',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.museumInfo.exhibition.form.title.required',
                      defaultMessage: '请输入展览标题',
                    }),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="location"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.exhibition.location',
                  defaultMessage: '展厅位置',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.museumInfo.exhibition.form.location.required',
                      defaultMessage: '请输入展厅位置',
                    }),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.exhibition.startDate',
                  defaultMessage: '开始日期',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.museumInfo.exhibition.form.startDate.required',
                      defaultMessage: '请选择开始日期',
                    }),
                  },
                ]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.exhibition.endDate',
                  defaultMessage: '结束日期',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.museumInfo.exhibition.form.endDate.required',
                      defaultMessage: '请选择结束日期',
                    }),
                  },
                ]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="ticketPrice"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.exhibition.ticketPrice',
                  defaultMessage: '门票价格',
                })}
              >
                <InputNumber
                  min={0}
                  precision={2}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="maxVisitors"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.exhibition.maxVisitors',
                  defaultMessage: '最大游客数',
                })}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.exhibition.status',
                  defaultMessage: '状态',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.museumInfo.exhibition.form.status.required',
                      defaultMessage: '请选择展览状态',
                    }),
                  },
                ]}
              >
                <Select>
                  <Select.Option value={0}>已结束</Select.Option>
                  <Select.Option value={1}>进行中</Select.Option>
                  <Select.Option value={2}>未开始</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isPermanent"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.exhibition.isPermanent',
                  defaultMessage: '是否常设',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.museumInfo.exhibition.form.isPermanent.required',
                      defaultMessage: '请选择展览类型',
                    }),
                  },
                ]}
              >
                <Select>
                  <Select.Option value={0}>临时展览</Select.Option>
                  <Select.Option value={1}>常设展览</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label={intl.formatMessage({
              id: 'pages.museumInfo.exhibition.description',
              defaultMessage: '展览描述',
            })}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          {/* 展览图片上传 */}
          <Form.Item
            label={intl.formatMessage({
              id: 'pages.museumInfo.exhibition.images',
              defaultMessage: '展览图片',
            })}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              customRequest={customRequest}
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
              multiple
            >
              {fileList.length >= 8 ? null : (
                <button style={{ border: 0, background: 'none' }} type="button">
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传</div>
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
          </Form.Item>

        </Form>
      </Drawer>
    </>
  );
};

export default CreateForm;