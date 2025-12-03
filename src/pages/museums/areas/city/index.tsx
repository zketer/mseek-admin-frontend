import type {
  ActionType,
  ProColumns,
} from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Button, message, Popconfirm, Select, Modal, Form, Input, InputNumber } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import { getCityList, createCity, updateCity, deleteCity } from '@/services/museum-service-api/cityController';
import { getProvinceList } from '@/services/museum-service-api/provinceController';
import { usePermission } from '@/utils/authUtils';
import { PermissionButton } from '@/components/PermissionControl';

/**
 * 城市管理页面
 */
const CityList: React.FC = () => {
  const actionRef = useRef<ActionType | null>(null);
  const [selectedRowsState, setSelectedRows] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [form] = Form.useForm();

  const intl = useIntl();
  const [messageApi, contextHolder] = message.useMessage();

  // 权限检查
  const { hasAuth: canCreateCity } = usePermission('system:regions:add');
  const { hasAuth: canUpdateCity } = usePermission('system:regions:edit');
  const { hasAuth: canDeleteCity } = usePermission('system:regions:delete');

  // 加载省份数据
  const loadProvinces = async () => {
    try {
      const response = await getProvinceList({
        request: {}
      });
      if (response.success && response.data?.records) {
        const provinceOptions = response.data.records.map((province: any) => ({
          value: province.adcode,
          label: province.name,
        }));
        setProvinces(provinceOptions);
      }
    } catch (error) {
      console.error('加载省份数据失败:', error);
    }
  };

  useEffect(() => {
    loadProvinces();
  }, []);

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
    form.setFieldsValue({
      name: record.name,
      adcode: record.adcode,
      provinceAdcode: record.provinceAdcode,
      citycode: record.citycode,
      longitude: record.longitude,
      latitude: record.latitude,
    });
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingRecord) {
        // 更新
        await updateCity(
          { id: editingRecord.id },
          values
        );
        messageApi.success('城市更新成功');
      } else {
        // 创建
        await createCity(values);
        messageApi.success('城市创建成功');
      }

      setModalVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      console.error('操作失败:', error);
      messageApi.error('操作失败，请重试');
    }
  };

  // 处理删除
  const handleDelete = async (record: any) => {
    try {
      await deleteCity({ id: record.id });
      messageApi.success('删除成功');
      actionRef.current?.reload();
    } catch (error) {
      console.error('删除失败:', error);
      messageApi.error('删除失败，请重试');
    }
  };

  const columns: ProColumns<any>[] = [
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
      render: (dom, entity) => {
        return (
          <a
            onClick={async () => {
              messageApi.info('城市详情功能开发中...');
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
      width: 200,
      render: (_, record) => [
        <PermissionButton
          key="edit"
          hasPermission={canUpdateCity}
          permissionName="编辑城市"
        >
          <Button
            type="link"
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
        </PermissionButton>,
        <Button
          key="districts"
          type="link"
          size="small"
          onClick={() => {
            messageApi.info('查看区县功能开发中...');
          }}
        >
          查看区县
        </Button>,
        <PermissionButton
          key="delete"
          hasPermission={canDeleteCity}
          permissionName="删除城市"
        >
          <Popconfirm
            title="确定删除这个城市吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </PermissionButton>,
      ],
    },
  ];

  return (
    <PageContainer>
      {contextHolder}
      <ProTable<any>
        headerTitle="城市管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <PermissionButton
            key="create"
            hasPermission={canCreateCity}
            permissionName="新建城市"
          >
            <Button
              type="primary"
              onClick={handleCreate}
            >
              新建城市
            </Button>
          </PermissionButton>,
        ]}
        request={async (params) => {
          try {
            const response = await getCityList({
              request: {
                current: params.current,
                pageSize: params.pageSize,
                keyword: params.name,
                adcode: params.adcode,
                provinceAdcode: params.provinceAdcode,
              }
            });

            return {
              data: response.data?.records || [],
              success: response.success || false,
              total: response.data?.total || 0,
            };
          } catch (error) {
            console.error('获取城市列表失败:', error);
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />

      <Modal
        title={editingRecord ? '编辑城市' : '新建城市'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          preserve={false}
        >
          <Form.Item
            label="城市名称"
            name="name"
            rules={[{ required: true, message: '请输入城市名称' }]}
          >
            <Input placeholder="请输入城市名称" />
          </Form.Item>

          <Form.Item
            label="区域代码"
            name="adcode"
            rules={[{ required: true, message: '请输入区域代码' }]}
          >
            <Input placeholder="请输入区域代码" />
          </Form.Item>

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

          <Form.Item
            label="城市代码"
            name="citycode"
          >
            <Input placeholder="请输入城市代码" />
          </Form.Item>

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
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default CityList;
