import {
  AlipayOutlined,
  LockOutlined,
  MobileOutlined,
  UserOutlined,
  WechatOutlined,
  QqOutlined,
  GithubOutlined,
  MailOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
  ProFormDependency,
} from '@ant-design/pro-components';
import {
  FormattedMessage,
  Helmet,
  useIntl,
  useModel,
} from '@umijs/max';
import { Button, Divider, Space, Tabs, App, theme, Form, Spin } from 'antd';
import { createStyles } from 'antd-style';
import type { CSSProperties } from 'react';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { Footer, ColorfulLangSwitch } from '@/components';
import LatestAppVersion from '@/components/LatestAppVersion';
// 不需要引入模拟验证码服务
import * as authController from '@/services/auth-service-api/authController';
import * as oAuth2Controller from '@/services/auth-service-api/oAuth2Controller';
import Settings from '../../../config/defaultSettings';

type LoginType = 'phone' | 'account';
type FormMode = 'login' | 'register' | 'reset';

const useStyles = createStyles(({ token }) => {
  return {
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      top: 16,
      borderRadius: token.borderRadius,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
      zIndex: 1000,
    },
    customInput: {
      '& .ant-input': {
        fontSize: '14px !important',
      },
      '& .ant-input::placeholder': {
        color: 'rgba(255, 255, 255, 0.5) !important',
        fontSize: '14px !important',
      },
      '& .ant-input-password': {
        fontSize: '14px !important',
      },
      '& .ant-input-password::placeholder': {
        color: 'rgba(255, 255, 255, 0.5) !important',
        fontSize: '14px !important',
      },
      '& .ant-btn': {
        fontSize: '14px !important',
      },
      '& .ant-checkbox': {
        '& .ant-checkbox-inner': {
          backgroundColor: 'rgba(255, 255, 255, 0.1) !important',
          borderColor: 'rgba(255, 255, 255, 0.3) !important',
          '&::after': {
            display: 'table !important',
            content: '""',
          },
        },
        '&.ant-checkbox-checked .ant-checkbox-inner': {
          backgroundColor: 'rgba(24, 144, 255, 0.8) !important',
          borderColor: 'rgba(24, 144, 255, 0.8) !important',
        },
        '&:hover .ant-checkbox-inner': {
          borderColor: 'rgba(255, 255, 255, 0.5) !important',
        },
        '&:focus .ant-checkbox-inner': {
          borderColor: 'rgba(255, 255, 255, 0.5) !important',
        },
      },
      // 确保初始状态也应用样式
      '.ant-checkbox': {
        '& .ant-checkbox-inner': {
          backgroundColor: 'rgba(255, 255, 255, 0.1) !important',
          borderColor: 'rgba(255, 255, 255, 0.3) !important',
        },
      },
    },
    captchaContainer: {
      '& .ant-form-item': {
        marginBottom: '0 !important',
      },
      '& .ant-form-item-control': {
        backgroundColor: 'transparent !important',
        border: 'none !important',
        boxShadow: 'none !important',
      },
      '& .ant-form-item-control-input': {
        backgroundColor: 'transparent !important',
        border: 'none !important',
        boxShadow: 'none !important',
      },
      '& .ant-input-group-wrapper': {
        backgroundColor: 'transparent !important',
        border: 'none !important',
        boxShadow: 'none !important',
        borderRadius: '0 !important',
      },
      '& .ant-input-group': {
        backgroundColor: 'transparent !important',
        border: 'none !important',
        boxShadow: 'none !important',
        borderRadius: '0 !important',
      },
      '& .ant-input-group-compact': {
        backgroundColor: 'transparent !important',
        border: 'none !important',
        boxShadow: 'none !important',
        borderRadius: '0 !important',
      },
      // 针对Pro组件的特殊样式
      '& .ant-pro-form-captcha': {
        backgroundColor: 'transparent !important',
        border: 'none !important',
        boxShadow: 'none !important',
      },
    },
  };
});

const iconStyles: CSSProperties = {
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '18px',
  verticalAlign: 'middle',
  cursor: 'pointer',
};

