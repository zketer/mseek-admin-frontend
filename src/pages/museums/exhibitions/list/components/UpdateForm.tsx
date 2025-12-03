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
  Spin,
  App,
  Upload,
  Image
} from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { cloneElement, useCallback, useState, useEffect } from 'react';
import { updateExhibition } from '@/services/museum-service-api/museumExhibitionController';
import { uploadFile, getFileUrl } from '@/services/file-service-api/fileController'
import dayjs from 'dayjs';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export type UpdateFormProps = {
  trigger?: React.ReactElement<any>;
  onOk?: () => void;
  values: Partial<MuseumsAPI.ExhibitionResponse>;
  museumId: number;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { onOk, values, trigger, museumId } = props;

  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [form] = Form.useForm();

  // 图片上传相关状态
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

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
          onError(new Error('获取文件URL失败'));
          message.error('获取文件URL失败');
        }
      } else {
        onError(new Error(response.message || '上传失败'));
        message.error(response.message || '上传失败');
      }
    } catch (error) {
      console.error('Upload error:', error);
      onError(error);
      message.error('上传失败，请重试');
    }
  };

  const onClose = useCallback(() => {
    setOpen(false);
    form.resetFields();
    // 重置图片上传状态
    setFileList([]);
    setPreviewImage('');
    setPreviewOpen(false);
  }, [form]);

  // 当编辑数据变化时，初始化图片列表
  useEffect(() => {
    if (open && values && values.imageUrls && values.imageUrls.length > 0) {
      // 将现有图片转换为UploadFile格式
      const existingFiles: UploadFile[] = values.imageUrls.map((url, index) => ({
        uid: `existing-${index}`,
        name: `image-${index + 1}`,
        status: 'done',
        url: url,
        response: {
          fileId: values.imageFileIds && values.imageFileIds[index] ? values.imageFileIds[index] : 0
        }
      }));
      setFileList(existingFiles);
    } else if (open) {
      // 新建时清空图片列表
      setFileList([]);
    }
  }, [open, values]);

  const showDrawer = useCallback(async () => {
    setOpen(true);
    setLoadingDetail(true);
    
    try {
      // 预填充表单数据
      const formData = {
        ...values,
        startDate: values.startDate ? dayjs(values.startDate) : undefined,
        endDate: values.endDate ? dayjs(values.endDate) : undefined,
      };
      
      form.setFieldsValue(formData);
    } catch (error) {
      console.error('Failed to load form data:', error);
      message.error(intl.formatMessage({
        id: 'pages.museumInfo.exhibition.loadFailed',
        defaultMessage: '加载展览详情失败',
      }));
    } finally {
      setLoadingDetail(false);
    }
  }, [values, form, intl, message]);

  const onFinish = useCallback(async (formValues: any) => {
    setLoading(true);
    try {
      
      // 验证 museumId 和 exhibition id 的有效性
      if (!museumId || museumId <= 0) {
        message.error(intl.formatMessage({
          id: 'pages.museumInfo.exhibition.noMuseumSelected',
          defaultMessage: '请先选择博物馆',
        }));
        setLoading(false);
        return;
      }
      
      if (!values.id) {
        message.error(intl.formatMessage({
          id: 'pages.museumInfo.exhibition.noExhibitionId',
          defaultMessage: '展览ID缺失',
        }));
        setLoading(false);
        return;
      }
      
      // 从fileList中提取所有有效的fileId（包括现有的和新上传的）
      const fileIds = fileList
        .filter(file => file.status === 'done' && file.response?.fileId && file.response.fileId > 0)
        .map(file => file.response.fileId);
      
      const submitData = {
        id: values.id!,
        museumId, // 确保请求体中包含 museumId
        ...formValues,
        startDate: formValues.startDate ? formValues.startDate.format('YYYY-MM-DD') : undefined,
        endDate: formValues.endDate ? formValues.endDate.format('YYYY-MM-DD') : undefined,
        fileIds, // 传递所有有效的文件ID数组给后端
      };
      
      
      await updateExhibition(
        { museumId, id: values.id! },
        submitData
      );
      
      message.success(intl.formatMessage({
        id: 'pages.museumInfo.exhibition.updateSuccess',
        defaultMessage: '展览更新成功',
      }));
      
      onClose();
      onOk?.();
    } catch (error) {
      console.error('Failed to update exhibition:', error);
      message.error(intl.formatMessage({
        id: 'pages.museumInfo.exhibition.updateFailed',
        defaultMessage: '展览更新失败，请重试！',
      }));
    } finally {
      setLoading(false);
    }
  }, [intl, message, museumId, values.id, onOk, onClose, fileList]);

  return (
    <>
      {trigger &&
        cloneElement(trigger, {
          ...trigger.props,
          onClick: showDrawer,
        })}
      
      <Drawer
        title={intl.formatMessage({
          id: 'pages.museumInfo.exhibition.edit',
          defaultMessage: '编辑展览',
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
        {loadingDetail ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large">
              <div style={{ marginTop: '20px' }}>
                {intl.formatMessage({
                  id: 'pages.museumInfo.exhibition.loadingDetails',
                  defaultMessage: '正在加载展览详情...',
                })}
              </div>
            </Spin>
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            hideRequiredMark
            onFinish={onFinish}
            autoComplete="off"
          >
            {/* 隐藏的 ID 字段 */}
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>

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
        )}
      </Drawer>
    </>
  );
};

export default UpdateForm;