import { getMuseumById, createMuseum, updateMuseum, checkCode1 } from '@/services/museum-service-api/museumInfoController';
import { getAllCategories } from '@/services/museum-service-api/museumCategoryController';
import { getAllTags } from '@/services/museum-service-api/museumTagController';
import { uploadFile, getFileUrl } from '@/services/file-service-api/fileController';
import { PageContainer, ProForm, ProFormDigit, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Button, Card, Col, message, Row, Spin, Upload, Image, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { history, useParams } from '@umijs/max';
import type { GetProp, UploadFile, UploadProps } from 'antd';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

/**
 * 博物馆表单页面
 */
const MuseumForm: React.FC = () => {
  const params = useParams<{ id?: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<any>({});
  const [categories, setCategories] = useState<{ label: string; value: number }[]>([]);
  const [tags, setTags] = useState<{ label: string; value: number }[]>([]);
  const [logoPreviewOpen, setLogoPreviewOpen] = useState(false);
  const [logoPreviewImage, setLogoPreviewImage] = useState('');
  const [logoFileList, setLogoFileList] = useState<UploadFile[]>([]);
  const isEdit = !!params.id;

  /**
   * 获取博物馆详情
   */
  const fetchMuseumDetail = async () => {
    if (!params.id) return;

    try {
      setLoading(true);
      const id = Number(params.id);
      if (isNaN(id)) {
        message.error('无效的博物馆ID');
        return;
      }

      const response = await getMuseumById({ id });
      if (response.success && response.data) {
        // 转换数据为表单可用的格式
        const museum = response.data;
        const formData = {
          ...museum,
          categoryIds: museum.categories?.map(item => item.id) || [],
          tagIds: museum.tags?.map(item => item.id) || [],
        };
        setInitialValues(formData);
        
        // 初始化 Logo 文件列表
        if (museum.logoUrl && museum.logoFileId) {
          setLogoFileList([{
            uid: `logo-${museum.logoFileId}`,
            name: 'logo',
            status: 'done',
            url: museum.logoUrl,
            response: { fileId: museum.logoFileId }
          }]);
        }
      } else {
        message.error(response.message || '获取博物馆详情失败');
      }
    } catch (error) {
      message.error('获取博物馆详情失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 获取所有分类
   */
  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      if (response.success && response.data) {
        const options = response.data.map(item => ({
          label: item.name || '',
          value: item.id || 0,
        }));
        setCategories(options);
      }
    } catch (error) {
      console.error('获取分类列表失败', error);
    }
  };

  /**
   * 获取所有标签
   */
  const fetchTags = async () => {
    try {
      const response = await getAllTags();
      if (response.success && response.data) {
        const options = response.data.map(item => ({
          label: item.name || '',
          value: item.id || 0,
        }));
        setTags(options);
      }
    } catch (error) {
      console.error('获取标签列表失败', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTags();
    if (isEdit) {
      fetchMuseumDetail();
    }
  }, [params.id]);

  /**
   * 提交表单
   */
  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      
      // 从 logoFileList 中提取 logoFileId
      const logoFileId = logoFileList.length > 0 && logoFileList[0].status === 'done' 
        ? logoFileList[0].response?.fileId 
        : undefined;

      const submitData = {
        ...values,
        logoFileId,
      };

      if (isEdit) {
        // 更新博物馆
        const response = await updateMuseum({ id: Number(params.id) }, {
          ...submitData,
          id: Number(params.id),
        });

        if (response.success) {
          message.success('更新博物馆成功');
          history.push('/museum-service/museum/list');
        } else {
          message.error(response.message || '更新博物馆失败');
        }
      } else {
        // 创建博物馆
        const response = await createMuseum(submitData);

        if (response.success) {
          message.success('创建博物馆成功');
          history.push('/museum-service/museum/list');
        } else {
          message.error(response.message || '创建博物馆失败');
        }
      }
    } catch (error) {
      message.error('操作失败');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * 检查博物馆编码是否存在
   */
  const checkCodeExists = async (code: string) => {
    if (!code) return Promise.resolve();

    try {
      const response = await checkCode1({
        code,
        excludeId: isEdit ? Number(params.id) : undefined,
      });

      if (response.success && response.data) {
        return Promise.reject(new Error('该博物馆编码已存在'));
      }
      return Promise.resolve();
    } catch (error) {
      return Promise.resolve();
    }
  };

  /**
   * 返回列表页
   */
  const handleBack = () => {
    history.push('/museum-service/museum/list');
  };

  /**
   * Logo 预览处理
   */
  const handleLogoPreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setLogoPreviewImage(file.url || (file.preview as string));
    setLogoPreviewOpen(true);
  };

  /**
   * Logo 文件列表变化处理
   */
  const handleLogoChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setLogoFileList(newFileList);
  };

  /**
   * Logo 自定义上传请求（优化版：移除不必要的getFileUrl调用）
   */
  const customLogoRequest = async ({ file, onSuccess, onError, onProgress }: any) => {
    try {
      onProgress({ percent: 30 });
      
      // 调用file-service上传接口
      const response = await uploadFile(
        { type: 'museum', uploaderId: 1 },
        {},
        file
      );

      onProgress({ percent: 90 });

      if (response.success && response.data && response.data.id) {
        const fileId = response.data.id;
        
        // 生成本地预览URL（使用base64）
        const preview = await getBase64(file as FileType);
        
        onProgress({ percent: 100 });
        // 只存储fileId，预览使用base64，不需要额外请求URL
        onSuccess({ ...response.data, url: preview, fileId });
        message.success('Logo上传成功');
      } else {
        throw new Error(response.message || '上传失败');
      }
    } catch (error: any) {
      message.error(`Logo上传失败: ${error.message || '未知错误'}`);
      onError(error);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Card>
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      header={{
        title: isEdit ? '编辑博物馆' : '新增博物馆',
        backIcon: true,
        onBack: handleBack,
      }}
    >
      <Card bordered={false}>
        <ProForm
          initialValues={initialValues}
          submitter={{
            render: (_, dom) => (
              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <Button type="primary" loading={submitting} htmlType="submit">
                  {isEdit ? '更新' : '提交'}
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleBack}>
                  取消
                </Button>
              </div>
            ),
          }}
          onFinish={handleSubmit}
        >
          <Card title="基本信息" bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <ProFormText
                  name="name"
                  label="博物馆名称"
                  placeholder="请输入博物馆名称"
                  rules={[{ required: true, message: '请输入博物馆名称' }]}
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  name="code"
                  label="博物馆编码"
                  placeholder="请输入博物馆编码"
                  rules={[
                    { required: true, message: '请输入博物馆编码' },
                    { validator: (_, value) => checkCodeExists(value) },
                  ]}
                  disabled={isEdit}
                  tooltip="博物馆编码一旦创建不可修改"
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                    博物馆Logo
                  </label>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Upload
                      customRequest={customLogoRequest}
                      listType="picture-card"
                      fileList={logoFileList}
                      onPreview={handleLogoPreview}
                      onChange={handleLogoChange}
                      beforeUpload={(file) => {
                        const isImage = file.type.startsWith('image/');
                        if (!isImage) {
                          message.error('只能上传图片文件！');
                          return false;
                        }
                        
                        const isLt2M = file.size / 1024 / 1024 < 2;
                        if (!isLt2M) {
                          message.error('Logo大小不能超过2MB！');
                          return false;
                        }
                        
                        return true;
                      }}
                      accept="image/*"
                      maxCount={1}
                    >
                      {logoFileList.length === 0 && (
                        <button style={{ border: 0, background: 'none' }} type="button">
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>上传Logo</div>
                        </button>
                      )}
                    </Upload>
                    {logoPreviewImage && (
                      <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                          visible: logoPreviewOpen,
                          onVisibleChange: (visible) => setLogoPreviewOpen(visible),
                          afterOpenChange: (visible) => !visible && setLogoPreviewImage(''),
                        }}
                        src={logoPreviewImage}
                      />
                    )}
                    <span style={{ fontSize: 12, color: '#999' }}>
                      支持 JPG、PNG 格式，建议尺寸 200x200px，文件大小不超过 2MB
                    </span>
                  </Space>
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <ProFormText
                  name="province"
                  label="省份"
                  placeholder="请输入省份"
                />
              </Col>
              <Col span={8}>
                <ProFormText
                  name="city"
                  label="城市"
                  placeholder="请输入城市"
                />
              </Col>
              <Col span={8}>
                <ProFormText
                  name="district"
                  label="区县"
                  placeholder="请输入区县"
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <ProFormText
                  name="address"
                  label="详细地址"
                  placeholder="请输入详细地址"
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <ProFormDigit
                  name="longitude"
                  label="经度"
                  placeholder="请输入经度"
                  fieldProps={{
                    precision: 6,
                  }}
                />
              </Col>
              <Col span={12}>
                <ProFormDigit
                  name="latitude"
                  label="纬度"
                  placeholder="请输入纬度"
                  fieldProps={{
                    precision: 6,
                  }}
                />
              </Col>
            </Row>
          </Card>

          <Card title="联系信息" bordered={false} style={{ marginTop: 24 }}>
            <Row gutter={16}>
              <Col span={12}>
                <ProFormText
                  name="phone"
                  label="联系电话"
                  placeholder="请输入联系电话"
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  name="website"
                  label="官方网站"
                  placeholder="请输入官方网站"
                />
              </Col>
            </Row>
          </Card>

          <Card title="开放信息" bordered={false} style={{ marginTop: 24 }}>
            <Row gutter={16}>
              <Col span={12}>
                <ProFormText
                  name="openTime"
                  label="开放时间"
                  placeholder="请输入开放时间"
                />
              </Col>
              <Col span={12}>
                <ProFormDigit
                  name="capacity"
                  label="日接待能力"
                  placeholder="请输入日接待能力"
                  min={0}
                  fieldProps={{
                    precision: 0,
                    addonAfter: '人/天',
                  }}
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <ProFormTextArea
                  name="ticketInfo"
                  label="门票信息"
                  placeholder="请输入门票信息"
                  fieldProps={{
                    rows: 4,
                  }}
                />
              </Col>
            </Row>
          </Card>

          <Card title="分类与标签" bordered={false} style={{ marginTop: 24 }}>
            <Row gutter={16}>
              <Col span={12}>
                <ProFormSelect
                  name="categoryIds"
                  label="博物馆分类"
                  placeholder="请选择博物馆分类"
                  mode="multiple"
                  options={categories}
                />
              </Col>
              <Col span={12}>
                <ProFormSelect
                  name="tagIds"
                  label="博物馆标签"
                  placeholder="请选择博物馆标签"
                  mode="multiple"
                  options={tags}
                />
              </Col>
            </Row>
          </Card>

          <Card title="状态信息" bordered={false} style={{ marginTop: 24 }}>
            <Row gutter={16}>
              <Col span={12}>
                <ProFormSelect
                  name="status"
                  label="状态"
                  rules={[{ required: true, message: '请选择状态' }]}
                  options={[
                    { label: '关闭', value: 0 },
                    { label: '开放', value: 1 },
                  ]}
                />
              </Col>
              <Col span={12}>
                <ProFormSelect
                  name="level"
                  label="等级"
                  rules={[{ required: true, message: '请选择等级' }]}
                  options={[
                    { label: '无等级', value: 0 },
                    { label: '一级', value: 1 },
                    { label: '二级', value: 2 },
                    { label: '三级', value: 3 },
                    { label: '四级', value: 4 },
                    { label: '五级', value: 5 },
                  ]}
                />
              </Col>
            </Row>
          </Card>

          <Card title="博物馆描述" bordered={false} style={{ marginTop: 24 }}>
            <Row gutter={16}>
              <Col span={24}>
                <ProFormTextArea
                  name="description"
                  label="描述"
                  placeholder="请输入博物馆描述"
                  fieldProps={{
                    rows: 6,
                  }}
                />
              </Col>
            </Row>
          </Card>
        </ProForm>
      </Card>
    </PageContainer>
  );
};

export default MuseumForm;
