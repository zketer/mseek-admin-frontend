import React, { useEffect, useRef, useState } from 'react';
import { Card, Spin, Alert } from 'antd';

interface MermaidDiagramProps {
  chart: string;
  title?: string;
  height?: number;
  className?: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ 
  chart, 
  title, 
  height = 600,
  className = ''
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderChart = async () => {
      if (!chartRef.current || !chart) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // 检查是否在浏览器环境
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }

        // 动态导入 Mermaid
        const mermaidModule = await import('mermaid');
        const mermaid = mermaidModule.default;
        
        // 初始化 Mermaid
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
          },
          themeVariables: {
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
          }
        });
        
        // 清空之前的内容
        if (chartRef.current) {
          chartRef.current.innerHTML = '';
        }
        
        // 生成唯一ID
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // 渲染图表
        const { svg } = await mermaid.render(id, chart);
        
        if (chartRef.current) {
          chartRef.current.innerHTML = svg;
          
          // 添加一些样式优化
          const svgElement = chartRef.current.querySelector('svg');
          if (svgElement) {
            svgElement.style.maxWidth = '100%';
            svgElement.style.height = 'auto';
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(err instanceof Error ? err.message : '图表渲染失败');
        setLoading(false);
      }
    };

    // 添加延迟以确保DOM已准备好
    const timer = setTimeout(renderChart, 200);
    return () => clearTimeout(timer);
  }, [chart]);

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: height,
          flexDirection: 'column'
        }}>
          <Spin size="large" />
          <div style={{ marginTop: 16, color: '#666' }}>正在渲染架构图...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ padding: '20px' }}>
          <Alert
            message="图表渲染失败"
            description={`错误信息: ${error}`}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <div style={{ 
            background: '#f5f5f5',
            padding: '16px',
            borderRadius: '4px',
            border: '1px solid #d9d9d9'
          }}>
            <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>原始图表代码：</div>
            <pre style={{
              fontSize: '12px',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              margin: 0,
              overflow: 'auto'
            }}>
              {chart}
            </pre>
          </div>
        </div>
      );
    }

    return (
      <div 
        ref={chartRef}
        className={`mermaid-diagram ${className}`}
        style={{
          textAlign: 'center',
          minHeight: height,
          overflow: 'auto',
          padding: '16px',
        }}
      />
    );
  };

  if (title) {
    return (
      <Card title={title} style={{ marginBottom: 24 }}>
        {renderContent()}
      </Card>
    );
  }

  return renderContent();
};

export default MermaidDiagram;