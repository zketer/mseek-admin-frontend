import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import {
  Button,
  Drawer,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Switch,
  Space,
  App,
} from 'antd';
import type { FC } from 'react';
import { useState, useCallback } from 'react';
import { createAppVersion } from '@/services/museum-service-api/appVersionController';
import ChunkedUploader from '@/components/ChunkedUploader';
import dayjs from 'dayjs';

const { TextArea } = Input;

interface CreateFormProps {
  reload?: ActionType['reload'];
}

const CreateForm: FC<CreateFormProps> = (props) => {
  const { reload } = props;

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileId, setFileId] = useState<number | undefined>(undefined);

  const intl = useIntl();
  const { message } = App.useApp();

  const showDrawer = useCallback(async () => {
    // 先重置表单和状态
    form.resetFields();
    setFileId(undefined);
    
    // 然后设置默认值
    form.setFieldsValue({
      releaseDate: dayjs(),
      status: 'draft',
      updateType: 'minor',
      platform: 'android',
      forceUpdate: false,
    });
    
    // 最后打开抽屉
    setOpen(true);
  }, [form]);

  const onClose = useCallback(() => {
    // 完全重置表单
    form.resetFields();
    setFileId(undefined);
    setOpen(false);
    
    // 添加一个延时，确保在抽屉关闭后再清空表单，避免视觉上的跳动
    setTimeout(() => {
      form.resetFields();
    }, 300);
  }, [form]);

  // 处理文件上传成功
  const handleFileUploadSuccess = (fileRecord: any) => {
    if (fileRecord && fileRecord.id) {
      setFileId(fileRecord.id);
      message.success('文件上传成功');
    }
  };

  const handleSubmit = useCallback(async () => {
    try {
      // 验证文件是否已上传
      if (!fileId) {
        message.error('请先上传安装包文件');
        return;
      }

      const values = await form.validateFields();
      setLoading(true);

      // 处理更新日志
      const changeLog = values.changeLog
        ? values.changeLog.split('\n').filter((line: string) => line.trim())
        : [];

      // 构建请求数据
      const requestData: MuseumsAPI.AppVersionCreateRequest = {
        versionName: values.versionName,
        versionCode: values.versionCode,
        platform: values.platform,
        releaseDate: values.releaseDate.format('YYYY-MM-DD'),
        updateType: values.updateType,
        changeLog: changeLog,
        status: values.status,
        forceUpdate: values.forceUpdate || false,
        minAndroidVersion: values.minAndroidVersion,
        minIosVersion: values.minIosVersion,
        remark: values.remark,
        fileId: fileId, // fileId 已经验证非空
      };


      const response = await createAppVersion(requestData);

      if (response.success) {
        message.success('创建成功');
        onClose();
        reload?.();
      } else {
        message.error(response.message || '创建失败');
      }
    } catch (error: any) {
      console.error('创建失败:', error);
      if (error.errorFields) {
        message.error('请检查表单填写是否正确');
      } else {
        message.error(error.message || '创建失败');
      }
    } finally {
      setLoading(false);
    }
  }, [form, fileId, message, onClose, reload]);

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={showDrawer}>
        新建版本
      </Button>
      <Drawer
        title="新建版本"
        width={720}
        open={open}
        onClose={onClose}
        extra={
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button type="primary" loading={loading} onClick={handleSubmit}>
              提交
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="versionName"
            label="版本名称"
            rules={[
              { required: true, message: '请输入版本名称' },
              {
                pattern: /^\d+\.\d+\.\d+$/,
                message: '版本名称格式应为：x.y.z（如：1.0.0）',
              },
            ]}
          >
            <Input placeholder="请输入版本名称，如：1.0.0" />
          </Form.Item>

          <Form.Item
            name="versionCode"
            label="版本号"
            rules={[
              { required: true, message: '请输入版本号' },
              { type: 'integer', min: 1, message: '版本号必须是正整数' },
            ]}
          >
            <InputNumber
              placeholder="请输入版本号，如：1"
              style={{ width: '100%' }}
              min={1}
            />
          </Form.Item>

          <Form.Item
            name="platform"
            label="平台"
            rules={[{ required: true, message: '请选择平台' }]}
          >
            <Select placeholder="请选择平台">
              <Select.Option value="android">Android</Select.Option>
              <Select.Option value="ios">iOS</Select.Option>
              <Select.Option value="all">全平台</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="updateType"
            label="更新类型"
            rules={[{ required: true, message: '请选择更新类型' }]}
          >
            <Select placeholder="请选择更新类型">
              <Select.Option value="major">重大更新</Select.Option>
              <Select.Option value="minor">功能更新</Select.Option>
              <Select.Option value="patch">修复更新</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="releaseDate"
            label="发布日期"
            rules={[{ required: true, message: '请选择发布日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="changeLog"
            label="更新日志"
            rules={[{ required: true, message: '请输入更新日志' }]}
            extra="每行一条更新内容"
          >
            <TextArea
              rows={6}
              placeholder="请输入更新日志，每行一条更新内容，例如：&#10;新增打卡功能&#10;优化地图性能&#10;修复已知问题"
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Select.Option value="draft">草稿</Select.Option>
              <Select.Option value="published">已发布</Select.Option>
              <Select.Option value="deprecated">已废弃</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="forceUpdate" label="强制更新" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="minAndroidVersion" label="最低Android版本">
            <Input placeholder="如：5.0" />
          </Form.Item>

          <Form.Item name="minIosVersion" label="最低iOS版本">
            <Input placeholder="如：12.0" />
          </Form.Item>

          <Form.Item 
            name="file" 
            label="安装包文件" 
            extra="上传APK或IPA文件（最大200MB）"
            style={{ marginBottom: 24 }}
          >
            <div style={{ marginBottom: 8 }}>
              <ChunkedUploader 
                fileType="app-version"
                uploaderId={1}
                onSuccess={handleFileUploadSuccess}
                maxSize={200}
                accept=".apk,.ipa,application/vnd.android.package-archive,application/octet-stream"
                buttonText="选择文件"
              />
              {/* 不显示文件ID信息 */}
            </div>
          </Form.Item>

          <Form.Item name="remark" label="备注">
            <TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default CreateForm;

