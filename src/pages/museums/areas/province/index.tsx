import type {
  ActionType,
  ProColumns,
} from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Button, message, Popconfirm, Modal, Form, Input, InputNumber } from 'antd';
import React, { useRef, useState } from 'react';
import { getProvinceList, deleteProvince, createProvince, updateProvince } from '@/services/museum-service-api/provinceController';
import { usePermission } from '@/utils/authUtils';
import { PermissionButton } from '@/components/PermissionControl';

/**
 * 省份管理页面
 */
const ProvinceList: React.FC = () => {
  const actionRef = useRef<ActionType | null>(null);
  const [selectedRowsState, setSelectedRows] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MuseumsAPI.ProvinceResponse | null>(null);
  const [form] = Form.useForm();

  const intl = useIntl();
  const [messageApi, contextHolder] = message.useMessage();

  // 权限检查
  const { hasAuth: canCreateProvince } = usePermission('system:regions:add');
  const { hasAuth: canUpdateProvince } = usePermission('system:regions:edit');
  const { hasAuth: canDeleteProvince } = usePermission('system:regions:delete');

  // 删除操作处理
  const handleDelete = async (id: number) => {
    try {
      await deleteProvince({ id });
      messageApi.success('删除成功');
      actionRef.current?.reload();
    } catch (error) {
      messageApi.error('删除失败');
    }
  };

  // 新建处理
  const handleCreate = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 编辑处理
  const handleEdit = (record: MuseumsAPI.ProvinceResponse) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // 表单提交处理
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingRecord) {
        // 编辑
        await updateProvince({ id: editingRecord.id }, values);
        messageApi.success('更新成功');
      } else {
        // 新建
        await createProvince(values);
        messageApi.success('创建成功');
      }

      setModalVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      messageApi.error(editingRecord ? '更新失败' : '创建失败');
    }
  };

  const columns: ProColumns<MuseumsAPI.ProvinceResponse>[] = [
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
      render: (dom, entity) => {
        return (
          <a
            onClick={async () => {
              // 可以添加省份详情查看功能
              messageApi.info('省份详情功能开发中...');
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
      width: 120,
    },
    {
      title: '经度',
      dataIndex: 'longitude',
      hideInSearch: true,
      width: 120,
      render: (text) => text ? Number(text).toFixed(6) : '-',
    },
    {
      title: '纬度',
      dataIndex: 'latitude',
      hideInSearch: true,
      width: 120,
      render: (text) => text ? Number(text).toFixed(6) : '-',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 200,
      render: (_, record) => [
        <PermissionButton
          key="edit"
          hasPermission={canUpdateProvince}
          permissionName="编辑省份"
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
          key="cities"
          type="link"
          size="small"
          onClick={() => {
            messageApi.info('查看城市功能开发中...');
          }}
        >
          查看城市
        </Button>,
        <PermissionButton
          key="delete"
          hasPermission={canDeleteProvince}
          permissionName="删除省份"
        >
          <Popconfirm
            title="确定删除这个省份吗？"
            onConfirm={() => handleDelete(record.id)}
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
      <ProTable<MuseumsAPI.ProvinceResponse>
        headerTitle="省份管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <PermissionButton
            key="create"
            hasPermission={canCreateProvince}
            permissionName="新建省份"
          >
            <Button
              type="primary"
              onClick={handleCreate}
            >
              新建省份
            </Button>
          </PermissionButton>,
        ]}
        request={async (params, sort, filter) => {
          try {
            const response = await getProvinceList({
              current: params.current || 1,
              pageSize: params.pageSize || 20,
              name: params.name,
              adcode: params.adcode,
            });

            return {
              data: response.data?.records || [],
              success: response.success,
              total: response.data?.total || 0,
            };
          } catch (error) {
            messageApi.error('获取省份列表失败');
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
      {selectedRowsState?.length > 0 && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 16,
            paddingRight: 16,
            boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.15)',
            backgroundColor: '#fff',
          }}
        >
          <span>已选择 {selectedRowsState.length} 项</span>
          <Button
            onClick={() => {
              messageApi.success(`批量删除 ${selectedRowsState.length} 个省份`);              setSelectedRows([]);
              actionRef.current?.reload();
            }}
          >
            批量删除
          </Button>
        </div>
      )}

      {/* 新建/编辑表单弹窗 */}
      <Modal
        title={editingRecord ? '编辑省份' : '新建省份'}
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
            name="name"
            label="省份名称"
            rules={[{ required: true, message: '请输入省份名称' }]}
          >
            <Input placeholder="请输入省份名称" />
          </Form.Item>

          <Form.Item
            name="adcode"
            label="区域代码"
            rules={[{ required: true, message: '请输入区域代码' }]}
          >
            <Input placeholder="请输入区域代码" />
          </Form.Item>

          <Form.Item
            name="countryAdcode"
            label="国家代码"
            rules={[{ required: true, message: '请输入国家代码' }]}
          >
            <Input placeholder="请输入国家代码" defaultValue="100000" />
          </Form.Item>

          <Form.Item
            name="longitude"
            label="经度"
          >
            <InputNumber
              placeholder="请输入经度"
              style={{ width: '100%' }}
              precision={6}
              step={0.000001}
            />
          </Form.Item>

          <Form.Item
            name="latitude"
            label="纬度"
          >
            <InputNumber
              placeholder="请输入纬度"
              style={{ width: '100%' }}
              precision={6}
              step={0.000001}
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default ProvinceList;
