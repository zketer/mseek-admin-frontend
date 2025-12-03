import { createExhibition, updateExhibition } from '@/services/museum-service-api/museumExhibitionController';
import { ProForm, ProFormDatePicker, ProFormDigit, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React, { useState } from 'react';

interface ExhibitionFormProps {
  museumId: number;
  exhibition?: MuseumsAPI.ExhibitionResponse | null;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * 展览表单组件
 */
const ExhibitionForm: React.FC<ExhibitionFormProps> = ({ museumId, exhibition, onSuccess, onCancel }) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const isEdit = !!exhibition;

  /**
   * 提交表单
   */
  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);

      if (isEdit) {
        // 更新展览
        const response = await updateExhibition(
          { museumId, id: exhibition?.id || 0 },
          {
            ...values,
            id: exhibition?.id,
            museumId,
          }
        );

        if (response.success) {
          message.success('更新展览成功');
          onSuccess();
        } else {
          message.error(response.message || '更新展览失败');
        }
      } else {
        // 创建展览
        const response = await createExhibition(
          { museumId },
          {
            ...values,
            museumId,
          }
        );

        if (response.success) {
          message.success('创建展览成功');
          onSuccess();
        } else {
          message.error(response.message || '创建展览失败');
        }
      }
    } catch (error) {
      message.error('操作失败');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProForm
      initialValues={exhibition || {}}
      submitter={{
        render: (_, dom) => (
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Button type="primary" loading={submitting} htmlType="submit">
              {isEdit ? '更新' : '提交'}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={onCancel}>
              取消
            </Button>
          </div>
        ),
      }}
      onFinish={handleSubmit}
    >
      <ProFormText
        name="title"
        label="展览标题"
        placeholder="请输入展览标题"
        rules={[{ required: true, message: '请输入展览标题' }]}
      />

      <ProFormTextArea
        name="description"
        label="展览描述"
        placeholder="请输入展览描述"
        fieldProps={{
          rows: 4,
        }}
      />

      <ProFormText
        name="coverImage"
        label="封面图片URL"
        placeholder="请输入封面图片URL"
      />

      <ProFormDatePicker
        name="startDate"
        label="开始日期"
        placeholder="请选择开始日期"
      />

      <ProFormDatePicker
        name="endDate"
        label="结束日期"
        placeholder="请选择结束日期"
      />

      <ProFormText
        name="location"
        label="展厅位置"
        placeholder="请输入展厅位置"
      />

      <ProFormDigit
        name="ticketPrice"
        label="门票价格"
        placeholder="请输入门票价格"
        min={0}
        fieldProps={{
          precision: 2,
          addonAfter: '元',
        }}
      />

      <ProFormSelect
        name="isPermanent"
        label="展览类型"
        placeholder="请选择展览类型"
        rules={[{ required: true, message: '请选择展览类型' }]}
        options={[
          { label: '临时展览', value: 0 },
          { label: '常设展览', value: 1 },
        ]}
      />

      <ProFormSelect
        name="status"
        label="展览状态"
        placeholder="请选择展览状态"
        rules={[{ required: true, message: '请选择展览状态' }]}
        options={[
          { label: '已结束', value: 0 },
          { label: '进行中', value: 1 },
          { label: '未开始', value: 2 },
        ]}
      />
    </ProForm>
  );
};

export default ExhibitionForm;
