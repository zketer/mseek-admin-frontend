import { getExhibitionPage, deleteExhibition, updateStatus } from '@/services/museum-service-api/museumExhibitionController';
import { getMuseumPage1 } from '@/services/museum-service-api/museumInfoController';
import { ActionType, PageContainer, ProColumns, ProTable, FooterToolbar, ProDescriptions } from '@ant-design/pro-components';
import { Button, Card, Modal, Space, Tag, Typography, Popconfirm, Tooltip, Drawer, App, Select, Empty, Image } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from '@umijs/max';
import React, { useState, useCallback } from 'react';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { usePermission } from '@/utils/authUtils';
import { PermissionButton, PermissionSwitch } from '@/components/PermissionControl';
import { useCRUD } from '@/hooks';

const { Text } = Typography;

/**
 * 展览状态映射
 */
const exhibitionStatusMap = {
  0: { text: '已结束', color: 'default' },
  1: { text: '进行中', color: 'success' },
  2: { text: '未开始', color: 'processing' },
};

/**
 * 是否常设展览映射
 */
const isPermanentMap = {
  0: { text: '临时展览', color: 'blue' },
  1: { text: '常设展览', color: 'purple' },
};

/**
 * 博物馆展览列表页面
 */
const ExhibitionList: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRowsState, setSelectedRows] = useState<MuseumsAPI.ExhibitionResponse[]>([]);
  const [currentMuseum, setCurrentMuseum] = useState<{ id: number; name: string } | null>(null);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<MuseumsAPI.ExhibitionResponse>();
  const [museumOptions, setMuseumOptions] = useState<{ value: number; label: string }[]>([]);
  const [loadingMuseums, setLoadingMuseums] = useState<boolean>(false);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();
  const { message } = App.useApp();

  // 权限检查
  const { hasAuth: canCreateExhibition } = usePermission('museums:exhibitions:add');
  const { hasAuth: canUpdateExhibition } = usePermission('museums:exhibitions:edit');
  const { hasAuth: canDeleteExhibition } = usePermission('museums:exhibitions:delete');
  const { hasAuth: canUpdateStatus } = usePermission('museums:exhibitions:edit'); // 状态切换也属于编辑权限

  // ✅ 使用 useCRUD Hook 简化代码 (展览需要 museumId，仅使用 actionRef)
  const {
    actionRef,
  } = useCRUD<MuseumsAPI.ExhibitionResponse>({});

  // 加载博物馆列表
  const loadMuseumOptions = useCallback(async () => {
    if (museumOptions.length > 0) return; // 避免重复加载
    
    setLoadingMuseums(true);
    try {
      const response = await getMuseumPage1({ 
        query: { 
          page: 1, 
          size: 100, // 加载前100个博物馆
          status: 1 // 只加载启用的博物馆
        } 
      });
      
      if (response.success && response.data?.records) {
        const options = response.data.records.map(museum => ({
          value: museum.id || 0,
          label: museum.name || '',
        }));
        setMuseumOptions(options);
      }
    } catch (error) {
      message.error('加载博物馆列表失败');
    } finally {
      setLoadingMuseums(false);
    }
  }, [museumOptions.length, message]);

  /**
   * 博物馆选择列配置
   */
  const museumColumns: ProColumns<MuseumsAPI.MuseumResponse>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.museum.index',
        defaultMessage: '序号',
      }),
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
      title: intl.formatMessage({
        id: 'pages.museumInfo.museum.name',
        defaultMessage: '博物馆名称',
      }),
      dataIndex: 'name',
      ellipsis: true,
      width: 180,
      formItemProps: {
        rules: [{ required: true, message: '此项为必填项' }],
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.museum.address',
        defaultMessage: '地址',
      }),
      dataIndex: 'address',
      ellipsis: true,
      hideInSearch: true,
      width: 240,
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.museum.status',
        defaultMessage: '状态',
      }),
      dataIndex: 'status',
      width: 80,
      valueEnum: {
        0: {
          text: intl.formatMessage({
            id: 'pages.museumInfo.museum.status.disabled',
            defaultMessage: '禁用',
          }),
          status: 'Default'
        },
        1: {
          text: intl.formatMessage({
            id: 'pages.museumInfo.museum.status.enabled',
            defaultMessage: '启用',
          }),
          status: 'Success'
        },
      },
      render: (_, record) => (
        <PermissionSwitch
          hasPermission={false}
          checked={record.status === 1}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          disabled
          onChange={() => {}}
          permissionName="博物馆状态"
        />
      ),
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.exhibition.actions',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      width: 40,
      fixed: 'right',
      render: (_, record) => [
        <Tooltip
          key="select"
          title={intl.formatMessage({
            id: 'pages.museumInfo.exhibition.selectMuseum',
            defaultMessage: '选择此博物馆',
          })}
        >
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setCurrentMuseum({ id: record.id || 0, name: record.name || '' });
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }}
          >
            {intl.formatMessage({
              id: 'pages.museumInfo.exhibition.select',
              defaultMessage: '选择',
            })}
          </Button>
        </Tooltip>,
      ],
    },
  ];


  // Handle single delete (展览需要 museumId，保留自定义逻辑)
  const handleDelete = useCallback(
    async (record: MuseumsAPI.ExhibitionResponse) => {
      try {
        await deleteExhibition({ museumId: record.museumId!, id: record.id! });
        message.success(
          intl.formatMessage({
            id: 'pages.museumInfo.exhibition.deleteSuccess',
            defaultMessage: '删除成功',
          })
        );
        actionRef.current?.reload();
      } catch (error) {
        message.error(
          intl.formatMessage({
            id: 'pages.museumInfo.exhibition.deleteFailed',
            defaultMessage: '删除失败',
          })
        );
      }
    },
    [intl, message, actionRef]
  );

  // Handle status change (展览需要 museumId，保留自定义逻辑)
  const handleStatusChange = useCallback(
    async (record: MuseumsAPI.ExhibitionResponse, checked: boolean) => {
      try {
        const newStatus = checked ? 1 : 0;
        await updateStatus({ museumId: record.museumId!, id: record.id!, status: newStatus });
        message.success(
          intl.formatMessage({
            id: 'pages.museumInfo.exhibition.statusUpdateSuccess',
            defaultMessage: '状态更新成功',
          })
        );
        actionRef.current?.reload();
      } catch (error) {
        message.error(
          intl.formatMessage({
            id: 'pages.museumInfo.exhibition.statusUpdateFailed',
            defaultMessage: '状态更新失败',
          })
        );
      }
    },
    [intl, message, actionRef]
  );

  /**
   * Delete exhibition
   *
   * @param selectedRows
   */
  const handleRemove = useCallback(
    async (selectedRows: MuseumsAPI.ExhibitionResponse[]) => {
      if (!selectedRows?.length) {
        message.warning(intl.formatMessage({
          id: 'pages.museumInfo.exhibition.pleaseSelectDelete',
          defaultMessage: 'Please select items to delete',
        }));
        return;
      }
      if (!currentMuseum) {
        message.error(intl.formatMessage({
          id: 'pages.museumInfo.exhibition.pleaseSelectMuseum',
          defaultMessage: 'Please select museum first',
        }));
        return;
      }

      try {
        const promises = selectedRows.map((row) => 
          deleteExhibition({ museumId: currentMuseum.id, id: row.id! })
        );
        await Promise.all(promises);
        
        message.success(
          intl.formatMessage({
            id: 'pages.museumInfo.exhibition.batchDeleteSuccess',
            defaultMessage: '批量删除成功',
          })
        );
        setSelectedRows([]);
        actionRef.current?.reload();
      } catch (error) {
        message.error(
          intl.formatMessage({
            id: 'pages.museumInfo.exhibition.batchDeleteFailed',
            defaultMessage: '批量删除失败',
          })
        );
      }
    },
    [message, intl, currentMuseum, actionRef],
  );


  /**
   * 展览列
   */
  const exhibitionColumns: ProColumns<MuseumsAPI.ExhibitionResponse>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.exhibition.index',
        defaultMessage: '序号',
      }),
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
      title: intl.formatMessage({
        id: 'pages.museumInfo.exhibition.title',
        defaultMessage: '展览标题',
      }),
      dataIndex: 'title',
      render: (dom, entity) => {
        return (
          <a
            onClick={async () => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.exhibition.startDate',
        defaultMessage: '开始日期',
      }),
      dataIndex: 'startDate',
      valueType: 'date',
      search: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.exhibition.endDate',
        defaultMessage: '结束日期',
      }),
      dataIndex: 'endDate',
      valueType: 'date',
      search: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.exhibition.location',
        defaultMessage: '展厅位置',
      }),
      dataIndex: 'location',
      search: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.exhibition.ticketPrice',
        defaultMessage: '门票价格',
      }),
      dataIndex: 'ticketPrice',
      valueType: 'money',
      search: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.exhibition.type',
        defaultMessage: '展览类型',
      }),
      dataIndex: 'isPermanent',
      valueEnum: {
        0: {
          text: intl.formatMessage({
            id: 'pages.museumInfo.exhibition.type.temporary',
            defaultMessage: '临时展览',
          })
        },
        1: {
          text: intl.formatMessage({
            id: 'pages.museumInfo.exhibition.type.permanent',
            defaultMessage: '常设展览',
          })
        },
      },
      render: (_, record) => {
        const isPermanent = record.isPermanent || 0;
        const { text, color } = isPermanentMap[isPermanent as keyof typeof isPermanentMap];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.exhibition.status',
        defaultMessage: '状态',
      }),
      dataIndex: 'status',
      valueEnum: {
        0: {
          text: intl.formatMessage({
            id: 'pages.museumInfo.exhibition.status.ended',
            defaultMessage: '已结束',
          }),
          status: 'Default'
        },
        1: {
          text: intl.formatMessage({
            id: 'pages.museumInfo.exhibition.status.ongoing',
            defaultMessage: '进行中',
          }),
          status: 'Success'
        },
      },
      render: (_, record) => (
        <PermissionSwitch
          hasPermission={canUpdateStatus ?? false}
          checked={record.status === 1}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          onChange={(checked) => handleStatusChange(record, checked)}
          permissionName="展览状态切换"
        />
      ),
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.exhibition.createAt',
        defaultMessage: '创建时间',
      }),
      dataIndex: 'createAt',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.exhibition.actions',
        defaultMessage: '操作',
      }),
      width: 80,
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => [
        <PermissionButton key="edit" hasPermission={canUpdateExhibition ?? false} permissionName="编辑展览">
          <UpdateForm
            trigger={
              <Tooltip
                title={intl.formatMessage({
                  id: 'pages.museumInfo.exhibition.edit',
                  defaultMessage: '编辑',
                })}
              >
                <Button
                  type="link"
                  size="small"
                  icon={<EditOutlined />}
                  style={{ padding: 0 }}
                />
              </Tooltip>
            }
            onOk={actionRef.current?.reload}
            values={record}
            museumId={currentMuseum?.id || 0}
          />
        </PermissionButton>,
        <PermissionButton key="delete" hasPermission={canDeleteExhibition ?? false} permissionName="删除展览">
          <Popconfirm
            title={intl.formatMessage({
              id: 'pages.museumInfo.exhibition.deleteConfirm',
              defaultMessage: '确定要删除这个展览吗？',
            })}
            onConfirm={() => handleDelete(record)}
            okText={intl.formatMessage({
              id: 'pages.common.confirm',
              defaultMessage: '确定',
            })}
            cancelText={intl.formatMessage({
              id: 'pages.common.cancel',
              defaultMessage: '取消',
            })}
          >
            <Tooltip
              title={intl.formatMessage({
                id: 'pages.museumInfo.exhibition.delete',
                defaultMessage: '删除',
              })}
            >
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

  return (
    <PageContainer>
      {!currentMuseum ? (
        <ProTable<MuseumsAPI.MuseumResponse, any>
            headerTitle={intl.formatMessage({
              id: 'pages.museumInfo.exhibition.selectMuseumTitle',
              defaultMessage: '选择博物馆',
            })}
            rowKey="id"
            columns={museumColumns}
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
                intl.formatMessage(
                  { id: 'pages.common.pagination.total', defaultMessage: '共 {total} 条' },
                  { total },
                ),
            }}
            scroll={{ x: 600 }}
            dateFormatter="string"
            request={async (params) => {
              try {
                const response = await getMuseumPage1({
                  query: {
                    page: params.current || 1,
                    size: params.pageSize || 10,
                    name: params.name,
                    status: params.status,
                  },
                });
                return {
                  data: response.data?.records || [],
                  success: response.success,
                  total: response.data?.total || 0,
                };
              } catch (error) {
                return {
                  data: [],
                  success: false,
                  total: 0,
                };
              }
            }}
          />
      ) : (
        <Card style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Text strong>{intl.formatMessage({
                id: 'pages.museumInfo.exhibition.currentMuseum',
                defaultMessage: '当前选择的博物馆：',
              })}</Text>
              <Text style={{ marginLeft: 8 }}>{currentMuseum.name}</Text>
            </div>
            <Button onClick={() => setCurrentMuseum(null)}>
              {intl.formatMessage({
                id: 'pages.museumInfo.exhibition.reselect',
                defaultMessage: '重新选择',
              })}
            </Button>
          </div>
        </Card>
      )}

      {currentMuseum && (
        <Card>
        <ProTable<MuseumsAPI.ExhibitionResponse, any>
            headerTitle={intl.formatMessage({
              id: 'pages.museumInfo.exhibition.list',
              defaultMessage: '展览列表',
            })}
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
                intl.formatMessage(
                  {
                    id: 'pages.common.pagination.total',
                    defaultMessage: '{start}-{end} of {total} items',
                  },
                  {
                    start: range[0],
                    end: range[1],
                    total: total,
                  }
                ),
            }}
            scroll={{ x: 1200 }}
            dateFormatter="string"
            toolbar={{
              title: intl.formatMessage({
                id: 'pages.museumInfo.exhibition.advancedTable',
                defaultMessage: '展览列表',
              }),
            }}
            toolBarRender={() => [
              <PermissionButton key="create" hasPermission={canCreateExhibition ?? false} permissionName="新建展览">
                <CreateForm reload={async () => { await actionRef.current?.reload?.(); }} museumId={currentMuseum?.id || 0} museumName={currentMuseum?.name || ''} />
              </PermissionButton>,
            ]}
            request={async (params) => {
              const { current, pageSize, ...rest } = params;
              const query = {
                page: current,
                size: pageSize,
                museumId: currentMuseum.id,
                ...rest,
              };
              const response = await getExhibitionPage({ museumId: currentMuseum.id, query });
              if (response.success && response.data) {
                return {
                  data: response.data.records || [],
                  success: true,
                  total: response.data.total || 0,
                };
              }
              return {
                data: [],
                success: false,
                total: 0,
              };
            }}
            columns={exhibitionColumns}
            rowSelection={{
              onChange: (_, selectedRows) => {
                setSelectedRows(selectedRows);
              },
            }}
          />
        </Card>
      )}
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Selected" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="items" />
            </div>
          }
        >
          <Button
            onClick={() => {
              handleRemove(selectedRowsState);
            }}
          >
            <FormattedMessage id="pages.museumInfo.exhibition.batchDeletion" defaultMessage="Batch deletion" />
          </Button>
        </FooterToolbar>
      )}
      
      {/* 展览详情抽屉 */}
      <Drawer
        title={intl.formatMessage({
          id: 'pages.museumInfo.exhibition.detail',
          defaultMessage: '展览详情',
        })}
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        {currentRow ? (
          <div style={{ padding: '20px 0' }}>
            {/* Exhibition Details */}
            <ProDescriptions<MuseumsAPI.ExhibitionResponse>
              column={1}
              bordered
              size="small"
              request={async () => ({
                data: currentRow || {},
              })}
              params={{
                id: currentRow.id,
              }}
            columns={[
              {
                title: intl.formatMessage({
                  id: 'pages.museumInfo.exhibition.title',
                  defaultMessage: '展览标题',
                }),
                dataIndex: 'title',
              },
              {
                title: intl.formatMessage({
                  id: 'pages.museumInfo.exhibition.startDate',
                  defaultMessage: '开始日期',
                }),
                dataIndex: 'startDate',
                valueType: 'date',
              },
              {
                title: intl.formatMessage({
                  id: 'pages.museumInfo.exhibition.endDate',
                  defaultMessage: '结束日期',
                }),
                dataIndex: 'endDate',
                valueType: 'date',
              },
              {
                title: intl.formatMessage({
                  id: 'pages.museumInfo.exhibition.location',
                  defaultMessage: '展厅位置',
                }),
                dataIndex: 'location',
              },
              {
                title: intl.formatMessage({
                  id: 'pages.museumInfo.exhibition.ticketPrice',
                  defaultMessage: '门票价格',
                }),
                dataIndex: 'ticketPrice',
                valueType: 'money',
              },
              {
                title: intl.formatMessage({
                  id: 'pages.museumInfo.exhibition.maxVisitors',
                  defaultMessage: '最大游客数',
                }),
                dataIndex: 'maxVisitors',
              },
              {
                title: intl.formatMessage({
                  id: 'pages.museumInfo.exhibition.description',
                  defaultMessage: '展览描述',
                }),
                dataIndex: 'description',
                valueType: 'textarea',
              },
              {
                title: intl.formatMessage({
                  id: 'pages.museumInfo.exhibition.status',
                  defaultMessage: '状态',
                }),
                dataIndex: 'status',
                render: (_, record) => (
                  <Tag color={exhibitionStatusMap[record.status as keyof typeof exhibitionStatusMap]?.color}>
                    {exhibitionStatusMap[record.status as keyof typeof exhibitionStatusMap]?.text}
                  </Tag>
                ),
              },
              {
                title: intl.formatMessage({
                  id: 'pages.museumInfo.exhibition.createAt',
                  defaultMessage: '创建时间',
                }),
                dataIndex: 'createAt',
                valueType: 'dateTime',
              },
              {
                title: intl.formatMessage({
                  id: 'pages.museumInfo.exhibition.images',
                  defaultMessage: '展览图片',
                }),
                dataIndex: 'imageUrls',
                render: (_, record) => {
                  const imageUrls = record.imageUrls;
                  return imageUrls && imageUrls.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {imageUrls.map((url: string, index: number) => (
                        <div key={index} style={{ width: 100, height: 60, overflow: 'hidden', borderRadius: 6, border: '1px solid #d9d9d9' }}>
                          <Image 
                            src={url} 
                            alt={`展览图片${index + 1}`}
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover'
                            }}
                            preview={{
                              mask: '预览'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : '暂无图片';
                },
              },
            ]}
            labelStyle={{ width: '130px', fontWeight: 'bold' }}
          />
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <span>
              {intl.formatMessage({
                id: 'pages.common.loading',
                defaultMessage: '加载中...',
              })}
            </span>
          </div>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default ExhibitionList;
