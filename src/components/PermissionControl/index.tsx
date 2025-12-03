import React from 'react';
import { Switch, message } from 'antd';
import { useIntl } from '@umijs/max';

interface PermissionWrapperProps {
  hasPermission: boolean;
  children: React.ReactElement;
  permissionName?: string;
}

/**
 * 权限包装组件
 * 无权限时阻止所有交互并显示提示
 */
export const PermissionWrapper: React.FC<PermissionWrapperProps> = ({
  hasPermission,
  children,
  permissionName = '该操作'
}) => {
  const intl = useIntl();

  const handleNoPermission = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    message.warning(
      intl.formatMessage(
        { 
          id: 'pages.common.noPermission', 
          defaultMessage: '您没有{operation}的权限' 
        },
        { operation: permissionName }
      )
    );
  };

  if (!hasPermission) {
    return (
      <div
        style={{
          display: 'inline-block',
          opacity: 0.6,
          cursor: 'not-allowed',
          position: 'relative'
        }}
      >
        {/* 覆盖层拦截所有点击事件 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
            cursor: 'not-allowed'
          }}
          onClick={handleNoPermission}
        />
        {children}
      </div>
    );
  }

  return children;
};

// 重新导出，保持API兼容性
export const PermissionButton = PermissionWrapper;

interface PermissionSwitchProps {
  hasPermission: boolean;
  checked: boolean;
  onChange: (checked: boolean) => void;
  permissionName?: string;
  [key: string]: any;
}

/**
 * 权限控制开关组件
 */
export const PermissionSwitch: React.FC<PermissionSwitchProps> = ({
  hasPermission,
  checked,
  onChange,
  permissionName = '状态切换',
  ...props
}) => {
  const intl = useIntl();

  const handleChange = (newChecked: boolean) => {
    if (!hasPermission) {
      message.warning(
        intl.formatMessage(
          { 
            id: 'pages.common.noPermission', 
            defaultMessage: '您没有{operation}的权限' 
          },
          { operation: permissionName }
        )
      );
      return;
    }
    onChange(newChecked);
  };

  return (
    <div
      style={{
        display: 'inline-block',
        opacity: hasPermission ? 1 : 0.6,
        cursor: hasPermission ? 'default' : 'not-allowed'
      }}
    >
      <Switch
        {...props}
        checked={checked}
        onChange={handleChange}
        disabled={!hasPermission}
      />
    </div>
  );
};