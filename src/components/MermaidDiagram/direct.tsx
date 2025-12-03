import React, { useEffect, useState } from 'react';
import { Card, Spin, Alert, Button } from 'antd';
import { sanitizeHTML } from '@/utils/sanitize';
import { ReloadOutlined } from '@ant-design/icons';

interface DirectMermaidDiagramProps {
  chart: string;
  title?: string;
  height?: number;
}

const DirectMermaidDiagram: React.FC<DirectMermaidDiagramProps> = ({
  chart,
  title,
  height = 400,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [svgContent, setSvgContent] = useState<string>('');

  const renderChart = async () => {
    setLoading(true);
    setError(null);
    setSvgContent('');

    try {
      // 检查浏览器环境
      if (typeof window === 'undefined') {
        throw new Error('服务端渲染环境');
      }
      
      console.log('[Mermaid] 开始渲染，chart长度:', chart?.length);
      
      // 动态导入mermaid
      const mermaidModule = await import('mermaid');
      const mermaid = mermaidModule.default || mermaidModule;

      // 简化配置
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
      });

      // 生成唯一ID
      const id = `mermaid-${Date.now()}`;

      // 直接渲染获取SVG字符串
      const result = await mermaid.render(id, chart);
      
      console.log('[Mermaid] 渲染成功，SVG长度:', result.svg?.length);
      
      // 直接设置SVG内容到state
      setSvgContent(result.svg);
      setLoading(false);

    } catch (err) {
      console.error('[Mermaid] 渲染失败:', err);
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleRetry = () => {
    renderChart();
  };

  useEffect(() => {
    // 简单延迟后直接渲染
    const timer = setTimeout(renderChart, 500);
    return () => clearTimeout(timer);
  }, [chart]);

  if (loading) {
    return (
      <Card title={title} style={{ marginBottom: 24 }}>
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          background: '#fafafa',
          borderRadius: '4px'
        }}>
          <Spin size="large" tip="正在渲染架构图..." />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card 
        title={title} 
        style={{ marginBottom: 24 }}
        extra={
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleRetry}
            size="small"
          >
            重试
          </Button>
        }
      >
        <Alert
          message="图表渲染失败"
          description={
            <div>
              <p><strong>错误信息：</strong>{error}</p>
              <div style={{ marginTop: 12 }}>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={handleRetry}
                  type="primary"
                  size="small"
                >
                  重试渲染
                </Button>
              </div>
            </div>
          }
          type="error"
          showIcon
        />
      </Card>
    );
  }

  return (
    <Card title={title} style={{ marginBottom: 24 }}>
      <div style={{ 
        background: '#fff',
        borderRadius: '4px',
        padding: '16px',
        textAlign: 'center',
        minHeight: height,
        overflow: 'auto'
      }}>
        {/* 直接渲染SVG内容 */}
        <div 
          dangerouslySetInnerHTML={{ __html: svgContent }}
          style={{ 
            width: '100%',
            display: 'inline-block'
          }}
        />
      </div>
    </Card>
  );
};

export default DirectMermaidDiagram;
