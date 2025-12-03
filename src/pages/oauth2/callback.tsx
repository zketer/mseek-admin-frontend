import { useEffect, useState } from 'react';
import { Spin, message } from 'antd';
import * as oAuth2Controller from '@/services/auth-service-api/oAuth2Controller';
import { history, useModel } from '@umijs/max';
import { flushSync } from 'react-dom';
import { STORAGE_KEYS } from '@/constants';

/**
 * OAuth2 回调页面
 * 用于处理第三方登录（支付宝、微信）的授权回调
 * 直接在此页面完成登录流程，避免跳转导致的状态丢失
 */
const OAuth2Callback: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [status, setStatus] = useState('处理中...');
    
  useEffect(() => {
    
    const handleCallback = async () => {
      // 从URL中获取授权码和状态参数
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const authCode = urlParams.get('auth_code'); // 支付宝使用auth_code

      // 从state中提取provider信息
      let provider = 'alipay'; // 默认支付宝
      
      if (state) {
        // state格式：provider_timestamp（如 github_1761623021213, alipay_1761623021213）
        if (state.includes('_')) {
          provider = state.split('_')[0]; // 提取下划线前的provider
        } else {
          // 兼容旧格式：可能是JSON或直接的provider字符串
          try {
            const stateData = JSON.parse(decodeURIComponent(state));
            provider = stateData.provider || 'alipay';
          } catch (error) {
            provider = state;
          }
        }
      }

      // 使用code或authCode
      const authorizationCode = code || authCode;

      if (!authorizationCode) {
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        message.error('授权失败，请重试');
        setStatus('授权失败');
        setTimeout(() => {
          history.replace('/login');
        }, 2000);
        return;
      }

      setStatus('正在登录...');
      
      try {
        // 直接调用后端OAuth2回调API
        const result = await oAuth2Controller.callback({
          provider,
          code: authorizationCode,
        });

        if (result.success && result.data) {
          const { accessToken, refreshToken, tokenType, userInfo } = result.data;
          // 存储令牌
          localStorage.setItem(STORAGE_KEYS.TOKEN, `${tokenType} ${accessToken}`);
          
          if (refreshToken) {
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
            // 启动自动刷新
            if (window.tokenManager) {
              window.tokenManager.startAutoRefresh();
            }
          }

          message.success('登录成功！');
          setStatus('登录成功，正在获取用户信息...');
          
          // 获取用户信息并更新全局状态
          try {
            const fetchedUserInfo = await initialState?.fetchUserInfo?.();
            
            if (fetchedUserInfo) {
              flushSync(() => {
                setInitialState((s) => ({
                  ...s,
                  currentUser: fetchedUserInfo,
                }));
              });
              
              setStatus('登录成功，正在跳转...');
              
              // 使用history.replace进行跳转，避免整个页面刷新
              setTimeout(() => {
                history.replace('/dashboard/map');
              }, 300);
            } else {
              throw new Error('获取用户信息失败');
            }
          } catch (fetchError: any) {
            throw new Error('获取用户信息失败: ' + fetchError.message);
          }
        } else {
          throw new Error(result.message || '登录失败');
        }
      } catch (error: any) {
        message.error(error.message || '登录失败，请重试');
        setStatus('登录失败，2秒后返回登录页');
        setTimeout(() => {
          history.replace('/login');
        }, 2000);
      }
    };

    handleCallback();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Spin size="large" />
      <div style={{ marginTop: 20, color: '#666', fontSize: 16 }}>
        {status}
      </div>
    </div>
  );
};

export default OAuth2Callback;
