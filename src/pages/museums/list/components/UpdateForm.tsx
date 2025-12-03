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
  Spin,
  App,
  Upload,
  Image
} from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { cloneElement, useCallback, useState, useEffect } from 'react';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
import { updateMuseum, checkCode1, getMuseumById } from '@/services/museum-service-api/museumInfoController';
import { getAllCategories } from '@/services/museum-service-api/museumCategoryController';
import { getAllTags } from '@/services/museum-service-api/museumTagController';
import { getAllProvinces } from '@/services/museum-service-api/areaProvinceController';
import { getCitiesByProvince } from '@/services/museum-service-api/areaCityController';
import { getDistrictsByCity } from '@/services/museum-service-api/areaDistrictController';
import { getStreetsByDistrict } from '@/services/museum-service-api/areaStreetController';
import { uploadFile, getFileUrl } from '@/services/file-service-api/fileController';

export type UpdateFormProps = {
  trigger?: React.ReactElement<any>;
  onOk?: () => void;
  values: Partial<MuseumsAPI.MuseumResponse>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { onOk, values, trigger } = props;

  const intl = useIntl();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [categories, setCategories] = useState<{ label: string; value: number }[]>([]);
  const [tags, setTags] = useState<{ label: string; value: number }[]>([]);
  const [provinces, setProvinces] = useState<{ label: string; value: string }[]>([]);
  const [cities, setCities] = useState<{ label: string; value: string }[]>([]);
  const [districts, setDistricts] = useState<{ label: string; value: string }[]>([]);
  const [streets, setStreets] = useState<{ label: string; value: string }[]>([]);

  // 图片上传相关状态（使用官方demo方式）
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  
  // Logo上传相关状态
  const [logoPreviewOpen, setLogoPreviewOpen] = useState(false);
  const [logoPreviewImage, setLogoPreviewImage] = useState('');
  const [logoFileList, setLogoFileList] = useState<UploadFile[]>([]);

  const { message } = App.useApp();

  // 获取分类、标签和地区数据
  const fetchOptions = useCallback(async () => {
    try {
      const [categoriesRes, tagsRes, provincesRes] = await Promise.all([
        getAllCategories(),
        getAllTags(),
        getAllProvinces()
      ]);

      if (categoriesRes?.success && categoriesRes.data) {
        const categoryOptions = categoriesRes.data.map((category: any) => ({
          label: category.name,
          value: category.id,
        }));
        setCategories(categoryOptions);
      }

      if (tagsRes?.success && tagsRes.data) {
        const tagOptions = tagsRes.data.map((tag: any) => ({
          label: tag.name,
          value: tag.id,
        }));
        setTags(tagOptions);
      }

      if (provincesRes?.success && provincesRes.data) {
        const provinceOptions = provincesRes.data.map((province: any) => ({
          label: province.name,
          value: province.adcode,
        }));
        setProvinces(provinceOptions);
      }
    } catch (error) {
      console.error('Failed to fetch options:', error);
    }
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
    form.resetFields();
    // 重置地区选择
    setCities([]);
    setDistricts([]);
    setStreets([]);
    // 重置图片上传状态
    setFileList([]);
    setPreviewImage('');
    setPreviewOpen(false);
    // 重置Logo上传状态
    setLogoFileList([]);
    setLogoPreviewImage('');
    setLogoPreviewOpen(false);
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
    
    // 初始化 Logo 文件列表
    if (open && values && values.logoUrl && values.logoFileId) {
      setLogoFileList([{
        uid: `logo-${values.logoFileId}`,
        name: 'logo',
        status: 'done',
        url: values.logoUrl,
        response: { fileId: values.logoFileId }
      }]);
    } else if (open) {
      setLogoFileList([]);
    }
  }, [open, values]);

  // 省份变化时，获取对应城市列表
  const handleProvinceChange = useCallback(async (provinceCode: string) => {
    setCities([]);
    setDistricts([]);
    setStreets([]);
    form.setFieldsValue({ cityCode: undefined, districtCode: undefined, streetCode: undefined });

    if (provinceCode) {
      try {
        const response = await getCitiesByProvince({ provinceAdcode: provinceCode });
        if (response?.success && response.data) {
          const cityOptions = response.data.map((city: any) => ({
            label: city.name,
            value: city.adcode,
          }));
          setCities(cityOptions);
        }
      } catch (error) {
        console.error('Failed to fetch cities:', error);
      }
    }
  }, [form]);

  // 城市变化时，获取对应区县列表
  const handleCityChange = useCallback(async (cityCode: string) => {
    setDistricts([]);
    setStreets([]);
    form.setFieldsValue({ districtCode: undefined, streetCode: undefined });

    if (cityCode) {
      try {
        const response = await getDistrictsByCity({ cityCode });
        if (response?.success && response.data) {
          const districtOptions = response.data.map((district: any) => ({
            label: district.name,
            value: district.adcode,
          }));
          setDistricts(districtOptions);
        }
      } catch (error) {
        console.error('Failed to fetch districts:', error);
      }
    }
  }, [form]);

  // 区县变化时，获取对应街道列表
  const handleDistrictChange = useCallback(async (districtCode: string) => {
    setStreets([]);
    form.setFieldsValue({ streetCode: undefined });

    if (districtCode) {
      try {
        const response = await getStreetsByDistrict({ districtCode });
        if (response?.success && response.data) {
          const streetOptions = response.data.map((street: any) => ({
            label: street.name,
            value: street.adcode,
          }));
          setStreets(streetOptions);
        }
      } catch (error) {
        console.error('Failed to fetch streets:', error);
      }
    }
  }, [form]);

  // 预填充地区数据
  const preloadAreaData = useCallback(async (provinceCode?: string, cityCode?: string, districtCode?: string) => {
    try {
      // 如果有省份代码，加载对应城市
      if (provinceCode) {
        const citiesResponse = await getCitiesByProvince({ provinceAdcode: provinceCode });
        if (citiesResponse?.success && citiesResponse.data) {
          const cityOptions = citiesResponse.data.map((city: any) => ({
            label: city.name,
            value: city.adcode,
          }));
          setCities(cityOptions);
        }

        // 如果有城市代码，加载对应区县
        if (cityCode) {
          const districtsResponse = await getDistrictsByCity({ cityCode });
          if (districtsResponse?.success && districtsResponse.data) {
            const districtOptions = districtsResponse.data.map((district: any) => ({
              label: district.name,
              value: district.adcode,
            }));
            setDistricts(districtOptions);
          }

          // 如果有区县代码，加载对应街道
          if (districtCode) {
            const streetsResponse = await getStreetsByDistrict({ districtCode });
            if (streetsResponse?.success && streetsResponse.data) {
              const streetOptions = streetsResponse.data.map((street: any) => ({
                label: street.name,
                value: street.adcode,
              }));
              setStreets(streetOptions);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to preload area data:', error);
    }
  }, []);

  const showDrawer = useCallback(async () => {
    setOpen(true);
    setLoadingDetail(true);
    
    try {
      // 并行加载选项数据和详情数据
      const [_, detailResponse] = await Promise.all([
        fetchOptions(),
        getMuseumById({ id: values.id! })
      ]);
      
      // 使用详情接口返回的完整数据
      const detailData = detailResponse?.success && detailResponse.data ? detailResponse.data : values;
      
      if (detailData) {
        // 预填充地区数据
        await preloadAreaData(detailData.provinceCode, detailData.cityCode, detailData.districtCode);
        
        // 预填充表单数据
        const categoryIds = detailData.categories?.map((cat: any) => cat.id) || [];
        const tagIds = detailData.tags?.map((tag: any) => tag.id) || [];
        
        form.setFieldsValue({
          ...detailData,
          categoryIds,
          tagIds,
        });
        
        // 初始化 Logo 文件列表（使用详情数据中的 logoUrl 和 logoFileId）
        if (detailData.logoUrl && detailData.logoFileId) {
          setLogoFileList([{
            uid: `logo-${detailData.logoFileId}`,
            name: 'logo',
            status: 'done',
            url: detailData.logoUrl,
            response: { fileId: detailData.logoFileId }
          }]);
        } else {
          setLogoFileList([]);
        }
      }
    } catch (error) {
      console.error('Failed to load form data:', error);
      message.error(intl.formatMessage({
        id: 'pages.museumInfo.museum.loadFailed',
        defaultMessage: 'Failed to load museum details',
      }));
    } finally {
      setLoadingDetail(false);
    }
  }, [fetchOptions, form, values, preloadAreaData, message, intl]);

  // 检查博物馆编码是否存在
  const checkCodeExists = async (_: any, value: string) => {
    if (!value || value === values.code) return Promise.resolve();

    try {
      const response = await checkCode1({
        code: value,
        excludeId: values.id
      });
      if (response.success && response.data) {
        return Promise.reject(new Error(intl.formatMessage({
          id: 'pages.museumInfo.museum.form.code.exists',
          defaultMessage: 'Museum code already exists',
        })));
      }
      return Promise.resolve();
    } catch (error) {
      return Promise.resolve();
    }
  };

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

  // 自定义上传请求（优化版：移除不必要的getFileUrl调用）
  const customRequest = async ({ file, onSuccess, onError, onProgress }: any) => {
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
        message.success('图片上传成功');
      } else {
        throw new Error(response.message || '上传失败');
      }
    } catch (error: any) {
      message.error(`图片上传失败: ${error.message || '未知错误'}`);
      onError(error);
    }
  };

  // Logo 预览处理
  const handleLogoPreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setLogoPreviewImage(file.url || (file.preview as string));
    setLogoPreviewOpen(true);
  };

  // Logo 文件列表变化处理
  const handleLogoChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setLogoFileList(newFileList);
  };

  // Logo 自定义上传请求（优化版：移除不必要的getFileUrl调用）
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

  // Form submission
  const onFinish = useCallback(
    async (formValues: any) => {
      setLoading(true);
      try {
        // 从fileList中提取所有有效的fileId（包括现有的和新上传的）
        const fileIds = fileList
          .filter(file => file.status === 'done' && file.response?.fileId && file.response.fileId > 0)
          .map(file => file.response.fileId);
        
        // 从logoFileList中提取logoFileId
        const logoFileId = logoFileList.length > 0 && logoFileList[0].status === 'done' 
          ? logoFileList[0].response?.fileId 
          : undefined;
        
        const submitData = {
          id: values.id!,
          ...formValues,
          fileIds, // 传递所有有效的文件ID数组给后端
          logoFileId, // 传递Logo文件ID给后端
        };
        
        const response = await updateMuseum({ id: values.id! }, submitData);
        if (response.success) {
          message.success(
            intl.formatMessage({
              id: 'pages.museumInfo.museum.updateSuccess',
              defaultMessage: '更新成功',
            })
          );
          
          onOk?.();
          setOpen(false);
          form.resetFields();
        }
      } catch (error) {
        console.error('Failed to update museum:', error);
        message.error(
          intl.formatMessage({
            id: 'pages.museumInfo.museum.updateFailed',
            defaultMessage: '更新失败',
          })
        );
      } finally {
        setLoading(false);
      }
    },
    [intl, message, form, onOk, values.id, fileList, logoFileList]
  );

  return (
    <>
      {trigger
        ? cloneElement(trigger, {
            onClick: showDrawer,
          } as any)
        : null}
      
      <Drawer
        title={intl.formatMessage({
          id: 'pages.museumInfo.museum.editMuseum',
          defaultMessage: 'Edit Museum',
        })}
        width={800}
        open={open}
        onClose={onClose}
        destroyOnClose
        extra={
          <Space>
            <Button onClick={onClose}>
              {intl.formatMessage({
                id: 'pages.common.cancel',
                defaultMessage: 'Cancel',
              })}
            </Button>
            <Button 
              onClick={() => form.submit()} 
              type="primary" 
              loading={loading}
            >
              {intl.formatMessage({
                id: 'pages.common.submit',
                defaultMessage: 'Submit',
              })}
            </Button>
          </Space>
        }
      >
        <Spin 
          tip={intl.formatMessage({
            id: 'pages.museumInfo.museum.loadingDetails',
            defaultMessage: 'Loading museum details...',
          })}
          spinning={loadingDetail}
        >
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
                name="name"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.museum.name',
                  defaultMessage: 'Museum Name',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.museumInfo.museum.form.name.required',
                      defaultMessage: 'Please enter museum name',
                    }),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.museum.code',
                  defaultMessage: 'Museum Code',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.museumInfo.museum.form.code.required',
                      defaultMessage: 'Please enter museum code',
                    }),
                  },
                  { validator: checkCodeExists },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.museum.phone',
                  defaultMessage: 'Phone',
                })}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="website"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.museum.website',
                  defaultMessage: 'Website',
                })}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="provinceCode"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.museum.province',
                  defaultMessage: 'Province',
                })}
              >
                <Select
                  placeholder={intl.formatMessage({
                    id: 'pages.museumInfo.museum.form.province.placeholder',
                    defaultMessage: 'Please select province',
                  })}
                  options={provinces}
                  onChange={handleProvinceChange}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="cityCode"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.museum.city',
                  defaultMessage: 'City',
                })}
              >
                <Select
                  placeholder={intl.formatMessage({
                    id: 'pages.museumInfo.museum.form.city.placeholder',
                    defaultMessage: 'Please select city',
                  })}
                  options={cities}
                  onChange={handleCityChange}
                  disabled={cities.length === 0}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="districtCode"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.museum.district',
                  defaultMessage: 'District',
                })}
              >
                <Select
                  placeholder={intl.formatMessage({
                    id: 'pages.museumInfo.museum.form.district.placeholder',
                    defaultMessage: 'Please select district',
                  })}
                  options={districts}
                  onChange={handleDistrictChange}
                  disabled={districts.length === 0}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="streetCode"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.museum.street',
                  defaultMessage: 'Street',
                })}
              >
                <Select
                  placeholder={intl.formatMessage({
                    id: 'pages.museumInfo.museum.form.street.placeholder',
                    defaultMessage: 'Please select street',
                  })}
                  options={streets}
                  disabled={streets.length === 0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="address"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.museum.address',
                  defaultMessage: 'Address',
                })}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="openTime"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.museum.openTime',
                  defaultMessage: 'Open Time',
                })}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="longitude"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.museum.longitude',
                  defaultMessage: 'Longitude',
                })}
              >
                <InputNumber
                  precision={6}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="latitude"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.museum.latitude',
                  defaultMessage: 'Latitude',
                })}
              >
                <InputNumber
                  precision={6}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="capacity"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.museum.capacity',
                  defaultMessage: 'Capacity',
                })}
              >
                <InputNumber
                  min={0}
                  precision={0}
                  addonAfter={intl.formatMessage({
                    id: 'pages.museumInfo.museum.capacity.unit',
                    defaultMessage: 'people/day',
                  })}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="categoryIds"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.museum.categories',
                  defaultMessage: 'Categories',
                })}
              >
                <Select
                  mode="multiple"
                  options={categories}
                  placeholder={intl.formatMessage({
                    id: 'pages.museumInfo.museum.form.categories.placeholder',
                    defaultMessage: 'Please select categories',
                  })}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="tagIds"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.museum.tags',
                  defaultMessage: 'Tags',
                })}
              >
                <Select
                  mode="multiple"
                  options={tags}
                  placeholder={intl.formatMessage({
                    id: 'pages.museumInfo.museum.form.tags.placeholder',
                    defaultMessage: 'Please select tags',
                  })}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.museum.status',
                  defaultMessage: 'Status',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.museumInfo.museum.form.status.required',
                      defaultMessage: 'Please select a status',
                    }),
                  },
                ]}
              >
                <Select>
                  <Select.Option value={0}>
                    {intl.formatMessage({
                      id: 'pages.museumInfo.museum.status.closed',
                      defaultMessage: 'Closed',
                    })}
                  </Select.Option>
                  <Select.Option value={1}>
                    {intl.formatMessage({
                      id: 'pages.museumInfo.museum.status.open',
                      defaultMessage: 'Open',
                    })}
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="level"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.museum.level',
                  defaultMessage: 'Level',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.museumInfo.museum.form.level.required',
                      defaultMessage: 'Please select a level',
                    }),
                  },
                ]}
              >
                <Select>
                  {[0, 1, 2, 3, 4, 5].map((level) => (
                    <Select.Option key={level} value={level}>
                      {level === 0
                        ? intl.formatMessage({
                            id: 'pages.museumInfo.museum.level.none',
                            defaultMessage: 'No Level',
                          })
                        : intl.formatMessage({
                            id: `pages.museumInfo.museum.level.${['', 'one', 'two', 'three', 'four', 'five'][level]}`,
                            defaultMessage: `Level ${level}`,
                          })}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>


          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="ticketPrice"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.museum.ticketPrice',
                  defaultMessage: 'Ticket Price (¥)',
                })}
              >
                <InputNumber
                  precision={2}
                  min={0}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="ticketDescription"
                label={intl.formatMessage({
                  id: 'pages.museumInfo.museum.ticketDescription',
                  defaultMessage: 'Ticket Description',
                })}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          {/* 描述字段 */}
          <Form.Item
            name="description"
            label={intl.formatMessage({
              id: 'pages.museumInfo.museum.description',
              defaultMessage: 'Description',
            })}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          {/* Logo上传区域 */}
          <Form.Item
            label={intl.formatMessage({
              id: 'pages.museumInfo.museum.logo',
              defaultMessage: 'Logo',
            })}
          >
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
          </Form.Item>

          {/* 图片上传区域 */}
          <Form.Item
            name="images"
            label={intl.formatMessage({
              id: 'pages.museumInfo.museum.images',
              defaultMessage: '博物馆图片',
            })}
            extra="支持jpg、png、gif格式，文件大小不超过10MB，可上传多张图片"
          >
            <div>
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
                multiple
              >
                {fileList.length >= 8 ? null : (
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
            </div>
          </Form.Item>

        </Form>
        </Spin>
      </Drawer>
    </>
  );
};

export default UpdateForm;