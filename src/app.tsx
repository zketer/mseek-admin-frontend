import { LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history, Link, useIntl } from '@umijs/max';
import { Watermark, Tag } from 'antd';
import React from 'react';
import {
  AppTitle,
  AvatarDropdown,
  AvatarName,
  Footer,
  MenuFooter,
  SelectLang,
  ErrorBoundary,
} from '@/components';
// 使用新的用户控制器中的方法获取用户信息
import { getByUsername, getUserPermissions } from '@/services/user-service-api/userController';
import { getAppTitle } from '@/utils/i18n';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import '@ant-design/v5-patch-for-react-19';
import type { JWTPayload } from '@/types/jwt';
import performanceMonitor from '@/utils/performance';
import { initSentry } from '@/utils/sentry';
import { STORAGE_KEYS } from '@/constants';

const isDev =
  process.env.NODE_ENV === 'development' || process.env.CI;
const loginPath = '/login';
// OAuth2回调页面也需要允许未登录访问
const whiteList = [loginPath, '/oauth2/callback', '/user/register', '/user/register-result'];

// 全局状态：避免多次并发调用fetchUserInfo
let fetchUserInfoPromise: Promise<any | undefined> | null = null;

/**
 * @see https://umijs.org/docs/api/runtime-config#getinitialstate
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: any;
  loading?: boolean;
  fetchUserInfo?: () => Promise<any | undefined>;
}> {
  // 🔧 初始化监控工具（生产环境）
  if (process.env.NODE_ENV === 'production') {
    // 性能监控已通过单例自动初始化
    // performanceMonitor 会在首次导入时自动启动监控

    // 启用 Sentry 错误追踪（需要配置 .env.production）
    try {
      initSentry({
        dsn: process.env.SENTRY_DSN || '',
        environment: process.env.SENTRY_ENVIRONMENT || 'production',
        release: `museum-ui-pro@${process.env.APP_VERSION || '1.0.0'}`,
        tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE) || 0.1,
        enabled: process.env.SENTRY_ENABLED === 'true',
      });
    } catch (error) {
      console.error('[App] Sentry 初始化失败:', error);
    }
  }

  const fetchUserInfo = async (): Promise<any | undefined> => {
    // 如果已有正在进行的请求，直接返回该Promise，避免重复调用
    if (fetchUserInfoPromise) {
      return fetchUserInfoPromise;
    }

    fetchUserInfoPromise = (async () => {
      try {
        // 从localStorage获取token
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

        if (!token) {
          throw new Error('未登录');
        }

        // 启动token自动刷新机制
        if (window.tokenManager && localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)) {
          window.tokenManager.startAutoRefresh();
        }

        // 从token中解析用户名
        const tokenParts = token.split(' ');
        if (tokenParts.length !== 2) {
          throw new Error('无效的token格式');
        }

        const payload: JWTPayload = JSON.parse(atob(tokenParts[1].split('.')[1]));
        const username = payload.sub; // JWT标准中，sub字段通常是用户名

        if (!username) {
          throw new Error('无法获取用户名');
        }

        // 使用userController中的方法获取用户信息
        const response = await getByUsername({ username }, { skipErrorHandler: true });

        if (response.success && response.data) {
          // 获取用户权限
          let userPermissions: string[] = [];
          try {
            const permissionsResponse = await getUserPermissions({ id: response.data.id || 0 });
            if (permissionsResponse.success && Array.isArray(permissionsResponse.data)) {
              userPermissions = permissionsResponse.data;
            }
          } catch (error) {
            console.warn('获取用户权限失败:', error);
          }

          // 将后端的用户信息格式转换为前端需要的格式
          return {
            name: response.data.nickname || response.data.username,
            avatar: response.data.avatar,
            userid: String(response.data.id),
            email: response.data.email,
            phone: response.data.phone,
            signature: '',
            title: '',
            group: '',
            tags: [],
            notifyCount: 0,
            unreadCount: 0,
            country: 'China',
            access: response.data.roles?.join(',') || '',
            permissions: userPermissions, // 添加权限列表
            address: '',
            geographic: {
              province: { label: '', key: '' },
              city: { label: '', key: '' },
            },
          };
        }
        throw new Error('获取用户信息失败');
      } catch (_error) {
        // 改进错误处理：只在401错误时尝试一次重试，避免无限循环
        if (_error instanceof Error && _error.message.includes('401')) {
          // 等待一段时间让token刷新完成，但只等待1秒而不是2秒
          await new Promise(resolve => setTimeout(resolve, 1000));

          // 再次检查token是否仍然存在，避免不必要的重试
          const currentToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
          if (currentToken) {
            try {
              // 直接递归调用，但不通过Promise包装，避免复杂的Promise状态管理
              return await fetchUserInfo();
            } catch (retryError) {
              // 重试失败，继续执行后续逻辑
            }
          }
        }

        // 所有错误情况都跳转到登录页
        history.push(loginPath);
        return undefined;
      } finally {
        // 请求完成后清除Promise引用
        fetchUserInfoPromise = null;
      }
    })();

    return fetchUserInfoPromise;
  };
  // 如果不是白名单页面（登录页、OAuth2回调页等），执行用户信息获取
  const { location } = history;
  if (!whiteList.includes(location.pathname)) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  return {
    title: getAppTitle(),
    // 自定义标题渲染，添加版本号标签
    headerTitleRender: (logo, title) => {
      const version = require('../package.json').version;
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {logo}
          {title}
          <Tag color="blue" style={{ margin: 0 }}>{version}</Tag>
        </div>
      );
    },
    // 监听语言变化，重新设置标题
    onPageChange: () => {
      const { location } = history;
      // 动态更新页面标题
      document.title = getAppTitle();
      // 如果没有登录且不在白名单中，重定向到 login
      if (!initialState?.currentUser && !whiteList.includes(location.pathname)) {
        history.push(loginPath);
      }
    },
    actionsRender: () => [
      <SelectLang key="SelectLang" />,
    ],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      size: 'default',
      style: {
        backgroundColor: initialState?.currentUser?.avatar ? 'transparent' : '#1890ff',
        color: '#fff',
      },
      render: (_, avatarChildren) => {
        return <AvatarDropdown menu={true}>{avatarChildren}</AvatarDropdown>;
      },
    },
    // 水印已在 childrenRender 中全局配置，避免重复
    // waterMarkProps: {
    //   content: initialState?.currentUser?.name || '未登录用户',
    // },
    footerRender: false, // 禁用默认页脚
    menuProps: {
      defaultOpenKeys: ['/user-service', '/data-center', '/result', '/exception'],
      defaultCollapsed: true, // 默认折叠导航栏
    },
    menuFooterRender: (props) => {
      return <MenuFooter collapsed={props?.collapsed} />;
    },
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
  // 增加一个 loading 的状态
  childrenRender: (children) => {
    // if (initialState?.loading) return <PageLoading />;
    return (
      <ErrorBoundary>
        <Watermark
          content={initialState?.currentUser?.name || '未登录用户'}
          font={{
            fontSize: 14,
            color: 'rgba(0, 0, 0, 0.1)',
          }}
          zIndex={9}
          rotate={-22}
          gap={[100, 100]}
        >
          {children}
        </Watermark>
        {isDev && (
          <SettingDrawer
            disableUrlParams
            enableDarkTheme
            settings={initialState?.settings}
            onSettingChange={(settings) => {
              setInitialState((preInitialState) => ({
                ...preInitialState,
                settings,
              }));
            }}
          />
        )}
      </ErrorBoundary>
    );
  },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: RequestConfig = {
  // 删除 baseURL，使用代理配置
  ...errorConfig,
};
