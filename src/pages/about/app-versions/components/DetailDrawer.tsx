import { Drawer, Descriptions, Tag, Space, Badge, Typography } from 'antd';
import {
  AndroidOutlined,
  AppleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  StarFilled,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Paragraph } = Typography;

interface DetailDrawerProps {
  open: boolean;
  record: MuseumsAPI.AppVersionResponse | null;
  onClose: () => void;
}

const DetailDrawer: React.FC<DetailDrawerProps> = ({ open, record, onClose }) => {
  if (!record) return null;

  // 获取平台图标
  const getPlatformIcon = () => {
    return record.platform === 'android' ? (
      <AndroidOutlined style={{ color: '#3DDC84', fontSize: 24 }} />
    ) : (
      <AppleOutlined style={{ color: '#555', fontSize: 24 }} />
    );
  };

  // 获取更新类型标签
  const getUpdateTypeTag = () => {
    const typeMap: Record<string, { color: string; text: string }> = {
      major: { color: 'red', text: '重大更新' },
      minor: { color: 'orange', text: '功能更新' },
      patch: { color: 'blue', text: '修复更新' },
      hotfix: { color: 'purple', text: '紧急修复' },
    };
    const type = typeMap[record.updateType || 'patch'];
    return <Tag color={type.color}>{type.text}</Tag>;
  };

  // 获取状态标签
  const getStatusTag = () => {
    const statusMap: Record<string, { color: string; text: string }> = {
      draft: { color: 'default', text: '草稿' },
      published: { color: 'success', text: '已发布' },
      deprecated: { color: 'error', text: '已废弃' },
    };
    const status = statusMap[record.status || 'draft'];
    return <Tag color={status.color}>{status.text}</Tag>;
  };

  // 格式化文件大小
  const formatFileSize = (size?: string) => {
    if (!size || size === '-') return '-';
    return size;
  };

  return (
    <Drawer
      title={
        <Space>
          {getPlatformIcon()}
          <span>版本详情</span>
          {record.isLatest && (
            <Tag icon={<StarFilled />} color="gold">
              最新版本
            </Tag>
          )}
        </Space>
      }
      width={720}
      open={open}
      onClose={onClose}
      destroyOnClose
    >
      <Descriptions column={2} bordered>
        <Descriptions.Item label="版本名称" span={2}>
          <strong style={{ fontSize: 16 }}>{record.versionName}</strong>
        </Descriptions.Item>

        <Descriptions.Item label="版本号">{record.versionCode}</Descriptions.Item>

        <Descriptions.Item label="平台">
          <Space>
            {getPlatformIcon()}
            <span>{record.platform?.toUpperCase()}</span>
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="更新类型">{getUpdateTypeTag()}</Descriptions.Item>

        <Descriptions.Item label="发布状态">{getStatusTag()}</Descriptions.Item>

        <Descriptions.Item label="文件大小">{formatFileSize(record.fileSize)}</Descriptions.Item>

        <Descriptions.Item label="下载次数">
          <Badge
            count={record.downloadCount || 0}
            showZero
            color="#1890ff"
            overflowCount={9999}
          />
        </Descriptions.Item>

        <Descriptions.Item label="发布时间">
          <Space>
            <ClockCircleOutlined />
            {record.releaseDate ? dayjs(record.releaseDate).format('YYYY-MM-DD HH:mm') : '-'}
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="强制更新">
          {record.forceUpdate ? (
            <Tag color="error">是</Tag>
          ) : (
            <Tag color="default">否</Tag>
          )}
        </Descriptions.Item>

        {record.platform === 'android' && record.minAndroidVersion && (
          <Descriptions.Item label="最低Android版本">
            Android {record.minAndroidVersion}
          </Descriptions.Item>
        )}

        {record.platform === 'ios' && record.minIosVersion && (
          <Descriptions.Item label="最低iOS版本">iOS {record.minIosVersion}</Descriptions.Item>
        )}

        <Descriptions.Item label="更新内容" span={2}>
          <Paragraph style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>
            {record.changeLog || '暂无更新说明'}
          </Paragraph>
        </Descriptions.Item>

        {record.remark && (
          <Descriptions.Item label="备注" span={2}>
            {record.remark}
          </Descriptions.Item>
        )}

        <Descriptions.Item label="创建时间" span={2}>
          {record.createAt ? dayjs(record.createAt).format('YYYY-MM-DD HH:mm:ss') : '-'}
        </Descriptions.Item>

        <Descriptions.Item label="更新时间" span={2}>
          {record.updateAt ? dayjs(record.updateAt).format('YYYY-MM-DD HH:mm:ss') : '-'}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default DetailDrawer;

