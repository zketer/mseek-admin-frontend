import { EditOutlined } from '@ant-design/icons';
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
  Tooltip,
  Descriptions,
} from 'antd';
import type { FC } from 'react';
import { useState, useCallback } from 'react';
import {
  updateAppVersion,
  getAppVersionDetail,
} from '@/services/museum-service-api/appVersionController';
import ChunkedUploader from '@/components/ChunkedUploader';
import dayjs from 'dayjs';

const { TextArea } = Input;

interface UpdateFormProps {
  record: MuseumsAPI.AppVersionResponse;
  reload?: ActionType['reload'];
}

const UpdateForm: FC<UpdateFormProps> = (props) => {
  const { record, reload } = props;

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState<MuseumsAPI.AppVersionResponse | null>(null);
  const [fileId, setFileId] = useState<number | undefined>(undefined);
  const [fileRelationId, setFileRelationId] = useState<number | undefined>(undefined);

  const intl = useIntl();
  const { message } = App.useApp();

  const showDrawer = useCallback(async () => {
    setOpen(true);
    setDetailLoading(true);

    try {
      // 获取详细信息
      const response = await getAppVersionDetail({ id: record.id! });

      if (response.success && response.data) {
        const data = response.data;
        setDetail(data);
        
        // 设置文件ID和文件关系表ID
        if (data.fileId) {
          setFileId(data.fileId);
        }
        if (data.fileRelationId) {
          setFileRelationId(data.fileRelationId);
        }

        // 设置表单值
        form.setFieldsValue({
          versionName: data.versionName,
          versionCode: data.versionCode,
          platform: data.platform,
          updateType: data.updateType,
          releaseDate: data.releaseDate ? dayjs(data.releaseDate) : undefined,
          changeLog: data.changeLog ? data.changeLog.join('\n') : '',
          status: data.status,
          forceUpdate: data.forceUpdate || false,
          minAndroidVersion: data.minAndroidVersion,
          minIosVersion: data.minIosVersion,
          remark: data.remark,
        });
      } else {
        message.error(response.message || '获取详情失败');
        setOpen(false);
      }
    } catch (error: any) {
      console.error('获取详情失败:', error);
      message.error(error.message || '获取详情失败');
      setOpen(false);
    } finally {
      setDetailLoading(false);
    }
  }, [record, form, message]);

  const onClose = useCallback(() => {
    // 完全重置表单
    form.resetFields();
    setDetail(null);
    setFileId(undefined);
    setFileRelationId(undefined);
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
      // 如果上传了新文件，重置fileRelationId，因为这是一个新的文件关联
      setFileRelationId(undefined);
      message.success('文件上传成功');
    }
  };

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // 处理更新日志
      const changeLog = values.changeLog
        ? values.changeLog.split('\n').filter((line: string) => line.trim())
        : [];

      // 使用状态中的fileId（如果有新上传的文件）

      // 构建请求数据
      const requestData: MuseumsAPI.AppVersionUpdateRequest = {
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
        fileId: fileId,
        fileRelationId: fileRelationId,
        updateBy: 1, // 设置更新者ID，这里使用默认值1
      };
      
      // 提交更新请求


      const response = await updateAppVersion({ id: record.id! }, requestData);

      if (response.success) {
        message.success('更新成功');
        onClose();
        reload?.();
      } else {
        message.error(response.message || '更新失败');
      }
    } catch (error: any) {
      console.error('更新失败:', error);
      if (error.errorFields) {
        message.error('请检查表单填写是否正确');
      } else {
        message.error(error.message || '更新失败');
      }
    } finally {
      setLoading(false);
    }
  }, [form, record, fileId, fileRelationId, message, onClose, reload]);

  return (
    <>
      <Tooltip title="编辑">
        <Button
          type="link"
          size="small"
          icon={<EditOutlined />}
          onClick={showDrawer}
          style={{ padding: 0 }}
        />
      </Tooltip>
      <Drawer
        title="编辑版本"
        width={720}
        open={open}
        onClose={onClose}
        loading={detailLoading}
        extra={
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button type="primary" loading={loading} onClick={handleSubmit}>
              提交
            </Button>
          </Space>
        }
      >
        {detail && (
          <>
            <Descriptions column={2} bordered style={{ marginBottom: 24 }}>
              <Descriptions.Item label="当前版本" span={1}>
                {detail.versionName}
              </Descriptions.Item>
              <Descriptions.Item label="版本号" span={1}>
                {detail.versionCode}
              </Descriptions.Item>
              <Descriptions.Item label="下载次数" span={2}>
                {detail.downloadCount || 0} 次
              </Descriptions.Item>
            </Descriptions>

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
                label="更新安装包文件"
                extra="上传APK或IPA文件（最大200MB）"
                style={{ marginBottom: 24 }}
              >
                <div style={{ marginBottom: 8 }}>
                  {/* 不显示当前文件信息 */}
                  
                  <ChunkedUploader 
                    fileType="app-version"
                    uploaderId={1}
                    onSuccess={handleFileUploadSuccess}
                    maxSize={200}
                    accept=".apk,.ipa,application/vnd.android.package-archive,application/octet-stream"
                    buttonText="选择新文件"
                  />
                </div>
              </Form.Item>

              <Form.Item name="remark" label="备注">
                <TextArea rows={3} placeholder="请输入备注信息" />
              </Form.Item>
            </Form>
          </>
        )}
      </Drawer>
    </>
  );
};

export default UpdateForm;

