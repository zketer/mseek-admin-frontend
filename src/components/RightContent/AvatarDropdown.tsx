import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import { history, useModel, useIntl } from '@umijs/max';
import type { MenuProps } from 'antd';
import { Spin, theme } from 'antd';
import { createStyles } from 'antd-style';
import React from 'react';
import { flushSync } from 'react-dom';
import { logout as outLogin } from '@/services/auth-service-api/authController';
import HeaderDropdown from '../HeaderDropdown';
import { STORAGE_KEYS } from '@/constants';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { token } = theme.useToken();
  
  return (
    <span 
      style={{
        color: token.colorText,
        fontSize: '14px',
        fontWeight: 500,
        marginLeft: '8px',
      }}
    >
      {currentUser?.name}
    </span>
  );
};

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
  };
});

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({
  menu,
  children,
}) => {
  const intl = useIntl();
  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    try {
      // 先停止token自动刷新
      if (window.tokenManager) {
        window.tokenManager.stopAutoRefresh();
      }

      // 先清除本地存储的token和用户信息（避免401错误被拦截器处理）
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_INFO);

      // 如果token存在，尝试调用退出接口（设置超时，避免一直等待）
      if (token) {
        try {
          // 使用skipErrorHandler跳过错误处理，避免401错误触发跳转
          // 设置3秒超时，避免一直等待
          const logoutPromise = outLogin({ skipErrorHandler: true });
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('退出登录超时')), 3000)
          );
          
          await Promise.race([logoutPromise, timeoutPromise]);
          console.log('退出登录API调用成功');
        } catch (error) {
          // 忽略退出接口的错误和超时，直接跳转
          console.warn('退出登录API调用失败或超时，继续执行退出流程:', error);
        }
      }

      // 获取跳转参数
      const { search, pathname } = window.location;
      const urlParams = new URL(window.location.href).searchParams;
      const redirect = urlParams.get('redirect');

      console.log('准备跳转到登录页面');
      // 使用window.location.href进行硬跳转
      if (redirect) {
        window.location.href = `/login?redirect=${encodeURIComponent(redirect)}`;
      } else {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('退出登录过程中出错:', error);
      // 即使出现任何错误，也确保清除本地存储并跳转到登录页
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_INFO);
      
      if (window.tokenManager) {
        window.tokenManager.stopAutoRefresh();
      }
      
      window.location.href = '/login';
    }
  };
  const { styles } = useStyles();

  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick: MenuProps['onClick'] = (event) => {
    const { key } = event;
    if (key === 'logout') {
      flushSync(() => {
        setInitialState((s) => ({ ...s, currentUser: undefined }));
      });
      loginOut();
      return;
    }
    if (key === 'profile') {
      history.push('/profile');
      return;
    }
  };

  const loading = (
    <span className={styles.action}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }

  const menuItems = [
    ...(menu
      ? [
          {
            key: 'profile',
            icon: <ProfileOutlined />,
            label: intl.formatMessage({
              id: 'menu.account.profile',
              defaultMessage: '个人资料',
            }),
          },
          {
            type: 'divider' as const,
          },
        ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: intl.formatMessage({
        id: 'menu.account.logout',
        defaultMessage: '退出登录',
      }),
    },
  ];

  return (
    <HeaderDropdown
      menu={{
        selectedKeys: [],
        onClick: onMenuClick,
        items: menuItems,
      }}
    >
      {children}
    </HeaderDropdown>
  );
};
