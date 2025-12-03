import { GithubOutlined, MailOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import React from 'react';

export interface MenuFooterProps {
  collapsed?: boolean;
}

const MenuFooter: React.FC<MenuFooterProps> = ({ collapsed }) => {
  const intl = useIntl();
  
  if (collapsed) {
    // 折叠状态：只显示图标和年份
    return (
      <div style={{
        padding: '8px',
        borderTop: '1px solid #f0f0f0',
        textAlign: 'center',
        fontSize: '10px',
        color: '#666'
      }}>
        <div style={{ marginBottom: '6px' }}>
          <div style={{ fontSize: '16px', marginBottom: '4px' }}>
            📖
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '6px' }}>
          <a href="mailto:museumseek@163.com" style={{ color: '#666', fontSize: '14px' }}>
            <GithubOutlined />
          </a>
          <a href="mailto:museumseek@163.com" style={{ color: '#666', fontSize: '14px' }}>
            <MailOutlined />
          </a>
        </div>
        <div style={{ fontSize: '9px', lineHeight: '1.2' }}>
          ©{new Date().getFullYear()}
        </div>
      </div>
    );
  }

  // 展开状态：显示完整内容
  return (
    <div style={{
      padding: '16px',
      borderTop: '1px solid #f0f0f0',
      textAlign: 'center',
      fontSize: '12px',
      color: '#666'
    }}>
      <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
        {intl.formatMessage({
          id: 'app.name',
          defaultMessage: '文博探索',
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
        <a href="mailto:museumseek@163.com" style={{ color: '#666' }}>
          <GithubOutlined />
        </a>
        <a href="mailto:museumseek@163.com" style={{ color: '#666' }}>
          <MailOutlined />
        </a>
      </div>
      <div>
        © {new Date().getFullYear()} zlynn
      </div>
    </div>
  );
};

export default MenuFooter;
