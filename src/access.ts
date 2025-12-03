/**
 * @see https://umijs.org/docs/max/access#access
 * */

import type { CurrentUser } from '@/types/user';

export default function access(
  initialState: { currentUser?: CurrentUser } | undefined,
) {
  const { currentUser } = initialState ?? {};
  
  // 基础权限检查
  const isLoggedIn = !!currentUser;
  const userPermissions = currentUser?.permissions || [];
  
  // 权限检查辅助函数
  const hasPermission = (permission: string): boolean => {
    return userPermissions.includes(permission);
  };
  
  // 主菜单权限检查：如果有任何子菜单权限（一级子权限，不包括操作权限），则显示主菜单
  // 例如：users:list, users:roles 是子菜单，users:list:add 是操作权限
  const hasAnySubPermission = (prefix: string): boolean => {
    return userPermissions.some((perm: string) => {
      // 检查是否以 prefix: 开头
      if (!perm.startsWith(prefix + ':')) return false;
      // 移除前缀后，检查是否只有一级（即子菜单），不包含第二个冒号（操作权限）
      const afterPrefix = perm.substring(prefix.length + 1);
      return !afterPrefix.includes(':');
    });
  };
  
  return {
    // 旧的权限检查（保持兼容）
    canAdmin: currentUser && currentUser.access === 'admin',
    
    // 登录状态检查
    isLoggedIn,
    
    // 数据中心权限 - 使用菜单权限检查
    canViewDashboard: isLoggedIn && (hasPermission('dashboard') || hasAnySubPermission('dashboard')),
    canViewMuseumMap: isLoggedIn && hasPermission('dashboard:map'),
    canViewOverview: isLoggedIn && hasPermission('dashboard:overview'),
    canViewUserStats: isLoggedIn && hasPermission('dashboard:statistics'),
    
    // 博物馆管理权限 - 使用真实权限检查
    canViewMuseums: isLoggedIn && (hasPermission('museums') || hasAnySubPermission('museums')), // 主菜单：需要museums权限或任何子菜单权限
    canViewMuseumList: isLoggedIn && hasPermission('museums:list'), // 博物馆列表子菜单
    canCreateMuseum: isLoggedIn && hasPermission('museums:list:add'),
    canEditMuseum: isLoggedIn && hasPermission('museums:list:edit'),
    canDeleteMuseum: isLoggedIn && hasPermission('museums:list:delete'),
    canManageExhibitions: isLoggedIn && hasPermission('museums:exhibitions'),
    canManageCategories: isLoggedIn && hasPermission('museums:categories'),
    canManageTags: isLoggedIn && hasPermission('museums:tags'),
    canManageRegions: isLoggedIn && hasPermission('museums:areas'),
    
    // 用户管理权限 - 智能权限检查
    canViewUsersModule: isLoggedIn && (hasPermission('users') || hasAnySubPermission('users')), // 主菜单：需要users权限或任何子权限
    canViewUsers: isLoggedIn && hasPermission('users:list'),        // 用户列表子菜单
    canCreateUser: isLoggedIn && hasPermission('users:list:add'),
    canEditUser: isLoggedIn && hasPermission('users:list:edit'),
    canDeleteUser: isLoggedIn && hasPermission('users:list:delete'),
    
    // 角色权限管理 - 使用真实权限检查
    canViewRoles: isLoggedIn && hasPermission('users:roles'),
    canCreateRole: isLoggedIn && hasPermission('users:roles:add'),
    canEditRole: isLoggedIn && hasPermission('users:roles:edit'),
    canDeleteRole: isLoggedIn && hasPermission('users:roles:delete'),
    
    // 权限管理 - 使用真实权限检查
    canViewPermissions: isLoggedIn && hasPermission('users:permissions'),
    canManagePermissions: isLoggedIn && hasPermission('users:permissions:edit'),
    
    // 部门管理权限
    canViewDepartments: isLoggedIn,
    canCreateDepartment: isLoggedIn,
    canEditDepartment: isLoggedIn,
    canDeleteDepartment: isLoggedIn,
    
    // 打卡记录权限 - 使用菜单权限检查
    canViewCheckIns: isLoggedIn && (hasPermission('checkins') || hasAnySubPermission('checkins')),
    canManageCheckIns: isLoggedIn && hasPermission('checkins:records'),
    canAuditCheckIns: isLoggedIn && hasPermission('checkins:records:audit'),
    
    // 内容管理权限 - 使用真实权限检查
    canViewContent: isLoggedIn && (hasPermission('content') || hasAnySubPermission('content')), // 主菜单：需要content权限或任何子权限
    canViewBanners: isLoggedIn && hasPermission('content:banners'),
    canCreateBanner: isLoggedIn && hasPermission('content:banners:add'),
    canEditBanner: isLoggedIn && hasPermission('content:banners:edit'),
    canDeleteBanner: isLoggedIn && hasPermission('content:banners:delete'),
    
    canViewAnnouncements: isLoggedIn && hasPermission('content:announcements'),
    canCreateAnnouncement: isLoggedIn && hasPermission('content:announcements:add'),
    canEditAnnouncement: isLoggedIn && hasPermission('content:announcements:edit'),
    canDeleteAnnouncement: isLoggedIn && hasPermission('content:announcements:delete'),
    
    // AI旅游指南权限 - 使用真实权限检查
    canViewAiGuide: isLoggedIn && (hasPermission('ai-guide') || hasAnySubPermission('ai-guide')), // 主菜单：需要ai-guide权限或任何子权限
    canViewGenerator: isLoggedIn && hasPermission('ai-guide:generator'),
    canGenerateGuide: isLoggedIn && hasPermission('ai-guide:generator:generate'),
    canViewMyGuides: isLoggedIn && hasPermission('ai-guide:my-guides'),
    canViewGuide: isLoggedIn && hasPermission('ai-guide:my-guides:view'),
    canEditGuide: isLoggedIn && hasPermission('ai-guide:my-guides:edit'),
    canDeleteGuide: isLoggedIn && hasPermission('ai-guide:my-guides:delete'),
    
    // 系统管理权限
    canViewSystemInfo: isLoggedIn,
    canViewSystemLogs: isLoggedIn,
    canViewSystemConfig: isLoggedIn,
    
    // 关于系统权限 - 使用真实权限检查
    canViewAbout: isLoggedIn && (hasPermission('about') || hasAnySubPermission('about')), // 主菜单：需要about权限或任何子权限
    canViewAboutOverview: isLoggedIn && hasPermission('about:overview'),
    canViewAboutArchitecture: isLoggedIn && hasPermission('about:architecture'),
    canViewAboutAppVersions: isLoggedIn && hasPermission('about:app-versions'),
    
    // 应用信息操作权限
    canViewAppVersionDetail: isLoggedIn && hasPermission('about:app-versions:view'),
    canAddAppVersion: isLoggedIn && hasPermission('about:app-versions:add'),
    canEditAppVersion: isLoggedIn && hasPermission('about:app-versions:edit'),
    canDeleteAppVersion: isLoggedIn && hasPermission('about:app-versions:delete'),
    canDownloadAppVersion: isLoggedIn && hasPermission('about:app-versions:download'),
    canMarkAppVersionLatest: isLoggedIn && hasPermission('about:app-versions:mark-latest'),
    
    // 个人中心权限 - 使用真实权限检查
    canViewProfile: isLoggedIn && hasPermission('profile'),
    canEditProfile: isLoggedIn && hasPermission('profile:info'),
  };
}
