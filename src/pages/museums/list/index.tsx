import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, Popconfirm, Tag, Tooltip, App, Image } from 'antd';
import { EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import React, { useCallback, useState, useEffect } from 'react';
import { usePermission } from '@/utils/authUtils';
import { getMuseumPage1, deleteMuseum, updateStatus1, getMuseumById } from '@/services/museum-service-api/museumInfoController';
import { getAllProvinces } from '@/services/museum-service-api/areaProvinceController';
import { getCitiesByProvince } from '@/services/museum-service-api/areaCityController';
import { getDistrictsByCity } from '@/services/museum-service-api/areaDistrictController';
import { getStreetsByDistrict } from '@/services/museum-service-api/areaStreetController';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { PermissionButton, PermissionSwitch } from '@/components/PermissionControl';
import { useCRUD } from '@/hooks';
import type { AreaOption } from '@/types/common';

/**
 * 博物馆列表页面
 */
const MuseumList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<MuseumsAPI.MuseumResponse>();
  const [selectedRowsState, setSelectedRows] = useState<MuseumsAPI.MuseumResponse[]>([]);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [areaOptions, setAreaOptions] = useState<AreaOption[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();
  
  const { message } = App.useApp();

  // 权限检查
  const { hasAuth: canCreateMuseum } = usePermission('museums:list:add');
  const { hasAuth: canUpdateMuseum } = usePermission('museums:list:edit');
  const { hasAuth: canDeleteMuseum } = usePermission('museums:list:delete');
  const { hasAuth: canUpdateStatus } = usePermission('museums:list:status');

  // ✅ 使用 useCRUD Hook 简化代码
  const {
    actionRef,
    handleDelete: crudHandleDelete,
    handleBatchDelete: crudHandleBatchDelete,
    handleStatusUpdate: crudHandleStatusUpdate,
  } = useCRUD<MuseumsAPI.MuseumResponse>({
    deleteAPI: async (id) => {
      const response = await deleteMuseum({ id: Number(id) });
      return response;
    },
    batchDeleteAPI: async (ids) => {
      const promises = ids.map((id) => deleteMuseum({ id: Number(id) }));
      await Promise.all(promises);
      return { success: true, code: 200, message: '批量删除成功', data: null, timestamp: Date.now() };
    },
    updateStatusAPI: async (id, status) => {
      const response = await updateStatus1({ id: Number(id), status });
      return response;
    },
    messages: {
      deleteSuccess: intl.formatMessage({
        id: 'pages.museumInfo.museum.deleteSuccess',
        defaultMessage: '删除成功',
      }),
      statusUpdateSuccess: intl.formatMessage({
        id: 'pages.museumInfo.museum.statusUpdateSuccess',
        defaultMessage: '状态更新成功',
      }),
    },
  });



  // 懒加载地区选项数据 - 初始只加载省份数据
  const loadProvinceOptions = useCallback(async () => {
    try {
      const provincesRes = await getAllProvinces();
      if (!provincesRes?.success || !provincesRes.data) {
        return [];
      }
      
      // 初始只构建省份级别的选项，设置isLeaf为false表示有子级
      const options: AreaOption[] = provincesRes.data.map((province: any) => ({
        value: province.adcode,
        label: province.name,
        isLeaf: false, // 表示还有子级数据需要懒加载
      }));
      
      setAreaOptions(options);
      return options;
    } catch (error) {
      console.error('[Error] Failed to load province options:', error);
      return [];
    }
  }, []);

  // 懒加载下级地区数据
  const loadChildrenOptions = useCallback(async (selectedOptions: AreaOption[]) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    const level = selectedOptions.length;
    
    try {
      if (level === 1) {
        // 加载城市数据
        const citiesRes = await getCitiesByProvince({ provinceAdcode: targetOption.value });
        const cities = citiesRes?.success && citiesRes.data ? citiesRes.data : [];
        
        targetOption.children = cities.map((city: any): AreaOption => ({
          value: city.adcode,
          label: city.name,
          isLeaf: false, // 城市下还有区县
        }));
        
      } else if (level === 2) {
        // 加载区县数据
        const districtsRes = await getDistrictsByCity({ cityCode: targetOption.value });
        const districts = districtsRes?.success && districtsRes.data ? districtsRes.data : [];
        
        targetOption.children = districts.map((district: any): AreaOption => ({
          value: district.adcode,
          label: district.name,
          isLeaf: false, // 区县下还有街道
        }));
        
      } else if (level === 3) {
        // 加载街道数据
        const streetsRes = await getStreetsByDistrict({ districtCode: targetOption.value });
        const streets = streetsRes?.success && streetsRes.data ? streetsRes.data : [];
        
        targetOption.children = streets.map((street: any): AreaOption => ({
          value: street.adcode,
          label: street.name,
          isLeaf: true, // 街道是最后一级
        }));
      }
      
      // 更新状态，触发重新渲染
      setAreaOptions([...areaOptions]);
      
    } catch (error) {
      console.error(`Failed to load children for ${targetOption.label}:`, error);
      // 即使加载失败，也标记为叶子节点，避免无限加载
      targetOption.isLeaf = true;
      setAreaOptions([...areaOptions]);
    }
  }, [areaOptions]);

  // 组件初始化时只加载省份数据
  useEffect(() => {
    loadProvinceOptions();
  }, [loadProvinceOptions]);

  // ✅ 使用 useMemo 缓存 columns 定义，避免每次渲染都重新创建
  const columns: ProColumns<MuseumsAPI.MuseumResponse>[] = React.useMemo(() => [
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
        defaultMessage: 'Museum Name',
      }),
      dataIndex: 'name',
      render: (dom, entity) => {
        return (
          <a
            onClick={async () => {
              setLoadingDetail(true);
              try {
                // 调用详情接口获取完整数据
                const response = await getMuseumById({ id: entity.id! });
                if (response.success && response.data) {
                  setCurrentRow(response.data);
                } else {
                  setCurrentRow(entity);
                }
              } catch (error) {
                console.error('Failed to fetch museum detail:', error);
                setCurrentRow(entity);
              } finally {
                setLoadingDetail(false);
                setShowDetail(true);
              }
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.museum.code',
        defaultMessage: 'Museum Code',
      }),
      dataIndex: 'code',
      copyable: true,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.museum.address',
        defaultMessage: 'Address',
      }),
      dataIndex: 'address',
      ellipsis: true,
      hideInSearch: true,
      width: 200,
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.museum.areaSearch',
        defaultMessage: 'Area',
      }),
      dataIndex: 'areaSearch',
      hideInTable: true,
      valueType: 'cascader',
      fieldProps: {
        options: areaOptions,
        placeholder: intl.formatMessage({
          id: 'pages.museumInfo.museum.form.area.placeholder',
          defaultMessage: 'Please select area',
        }),
        expandTrigger: 'hover',
        showSearch: true,
        changeOnSelect: true,
        loadData: loadChildrenOptions, // 懒加载函数
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.museum.categories',
        defaultMessage: 'Categories',
      }),
      dataIndex: 'categories',
      hideInSearch: true,
      render: (_, record) => {
        const categories = record.categories;
        if (!categories || categories.length === 0) {
          return '-';
        }
        return (
          <>
            {categories.slice(0, 2).map((category) => (
              <Tag key={category.id} color="blue">
                {category.name}
              </Tag>
            ))}
            {categories.length > 2 && <Tag>+{categories.length - 2}</Tag>}
          </>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.museum.level',
        defaultMessage: 'Level',
      }),
      dataIndex: 'level',
      hideInForm: true,
      width: 80,
      valueEnum: {
        0: {
          text: intl.formatMessage({
            id: 'pages.museumInfo.museum.level.none',
            defaultMessage: 'No Level',
          }),
        },
        1: {
          text: intl.formatMessage({
            id: 'pages.museumInfo.museum.level.one',
            defaultMessage: 'Level 1',
          }),
        },
        2: {
          text: intl.formatMessage({
            id: 'pages.museumInfo.museum.level.two',
            defaultMessage: 'Level 2',
          }),
        },
        3: {
          text: intl.formatMessage({
            id: 'pages.museumInfo.museum.level.three',
            defaultMessage: 'Level 3',
          }),
        },
        4: {
          text: intl.formatMessage({
            id: 'pages.museumInfo.museum.level.four',
            defaultMessage: 'Level 4',
          }),
        },
        5: {
          text: intl.formatMessage({
            id: 'pages.museumInfo.museum.level.five',
            defaultMessage: 'Level 5',
          }),
        },
      },
      render: (_, record) => {
        const level = record.level;
        let color = 'default';
        let text = intl.formatMessage({
          id: 'pages.museumInfo.museum.level.none',
          defaultMessage: 'No Level',
        });

        if (level === 1) {
          color = 'blue';
          text = intl.formatMessage({
            id: 'pages.museumInfo.museum.level.one',
            defaultMessage: 'Level 1',
          });
        } else if (level === 2) {
          color = 'cyan';
          text = intl.formatMessage({
            id: 'pages.museumInfo.museum.level.two',
            defaultMessage: 'Level 2',
          });
        } else if (level === 3) {
          color = 'green';
          text = intl.formatMessage({
            id: 'pages.museumInfo.museum.level.three',
            defaultMessage: 'Level 3',
          });
        } else if (level === 4) {
          color = 'orange';
          text = intl.formatMessage({
            id: 'pages.museumInfo.museum.level.four',
            defaultMessage: 'Level 4',
          });
        } else if (level === 5) {
          color = 'red';
          text = intl.formatMessage({
            id: 'pages.museumInfo.museum.level.five',
            defaultMessage: 'Level 5',
          });
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.museum.status',
        defaultMessage: 'Status',
      }),
      dataIndex: 'status',
      hideInForm: true,
      width: 100,
      valueEnum: {
        0: {
          text: intl.formatMessage({
            id: 'pages.museumInfo.museum.status.closed',
            defaultMessage: 'Closed',
          }),
          status: 'Default',
        },
        1: {
          text: intl.formatMessage({
            id: 'pages.museumInfo.museum.status.open',
            defaultMessage: 'Open',
          }),
          status: 'Success',
        },
      },
      render: (_, record) => (
        <PermissionSwitch
          hasPermission={canUpdateStatus}
          checked={record.status === 1}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          onChange={(checked) => crudHandleStatusUpdate(record.id!, checked ? 1 : 0)}
          permissionName="状态切换"
        />
      ),
    },
    {
      title: intl.formatMessage({
        id: 'pages.museumInfo.museum.actions',
        defaultMessage: 'Actions',
      }),
      dataIndex: 'option',
      valueType: 'option',
      width: 80,
      key: 'option',
      fixed: 'right',
      render: (_, record) => [
        <PermissionButton key="edit" hasPermission={canUpdateMuseum} permissionName="编辑博物馆">
          <UpdateForm
            trigger={
              <Tooltip
                title={intl.formatMessage({
                  id: 'pages.museumInfo.museum.edit',
                  defaultMessage: 'Edit',
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
          />
        </PermissionButton>,
        <PermissionButton key="delete" hasPermission={canDeleteMuseum} permissionName="删除博物馆">
          <Popconfirm
            title={intl.formatMessage({
              id: 'pages.museumInfo.museum.deleteConfirm',
              defaultMessage: '确定要删除这个博物馆吗？',
            })}
            onConfirm={() => crudHandleDelete(record.id!)}
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
                id: 'pages.museumInfo.museum.delete',
                defaultMessage: 'Delete',
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
  ], [intl, canUpdateStatus, canUpdateMuseum, canDeleteMuseum, crudHandleStatusUpdate, crudHandleDelete, actionRef]);
  // ⬆️ 依赖项包含所有在columns中使用的变量

  // ✅ 使用 useCallback 缓存批量删除函数
  // 批量删除博物馆
  const handleBatchDelete = useCallback(
    async (selectedRows: MuseumsAPI.MuseumResponse[]) => {
      if (!selectedRows?.length) {
        message.warning(
          intl.formatMessage({
            id: 'pages.museumInfo.museum.pleaseSelectDelete',
            defaultMessage: '请选择要删除的项',
          })
        );
        return;
      }

      const ids = selectedRows.map((row) => row.id!);
      const success = await crudHandleBatchDelete(ids);
      if (success) {
        setSelectedRows([]);
      }
    },
    [crudHandleBatchDelete, message, intl]
  );

  return (
    <PageContainer>
      <ProTable<MuseumsAPI.MuseumResponse, any>
        headerTitle={intl.formatMessage({
          id: 'pages.museumInfo.museum.title',
          defaultMessage: 'Museum Management',
        })}
        actionRef={actionRef}
        rowKey="id"
        skeleton={true}
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
                total,
              }
            ),
        }}
        scroll={{ x: 1200 }}
        dateFormatter="string"
        toolbar={{
          title: intl.formatMessage({
            id: 'pages.museumInfo.museum.advancedTable',
            defaultMessage: '博物馆列表',
          }),
        }}
        toolBarRender={() => [
          <PermissionButton key="create" hasPermission={canCreateMuseum} permissionName="新建博物馆">
            <CreateForm reload={actionRef.current?.reload} />
          </PermissionButton>,
        ]}
        request={async (params, sort, filter) => {
          // 处理地区搜索参数
          let areaSearchParams = {};
          if (params.areaSearch && Array.isArray(params.areaSearch) && params.areaSearch.length > 0) {
            // 地区级联选择器返回的是数组，最后一个元素是最深层级的选择
            const selectedArea = params.areaSearch[params.areaSearch.length - 1];
            
            // 根据选择的层级设置对应的参数
            if (params.areaSearch.length === 1) {
              // 只选择了省份
              areaSearchParams = { provinceCode: selectedArea };
            } else if (params.areaSearch.length === 2) {
              // 选择了省份和城市
              areaSearchParams = { 
                provinceCode: params.areaSearch[0],
                cityCode: selectedArea 
              };
            } else if (params.areaSearch.length === 3) {
              // 选择了省份、城市和区县
              areaSearchParams = { 
                provinceCode: params.areaSearch[0],
                cityCode: params.areaSearch[1],
                districtCode: selectedArea 
              };
            } else if (params.areaSearch.length === 4) {
              // 选择了省份、城市、区县和街道
              areaSearchParams = { 
                provinceCode: params.areaSearch[0],
                cityCode: params.areaSearch[1],
                districtCode: params.areaSearch[2],
                streetCode: selectedArea 
              };
            }
          }

          // 直接构造查询参数，不嵌套在query对象中
          const queryParams = {
            page: params.current || 1,
            size: params.pageSize || 10,
            name: params.name || undefined,
            status: params.status,
            level: params.level,
            ...areaSearchParams,
          };

          try {
            const response = await getMuseumPage1({ query: queryParams });

            return {
              data: response.data?.records || [],
              success: response.success,
              total: response.data?.total || 0,
            };
          } catch (error) {
            console.error('API request failed:', error);
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
              handleBatchDelete(selectedRowsState);
            }}
          >
            <FormattedMessage id="pages.museumInfo.museum.batchDeletion" defaultMessage="Batch deletion" />
          </Button>
        </FooterToolbar>
      )}

      <Drawer
        title={intl.formatMessage(
          {
            id: 'pages.museumInfo.museum.detailTitle',
            defaultMessage: 'Museum Details: {name}',
          },
          { name: currentRow?.name }
        )}
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        destroyOnClose
      >
        {loadingDetail ? (
          <div style={{ padding: '50px', textAlign: 'center' }}>加载中...</div>
        ) : showDetail && currentRow ? (
          <ProDescriptions<MuseumsAPI.MuseumResponse>
            column={1}
            bordered
            size="small"
            styles={{ label: { width: '130px', fontWeight: 'bold' } }}
          >
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.museum.name',
                defaultMessage: 'Museum Name',
              })}
            >
              {currentRow.name}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.museum.code',
                defaultMessage: 'Museum Code',
              })}
            >
              {currentRow.code}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.museum.location',
                defaultMessage: 'Location',
              })}
            >
              {[currentRow.provinceName, currentRow.cityName, currentRow.districtName].filter(Boolean).join(' - ')}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.museum.address',
                defaultMessage: 'Address',
              })}
            >
              {currentRow.address || '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.museum.phone',
                defaultMessage: 'Phone',
              })}
            >
              {currentRow.phone || '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.museum.website',
                defaultMessage: 'Website',
              })}
            >
              {currentRow.website ? (
                <a href={currentRow.website} target="_blank" rel="noopener noreferrer">
                  {currentRow.website}
                </a>
              ) : (
                '-'
              )}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.museum.openTime',
                defaultMessage: 'Open Time',
              })}
            >
              {currentRow.openTime || '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.museum.capacity',
                defaultMessage: 'Capacity',
              })}
            >
              {currentRow.capacity ? `${currentRow.capacity} ${intl.formatMessage({
                id: 'pages.museumInfo.museum.capacity.unit',
                defaultMessage: 'people/day',
              })}` : '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.museum.status',
                defaultMessage: 'Status',
              })}
            >
              <Tag color={currentRow.status === 1 ? 'success' : 'default'}>
                {currentRow.status === 1
                  ? intl.formatMessage({
                      id: 'pages.museumInfo.museum.status.open',
                      defaultMessage: 'Open',
                    })
                  : intl.formatMessage({
                      id: 'pages.museumInfo.museum.status.closed',
                      defaultMessage: 'Closed',
                    })
                }
              </Tag>
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.museum.level',
                defaultMessage: 'Level',
              })}
            >
              <Tag color={currentRow.level === 1 ? 'blue' : currentRow.level === 2 ? 'cyan' : currentRow.level === 3 ? 'green' : currentRow.level === 4 ? 'orange' : currentRow.level === 5 ? 'red' : 'default'}>
                {currentRow.level === 0
                  ? intl.formatMessage({
                      id: 'pages.museumInfo.museum.level.none',
                      defaultMessage: 'No Level',
                    })
                  : intl.formatMessage({
                      id: `pages.museumInfo.museum.level.${currentRow.level === 1 ? 'one' : currentRow.level === 2 ? 'two' : currentRow.level === 3 ? 'three' : currentRow.level === 4 ? 'four' : 'five'}`,
                      defaultMessage: `Level ${currentRow.level}`,
                    })
                }
              </Tag>
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.museum.categories',
                defaultMessage: 'Categories',
              })}
            >
              {currentRow.categories && currentRow.categories.length > 0 ? (
                <>
                  {currentRow.categories.map((category) => (
                    <Tag key={category.id} color="blue">
                      {category.name}
                    </Tag>
                  ))}
                </>
              ) : (
                '-'
              )}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.museum.tags',
                defaultMessage: 'Tags',
              })}
            >
              {currentRow.tags && currentRow.tags.length > 0 ? (
                <>
                  {currentRow.tags.map((tag) => (
                    <Tag key={tag.id} color={tag.color || 'default'}>
                      {tag.name}
                    </Tag>
                  ))}
                </>
              ) : (
                '-'
              )}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.museum.type',
                defaultMessage: 'Type',
              })}
            >
              {currentRow.type || '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.museum.freeAdmission',
                defaultMessage: 'Free Admission',
              })}
            >
              <Tag color={currentRow.freeAdmission === 1 ? 'green' : 'orange'}>
                {currentRow.freeAdmission === 1
                  ? intl.formatMessage({
                      id: 'pages.museumInfo.museum.yes',
                      defaultMessage: 'Yes',
                    })
                  : intl.formatMessage({
                      id: 'pages.museumInfo.museum.no',
                      defaultMessage: 'No',
                    })
                }
              </Tag>
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.museum.collectionCount',
                defaultMessage: 'Collection Count',
              })}
            >
              {currentRow.collectionCount ? currentRow.collectionCount.toLocaleString() : '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.museum.visitorCount',
                defaultMessage: 'Annual Visitors',
              })}
            >
              {currentRow.visitorCount ? `${currentRow.visitorCount.toLocaleString()} ${intl.formatMessage({
                id: 'pages.museumInfo.museum.visitorCount.unit',
                defaultMessage: 'people',
              })}` : '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.museum.description',
                defaultMessage: 'Description',
              })}
              span={2}
            >
              {currentRow.description || '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.museum.ticketPrice',
                defaultMessage: 'Ticket Price',
              })}
            >
              {currentRow.ticketPrice !== undefined && currentRow.ticketPrice !== null
                ? (currentRow.ticketPrice === 0
                   ? intl.formatMessage({
                       id: 'pages.museumInfo.museum.free',
                       defaultMessage: 'Free',
                     })
                   : `¥${currentRow.ticketPrice}`)
                : '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.museum.ticketDescription',
                defaultMessage: 'Ticket Description',
              })}
            >
              {currentRow.ticketDescription || '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.museum.createAt',
                defaultMessage: 'Created',
              })}
            >
              {currentRow.createAt ? currentRow.createAt.split('T').join(' ') : '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.museum.updateAt',
                defaultMessage: 'Updated',
              })}
            >
              {currentRow.updateAt ? currentRow.updateAt.split('T').join(' ') : '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.museum.logo',
                defaultMessage: 'Logo',
              })}
            >
              {currentRow.logoUrl ? (
                <Image 
                  src={currentRow.logoUrl} 
                  alt={`${currentRow.name} Logo`}
                  style={{ 
                    maxWidth: 100,
                    maxHeight: 100,
                    objectFit: 'contain'
                  }}
                  preview={{
                    mask: '预览'
                  }}
                />
              ) : (
                '-'
              )}
            </ProDescriptions.Item>
            {/* 博物馆图片 - 移动到最后 */}
            <ProDescriptions.Item
              label={intl.formatMessage({
                id: 'pages.museumInfo.museum.images',
                defaultMessage: '博物馆图片',
              })}
              span={2}
            >
              {currentRow.imageUrls && currentRow.imageUrls.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {currentRow.imageUrls.map((url, index) => (
                    <div key={index} style={{ width: 100, height: 60, overflow: 'hidden', borderRadius: 6, border: '1px solid #d9d9d9' }}>
                      <img 
                        src={url} 
                        alt={`博物馆图片${index + 1}`}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          // 简单的图片预览
                          const preview = document.createElement('div');
                          preview.innerHTML = `<img src="${url}" style="max-width: 100%; max-height: 100%;" />`;
                          const modal = document.createElement('div');
                          modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 9999; cursor: pointer;';
                          modal.appendChild(preview);
                          modal.onclick = () => document.body.removeChild(modal);
                          document.body.appendChild(modal);
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : '-'}
            </ProDescriptions.Item>
          </ProDescriptions>
        ) : (
          <div style={{ padding: '50px', textAlign: 'center' }}>暂无详情数据</div>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default MuseumList;
