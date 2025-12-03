import type {
  ActionType,
  ProColumns,
} from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
  ProDescriptions,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Button, message, Popconfirm, Modal, Form, Input, InputNumber, Select, Tabs, Tree, Radio, Space, Tooltip, Drawer, App, Tag, Row, Col, Steps, Popover } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import { getProvinceList, createProvince, updateProvince, deleteProvince, getAllProvinces } from '@/services/museum-service-api/areaProvinceController';
import { getCityList, createCity, updateCity, deleteCity, getCitiesByProvince } from '@/services/museum-service-api/areaCityController';
import { getDistrictsByCity, getDistrictsPage, createDistrict, updateDistrict, deleteDistrict } from '@/services/museum-service-api/areaDistrictController';
import { getStreetsByDistrict, getStreetsPage, createStreet, updateStreet, deleteStreet } from '@/services/museum-service-api/areaStreetController';
import { GlobalOutlined, BuildOutlined, ApartmentOutlined, HomeOutlined, TableOutlined, PartitionOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { usePermission } from '@/utils/authUtils';
import { PermissionButton } from '@/components/PermissionControl';

const { TabPane } = Tabs;

/**
 * 统一的区域管理页面
 */
const AreaManagement: React.FC = () => {
  const actionRef = useRef<ActionType | null>(null);
  const [selectedRowsState, setSelectedRows] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('province');
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('table');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<any>();
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [treeLoading, setTreeLoading] = useState(false);
  const [loadedNodes, setLoadedNodes] = useState<Set<string>>(new Set());
  const [form] = Form.useForm();
  
  // 分步创建相关状态
  const [showStepWizard, setShowStepWizard] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepForm] = Form.useForm();
  const [stepData, setStepData] = useState<{
    province: any;
    city: any;
    district: any;
    street: any;
  }>({
    province: null,
    city: null,
    district: null,
    street: null,
  });

  const intl = useIntl();
  const { message: messageApi } = App.useApp();

  // 权限检查
  const { hasAuth: canCreateRegion } = usePermission('museums:areas:add');
  const { hasAuth: canUpdateRegion } = usePermission('museums:areas:edit');
  const { hasAuth: canDeleteRegion } = usePermission('museums:areas:delete');

  // 获取区域类型名称
  const getAreaTypeName = (type: string) => {
    switch (type) {
      case 'province':
        return '省份';
      case 'city':
        return '城市';
      case 'district':
        return '区县';
      case 'street':
        return '街道';
      default:
        return '区域';
    }
  };

  // 初始化数据
  useEffect(() => {
    loadProvinces();
    if (viewMode === 'tree') {
      loadTreeData();
    }
  }, [viewMode]);

  // 当切换到树形视图时，加载树形数据
  useEffect(() => {
    if (viewMode === 'tree' && treeData.length === 0) {
      loadTreeData();
    }
  }, [viewMode]);

  // 加载省份数据
  const loadProvinces = async () => {
    try {
      const response = await getAllProvinces();
      if (response.success && response.data) {
        const provinceOptions = response.data.map((province: any) => ({
          value: province.adcode,
          label: province.name,
        }));
        setProvinces(provinceOptions);
      }
    } catch (error) {
      console.error('加载省份数据失败:', error);
    }
  };

  // 加载城市数据
  const loadCities = async () => {
    try {
      const response = await getAllProvinces(); // 获取所有省份，然后获取所有城市
      if (response.success && response.data) {
        const allCities: any[] = [];
        for (const province of response.data) {
          try {
            const cityResponse = await getCitiesByProvince({ provinceAdcode: province.adcode || '' });
            if (cityResponse.success && cityResponse.data) {
              const cityOptions = cityResponse.data.map((city: any) => ({
                value: city.adcode,
                label: city.name,
              }));
              allCities.push(...cityOptions);
            }
          } catch (error) {
            console.error(`加载省份${province.name}的城市失败:`, error);
          }
        }
        setCities(allCities);
      }
    } catch (error) {
      console.error('加载城市数据失败:', error);
    }
  };

  // 加载区县数据
  const loadDistricts = async () => {
    try {
      // 先获取所有城市，然后获取所有区县
      const response = await getAllProvinces();
      if (response.success && response.data) {
        const allDistricts: any[] = [];
        for (const province of response.data) {
          try {
            const cityResponse = await getCitiesByProvince({ provinceAdcode: province.adcode || '' });
            if (cityResponse.success && cityResponse.data) {
              for (const city of cityResponse.data) {
                try {
                  const districtResponse = await getDistrictsByCity({ cityCode: city.adcode || '' });
                  if (districtResponse.success && districtResponse.data) {
                    const districtOptions = districtResponse.data.map((district: any) => ({
                      value: district.adcode,
                      label: district.name,
                    }));
                    allDistricts.push(...districtOptions);
                  }
                } catch (error) {
                  console.error(`加载城市${city.name}的区县失败:`, error);
                }
              }
            }
          } catch (error) {
            console.error(`加载省份${province.name}的城市失败:`, error);
          }
        }
        setDistricts(allDistricts);
      }
    } catch (error) {
      console.error('加载区县数据失败:', error);
    }
  };

  // 初始化加载省份数据（懒加载模式）
  const loadTreeData = async () => {
    setTreeLoading(true);
    try {
      const provincesResponse = await getAllProvinces();
      if (!provincesResponse.success || !provincesResponse.data) {
        setTreeData([]);
        return;
      }

      // 只加载省份级别，子节点懒加载
      const treeNodes = provincesResponse.data.map((province: any) => ({
        title: province.name,
        key: `province-${province.adcode}`,
        icon: <GlobalOutlined />,
        isLeaf: false,
        data: { ...province, type: 'province' }
      }));

      setTreeData(treeNodes);
    } catch (error) {
      console.error('加载省份数据失败:', error);
      setTreeData([]);
    } finally {
      setTreeLoading(false);
    }
  };

  // 懒加载子节点（按需加载）
  const loadTreeChildren = async (node: any): Promise<any[]> => {
    const { data } = node;
    const nodeKey = node.key;

    // 检查是否已经加载过
    if (loadedNodes.has(nodeKey)) {
      return node.children || [];
    }

    try {
      let children: any[] = [];

      switch (data.type) {
        case 'province':
          // 点击省份，加载该省份的所有城市
          const citiesResponse = await getCitiesByProvince({ provinceAdcode: data.adcode });
          if (citiesResponse.success && citiesResponse.data) {
            children = citiesResponse.data.map((city: any) => ({
              title: city.name,
              key: `city-${city.adcode}`,
              icon: <BuildOutlined />,
              isLeaf: false, // 城市下还有区县，所以不是叶子节点
              data: { ...city, type: 'city' }
            }));
          }
          break;

        case 'city':
          // 点击城市，加载该城市的所有区县
          const districtsResponse = await getDistrictsByCity({ cityCode: data.adcode });
          if (districtsResponse.success && districtsResponse.data) {
            children = districtsResponse.data.map((district: any) => ({
              title: district.name,
              key: `district-${district.adcode}`,
              icon: <ApartmentOutlined />,
              isLeaf: false, // 区县下还有街道，所以不是叶子节点
              data: { ...district, type: 'district' }
            }));
          }
          break;

        case 'district':
          // 点击区县，加载该区县的所有街道
          const streetsResponse = await getStreetsByDistrict({ districtCode: data.adcode });
          if (streetsResponse.success && streetsResponse.data) {
            children = streetsResponse.data.map((street: any) => ({
              title: street.name,
              key: `street-${street.adcode}`,
              icon: <HomeOutlined />,
              isLeaf: true, // 街道是最后一级，所以是叶子节点
              data: { ...street, type: 'street' }
            }));
          }
          break;

        default:
          return [];
      }

      // 标记节点已加载
      setLoadedNodes(prev => new Set(prev).add(nodeKey));

      return children;

    } catch (error) {
      console.error(`加载 ${data.type} 子节点失败:`, error);
      messageApi.error(`加载${data.name}的子节点失败，请重试`);
    }

    return [];
  };

  useEffect(() => {
    loadProvinces();
    loadCities();
    loadDistricts();
    if (viewMode === 'tree') {
      // 重置缓存和树数据
      setLoadedNodes(new Set());
      loadTreeData();
    }
  }, [viewMode]);

  // 监听 activeTab 变化，重置状态和刷新数据
  useEffect(() => {
    // 重置选中的行
    setSelectedRows([]);
    // 确保 actionRef 在切换tab后能正确工作
    setTimeout(() => {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }, 100);
  }, [activeTab]);

  // 处理新建
  const handleCreate = () => {
    setEditingRecord(null);
    setModalVisible(true);
    form.resetFields();
  };

  // 处理编辑
  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setModalVisible(true);
    form.setFieldsValue(record);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (activeTab === 'province') {
        if (editingRecord) {
          await updateProvince({ id: Number(editingRecord.id) }, values);
          messageApi.success('省份更新成功');
        } else {
          await createProvince(values);
          messageApi.success('省份创建成功');
        }
      } else if (activeTab === 'city') {
        if (editingRecord) {
          await updateCity({ id: Number(editingRecord.id) }, values);
          messageApi.success('城市更新成功');
        } else {
          await createCity(values);
          messageApi.success('城市创建成功');
        }
      } else if (activeTab === 'district') {
        if (editingRecord) {
          // 现在所有记录都应该有正确的id字段
          await updateDistrict({ id: Number(editingRecord.id) }, values);
          messageApi.success('区县更新成功');
        } else {
          await createDistrict(values);
          messageApi.success('区县创建成功');
        }
      } else if (activeTab === 'street') {
        if (editingRecord) {
          // 现在所有记录都应该有正确的id字段
          await updateStreet({ id: Number(editingRecord.id) }, values);
          messageApi.success('街道更新成功');
        } else {
          await createStreet(values);
          messageApi.success('街道创建成功');
        }
      }

      setModalVisible(false);
      
      // 强制刷新表格数据
      if (actionRef.current) {
        // 尝试多种刷新方法
        actionRef.current.reload();
        setTimeout(() => {
          actionRef.current?.reloadAndRest?.();
        }, 100);
      }
      
      if (viewMode === 'tree') {
        loadTreeData();
      }
    } catch (error) {
      console.error('操作失败:', error);
      messageApi.error('操作失败，请重试');
    }
  };

  // 处理删除
  const handleDelete = async (record: any) => {
    try {
      // 所有记录现在都应该有正确的id字段
      const recordId = record.id;
      
      if (!recordId) {
        messageApi.error('无法删除：记录ID不存在');
        return;
      }
      
      const numericId = Number(recordId);
      if (isNaN(numericId)) {
        messageApi.error('无法删除：记录ID无效');
        return;
      }
      
      if (activeTab === 'province') {
        await deleteProvince({ id: numericId });
        messageApi.success('省份删除成功');
      } else if (activeTab === 'city') {
        await deleteCity({ id: numericId });
        messageApi.success('城市删除成功');
      } else if (activeTab === 'district') {
        await deleteDistrict({ id: numericId });
        messageApi.success('区县删除成功');
      } else if (activeTab === 'street') {
        await deleteStreet({ id: numericId });
        messageApi.success('街道删除成功');
      }

      // 强制刷新表格数据
      if (actionRef.current) {
        // 尝试多种刷新方法
        actionRef.current.reload();
        setTimeout(() => {
          actionRef.current?.reloadAndRest?.();
        }, 100);
      }
      
      if (viewMode === 'tree') {
        loadTreeData();
      }
    } catch (error) {
      console.error('删除失败:', error);
      messageApi.error('删除失败，请重试');
    }
  };

  // 分步创建向导相关函数
  const handleStepWizard = () => {
    setShowStepWizard(true);
    setCurrentStep(0);
    setStepData({
      province: null,
      city: null,
      district: null,
      street: null,
    });
    stepForm.resetFields();
  };

  const handleStepNext = async () => {
    try {
      const values = await stepForm.validateFields();
      const newStepData = { ...stepData };
      
      switch (currentStep) {
        case 0:
          // 创建省份
          const provinceResult = await createProvince(values);
          newStepData.province = provinceResult.data || null;
          messageApi.success('省份创建成功');
          break;
        case 1:
          // 创建城市
          const cityValues = { ...values, provinceAdcode: (stepData.province as any)?.adcode };
          const cityResult = await createCity(cityValues);
          newStepData.city = cityResult.data || null;
          messageApi.success('城市创建成功');
          break;
        case 2:
          // 创建区县
          const districtValues = { ...values, cityAdcode: (stepData.city as any)?.adcode };
          const districtResult = await createDistrict(districtValues);
          newStepData.district = districtResult.data || null;
          messageApi.success('区县创建成功');
          break;
        case 3:
          // 创建街道
          const streetValues = { ...values, districtAdcode: (stepData.district as any)?.adcode };
          await createStreet(streetValues);
          messageApi.success('街道创建成功');
          messageApi.success('区域层级创建完成！');
          setShowStepWizard(false);
          actionRef.current?.reload();
          return;
      }
      
      setStepData(newStepData);
      setCurrentStep(currentStep + 1);
      stepForm.resetFields();
    } catch (error) {
      console.error('步骤执行失败:', error);
      messageApi.error('操作失败，请重试');
    }
  };

  const handleStepPrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const customDot = (dot: any, { status, index }: any) => (
    <Popover
      content={
        <span>
          步骤 {index + 1}: {status === 'finish' ? '已完成' : status === 'process' ? '进行中' : '等待中'}
        </span>
      }
    >
      {dot}
    </Popover>
  );

  const getStepTitle = (step: number) => {
    const titles = ['创建省份', '创建城市', '创建区县', '创建街道'];
    return titles[step];
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form form={stepForm} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="省份名称"
                  name="name"
                  rules={[{ required: true, message: '请输入省份名称' }]}
                >
                  <Input placeholder="请输入省份名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="区域代码"
                  name="adcode"
                  rules={[{ required: true, message: '请输入区域代码' }]}
                >
                  <Input placeholder="请输入区域代码" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="国家代码" name="countryAdcode">
                  <Input placeholder="请输入国家代码" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="经度" name="longitude">
                  <InputNumber
                    placeholder="请输入经度"
                    precision={6}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="纬度" name="latitude">
                  <InputNumber
                    placeholder="请输入纬度"
                    precision={6}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        );
      case 1:
        return (
          <Form form={stepForm} layout="vertical">
            <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 6 }}>
              <strong>上一步创建的省份：</strong> {(stepData.province as any)?.name} ({(stepData.province as any)?.adcode})
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="城市名称"
                  name="name"
                  rules={[{ required: true, message: '请输入城市名称' }]}
                >
                  <Input placeholder="请输入城市名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="区域代码"
                  name="adcode"
                  rules={[{ required: true, message: '请输入区域代码' }]}
                >
                  <Input placeholder="请输入区域代码" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="城市代码" name="citycode">
                  <Input placeholder="请输入城市代码" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="经度" name="longitude">
                  <InputNumber
                    placeholder="请输入经度"
                    precision={6}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="纬度" name="latitude">
                  <InputNumber
                    placeholder="请输入纬度"
                    precision={6}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        );
      case 2:
        return (
          <Form form={stepForm} layout="vertical">
            <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 6 }}>
              <strong>已创建：</strong> {(stepData.province as any)?.name} {' > '} {(stepData.city as any)?.name}
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="区县名称"
                  name="name"
                  rules={[{ required: true, message: '请输入区县名称' }]}
                >
                  <Input placeholder="请输入区县名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="区域代码"
                  name="adcode"
                  rules={[{ required: true, message: '请输入区域代码' }]}
                >
                  <Input placeholder="请输入区域代码" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="经度" name="longitude">
                  <InputNumber
                    placeholder="请输入经度"
                    precision={6}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="纬度" name="latitude">
                  <InputNumber
                    placeholder="请输入纬度"
                    precision={6}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        );
      case 3:
        return (
          <Form form={stepForm} layout="vertical">
            <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 6 }}>
              <strong>已创建：</strong> {(stepData.province as any)?.name} {' > '} {(stepData.city as any)?.name} {' > '} {(stepData.district as any)?.name}
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="街道名称"
                  name="name"
                  rules={[{ required: true, message: '请输入街道名称' }]}
                >
                  <Input placeholder="请输入街道名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="街道代码"
                  name="adcode"
                  rules={[{ required: true, message: '请输入街道代码' }]}
                >
                  <Input placeholder="请输入街道代码" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="经度" name="longitude">
                  <InputNumber
                    placeholder="请输入经度"
                    precision={6}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="纬度" name="latitude">
                  <InputNumber
                    placeholder="请输入纬度"
                    precision={6}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        );
      default:
        return null;
    }
  };

  // 省份列配置
  const provinceColumns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 50,
      fixed: 'left',
      render: (_, __, index) => (
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: '#364657',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: '500',
            lineHeight: 1,
          }}
        >
          {index + 1}
        </div>
      ),
    },
    {
      title: '省份名称',
      dataIndex: 'name',
      width: 150,
      render: (dom, entity) => {
        return (
          <a
            onClick={async () => {
              setCurrentRow({ ...entity, type: 'province' });
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '区域代码',
      dataIndex: 'adcode',
      copyable: true,
      ellipsis: true,
      width: 120,
    },
    {
      title: '国家代码',
      dataIndex: 'countryAdcode',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '经度',
      dataIndex: 'longitude',
      hideInSearch: true,
      width: 120,
      render: (text) => typeof text === 'number' ? text.toFixed(6) : text,
    },
    {
      title: '纬度',
      dataIndex: 'latitude',
      hideInSearch: true,
      width: 120,
      render: (text) => typeof text === 'number' ? text.toFixed(6) : text,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 80,
      key: 'option',
      fixed: 'right',
      render: (_, record) => [
        <PermissionButton
          key="edit"
          hasPermission={canUpdateRegion}
          permissionName="编辑"
        >
          <Tooltip title="编辑">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              style={{ padding: 0 }}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
        </PermissionButton>,
        <PermissionButton
          key="delete"
          hasPermission={canDeleteRegion}
          permissionName="删除"
        >
          <Popconfirm
            title="确定删除这个省份吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button
                type="link"
                size="small"
                icon={<DeleteOutlined />}
                style={{ padding: 0, color: '#ff4d4f' }}
              />
            </Tooltip>
          </Popconfirm>
        </PermissionButton>,
      ],
    },
  ];

  // 城市列配置
  const cityColumns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 50,
      fixed: 'left',
      render: (_, __, index) => (
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: '#364657',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: '500',
            lineHeight: 1,
          }}
        >
          {index + 1}
        </div>
      ),
    },
    {
      title: '城市名称',
      dataIndex: 'name',
      width: 150,
      render: (dom, entity) => {
        return (
          <a
            onClick={async () => {
              setCurrentRow({ ...entity, type: 'city' });
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '区域代码',
      dataIndex: 'adcode',
      copyable: true,
      ellipsis: true,
      width: 120,
    },
    {
      title: '所属省份',
      dataIndex: 'provinceAdcode',
      width: 150,
      renderFormItem: () => (
        <Select
          placeholder="请选择省份"
          options={provinces}
          allowClear
        />
      ),
      render: (_, record) => record.provinceName,
    },
    {
      title: '城市代码',
      dataIndex: 'citycode',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '经度',
      dataIndex: 'longitude',
      hideInSearch: true,
      width: 120,
      render: (text) => typeof text === 'number' ? text.toFixed(6) : text,
    },
    {
      title: '纬度',
      dataIndex: 'latitude',
      hideInSearch: true,
      width: 120,
      render: (text) => typeof text === 'number' ? text.toFixed(6) : text,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 80,
      key: 'option',
      fixed: 'right',
      render: (_, record) => [
        <PermissionButton
          key="edit"
          hasPermission={canUpdateRegion}
          permissionName="编辑"
        >
          <Tooltip title="编辑">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              style={{ padding: 0 }}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
        </PermissionButton>,
        <PermissionButton
          key="delete"
          hasPermission={canDeleteRegion}
          permissionName="删除"
        >
          <Popconfirm
            title="确定删除这个城市吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button
                type="link"
                size="small"
                icon={<DeleteOutlined />}
                style={{ padding: 0, color: '#ff4d4f' }}
              />
            </Tooltip>
          </Popconfirm>
        </PermissionButton>,
      ],
    },
  ];

  // 区县列配置
  const districtColumns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 50,
      fixed: 'left',
      render: (_, __, index) => (
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: '#364657',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: '500',
            lineHeight: 1,
          }}
        >
          {index + 1}
        </div>
      ),
    },
    {
      title: '区县名称',
      dataIndex: 'name',
      width: 150,
      render: (dom, entity) => {
        return (
          <a
            onClick={async () => {
              setCurrentRow({ ...entity, type: 'district' });
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '区域代码',
      dataIndex: 'adcode',
      copyable: true,
      ellipsis: true,
      width: 120,
    },
    {
      title: '所属城市',
      dataIndex: 'cityName',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '所属省份',
      dataIndex: 'provinceName',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '经度',
      dataIndex: 'longitude',
      hideInSearch: true,
      width: 120,
      render: (text) => typeof text === 'number' ? text.toFixed(6) : text,
    },
    {
      title: '纬度',
      dataIndex: 'latitude',
      hideInSearch: true,
      width: 120,
      render: (text) => typeof text === 'number' ? text.toFixed(6) : text,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 80,
      key: 'option',
      fixed: 'right',
      render: (_, record) => [
        <PermissionButton
          key="edit"
          hasPermission={canUpdateRegion}
          permissionName="编辑"
        >
          <Tooltip title="编辑">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              style={{ padding: 0 }}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
        </PermissionButton>,
        <PermissionButton
          key="delete"
          hasPermission={canDeleteRegion}
          permissionName="删除"
        >
          <Popconfirm
            title="确定删除这个区县吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button
                type="link"
                size="small"
                icon={<DeleteOutlined />}
                style={{ padding: 0, color: '#ff4d4f' }}
              />
            </Tooltip>
          </Popconfirm>
        </PermissionButton>,
      ],
    },
  ];

  // 街道列配置
  const streetColumns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 50,
      fixed: 'left',
      render: (_, __, index) => (
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: '#364657',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: '500',
            lineHeight: 1,
          }}
        >
          {index + 1}
        </div>
      ),
    },
    {
      title: '街道名称',
      dataIndex: 'name',
      width: 150,
      render: (dom, entity) => {
        return (
          <a
            onClick={async () => {
              setCurrentRow({ ...entity, type: 'street' });
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '街道代码',
      dataIndex: 'adcode',
      copyable: true,
      ellipsis: true,
      width: 120,
    },
    {
      title: '所属区县',
      dataIndex: 'districtName',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '所属城市',
      dataIndex: 'cityName',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '所属省份',
      dataIndex: 'provinceName',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '经度',
      dataIndex: 'longitude',
      hideInSearch: true,
      width: 120,
      render: (text) => typeof text === 'number' ? text.toFixed(6) : text,
    },
    {
      title: '纬度',
      dataIndex: 'latitude',
      hideInSearch: true,
      width: 120,
      render: (text) => typeof text === 'number' ? text.toFixed(6) : text,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 80,
      key: 'option',
      fixed: 'right',
      render: (_, record) => [
        <PermissionButton
          key="edit"
          hasPermission={canUpdateRegion}
          permissionName="编辑"
        >
          <Tooltip title="编辑">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              style={{ padding: 0 }}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
        </PermissionButton>,
        <PermissionButton
          key="delete"
          hasPermission={canDeleteRegion}
          permissionName="删除"
        >
          <Popconfirm
            title="确定删除这个街道吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button
                type="link"
                size="small"
                icon={<DeleteOutlined />}
                style={{ padding: 0, color: '#ff4d4f' }}
              />
            </Tooltip>
          </Popconfirm>
        </PermissionButton>,
      ],
    },
  ];

  // 获取当前列配置
  const getCurrentColumns = () => {
    switch (activeTab) {
      case 'province':
        return provinceColumns;
      case 'city':
        return cityColumns;
      case 'district':
        return districtColumns;
      case 'street':
        return streetColumns;
      default:
        return provinceColumns;
    }
  };

  // 获取当前请求函数
  const getCurrentRequest = async (params: any) => {
    try {
      switch (activeTab) {
        case 'province':
          const provinceResponse = await getProvinceList({
            request: {
              current: params.current,
              pageSize: params.pageSize,
              keyword: params.name,
              adcode: params.adcode,
            }
          });
          return {
            data: provinceResponse.data?.records || [],
            success: provinceResponse.success || false,
            total: provinceResponse.data?.total || 0,
          };

        case 'city':
          const cityResponse = await getCityList({
            request: {
              current: params.current,
              pageSize: params.pageSize,
              keyword: params.name,
              adcode: params.adcode,
              provinceAdcode: params.provinceAdcode,
            }
          });
          return {
            data: cityResponse.data?.records || [],
            success: cityResponse.success || false,
            total: cityResponse.data?.total || 0,
          };

        case 'district':
          // 使用新的高性能后端分页API
          const districtResponse = await getDistrictsPage({
            current: params.current,
            pageSize: params.pageSize,
            keyword: params.name,
            adcode: params.adcode,
          });
          return {
            data: districtResponse.data?.records || [],
            success: districtResponse.success || false,
            total: districtResponse.data?.total || 0,
          };

        case 'street':
          // 使用新的高性能后端分页API
          const streetResponse = await getStreetsPage({
            current: params.current,
            pageSize: params.pageSize,
            keyword: params.name,
            adcode: params.adcode,
          });
          return {
            data: streetResponse.data?.records || [],
            success: streetResponse.success || false,
            total: streetResponse.data?.total || 0,
          };

        default:
          return { data: [], success: false, total: 0 };
      }
    } catch (error) {
      console.error('获取数据失败:', error);
      return { data: [], success: false, total: 0 };
    }
  };

  // 渲染表单字段
  const renderFormFields = () => {
    switch (activeTab) {
      case 'province':
        return (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="省份名称"
                  name="name"
                  rules={[{ required: true, message: '请输入省份名称' }]}
                >
                  <Input placeholder="请输入省份名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="区域代码"
                  name="adcode"
                  rules={[{ required: true, message: '请输入区域代码' }]}
                >
                  <Input placeholder="请输入区域代码" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="国家代码"
                  name="countryAdcode"
                >
                  <Input placeholder="请输入国家代码" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="经度"
                  name="longitude"
                >
                  <InputNumber
                    placeholder="请输入经度"
                    precision={6}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="纬度"
                  name="latitude"
                >
                  <InputNumber
                    placeholder="请输入纬度"
                    precision={6}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
        );

      case 'city':
        return (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="城市名称"
                  name="name"
                  rules={[{ required: true, message: '请输入城市名称' }]}
                >
                  <Input placeholder="请输入城市名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="区域代码"
                  name="adcode"
                  rules={[{ required: true, message: '请输入区域代码' }]}
                >
                  <Input placeholder="请输入区域代码" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="所属省份"
                  name="provinceAdcode"
                  rules={[{ required: true, message: '请选择所属省份' }]}
                >
                  <Select
                    placeholder="请选择所属省份"
                    options={provinces}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="城市代码"
                  name="citycode"
                >
                  <Input placeholder="请输入城市代码" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="经度"
                  name="longitude"
                >
                  <InputNumber
                    placeholder="请输入经度"
                    precision={6}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="纬度"
                  name="latitude"
                >
                  <InputNumber
                    placeholder="请输入纬度"
                    precision={6}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
        );

      case 'district':
        return (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="区县名称"
                  name="name"
                  rules={[{ required: true, message: '请输入区县名称' }]}
                >
                  <Input placeholder="请输入区县名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="区域代码"
                  name="adcode"
                  rules={[{ required: true, message: '请输入区域代码' }]}
                >
                  <Input placeholder="请输入区域代码" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="所属城市"
                  name="cityAdcode"
                  rules={[{ required: true, message: '请选择所属城市' }]}
                >
                  <Select
                    placeholder="请选择所属城市"
                    options={cities}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="经度"
                  name="longitude"
                >
                  <InputNumber
                    placeholder="请输入经度"
                    precision={6}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="纬度"
                  name="latitude"
                >
                  <InputNumber
                    placeholder="请输入纬度"
                    precision={6}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
        );

      case 'street':
        return (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="街道名称"
                  name="name"
                  rules={[{ required: true, message: '请输入街道名称' }]}
                >
                  <Input placeholder="请输入街道名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="街道代码"
                  name="adcode"
                  rules={[{ required: true, message: '请输入街道代码' }]}
                >
                  <Input placeholder="请输入街道代码" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="所属区县"
                  name="districtAdcode"
                  rules={[{ required: true, message: '请选择所属区县' }]}
                >
                  <Select
                    placeholder="请选择所属区县"
                    options={districts}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="经度"
                  name="longitude"
                >
                  <InputNumber
                    placeholder="请输入经度"
                    precision={6}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="纬度"
                  name="latitude"
                >
                  <InputNumber
                    placeholder="请输入纬度"
                    precision={6}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
        );

      default:
        return null;
    }
  };

  // 获取当前标题
  const getCurrentTitle = () => {
    switch (activeTab) {
      case 'province':
        return '省份管理';
      case 'city':
        return '城市管理';
      case 'district':
        return '区县管理';
      case 'street':
        return '街道管理';
      default:
        return '区域管理';
    }
  };

  // 获取新建按钮文本
  const getCreateButtonText = () => {
    switch (activeTab) {
      case 'province':
        return '新建省份';
      case 'city':
        return '新建城市';
      case 'district':
        return '新建区县';
      case 'street':
        return '新建街道';
      default:
        return '新建';
    }
  };

  return (
    <App>
      <PageContainer
      extra={[
        <PermissionButton
          key="step-wizard"
          hasPermission={canCreateRegion}
          permissionName="分步创建区域"
        >
          <Button
            type="primary"
            onClick={handleStepWizard}
            style={{ marginRight: 8 }}
          >
            分步创建区域
          </Button>
        </PermissionButton>,
        <Radio.Group
          key="view-mode"
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value)}
          buttonStyle="solid"
        >
          <Radio.Button value="table">
            <TableOutlined /> 表格视图
          </Radio.Button>
          <Radio.Button value="tree">
            <PartitionOutlined /> 树形视图
          </Radio.Button>
        </Radio.Group>
      ]}
    >

      {viewMode === 'tree' ? (
        <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
          {treeLoading ? (
            <div style={{ textAlign: 'center', padding: 50 }}>
              加载中...
            </div>
          ) : (
            <Tree
              showIcon
              treeData={treeData}
              loadData={async (node) => {
                try {
                  const children = await loadTreeChildren(node);

                  // 更新节点的children
                  const updateTreeData = (nodes: any[]): any[] => {
                    return nodes.map((item) => {
                      if (item.key === node.key) {
                        return { ...item, children };
                      }
                      if (item.children) {
                        return { ...item, children: updateTreeData(item.children) };
                      }
                      return item;
                    });
                  };

                  setTreeData(prev => updateTreeData(prev));
                } catch (error) {
                  console.error('树节点加载失败:', error);
                  messageApi.error('加载子节点失败，请重试');
                }
              }}
              titleRender={(nodeData) => (
                <Space>
                  <span>{nodeData.title}</span>
                  {nodeData.children && nodeData.children.length > 0 && (
                    <span style={{ color: '#999', fontSize: '12px' }}>
                      ({nodeData.children.length})
                    </span>
                  )}
                  {nodeData.data && (
                    <Tooltip title={`代码: ${nodeData.data.adcode} | 类型: ${nodeData.data.type} | 点击展开查看下级`}>
                      <span style={{ color: '#666', fontSize: '12px' }}>
                        {nodeData.data.adcode}
                      </span>
                    </Tooltip>
                  )}
                </Space>
              )}
            />
          )}
        </div>
      ) : (
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'province',
              label: (
                <span>
                  <GlobalOutlined />
                  省份管理
                </span>
              ),
              children: (
                <ProTable<any>
                  headerTitle={getCurrentTitle()}
                  actionRef={actionRef}
                  rowKey="id"
                  search={{
                    labelWidth: 120,
                  }}
                  pagination={{
                    defaultPageSize: 10,
                    showQuickJumper: true,
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} 共 ${total} 条`,
                  }}
                  toolBarRender={() => [
                    <PermissionButton
                      key="create"
                      hasPermission={canCreateRegion}
                      permissionName={`新建${getAreaTypeName(activeTab)}`}
                    >
                      <Button
                        type="primary"
                        onClick={handleCreate}
                      >
                        {getCreateButtonText()}
                      </Button>
                    </PermissionButton>,
                  ]}
                  request={getCurrentRequest}
                  columns={getCurrentColumns()}
                  rowSelection={{
                    onChange: (_, selectedRows) => {
                      setSelectedRows(selectedRows);
                    },
                  }}
                />
              ),
            },
            {
              key: 'city',
              label: (
                <span>
                  <BuildOutlined />
                  城市管理
                </span>
              ),
              children: (
                <ProTable<any>
                  headerTitle={getCurrentTitle()}
                  actionRef={actionRef}
                  rowKey="id"
                  search={{
                    labelWidth: 120,
                  }}
                  pagination={{
                    defaultPageSize: 10,
                    showQuickJumper: true,
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} 共 ${total} 条`,
                  }}
                  toolBarRender={() => [
                    <PermissionButton
                      key="create"
                      hasPermission={canCreateRegion}
                      permissionName={`新建${getAreaTypeName(activeTab)}`}
                    >
                      <Button
                        type="primary"
                        onClick={handleCreate}
                      >
                        {getCreateButtonText()}
                      </Button>
                    </PermissionButton>,
                  ]}
                  request={getCurrentRequest}
                  columns={getCurrentColumns()}
                  rowSelection={{
                    onChange: (_, selectedRows) => {
                      setSelectedRows(selectedRows);
                    },
                  }}
                />
              ),
            },
            {
              key: 'district',
              label: (
                <span>
                  <ApartmentOutlined />
                  区县管理
                </span>
              ),
              children: (
                <ProTable<any>
                  headerTitle={getCurrentTitle()}
                  actionRef={actionRef}
                  rowKey="id"
                  search={{
                    labelWidth: 120,
                  }}
                  pagination={{
                    defaultPageSize: 10,
                    showQuickJumper: true,
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} 共 ${total} 条`,
                  }}
                  toolBarRender={() => [
                    <PermissionButton
                      key="create"
                      hasPermission={canCreateRegion}
                      permissionName={`新建${getAreaTypeName(activeTab)}`}
                    >
                      <Button
                        type="primary"
                        onClick={handleCreate}
                      >
                        {getCreateButtonText()}
                      </Button>
                    </PermissionButton>,
                  ]}
                  request={getCurrentRequest}
                  columns={getCurrentColumns()}
                  rowSelection={{
                    onChange: (_, selectedRows) => {
                      setSelectedRows(selectedRows);
                    },
                  }}
                />
              ),
            },
            {
              key: 'street',
              label: (
                <span>
                  <HomeOutlined />
                  街道管理
                </span>
              ),
              children: (
                <ProTable<any>
                  headerTitle={getCurrentTitle()}
                  actionRef={actionRef}
                  rowKey="id"
                  search={{
                    labelWidth: 120,
                  }}
                  pagination={{
                    defaultPageSize: 10,
                    showQuickJumper: true,
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} 共 ${total} 条`,
                  }}
                  toolBarRender={() => [
                    <PermissionButton
                      key="create"
                      hasPermission={canCreateRegion}
                      permissionName={`新建${getAreaTypeName(activeTab)}`}
                    >
                      <Button
                        type="primary"
                        onClick={handleCreate}
                      >
                        {getCreateButtonText()}
                      </Button>
                    </PermissionButton>,
                  ]}
                  request={getCurrentRequest}
                  columns={getCurrentColumns()}
                  rowSelection={{
                    onChange: (_, selectedRows) => {
                      setSelectedRows(selectedRows);
                    },
                  }}
                />
              ),
            },
          ]}
        />
      )}

      <Drawer
        title={editingRecord ? `编辑${getAreaTypeName(activeTab)}` : `新建${getAreaTypeName(activeTab)}`}
        width={600}
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        destroyOnHidden
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" onClick={handleSubmit}>
                确定
              </Button>
            </Space>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          preserve={false}
        >
          {renderFormFields()}
        </Form>
      </Drawer>

      {/* 区域详情抽屉 */}
      <Drawer
        title={currentRow ? `${getAreaTypeName(currentRow.type)}详情：${currentRow.name}` : '区域详情'}
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        destroyOnHidden
      >
        {loadingDetail ? (
          <div style={{ padding: '50px', textAlign: 'center' }}>加载中...</div>
        ) : showDetail && currentRow ? (
          <ProDescriptions<any>
            column={1}
            bordered
            size="small"
            labelStyle={{ width: '130px', fontWeight: 'bold' }}
          >
            <ProDescriptions.Item label="名称">
              {currentRow.name}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="区域代码">
              {currentRow.adcode}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="类型">
              <Tag color="blue">{getAreaTypeName(currentRow.type)}</Tag>
            </ProDescriptions.Item>
            {currentRow.countryAdcode && (
              <ProDescriptions.Item label="国家代码">
                {currentRow.countryAdcode}
              </ProDescriptions.Item>
            )}
            {currentRow.citycode && (
              <ProDescriptions.Item label="城市代码">
                {currentRow.citycode}
              </ProDescriptions.Item>
            )}
            {currentRow.provinceName && (
              <ProDescriptions.Item label="所属省份">
                {currentRow.provinceName}
              </ProDescriptions.Item>
            )}
            {currentRow.cityName && (
              <ProDescriptions.Item label="所属城市">
                {currentRow.cityName}
              </ProDescriptions.Item>
            )}
            {currentRow.districtName && (
              <ProDescriptions.Item label="所属区县">
                {currentRow.districtName}
              </ProDescriptions.Item>
            )}
            {currentRow.longitude && (
              <ProDescriptions.Item label="经度">
                {typeof currentRow.longitude === 'number' ? currentRow.longitude.toFixed(6) : currentRow.longitude}
              </ProDescriptions.Item>
            )}
            {currentRow.latitude && (
              <ProDescriptions.Item label="纬度">
                {typeof currentRow.latitude === 'number' ? currentRow.latitude.toFixed(6) : currentRow.latitude}
              </ProDescriptions.Item>
            )}
            {currentRow.level && (
              <ProDescriptions.Item label="级别">
                {currentRow.level}
              </ProDescriptions.Item>
            )}
          </ProDescriptions>
        ) : (
          <div style={{ padding: '50px', textAlign: 'center' }}>暂无详情数据</div>
        )}
      </Drawer>

      {/* 分步创建向导 */}
      <Drawer
        title="分步创建区域层级"
        width={800}
        open={showStepWizard}
        onClose={() => setShowStepWizard(false)}
        destroyOnHidden
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              {currentStep > 0 && (
                <Button onClick={handleStepPrev}>
                  上一步
                </Button>
              )}
              <Button onClick={() => setShowStepWizard(false)}>
                取消
              </Button>
              <Button type="primary" onClick={handleStepNext}>
                {currentStep === 3 ? '完成' : '下一步'}
              </Button>
            </Space>
          </div>
        }
      >
        <div style={{ marginBottom: 24 }}>
          <Steps
            current={currentStep}
            progressDot={customDot}
            items={[
              {
                title: '创建省份',
                description: '输入省份基本信息',
              },
              {
                title: '创建城市',
                description: '在省份下创建城市',
              },
              {
                title: '创建区县',
                description: '在城市下创建区县',
              },
              {
                title: '创建街道',
                description: '在区县下创建街道',
              },
            ]}
          />
        </div>
        
        <div style={{ marginTop: 24 }}>
          <h3>{getStepTitle(currentStep)}</h3>
          {renderStepContent()}
        </div>
      </Drawer>
      </PageContainer>
    </App>
  );
};

export default AreaManagement;
