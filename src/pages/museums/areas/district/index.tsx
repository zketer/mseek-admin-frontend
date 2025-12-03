import type {
  ActionType,
  ProColumns,
} from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Button, message, Popconfirm, Cascader, Modal, Form, Input, InputNumber } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import { getDistrictsByCity, getAllProvinces1, getCitiesByProvince1 } from '@/services/museum-service-api/areaDivisionController';
import { usePermission } from '@/utils/authUtils';
import { PermissionButton } from '@/components/PermissionControl';

/**
 * 区县管理页面
 */
const DistrictList: React.FC = () => {
  const actionRef = useRef<ActionType | null>(null);
  const [selectedRowsState, setSelectedRows] = useState<any[]>([]);
  const [cascaderData, setCascaderData] = useState<any[]>([]);

  const intl = useIntl();
  const [messageApi, contextHolder] = message.useMessage();

  // 权限检查
  const { hasAuth: canCreateDistrict } = usePermission('system:regions:add');
  const { hasAuth: canUpdateDistrict } = usePermission('system:regions:edit');
  const { hasAuth: canDeleteDistrict } = usePermission('system:regions:delete');

  // 加载级联数据
  const loadCascaderData = async () => {
    try {
      const provincesResponse = await getAllProvinces1();
      if (provincesResponse.success && provincesResponse.data) {
        const cascaderOptions = await Promise.all(
          provincesResponse.data.map(async (province: any) => {
            try {
              const citiesResponse = await getCitiesByProvince1({ provinceCode: province.adcode });
              const children = citiesResponse.success && citiesResponse.data
                ? citiesResponse.data.map((city: any) => ({
                    value: city.adcode,
                    label: city.name,
                  }))
                : [];

              return {
                value: province.adcode,
                label: province.name,
                children,
              };
            } catch (error) {
              console.error(`加载省份 ${province.name} 的城市失败:`, error);
              return {
                value: province.adcode,
                label: province.name,
                children: [],
              };
            }
          })
        );
        setCascaderData(cascaderOptions);
      }
    } catch (error) {
      console.error('加载级联数据失败:', error);
    }
  };

  useEffect(() => {
    loadCascaderData();
  }, []);

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
      title: '区县名称',
      dataIndex: 'name',
      render: (dom, entity) => {
        return (
          <a
            onClick={async () => {
              messageApi.info('区县详情功能开发中...');
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
      title: '所属地区',
      dataIndex: 'cascader',
      hideInTable: true,
      renderFormItem: () => (
        <Cascader
          placeholder="请选择省份/城市"
          options={cascaderData}
          changeOnSelect
          allowClear
        />
      ),
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
      width: 150,
      render: (_, record) => [
        <PermissionButton
          key="edit"
          hasPermission={canUpdateDistrict}
          permissionName="编辑区县"
        >
          <Button
            type="link"
            size="small"
            onClick={() => {
              messageApi.info('编辑功能开发中...');
            }}
          >
            编辑
          </Button>
        </PermissionButton>,
        <PermissionButton
          key="delete"
          hasPermission={canDeleteDistrict}
          permissionName="删除区县"
        >
          <Popconfirm
            title="确定删除这个区县吗？"
            onConfirm={() => {
              messageApi.success('删除成功');
              actionRef.current?.reload();
            }}
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
        headerTitle="区县管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <PermissionButton
            key="create"
            hasPermission={canCreateDistrict}
            permissionName="新建区县"
          >
            <Button
              type="primary"
              onClick={() => {
                messageApi.info('新建区县功能开发中...');
              }}
            >
              新建区县
            </Button>
          </PermissionButton>,
        ]}
        request={async (params) => {
          try {
            // 如果有城市筛选，按城市加载区县
            if (params.cascader?.length > 1) {
              const [, cityAdcode] = params.cascader;
              const response = await getDistrictsByCity({ cityCode: cityAdcode });

              let filteredData = response.data || [];

              // 客户端过滤
              if (params.name) {
                filteredData = filteredData.filter((item: any) =>
                  item.name.includes(params.name)
                );
              }
              if (params.adcode) {
                filteredData = filteredData.filter((item: any) =>
                  item.adcode.includes(params.adcode)
                );
              }

              return {
                data: filteredData,
                success: response.success || false,
                total: filteredData.length,
              };
            }

            // 如果没有城市筛选，加载所有省份的所有城市的区县数据
            const provincesResponse = await getAllProvinces1();
            if (!provincesResponse.success || !provincesResponse.data) {
              return { data: [], success: false, total: 0 };
            }

            let allDistricts: any[] = [];

            // 遍历所有省份
            for (const province of provincesResponse.data) {
              try {
                // 获取省份下的所有城市
                if (!province.adcode) continue;
                const citiesResponse = await getCitiesByProvince1({ provinceCode: province.adcode });
                if (citiesResponse.success && citiesResponse.data) {
                  // 遍历城市，获取区县
                  for (const city of citiesResponse.data) {
                    try {
                      if (!city.adcode) continue;
                      const districtsResponse = await getDistrictsByCity({ cityCode: city.adcode });
                      if (districtsResponse.success && districtsResponse.data) {
                        // 为每个区县添加省份和城市信息
                        const districtsWithInfo = districtsResponse.data.map((district: any) => ({
                          ...district,
                          cityName: city.name,
                          provinceName: province.name,
                          cityAdcode: city.adcode,
                          provinceAdcode: province.adcode,
                        }));
                        allDistricts = allDistricts.concat(districtsWithInfo);
                      }
                    } catch (error) {
                      console.error(`获取城市 ${city.name} 的区县失败:`, error);
                    }
                  }
                }
              } catch (error) {
                console.error(`获取省份 ${province.name} 的城市失败:`, error);
              }
            }

            // 客户端过滤
            let filteredData = allDistricts;
            if (params.name) {
              filteredData = filteredData.filter((item: any) =>
                item.name.includes(params.name)
              );
            }
            if (params.adcode) {
              filteredData = filteredData.filter((item: any) =>
                item.adcode.includes(params.adcode)
              );
            }

            // 分页处理
            const current = params.current || 1;
            const pageSize = params.pageSize || 20;
            const startIndex = (current - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedData = filteredData.slice(startIndex, endIndex);

            return {
              data: paginatedData,
              success: true,
              total: filteredData.length,
            };
          } catch (error) {
            console.error('获取区县列表失败:', error);
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
    </PageContainer>
  );
};

export default DistrictList;
