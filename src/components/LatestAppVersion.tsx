import { AndroidOutlined, AppleOutlined, DownloadOutlined, QrcodeOutlined } from '@ant-design/icons';
import { getLatestVersions, getDownloadUrl } from '@/services/museum-service-api/appVersionController';
import { Alert, Button, Card, Space, Spin, Typography, message, Modal, Popover } from 'antd';
import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const { Text } = Typography;

interface AppVersion {
  versionName?: string;
  changeLog?: string | string[];
  id?: number;
  platform?: string;
}

/**
 * 最新APP版本公告组件
 */
const LatestAppVersion: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null); // 记录正在下载的平台
  const [androidVersion, setAndroidVersion] = useState<AppVersion | null>(null);
  const [iosVersion, setIosVersion] = useState<AppVersion | null>(null);
  const [qrCodeVisible, setQrCodeVisible] = useState<{ platform: string; url: string } | null>(null); // 二维码显示状态
  const [qrCodeLoading, setQrCodeLoading] = useState<string | null>(null); // 加载二维码的平台

  useEffect(() => {
    fetchLatestVersions();
  }, []);

  const fetchLatestVersions = async () => {
    try {
      const response = await getLatestVersions();
      if (response.success && response.data) {
        setAndroidVersion(response.data.android || null);
        setIosVersion(response.data.ios || null);
      }
    } catch (error) {
      console.error('获取最新版本失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (version: AppVersion) => {
    if (!version.id || !version.platform) return;

    setDownloading(version.platform); // 设置下载状态

    try {
      const response = await getDownloadUrl({ id: version.id });
      if (response.success && response.data) {
        // 使用和管理页面一致的方式：创建a标签并触发点击
        // 后端已经返回带强制下载响应头的URL（Content-Disposition: attachment）
        // 这种方式在管理页面已验证可用
        const link = document.createElement('a');
        link.href = response.data;
        const ext = version.platform === 'android' ? 'apk' : 'ipa';
        link.download = `mseek.${version.platform}.${version.versionName}.${ext}`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        message.success(`开始下载 ${version.platform?.toUpperCase()} 版本 ${version.versionName}`);
      } else {
        message.error('获取下载地址失败');
      }
    } catch (error) {
      console.error('下载失败:', error);
      message.error('下载失败，请稍后重试');
    } finally {
      setDownloading(null); // 清除下载状态
    }
  };

  // 获取下载链接并显示二维码
  const handleShowQRCode = async (version: AppVersion) => {
    if (!version.id || !version.platform) return;

    setQrCodeLoading(version.platform);

    try {
      const response = await getDownloadUrl({ id: version.id });
      if (response.success && response.data) {
        setQrCodeVisible({
          platform: version.platform,
          url: response.data,
        });
      } else {
        message.error('获取下载地址失败');
      }
    } catch (error) {
      console.error('获取下载地址失败:', error);
      message.error('获取下载地址失败，请稍后重试');
    } finally {
      setQrCodeLoading(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <Spin />
      </div>
    );
  }

  if (!androidVersion && !iosVersion) {
    return null; // 如果没有版本信息，不显示
  }

  return (
    <Card
      size="small"
      style={{
        width: '100%',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
      }}
      styles={{ body: { padding: '16px' } }}
    >
      <div style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
        <div style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 10, color: 'rgba(255, 255, 255, 0.85)' }}>
          📱 移动端APP最新版本
        </div>

        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          {androidVersion && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '10px 14px',
                borderRadius: 6,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                gap: 12,
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Space style={{ flex: 1, minWidth: 0 }}>
                <AndroidOutlined style={{ fontSize: 20, color: '#a4d65e', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div>
                    <Text strong style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: 13 }}>
                      Android 版本 {androidVersion.versionName}
                    </Text>
                  </div>
                  {androidVersion.changeLog && (
                    <div style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.6)', marginTop: 2, wordBreak: 'break-all' }}>
                      {Array.isArray(androidVersion.changeLog)
                        ? androidVersion.changeLog[0]
                        : androidVersion.changeLog.split('\n')[0]}
                    </div>
                  )}
                </div>
              </Space>
              <Space>
                <Button
                  size="small"
                  icon={<QrcodeOutlined />}
                  loading={qrCodeLoading === 'android'}
                  disabled={downloading !== null || qrCodeLoading !== null}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleShowQRCode(androidVersion);
                  }}
                  style={{
                    background: 'rgba(164, 214, 94, 0.15)',
                    borderColor: '#a4d65e',
                    color: '#a4d65e',
                  }}
                />
                <Button
                  size="small"
                  icon={<DownloadOutlined />}
                  loading={downloading === 'android'}
                  disabled={downloading !== null || qrCodeLoading !== null}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDownload(androidVersion);
                  }}
                  style={{
                    background: 'rgba(164, 214, 94, 0.15)',
                    borderColor: '#a4d65e',
                    color: '#a4d65e',
                    fontWeight: 500,
                  }}
                >
                  {downloading === 'android' ? '下载中' : '下载'}
                </Button>
              </Space>
            </div>
          )}

          {iosVersion && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '10px 14px',
                borderRadius: 6,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                gap: 12,
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Space style={{ flex: 1, minWidth: 0 }}>
                <AppleOutlined style={{ fontSize: 20, color: '#ccc', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div>
                    <Text strong style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: 13 }}>
                      iOS 版本 {iosVersion.versionName}
                    </Text>
                  </div>
                  {iosVersion.changeLog && (
                    <div style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.6)', marginTop: 2, wordBreak: 'break-all' }}>
                      {Array.isArray(iosVersion.changeLog)
                        ? iosVersion.changeLog[0]
                        : iosVersion.changeLog.split('\n')[0]}
                    </div>
                  )}
                </div>
              </Space>
              <Space>
                <Button
                  size="small"
                  icon={<QrcodeOutlined />}
                  loading={qrCodeLoading === 'ios'}
                  disabled={downloading !== null || qrCodeLoading !== null}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleShowQRCode(iosVersion);
                  }}
                  style={{
                    background: 'rgba(204, 204, 204, 0.15)',
                    borderColor: '#ccc',
                    color: '#ccc',
                  }}
                />
                <Button
                  size="small"
                  icon={<DownloadOutlined />}
                  loading={downloading === 'ios'}
                  disabled={downloading !== null || qrCodeLoading !== null}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDownload(iosVersion);
                  }}
                  style={{
                    background: 'rgba(204, 204, 204, 0.15)',
                    borderColor: '#ccc',
                    color: '#ccc',
                    fontWeight: 500,
                  }}
                >
                  {downloading === 'ios' ? '下载中' : '下载'}
                </Button>
              </Space>
            </div>
          )}
        </Space>
      </div>
      
      {/* 二维码弹窗 */}
      <Modal
        open={qrCodeVisible !== null}
        onCancel={() => setQrCodeVisible(null)}
        footer={null}
        title={
          <span style={{ 
            color: 'rgba(255, 255, 255, 0.95)', 
            fontSize: '16px',
            fontWeight: 500,
          }}>
            扫码下载 {qrCodeVisible?.platform === 'android' ? 'Android' : 'iOS'} 版本
          </span>
        }
        style={{
          top: '20%',
        }}
        styles={{
          content: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
          header: {
            background: 'transparent',
            borderBottom: 'none',
            paddingBottom: '12px',
          },
          mask: {
            background: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        {qrCodeVisible && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div
              style={{
                display: 'inline-block',
                padding: '16px',
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}
            >
              <QRCodeSVG
                value={qrCodeVisible.url}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <div style={{ marginTop: '16px', color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px' }}>
              使用手机扫描二维码即可下载
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default LatestAppVersion;