const Lang = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.lang} data-lang>
      <ColorfulLangSwitch />
    </div>
  );
};

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <div
      style={{
        marginBottom: 24,
        color: '#ff4d4f',
        fontSize: '14px',
      }}
    >
      {content}
    </div>
  );
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<AuthAPI.ResultLoginResponse>({});
  const [loginType, setLoginType] = useState<LoginType>('account'); // 默认使用账户密码登录
  const [formMode, setFormMode] = useState<FormMode>('login');
  const [countDown, setCountDown] = useState(0);
  const [sending, setSending] = useState(false);
  const [captchaImage, setCaptchaImage] = useState<string>('');
  const [captchaKey, setCaptchaKey] = useState<string>('');
  const [captchaLoading, setCaptchaLoading] = useState<boolean>(false); // 验证码加载状态
  const fetchingCaptchaRef = React.useRef(false); // 防止重复请求
  const lastFormModeRef = React.useRef<FormMode | null>(null); // 跟踪上次的formMode
  const { initialState, setInitialState} = useModel('@@initialState');
  const { styles } = useStyles();
  const { message } = App.useApp();
  const intl = useIntl();
  const { token } = theme.useToken();

  // 倒计时效果
  React.useEffect(() => {
    if (countDown > 0) {
      const timer = setTimeout(() => setCountDown(countDown - 1), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [countDown]);

  // 获取图形验证码（带防抖和竞态处理）
  const fetchCaptcha = React.useCallback(async () => {
    // 如果正在请求，直接返回
    if (fetchingCaptchaRef.current) {
      return;
    }
    
    try {
      fetchingCaptchaRef.current = true;
      setCaptchaLoading(true); // 开始加载
      const result = await authController.getCaptcha();
      
      // 检查是否仍然需要更新（防止竞态条件）
      if (result.code === 200 && result.data) {
        setCaptchaImage(result.data.captchaImage || '');
        setCaptchaKey(result.data.captchaKey || '');
      }
    } catch (error) {
      message.error('获取验证码失败，请重试');
    } finally {
      setCaptchaLoading(false); // 结束加载
      fetchingCaptchaRef.current = false;
    }
  }, [message]); // 添加 message 依赖

  // 页面加载时获取验证码（只在formMode变化时重新获取）
  React.useEffect(() => {
    // 如果formMode没有变化，跳过（避免React Strict Mode导致的重复调用）
    if (lastFormModeRef.current === formMode) {
      return;
    }
    
    // 更新formMode引用
    lastFormModeRef.current = formMode;
    
    // 如果正在请求，等待完成后重置标记
    if (fetchingCaptchaRef.current) {
      // 延迟执行，等待当前请求完成
      const timer = setTimeout(() => {
        fetchingCaptchaRef.current = false;
        fetchCaptcha();
      }, 100);
      return () => clearTimeout(timer);
    }
    
    // 获取验证码
    fetchCaptcha();
    
    // 清理函数：组件卸载时重置标记
    return () => {
      // 不清空lastFormModeRef，因为我们需要记住上次的值
    };
  }, [formMode, fetchCaptcha]);

  // 处理OAuth2回调参数
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // 支持两种回调参数格式：
    // 1. 支付宝格式：oauth2_provider + oauth2_code (从后端重定向)
    // 2. GitHub/标准OAuth格式：code + state (直接从OAuth提供商回调)
    
    let oauth2Provider = urlParams.get('oauth2_provider');
    let oauth2Code = urlParams.get('oauth2_code');
    
    // 如果没有oauth2_provider，尝试从标准OAuth回调参数中获取
    if (!oauth2Provider && urlParams.has('code')) {
      oauth2Code = urlParams.get('code');
      const state = urlParams.get('state');
      
      // 从state中解析provider（格式：provider_timestamp）
      if (state) {
        const parts = state.split('_');
        if (parts.length >= 2) {
          oauth2Provider = parts[0]; // github, qq等
        }
      }
      
    }
    
    if (oauth2Provider && oauth2Code) {      
      // 清除URL参数，避免重复处理
      window.history.replaceState({}, '', '/login');
      
      // 调用OAuth2回调处理
      handleOAuth2Callback(oauth2Provider, oauth2Code);
    }
  }, []); // 只在组件挂载时执行一次

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      // 使用博物馆认证服务登录
      let loginRequest: any = {
        username: values.username,
        password: values.password,
        rememberMe: values.autoLogin,
        captcha: values.captcha,
        captchaKey: captchaKey,
      };

      // 如果是手机号登录，添加手机验证码
      if (loginType === 'phone') {
        loginRequest = {
          ...loginRequest,
          username: values.mobile,
          mobileCaptcha: values.mobileCaptcha,
        };
      }

      // ✅ 使用 skipErrorHandler 避免全局错误处理器重复显示错误
      const result = await authController.login(loginRequest, { skipErrorHandler: true });

      // ✅ 后端返回的Result结构：{ code, message, messageEn, data, timestamp }
      // code === 200 表示成功，否则失败
      if (result.code === 200 && result.data) {
        // 处理认证服务返回的令牌和用户信息
        const { accessToken, refreshToken, tokenType, userInfo } = result.data;

        // 存储令牌到localStorage
        localStorage.setItem('token', `${tokenType} ${accessToken}`);
        
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
          
          // 启动全局token自动刷新机制
          if (window.tokenManager) {
            window.tokenManager.startAutoRefresh();
          }
        }

        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultLoginSuccessMessage);

        // 设置用户信息到全局状态
        if (userInfo) {
          flushSync(() => {
            setInitialState((s) => ({
              ...s,
              currentUser: {
                name: userInfo.nickname || userInfo.username,
                avatar: userInfo.avatar,
                userid: String(userInfo.userId),
                email: userInfo.email,
                phone: userInfo.phone,
                signature: '',
                title: '',
                group: '',
                tags: [],
                notifyCount: 0,
                unreadCount: 0,
                country: 'China',
                access: userInfo.roles?.join(',') || '',
                address: '',
                geographic: {
                  province: { label: '', key: '' },
                  city: { label: '', key: '' },
                },
              },
            }));
          });
        }

        try {
          // 获取用户信息
          await fetchUserInfo();

          // 使用history进行路由跳转，而不是刷新整个页面
          const urlParams = new URL(window.location.href).searchParams;
          const redirect = urlParams.get('redirect');
          
          // 如果redirect是登录页或空，则跳转到首页，避免循环重定向
          let targetUrl = '/dashboard/map';
          if (redirect && redirect !== '/login' && !redirect.includes('/login?')) {
            targetUrl = redirect;
          }

          // 直接使用window.location.href进行跳转
          window.location.href = targetUrl;
        } catch (error) {
        }
        return;
      }

      // ✅ 登录失败 - 后端返回 code !== 200
      // 直接显示后端返回的message（中文错误消息）
      message.error(result.message || intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      }));
      
      // 刷新验证码
      fetchCaptcha();
      return; // ← 重要：防止执行到 catch 块
    } catch (error: any) {
      // ✅ 特殊处理：检查是否是业务错误（HTTP 400 但包含标准 Result 结构）
      if (error?.response?.data && typeof error.response.data === 'object' && 'code' in error.response.data) {
        // 这是业务错误（如验证码错误、密码错误等）
        const result = error.response.data;
        
        // 显示后端返回的错误消息
        message.error(result.message || intl.formatMessage({
          id: 'pages.login.failure',
          defaultMessage: '登录失败，请重试！',
        }));
        
        // 刷新验证码
        fetchCaptcha();
        return;
      }
      
      message.error(intl.formatMessage({
        id: 'pages.error.networkError',
        defaultMessage: '网络连接失败，请检查网络设置',
      }));
      
      // 刷新验证码
      fetchCaptcha();
    }
  };

  // 注册表单提交处理
  const handleRegisterSubmit = async (values: any) => {
    try {
      // 验证两次密码是否一致
      if (values.password !== values.confirmPassword) {
        message.error('两次输入的密码不一致');
        return;
      }

      // ✅ 调用注册接口（跳过全局错误处理）
      const registerRequest: AuthAPI.RegisterRequest = {
        username: values.username,
        password: values.password,
        confirmPassword: values.confirmPassword,
        email: values.email,
        code: values.code,
        nickname: values.nickname,
        phone: values.phone,
        captcha: values.captcha,
        captchaKey: captchaKey,
      };

      const result = await authController.register(registerRequest, { skipErrorHandler: true });

      // ✅ 判断 code === 200 表示成功
      if (result.code === 200 && result.data) {
        message.success('注册成功！正在自动登录...');

        // 注册成功后自动登录
        const { accessToken, refreshToken, tokenType, userInfo } = result.data;

        // 存储令牌到localStorage
        localStorage.setItem('token', `${tokenType} ${accessToken}`);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
          
          // 启动全局token自动刷新机制
          if (window.tokenManager) {
            window.tokenManager.startAutoRefresh();
          }
        }

        // 设置用户信息到全局状态
        if (userInfo) {
          flushSync(() => {
            setInitialState((s) => ({
              ...s,
              currentUser: {
                name: userInfo.nickname || userInfo.username,
                avatar: userInfo.avatar,
                userid: String(userInfo.userId),
                email: userInfo.email,
                phone: userInfo.phone,
                signature: '',
                title: '',
                group: '',
                tags: [],
                notifyCount: 0,
                unreadCount: 0,
                country: 'China',
                access: userInfo.roles?.join(',') || '',
                address: '',
                geographic: {
                  province: { label: '', key: '' },
                  city: { label: '', key: '' },
                },
              },
            }));
          });
        }

        // 获取用户信息
        await fetchUserInfo();

        // 跳转到首页
        window.location.href = '/dashboard/map';
        return;
      }

      // ✅ 注册失败 - 显示后端返回的错误消息
      message.error(result.message || '注册失败，请重试');
      // 刷新验证码
      fetchCaptcha();
      return; // ← 重要：防止执行到 catch 块
    } catch (error: any) {
      // ✅ 检查是否是业务错误
      if (error?.response?.data && typeof error.response.data === 'object' && 'code' in error.response.data) {
        const result = error.response.data;
        message.error(result.message || '注册失败，请重试');
        fetchCaptcha();
        return;
      }
      
      // 真正的网络异常
      message.error('网络连接失败，请检查网络设置');
      fetchCaptcha();
    }
  };

  // 重置密码表单提交处理
  const handleResetPasswordSubmit = async (values: any) => {
    try {
      // 验证两次密码是否一致
      if (values.newPassword !== values.confirmPassword) {
        message.error('两次输入的密码不一致');
        return;
      }

      // ✅ 调用重置密码接口（跳过全局错误处理）
      const resetRequest: AuthAPI.ResetPasswordRequest = {
        username: values.username,
        email: values.email,
        code: values.code,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
        captcha: values.captcha,
        captchaKey: captchaKey,
      };

      const result = await authController.resetPassword(resetRequest, { skipErrorHandler: true });

      // ✅ 判断 code === 200 表示成功
      if (result.code === 200) {
        message.success('密码重置成功！请重新登录');
        // 切换回登录模式
        setFormMode('login');
        return;
      }

      // ✅ 密码重置失败 - 显示后端返回的错误消息
      message.error(result.message || '密码重置失败，请重试');
      // 刷新验证码
      fetchCaptcha();
      return; // ← 重要：防止执行到 catch 块
    } catch (error: any) {
      // ✅ 检查是否是业务错误
      if (error?.response?.data && typeof error.response.data === 'object' && 'code' in error.response.data) {
        const result = error.response.data;
        message.error(result.message || '密码重置失败，请重试');
        fetchCaptcha();
        return;
      }
      
      // 真正的网络异常
      message.error('网络连接失败，请检查网络设置');
      fetchCaptcha();
    }
  };

  // 支付宝登录处理
  const handleAlipayLogin = async () => {
    try {
      // 获取授权URL
      const result = await oAuth2Controller.authorize({
        provider: 'alipay',
        redirectUri: `${window.location.origin}/oauth2/callback`,
      }, { skipErrorHandler: true });

      if (result.code === 200 && result.data) {
        
        // 直接在当前页面跳转到支付宝授权页（避免弹窗被拦截）
        window.location.href = result.data;
        return; // ✅ 成功跳转，直接返回
      }

      // ✅ 统一只显示后端返回的错误信息
        message.error('获取授权URL失败');
    } catch (error: any) {
      // ✅ 优先显示后端返回的错误
      const errorMessage = error?.response?.data?.message || error?.message || '支付宝登录失败，请重试';
      message.error(errorMessage);
    }
  };

  // 微信登录处理（暂未支持）
  const handleWechatLogin = () => {
    message.warning('微信登录功能暂未支持，敬请期待！');
  };

  // QQ登录处理
  const handleQqLogin = () => {
    message.warning('QQ登录功能暂未支持，敬请期待！');
  };

  // GitHub登录处理
  const handleGithubLogin = async () => {
    try {
      // 获取授权URL
      const result = await oAuth2Controller.authorize({
        provider: 'github',
        redirectUri: `${window.location.origin}/oauth2/callback`,
      }, { skipErrorHandler: true });

      if (result.code === 200 && result.data) {
        
        // 直接在当前页面跳转到GitHub授权页（避免弹窗被拦截）
        window.location.href = result.data;
        return; // ✅ 成功跳转，直接返回
      }

      // ✅ 统一只显示后端返回的错误信息
        message.error('获取授权URL失败');
    } catch (error: any) {
      // ✅ 优先显示后端返回的错误
      const errorMessage = error?.response?.data?.message || error?.message || 'GitHub登录失败，请重试';
      message.error(errorMessage);
    }
  };

  // 处理OAuth2回调
  const handleOAuth2Callback = async (provider: string, code: string) => {
    
    try {
      const result = await oAuth2Controller.callback({
        provider,
        code,
      }, { skipErrorHandler: true });

      if (result.code === 200 && result.data) {
        // 处理登录成功
        const { accessToken, refreshToken, tokenType, userInfo } = result.data;

        // 存储令牌到localStorage
        localStorage.setItem('token', `${tokenType} ${accessToken}`);
        
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
          
          // 启动全局token自动刷新机制
          if (window.tokenManager) {
            window.tokenManager.startAutoRefresh();
          }
        }

        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultLoginSuccessMessage);

        try {
          // 获取用户信息
          await fetchUserInfo();

          // 跳转逻辑
          const urlParams = new URL(window.location.href).searchParams;
          const redirect = urlParams.get('redirect');
          
          let targetUrl = '/dashboard/map';
          if (redirect && redirect !== '/login' && !redirect.includes('/login?')) {
            targetUrl = redirect;
          }

          window.location.href = targetUrl;
        } catch (error) {
        }
        return;
      }

      message.error(result.message || '登录失败');
      return; // ✅ 立即返回，避免进入 catch 块重复显示错误
    } catch (error) {
      message.error('登录失败，请重试');
    }
  };

  // 发送验证码
  const handleSendCode = async (email: string) => {
    try {
      if (!email) {
        message.error('请先输入邮箱地址');
        return false;
      }

      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        message.error('请输入正确的邮箱地址');
        return false;
      }

      const sendCodeRequest: AuthAPI.SendCodeRequest = {
        email: email,
        type: formMode === 'reset' ? 'reset' : 'register',
      };

      const result = await authController.sendCode(sendCodeRequest, { skipErrorHandler: true });

      if (result.code === 200) {
        message.success('验证码已发送到您的邮箱，请注意查收');
        return true;
      }

      message.error(result.message || '发送验证码失败');
      return false; // ✅ 已经有 return，这里保持不变
    } catch (error) {
      message.error('发送验证码失败，请重试！');
      return false;
    }
  };

  // 不再使用status和type属性，因为ResultLoginResponse中没有这些属性

  return (
    <div
      style={{
        backgroundColor: 'white',
        height: '100vh',
      }}
    >
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.login',
            defaultMessage: '登录页',
          })}
          {Settings.title && ` - ${Settings.title}`}
        </title>
      </Helmet>
      <Lang />
      <ProConfigProvider dark>
        <LoginFormPage
          backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
          logo={formMode === 'login' ? <img alt="logo" src="/logo.svg" /> : false}
          backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
          title={
            formMode === 'login' 
              ? intl.formatMessage({ id: 'app.name', defaultMessage: '文博探索' })
              : formMode === 'reset'
              ? <span style={{ fontSize: '20px' }}>
                  {intl.formatMessage({ id: 'pages.login.resetPasswordTitle', defaultMessage: '重置密码' })}
                </span>
              : formMode === 'register'
              ? <span style={{ fontSize: '20px' }}>
                  {intl.formatMessage({ id: 'pages.login.registerTitle', defaultMessage: '用户注册' })}
                </span>
              : ' '
          }
          containerStyle={{
            backgroundColor: 'rgba(0, 0, 0,0.65)',
            backdropFilter: 'blur(4px)',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
          subTitle={formMode === 'login' ? intl.formatMessage({
            id: 'app.subtitle',
            defaultMessage: 'MUSEUM SEEK SYSTEM',
          }) : ''}
          activityConfig={formMode === 'login' ? {
            style: {
              boxShadow: 'none',
              borderRadius: 8,
              backgroundColor: 'transparent',
              backdropFilter: 'none',
              padding: 0,
            },
            action: <LatestAppVersion />,
          } : undefined}
          actions={
            formMode === 'login' ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <Divider
                  style={{
                    borderTopColor: 'rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: 'normal',
                      fontSize: '14px',
                    }}
                  >
                    <FormattedMessage id="pages.login.loginWith" defaultMessage="其他登录方式" />
                  </span>
                </Divider>
                <Space align="center" size={24}>
                  <div
                    onClick={handleAlipayLogin}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                      height: 40,
                      width: 40,
                      border: '1px solid ' + token.colorPrimaryBorder,
                      borderRadius: '50%',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                      e.currentTarget.style.borderColor = '#1677FF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.borderColor = token.colorPrimaryBorder;
                    }}
                  >
                    <AlipayOutlined style={{ ...iconStyles, color: '#1677FF' }} />
                  </div>
                  <div
                    onClick={handleGithubLogin}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                      height: 40,
                      width: 40,
                      border: '1px solid ' + token.colorPrimaryBorder,
                      borderRadius: '50%',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.borderColor = token.colorPrimaryBorder;
                    }}
                  >
                    <GithubOutlined style={{ ...iconStyles, color: 'rgba(255, 255, 255, 0.85)' }} />
                  </div>
                  {/* 不可用的登录方式放在后面 */}
                  <div
                    onClick={handleQqLogin}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                      height: 40,
                      width: 40,
                      border: '1px solid ' + token.colorPrimaryBorder,
                      borderRadius: '50%',
                      cursor: 'not-allowed',
                      transition: 'all 0.3s',
                      opacity: 0.6,
                    }}
                  >
                    <QqOutlined style={{ ...iconStyles, color: '#12B7F5' }} />
                  </div>
                  <div
                    onClick={handleWechatLogin}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                      height: 40,
                      width: 40,
                      border: '1px solid ' + token.colorPrimaryBorder,
                      borderRadius: '50%',
                      cursor: 'not-allowed',
                      transition: 'all 0.3s',
                      opacity: 0.6,
                    }}
                  >
                    <WechatOutlined style={{ ...iconStyles, color: '#07C160' }} />
                  </div>
                </Space>
              </div>
            ) : null
          }
          onFinish={async (values) => {
            if (formMode === 'register') {
              await handleRegisterSubmit(values);
            } else if (formMode === 'reset') {
              await handleResetPasswordSubmit(values);
            } else {
              await handleSubmit(values as AuthAPI.LoginRequest);
            }
          }}
          submitter={{
            searchConfig: {
              submitText: formMode === 'register' 
                ? intl.formatMessage({ id: 'pages.login.register', defaultMessage: '注册' })
                : formMode === 'reset' 
                ? intl.formatMessage({ id: 'pages.login.resetPassword', defaultMessage: '重置密码' })
                : intl.formatMessage({ id: 'pages.login.submit', defaultMessage: '登录' }),
            },
          }}
        >
          {formMode === 'login' && (
            <Tabs
              activeKey={loginType}
              onChange={(activeKey) => setLoginType(activeKey as LoginType)}
              centered
              items={[
                {
                  key: 'account',
                  label: intl.formatMessage({
                    id: 'pages.login.accountLogin.tab',
                    defaultMessage: '账户密码登录',
                  }),
                },
                {
                  key: 'phone',
                  label: (
                    <span>
                      {intl.formatMessage({
                        id: 'pages.login.phoneLogin.tab',
                        defaultMessage: '手机号登录',
                      })}
                      <span style={{ fontSize: '12px', color: '#ff4d4f', marginLeft: '4px' }}>
                        (暂不支持)
                      </span>
                    </span>
                  ),
                  disabled: true,
                },
              ]}
            />
          )}

          {/* 登录表单 */}
          {formMode === 'login' && (
            <>
              {/* ✅ 移除 LoginMessage，统一使用 message.error() 显示后端错误 */}
              {loginType === 'account' && (
                <>
                  <ProFormText
                    name="username"
                    fieldProps={{
                      size: 'large',
                      className: styles.customInput,
                      style: {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                      },
                      prefix: (
                        <UserOutlined
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                          }}
                          className={'prefixIcon'}
                        />
                      ),
                    }}
                    placeholder={intl.formatMessage({
                      id: 'pages.login.username.placeholder',
                      defaultMessage: '请输入用户名或邮箱',
                    })}
                    rules={[
                      {
                        required: true,
                        message: '请输入用户名或邮箱！',
                      },
                    ]}
                  />
                  <ProFormText.Password
                    name="password"
                    fieldProps={{
                      size: 'large',
                      className: styles.customInput,
                      style: {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                      },
                      prefix: (
                        <LockOutlined
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                          }}
                          className={'prefixIcon'}
                        />
                      ),
                    }}
                    placeholder={intl.formatMessage({
                      id: 'pages.login.password.placeholder',
                      defaultMessage: '请输入密码',
                    })}
                    rules={[
                      {
                        required: true,
                        message: (
                          <FormattedMessage
                            id="pages.login.password.required"
                            defaultMessage="请输入密码！"
                          />
                        ),
                      },
                    ]}
                  />
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <ProFormText
                      name="captcha"
                      fieldProps={{
                        size: 'large',
                        className: styles.customInput,
                        style: {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '14px',
                          flex: 1,
                        },
                        prefix: (
                          <SafetyOutlined
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                            }}
                            className={'prefixIcon'}
                          />
                        ),
                      }}
                      placeholder={intl.formatMessage({
                        id: 'pages.login.graphicCaptcha.placeholder',
                        defaultMessage: '请输入验证码',
                      })}
                      rules={[
                        {
                          required: true,
                          message: '请输入验证码！',
                        },
                      ]}
                    />
                    <div
                    onClick={captchaLoading ? undefined : fetchCaptcha}
                      style={{
                        width: '120px',
                        height: '40px',
                      cursor: captchaLoading ? 'not-allowed' : 'pointer',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                    {captchaLoading ? (
                      <Spin size="small" />
                    ) : captchaImage ? (
                        <img
                          src={`data:image/png;base64,${captchaImage}`}
                          alt="验证码"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px' }}>
                          点击刷新
                        </span>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* ✅ 移除 LoginMessage，统一使用 message.error() 显示后端错误 */}
              {loginType === 'phone' && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '16px', color: '#ff4d4f', marginBottom: '10px' }}>
                    手机号登录功能暂时不可用
                  </div>
                  <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.65)' }}>
                    请使用账户密码登录或第三方登录方式
                  </div>
                </div>
              )}
              <div
                style={{
                  marginBlockEnd: 24,
                  color: 'rgba(255, 255, 255, 0.85)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Button
                  type="link"
                  style={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '14px',
                    padding: 0,
                    height: 'auto',
                  }}
                  onClick={() => setFormMode('register')}
                >
                  <FormattedMessage
                    id="pages.login.registerAccount"
                    defaultMessage="立即注册"
                  />
                </Button>
                <a
                  style={{
                    color: 'rgba(255, 255, 255, 0.65)',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                  onClick={() => setFormMode('reset')}
                >
                  <FormattedMessage
                    id="pages.login.forgotPassword"
                    defaultMessage="忘记密码"
                  />
                </a>
              </div>
            </>
          )}

          {/* 注册表单 */}
          {formMode === 'register' && (
            <div style={{ 
              '--form-item-margin-bottom': '16px',
            } as React.CSSProperties & { '--form-item-margin-bottom': string }}>
              <style>{`
                .ant-form-item { margin-bottom: 16px !important; }
              `}</style>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  className: styles.customInput,
                  style: {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                    marginTop: '24px',
                  },
                  prefix: (
                    <UserOutlined
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                      className={'prefixIcon'}
                    />
                  ),
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.register.username.placeholder',
                  defaultMessage: '请输入用户名',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.login.register.username.required',
                      defaultMessage: '请输入用户名！',
                    }),
                  },
                  {
                    min: 4,
                    max: 20,
                    message: intl.formatMessage({
                      id: 'pages.login.register.username.length',
                      defaultMessage: '用户名长度为4-20个字符',
                    }),
                  },
                  {
                    pattern: /^[a-zA-Z0-9_]+$/,
                    message: intl.formatMessage({
                      id: 'pages.login.register.username.pattern',
                      defaultMessage: '用户名只能包含字母、数字和下划线',
                    }),
                  },
                ]}
              />
              <ProFormText
                name="nickname"
                fieldProps={{
                  size: 'large',
                  className: styles.customInput,
                  style: {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                  },
                  prefix: (
                    <UserOutlined
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                      className={'prefixIcon'}
                    />
                  ),
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.nickname.placeholder',
                  defaultMessage: '昵称（可选）',
                })}
              />
              <ProFormText
                name="email"
                fieldProps={{
                  size: 'large',
                  className: styles.customInput,
                  style: {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                  },
                  prefix: (
                    <MailOutlined
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                      className={'prefixIcon'}
                    />
                  ),
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.email.placeholder',
                  defaultMessage: '邮箱',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.login.register.email.required',
                      defaultMessage: '请输入邮箱！',
                    }),
                  },
                  {
                    type: 'email',
                    message: intl.formatMessage({
                      id: 'pages.login.register.email.invalid',
                      defaultMessage: '请输入正确的邮箱格式！',
                    }),
                  },
                ]}
              />
              <ProFormDependency name={['email']}>
                {({ email }) => (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <ProFormText
                      name="code"
                      fieldProps={{
                        size: 'large',
                        className: styles.customInput,
                        style: {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          color: 'rgba(255, 255, 255, 0.9)',
                          flex: 1,
                        },
                        prefix: (
                          <LockOutlined
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                            }}
                            className={'prefixIcon'}
                          />
                        ),
                      }}
                      placeholder={intl.formatMessage({
                        id: 'pages.login.emailCode.placeholder',
                        defaultMessage: '邮箱验证码',
                      })}
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({
                            id: 'pages.login.register.captcha.required',
                            defaultMessage: '请输入验证码！',
                          }),
                        },
                      ]}
                    />
                    <Button
                      size="large"
                      disabled={countDown > 0 || sending || !email}
                      loading={sending}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: 'rgba(255, 255, 255, 0.95)',
                        fontSize: '14px',
                        minWidth: '120px',
                      }}
                      onClick={async () => {
                        if (!email) {
                          message.error('请先输入邮箱地址');
                          return;
                        }
                        setSending(true);
                        const success = await handleSendCode(email);
                        setSending(false);
                        if (success) {
                          setCountDown(60);
                        }
                      }}
                    >
                      {countDown > 0 
                        ? intl.formatMessage({ 
                            id: 'pages.login.getEmailCode.countdown', 
                            defaultMessage: '{count} 秒后重新获取' 
                          }, { count: countDown })
                        : intl.formatMessage({ 
                            id: 'pages.login.getEmailCode', 
                            defaultMessage: '获取验证码' 
                          })
                      }
                    </Button>
                  </div>
                )}
              </ProFormDependency>
              <ProFormText
                name="phone"
                fieldProps={{
                  size: 'large',
                  className: styles.customInput,
                  style: {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                  },
                  prefix: (
                    <MobileOutlined
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                      className={'prefixIcon'}
                    />
                  ),
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.phoneNumber.placeholder',
                  defaultMessage: '手机号（可选）',
                })}
                rules={[
                  {
                    pattern: /^1\d{10}$/,
                    message: intl.formatMessage({
                      id: 'pages.login.register.phone.invalid',
                      defaultMessage: '请输入正确的手机号！',
                    }),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  className: styles.customInput,
                  style: {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                  },
                  prefix: (
                    <LockOutlined
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                      className={'prefixIcon'}
                    />
                  ),
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.login.register.password.required',
                      defaultMessage: '请输入密码！',
                    }),
                  },
                  {
                    min: 6,
                    max: 20,
                    message: '密码长度为6-20个字符',
                  },
                ]}
              />
              <ProFormText.Password
                name="confirmPassword"
                fieldProps={{
                  size: 'large',
                  className: styles.customInput,
                  style: {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                  },
                  prefix: (
                    <LockOutlined
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                      className={'prefixIcon'}
                    />
                  ),
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.confirmPassword.placeholder',
                  defaultMessage: '确认密码',
                })}
                rules={[
                  {
                    required: true,
                    message: '请再次输入密码！',
                  },
                ]}
              />
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <ProFormText
                  name="captcha"
                  fieldProps={{
                    size: 'large',
                    className: styles.customInput,
                    style: {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                      flex: 1,
                    },
                    prefix: (
                      <SafetyOutlined
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                        className={'prefixIcon'}
                      />
                    ),
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.graphicCaptcha.placeholder',
                    defaultMessage: '请输入验证码',
                  })}
                  rules={[
                    {
                      required: true,
                      message: '请输入验证码！',
                    },
                  ]}
                />
                <div
                  onClick={captchaLoading ? undefined : fetchCaptcha}
                  style={{
                    width: '120px',
                    height: '40px',
                    cursor: captchaLoading ? 'not-allowed' : 'pointer',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {captchaLoading ? (
                    <Spin size="small" />
                  ) : captchaImage ? (
                    <img
                      src={`data:image/png;base64,${captchaImage}`}
                      alt="验证码"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px' }}>
                      点击刷新
                    </span>
                  )}
                </div>
              </div>
              <div
                style={{
                  marginBlockEnd: 8,
                  marginTop: '8px',
                  color: 'rgba(255, 255, 255, 0.85)',
                  textAlign: 'center',
                }}
              >
                <Button
                  type="link"
                  style={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '14px',
                    padding: 0,
                    height: 'auto',
                  }}
                  onClick={() => setFormMode('login')}
                >
                  <FormattedMessage
                    id="pages.login.haveAccount"
                    defaultMessage="已有账号？立即登录"
                  />
                </Button>
              </div>
            </div>
          )}

          {/* 重置密码表单 */}
          {formMode === 'reset' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  className: styles.customInput,
                  style: {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                    marginTop: '24px',
                  },
                  prefix: (
                    <UserOutlined
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                      className={'prefixIcon'}
                    />
                  ),
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.reset.username.placeholder',
                  defaultMessage: '请输入用户名',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.login.reset.username.required',
                      defaultMessage: '请输入用户名！',
                    }),
                  },
                ]}
              />
              <ProFormText
                name="email"
                fieldProps={{
                  size: 'large',
                  className: styles.customInput,
                  style: {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                  },
                  prefix: (
                    <MailOutlined
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                      className={'prefixIcon'}
                    />
                  ),
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.email.placeholder',
                  defaultMessage: '邮箱',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.login.reset.email.required',
                      defaultMessage: '请输入邮箱！',
                    }),
                  },
                  {
                    type: 'email',
                    message: intl.formatMessage({
                      id: 'pages.login.reset.email.invalid',
                      defaultMessage: '请输入有效的邮箱地址！',
                    }),
                  },
                ]}
              />
              <ProFormDependency name={['email']}>
                {({ email }) => (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <ProFormText
                      name="code"
                      fieldProps={{
                        size: 'large',
                        className: styles.customInput,
                        style: {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          color: 'rgba(255, 255, 255, 0.9)',
                          flex: 1,
                        },
                        prefix: (
                          <LockOutlined
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                            }}
                            className={'prefixIcon'}
                          />
                        ),
                      }}
                      placeholder={intl.formatMessage({
                        id: 'pages.login.emailCode.placeholder',
                        defaultMessage: '邮箱验证码',
                      })}
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({
                            id: 'pages.login.reset.captcha.required',
                            defaultMessage: '请输入验证码！',
                          }),
                        },
                      ]}
                    />
                    <Button
                      size="large"
                      disabled={countDown > 0 || sending || !email}
                      loading={sending}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: 'rgba(255, 255, 255, 0.95)',
                        fontSize: '14px',
                        minWidth: '120px',
                      }}
                      onClick={async () => {
                        if (!email) {
                          message.error('请先输入邮箱地址');
                          return;
                        }
                        setSending(true);
                        const success = await handleSendCode(email);
                        setSending(false);
                        if (success) {
                          setCountDown(60);
                        }
                      }}
                    >
                      {countDown > 0 
                        ? intl.formatMessage({ 
                            id: 'pages.login.getEmailCode.countdown', 
                            defaultMessage: '{count} 秒后重新获取' 
                          }, { count: countDown })
                        : intl.formatMessage({ 
                            id: 'pages.login.getEmailCode', 
                            defaultMessage: '获取验证码' 
                          })
                      }
                    </Button>
                  </div>
                )}
              </ProFormDependency>
              <ProFormText.Password
                name="newPassword"
                fieldProps={{
                  size: 'large',
                  className: styles.customInput,
                  style: {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                  },
                  prefix: (
                    <LockOutlined
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                      className={'prefixIcon'}
                    />
                  ),
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.newPassword.placeholder',
                  defaultMessage: '新密码',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.login.reset.newPassword.required',
                      defaultMessage: '请输入新密码！',
                    }),
                  },
                  {
                    min: 6,
                    max: 20,
                    message: intl.formatMessage({
                      id: 'pages.login.reset.newPassword.length',
                      defaultMessage: '密码长度为6-20个字符',
                    }),
                  },
                ]}
              />
              <ProFormText.Password
                name="confirmPassword"
                fieldProps={{
                  size: 'large',
                  className: styles.customInput,
                  style: {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                  },
                  prefix: (
                    <LockOutlined
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                      className={'prefixIcon'}
                    />
                  ),
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.confirmNewPassword.placeholder',
                  defaultMessage: '确认新密码',
                })}
                rules={[
                  {
                    required: true,
                    message: '请再次输入新密码！',
                  },
                ]}
              />
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <ProFormText
                  name="captcha"
                  fieldProps={{
                    size: 'large',
                    className: styles.customInput,
                    style: {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                      flex: 1,
                    },
                    prefix: (
                      <SafetyOutlined
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                        className={'prefixIcon'}
                      />
                    ),
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.graphicCaptcha.placeholder',
                    defaultMessage: '请输入验证码',
                  })}
                  rules={[
                    {
                      required: true,
                      message: '请输入验证码！',
                    },
                  ]}
                />
                <div
                onClick={captchaLoading ? undefined : fetchCaptcha}
                  style={{
                    width: '120px',
                    height: '40px',
                  cursor: captchaLoading ? 'not-allowed' : 'pointer',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                {captchaLoading ? (
                  <Spin size="small" />
                ) : captchaImage ? (
                    <img
                      src={`data:image/png;base64,${captchaImage}`}
                      alt="验证码"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px' }}>
                      点击刷新
                    </span>
                  )}
                </div>
              </div>
              <div
                style={{
                  marginBlockEnd: 24,
                  color: 'rgba(255, 255, 255, 0.85)',
                  textAlign: 'center',
                }}
              >
                <Button
                  type="link"
                  style={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '14px',
                    padding: 0,
                    height: 'auto',
                  }}
                  onClick={() => setFormMode('login')}
                >
                  <FormattedMessage
                    id="pages.login.backToLogin"
                    defaultMessage="返回登录"
                  />
                </Button>
              </div>
            </>
          )}
        </LoginFormPage>
      </ProConfigProvider>
    </div>
  );
};

export default Login;
