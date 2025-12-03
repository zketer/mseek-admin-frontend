import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Popconfirm, Tag, Tooltip, App, Space, Badge } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  PlusOutlined,
  AndroidOutlined,
  AppleOutlined,
  StarOutlined,
} from '@ant-design/icons';
import React, { useCallback, useRef, useState } from 'react';
import {
  getAppVersions,
  deleteAppVersion,
  getDownloadUrl,
  markAsLatest,
} from '@/services/museum-service-api/appVersionController';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import DetailDrawer from './components/DetailDrawer';
import { usePermission } from '@/utils/authUtils';
import { PermissionButton } from '@/components/PermissionControl';
import './index.less';

/**
 * 应用版本管理页面
 */
const AppVersionsPage: React.FC = () => {
  const actionRef = useRef<ActionType | null>(null);
  const [selectedRowsState, setSelectedRows] = useState<MuseumsAPI.AppVersionResponse[]>([]);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MuseumsAPI.AppVersionResponse | null>(null);

  const intl = useIntl();
  const { message, modal } = App.useApp();

  // 权限检查
  const { hasAuth: canViewDetail } = usePermission('about:app-versions:view');
  const { hasAuth: canAddVersion } = usePermission('about:app-versions:add');
  const { hasAuth: canEditVersion } = usePermission('about:app-versions:edit');
  const { hasAuth: canDeleteVersion } = usePermission('about:app-versions:delete');
  const { hasAuth: canDownload } = usePermission('about:app-versions:download');
  const { hasAuth: canMarkLatest } = usePermission('about:app-versions:mark-latest');

  // 处理删除
  const handleDelete = useCallback(
    async (record: MuseumsAPI.AppVersionResponse) => {
      try {
        const response = await deleteAppVersion({ id: record.id! });
        if (response.success) {
          message.success('删除成功');
          actionRef.current?.reload();
        } else {
          message.error(response.message || '删除失败');
        }
      } catch (error: any) {
        console.error('Failed to delete version:', error);
        message.error(error.message || '删除失败');
      }
    },
    [message]
  );

  // 处理下载
  const handleDownload = useCallback(
    async (record: MuseumsAPI.AppVersionResponse) => {
      try {
        // 1. 获取下载URL（后端会自动增加下载次数）
        const urlResponse = await getDownloadUrl({ id: record.id! });

        if (urlResponse.success && urlResponse.data) {
          // 2. 创建下载链接
          const link = document.createElement('a');
          link.href = urlResponse.data;
          const ext = record.platform === 'android' ? 'apk' : 'ipa';
          link.download = `mseek.${record.platform}.${record.versionName}.${ext}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          message.success(
            `开始下载 ${record.versionName} (${record.platform?.toUpperCase()})`
          );

          // 3. 刷新列表以显示更新后的下载次数
          actionRef.current?.reload();
        } else {
          message.error(urlResponse.message || '获取下载地址失败');
        }
      } catch (error: any) {
        console.error('下载失败:', error);
        message.error(error.message || '下载失败');
      }
    },
    [message]
  );

  // 标记为最新版本
  const handleMarkAsLatest = useCallback(
    async (record: MuseumsAPI.AppVersionResponse) => {
      try {
        const response = await markAsLatest({ id: record.id! });
        if (response.success) {
          message.success('已标记为最新版本');
          actionRef.current?.reload();
        } else {
          message.error(response.message || '操作失败');
        }
      } catch (error: any) {
        console.error('Failed to mark as latest:', error);
        message.error(error.message || '操作失败');
      }
    },
    [message]
  );

  // 批量删除
  const handleBatchDelete = useCallback(
    async (selectedRows: MuseumsAPI.AppVersionResponse[]) => {
      if (!selectedRows?.length) {
        message.warning('请选择要删除的版本');
        return;
      }

      modal.confirm({
        title: '批量删除确认',
        content: `确定要删除选中的 ${selectedRows.length} 个版本吗？`,
        onOk: async () => {
          try {
            const promises = selectedRows.map((row) => deleteAppVersion({ id: row.id! }));
            await Promise.all(promises);
            message.success('批量删除成功');
            setSelectedRows([]);
            actionRef.current?.reload();
          } catch (error) {
            console.error('Failed to batch delete versions:', error);
            message.error('批量删除失败');
          }
        },
      });
    },
    [message, modal]
  );

  // 获取平台图标
  const getPlatformIcon = (platform?: string) => {
    if (platform === 'android') {
      return <AndroidOutlined style={{ color: '#3DDC84', fontSize: 16 }} />;
    } else if (platform === 'ios') {
      return <AppleOutlined style={{ color: '#000000', fontSize: 16 }} />;
    }
    return null;
  };

  // 获取状态标签
  const getStatusTag = (status?: string) => {
    const statusMap = {
      published: { color: 'success', text: '已发布' },
      draft: { color: 'default', text: '草稿' },
      deprecated: { color: 'error', text: '已废弃' },
    };
    const config = statusMap[status as keyof typeof statusMap];
    return config ? <Tag color={config.color}>{config.text}</Tag> : null;
  };

  // 获取更新类型标签
  const getUpdateTypeTag = (type?: string) => {
    const typeMap = {
      major: { color: 'red', text: '重大更新' },
      minor: { color: 'orange', text: '功能更新' },
      patch: { color: 'blue', text: '修复更新' },
    };
    const config = typeMap[type as keyof typeof typeMap];
    return config ? <Tag color={config.color}>{config.text}</Tag> : null;
  };

  const columns: ProColumns<MuseumsAPI.AppVersionResponse>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 50,
      fixed: 'left',
    },
    {
      title: '版本名称',
      dataIndex: 'versionName',
      width: 120,
      fixed: 'left',
      render: (_, record) => (
        <Space>
          <a
            style={{ fontWeight: 'bold' }}
            onClick={() => {
              setSelectedRecord(record);
              setDetailDrawerOpen(true);
            }}
          >
            {record.versionName}
          </a>
          {record.isLatest && (
            <Badge status="success" text="最新" style={{ fontSize: 12 }} />
          )}
        </Space>
      ),
    },
    {
      title: '版本号',
      dataIndex: 'versionCode',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '平台',
      dataIndex: 'platform',
      width: 100,
      valueType: 'select',
      valueEnum: {
        android: {
          text: 'Android',
          status: 'Success',
        },
        ios: {
          text: 'iOS',
          status: 'Default',
        },
        all: {
          text: '全部',
          status: 'Processing',
        },
      },
      render: (_, record) => (
        <Space>
          {getPlatformIcon(record.platform)}
          <span>{record.platform?.toUpperCase()}</span>
        </Space>
      ),
    },
    {
      title: '更新类型',
      dataIndex: 'updateType',
      width: 110,
      valueType: 'select',
      valueEnum: {
        major: { text: '重大更新', status: 'Error' },
        minor: { text: '功能更新', status: 'Warning' },
        patch: { text: '修复更新', status: 'Processing' },
      },
      render: (_, record) => getUpdateTypeTag(record.updateType),
    },
    {
      title: '发布日期',
      dataIndex: 'releaseDate',
      valueType: 'date',
      width: 120,
      sorter: true,
    },
    {
      title: '文件大小',
      dataIndex: 'fileSize',
      width: 100,
      hideInSearch: true,
      render: (text) => text || '-',
    },
    {
      title: '下载次数',
      dataIndex: 'downloadCount',
      width: 100,
      hideInSearch: true,
      sorter: true,
      render: (_, record) => (
        <Badge
          count={record.downloadCount || 0}
          overflowCount={9999}
          style={{ backgroundColor: '#52c41a' }}
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        published: { text: '已发布', status: 'Success' },
        draft: { text: '草稿', status: 'Default' },
        deprecated: { text: '已废弃', status: 'Error' },
      },
      render: (_, record) => getStatusTag(record.status),
    },
    {
      title: '强制更新',
      dataIndex: 'forceUpdate',
      width: 100,
      hideInSearch: true,
      render: (_, record) => (
        <Tag color={record.forceUpdate ? 'red' : 'default'}>
          {record.forceUpdate ? '是' : '否'}
        </Tag>
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 180,
      fixed: 'right',
      render: (_, record) => {
        const actions = [];
        
        // 标记为最新（显示但可能禁用）
        if (!record.isLatest && record.status === 'published') {
          actions.push(
            <PermissionButton
              key="latest"
              hasPermission={canMarkLatest}
              permissionName="标记最新"
            >
              <Tooltip title="标记为最新版本">
                <Button
                  type="link"
                  size="small"
                  icon={<StarOutlined />}
                  onClick={() => handleMarkAsLatest(record)}
                  style={{ padding: 0 }}
                />
              </Tooltip>
            </PermissionButton>
          );
        }
        
        // 下载（显示但可能禁用）
        actions.push(
          <PermissionButton
            key="download"
            hasPermission={canDownload}
            permissionName="下载应用"
          >
            <Tooltip title="下载">
              <Button
                type="link"
                size="small"
                icon={<DownloadOutlined />}
                onClick={() => handleDownload(record)}
                disabled={record.status === 'deprecated'}
                style={{ padding: 0 }}
              />
            </Tooltip>
          </PermissionButton>
        );
        
        // 编辑（显示但可能禁用）
        actions.push(
          <PermissionButton
            key="edit"
            hasPermission={canEditVersion}
            permissionName="编辑版本"
          >
            <UpdateForm 
              record={record} 
              reload={async () => await actionRef.current?.reload?.() || Promise.resolve()} 
            />
          </PermissionButton>
        );
        
        // 删除（显示但可能禁用）
        actions.push(
          <PermissionButton
            key="delete"
            hasPermission={canDeleteVersion}
            permissionName="删除版本"
          >
            <Popconfirm
              title="确定要删除这个版本吗？"
              onConfirm={() => handleDelete(record)}
              okText="确定"
              cancelText="取消"
            >
              <Tooltip title="删除">
                <Button
                  type="link"
                  size="small"
                  icon={<DeleteOutlined />}
                  danger
                  style={{ padding: 0 }}
                />
              </Tooltip>
            </Popconfirm>
          </PermissionButton>
        );
        
        return actions;
      },
    },
  ];

  return (
    <PageContainer
      header={{
        title: '应用版本管理',
        subTitle: '管理文博探索移动应用的版本发布和下载',
      }}
    >
      <ProTable<MuseumsAPI.AppVersionResponse, any>
        headerTitle="版本列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
          layout: 'vertical',
          defaultCollapsed: true,
        }}
        pagination={{
          defaultPageSize: 10,
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
        }}
        scroll={{ x: 1400 }}
        dateFormatter="string"
        toolBarRender={() => [
          <PermissionButton
            key="create"
            hasPermission={canAddVersion}
            permissionName="新增版本"
          >
            <CreateForm 
              reload={async () => await actionRef.current?.reload?.() || Promise.resolve()} 
            />
          </PermissionButton>,
        ]}
        request={async (params, sort) => {

          try {
            const response = await getAppVersions({
              query: {
                current: params.current || 1,
                pageSize: params.pageSize || 10,
                keyword: params.keyword,
                platform: params.platform as 'android' | 'ios' | undefined,
                status: params.status as 'published' | 'draft' | 'deprecated' | undefined,
              },
            });

            if (response.success && response.data) {
              return {
                data: response.data.records || [],
                total: response.data.total || 0,
                success: true,
              };
            } else {
              message.error(response.message || '加载版本列表失败');
              return {
                data: [],
                total: 0,
                success: false,
              };
            }
          } catch (error: any) {
            console.error('加载版本列表失败:', error);
            message.error(error.message || '加载版本列表失败');
            return {
              data: [],
              total: 0,
              success: false,
            };
          }
        }}
        columns={columns}
        rowSelection={canDeleteVersion ? {
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        } : false}
      />
      {selectedRowsState?.length > 0 && canDeleteVersion && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            background: '#fff',
            padding: '16px',
            boxShadow: '0 -2px 8px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Space>
            <span>已选择 {selectedRowsState.length} 项</span>
            <Button onClick={() => setSelectedRows([])}>取消选择</Button>
          </Space>
          <Space>
            <Button danger onClick={() => handleBatchDelete(selectedRowsState)}>
              批量删除
            </Button>
          </Space>
        </div>
      )}

      {/* 详情抽屉 */}
      <DetailDrawer
        open={detailDrawerOpen}
        record={selectedRecord}
        onClose={() => {
          setDetailDrawerOpen(false);
          setSelectedRecord(null);
        }}
      />
    </PageContainer>
  );
};

export default AppVersionsPage;
