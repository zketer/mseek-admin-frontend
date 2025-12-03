/**
 * 权限验证工具类
 */
import React from 'react';
import { getInitialState } from '@/app';
import { useModel } from '@umijs/max';
import UsersAPI from '@/services/user-service-api';

// 权限操作类型
export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'manage';

// 用户状态枚举
export enum UserStatus {
  INACTIVE = 0,  // 禁用
  ACTIVE = 1,    // 启用
  LOCKED = 2,    // 锁定
}

// 性别枚举
export enum Gender {
  UNKNOWN = 0,   // 未知
  MALE = 1,      // 男
  FEMALE = 2,    // 女
}

/**
 * 检查用户是否有指定权限
 * @param permission 权限标识
 * @param action 操作类型
 * @returns boolean
 */
export const hasPermission = async (permission: string, action?: PermissionAction): Promise<boolean> => {
  try {
    const initialState = await getInitialState();
    const currentUser = initialState?.currentUser;
    
    if (!currentUser || !currentUser.userid) {
      return false;
    }

    // 获取用户权限列表
    const response = await UsersAPI.userController.getUserPermissions({
      id: parseInt(currentUser.userid, 10),
    });

    if (response?.data && Array.isArray(response.data)) {
      const permissions = response.data;
      
      // 检查具体权限
      const fullPermission = action ? `${permission}:${action}` : permission;
      
      return permissions.includes(fullPermission) || permissions.includes(permission);
    }

    return false;
  } catch (error) {
    console.error('权限检查失败:', error);
    return false;
  }
};

/**
 * 检查用户是否有指定角色
 * @param roleName 角色名称
 * @returns boolean
 */
export const hasRole = async (roleName: string): Promise<boolean> => {
  try {
    const initialState = await getInitialState();
    const currentUser = initialState?.currentUser;
    
    if (!currentUser || !currentUser.id) {
      return false;
    }

    // 获取用户角色列表
    const response = await UsersAPI.userController.getUserRoles({
      id: currentUser.id,
    });

    if (response?.data && Array.isArray(response.data)) {
      return response.data.includes(roleName);
    }

    return false;
  } catch (error) {
    console.error('角色检查失败:', error);
    return false;
  }
};

/**
 * 检查是否为管理员
 * @returns boolean
 */
export const isAdmin = async (): Promise<boolean> => {
  return await hasRole('admin') || await hasRole('超级管理员');
};

/**
 * 检查是否为超级管理员
 * @returns boolean
 */
export const isSuperAdmin = async (): Promise<boolean> => {
  return await hasRole('super-admin') || await hasRole('超级管理员');
};

/**
 * 权限校验装饰器（高阶组件）
 * @param permission 权限标识
 * @param action 操作类型
 * @param fallback 无权限时的回退组件
 */
export const withPermission = (
  permission: string,
  action?: PermissionAction,
  fallback?: React.ComponentType
) => {
  return <P extends object>(Component: React.ComponentType<P>) => {
    const WrappedComponent = (props: P) => {
      const [hasAuth, setHasAuth] = React.useState<boolean | null>(null);

      React.useEffect(() => {
        hasPermission(permission, action).then(setHasAuth);
      }, []);

      if (hasAuth === null) {
        return React.createElement('div', null, '检查权限中');
      }

      if (!hasAuth) {
        return fallback ? React.createElement(fallback) : React.createElement('div', null, '无权限访问');
      }

      return React.createElement(Component, props);
    };

    WrappedComponent.displayName = `withPermission(${Component.displayName || Component.name})`;
    return WrappedComponent;
  };
};

/**
 * 权限校验Hook（优化版本）
 * @description 从全局状态直接读取权限，避免每次都调用API
 * @param permission 权限标识
 * @param action 操作类型
 * @returns { hasAuth: boolean, loading: boolean }
 * 
 * @example
 * const { hasAuth, loading } = usePermission('museums:list:add');
 * if (loading) return <Spin />;
 * if (!hasAuth) return <NoPermission />;
 */
export const usePermission = (permission: string, action?: PermissionAction) => {
  // ✅ 使用 UmiJS 的 useModel 获取全局状态
  const { initialState } = useModel('@@initialState');
  
  // 从权限列表中检查
  const hasAuth = React.useMemo(() => {
    if (!initialState?.currentUser) {
      return false;
    }

    const permissions = initialState.currentUser.permissions || [];
    const fullPermission = action ? `${permission}:${action}` : permission;
    
    // 支持通配符匹配：如果用户有 'museums:*' 权限，则拥有所有 museums 相关权限
    const hasDirectPermission = permissions.includes(fullPermission) || permissions.includes(permission);
    const hasWildcardPermission = permissions.some((p: string) => {
      const parts = permission.split(':');
      if (parts.length > 1) {
        return permissions.includes(`${parts[0]}:*`);
      }
      return false;
      });
    
    return hasDirectPermission || hasWildcardPermission;
  }, [initialState, permission, action]);

  // ✅ 不再需要 loading 状态，因为 initialState 是同步的
  const loading = !initialState;

  return { hasAuth, loading };
};

/**
 * 角色校验Hook
 * @param roleName 角色名称
 * @returns { hasRole: boolean | null, loading: boolean }
 */
export const useRole = (roleName: string) => {
  const [hasRoleAuth, setHasRoleAuth] = React.useState<boolean | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    hasRole(roleName)
      .then((result) => {
        setHasRoleAuth(result);
        setLoading(false);
      })
      .catch(() => {
        setHasRoleAuth(false);
        setLoading(false);
      });
  }, [roleName]);

  return { hasRole: hasRoleAuth, loading };
};

/**
 * 获取用户状态显示文本
 * @param status 用户状态
 * @returns string
 */
export const getUserStatusText = (status: UserStatus): string => {
  switch (status) {
    case UserStatus.INACTIVE:
      return '禁用';
    case UserStatus.ACTIVE:
      return '启用';
    case UserStatus.LOCKED:
      return '锁定';
    default:
      return '未知';
  }
};

/**
 * 获取性别显示文本
 * @param gender 性别
 * @returns string
 */
export const getGenderText = (gender: Gender): string => {
  switch (gender) {
    case Gender.UNKNOWN:
      return '未知';
    case Gender.MALE:
      return '男';
    case Gender.FEMALE:
      return '女';
    default:
      return '未知';
  }
};

/**
 * 重新导出验证工具函数（保持向后兼容）
 * @deprecated 请直接从 '@/utils/validators' 导入验证函数
 */
export {
  validateUsername,
  validateEmail,
  validatePhone,
  validatePassword,
} from './validators';

export default {
  hasPermission,
  hasRole,
  isAdmin,
  isSuperAdmin,
  withPermission,
  usePermission,
  useRole,
  getUserStatusText,
  getGenderText,
  UserStatus,
  Gender,
};
