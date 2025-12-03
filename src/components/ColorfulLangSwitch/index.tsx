import { Button } from 'antd';
import { setLocale, getLocale } from '@umijs/max';
import React from 'react';

export interface ColorfulLangSwitchProps {
  style?: React.CSSProperties;
}

const ColorfulLangSwitch: React.FC<ColorfulLangSwitchProps> = ({ style }) => {
  const currentLocale = getLocale();
  
  const handleLanguageToggle = () => {
    const newLocale = currentLocale === 'zh-CN' ? 'en-US' : 'zh-CN';
    setLocale(newLocale, false);
  };

  return (
    <Button
      type="text"
      size="small"
      onClick={handleLanguageToggle}
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        padding: '0',
        fontSize: '16px',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 3px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        e.currentTarget.style.transform = 'translateY(-1px) scale(1.05)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 3px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      }}
    >
      {currentLocale === 'zh-CN' ? '🇨🇳' : '🇺🇸'}
    </Button>
  );
};

export default ColorfulLangSwitch;
