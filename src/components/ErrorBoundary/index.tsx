import React, { Component, ReactNode } from 'react';
import { Button, Result } from 'antd';
import { history } from '@umijs/max';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * 全局错误边界组件
 * 捕获子组件中的 JavaScript 错误，防止整个应用崩溃
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // 更新 state，下次渲染将显示降级 UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 记录错误信息
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // 更新状态
    this.setState({
      error,
      errorInfo,
    });

    // 可以在这里上报错误到监控服务
    if (process.env.NODE_ENV === 'production') {
      // 错误监控服务集成（需要时在 utils/sentry.ts 中启用）
      // reportErrorToService(error, errorInfo);
    }
  }

  handleReload = () => {
    // 重置错误状态
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    
    // 刷新页面
    window.location.reload();
  };

  handleBackHome = () => {
    // 重置错误状态
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    
    // 返回首页
    history.push('/');
  };

  render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '24px',
          }}
        >
          <Result
            status="error"
            title="页面出现错误"
            subTitle={
              process.env.NODE_ENV === 'development' 
                ? error?.message 
                : '抱歉，页面出现了一些问题，请尝试刷新页面或返回首页。'
            }
            extra={[
              <Button type="primary" key="reload" onClick={this.handleReload}>
                刷新页面
              </Button>,
              <Button key="home" onClick={this.handleBackHome}>
                返回首页
              </Button>,
            ]}
          >
            {process.env.NODE_ENV === 'development' && error && (
              <div
                style={{
                  textAlign: 'left',
                  padding: '16px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  maxWidth: '800px',
                  margin: '0 auto',
                  overflow: 'auto',
                }}
              >
                <h4>错误堆栈信息：</h4>
                <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                  {error.stack}
                </pre>
              </div>
            )}
          </Result>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;


