/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/login',
    layout: false,
    name: 'login',
    component: './login',
  },
  {
    path: '/oauth2/callback',
    layout: false,
    name: 'oauth2-callback',
    component: './oauth2/callback',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    locale: 'menu.dashboard',
    icon: 'BarChartOutlined',
    access: 'canViewDashboard',
    defaultOpenAll: true,
    routes: [
      // 移除默认重定向，让ProLayout自动选择第一个有权限的子菜单
      {
        name: 'museum-map',
        locale: 'menu.museum-map',
        icon: 'EnvironmentOutlined',
        path: '/dashboard/map',
        component: './dashboard/museum-map',
        access: 'canViewMuseumMap',
      },
      {
        name: 'museum-overview',
        locale: 'menu.museum-overview',
        icon: 'BankOutlined',
        path: '/dashboard/overview',
        component: './dashboard/museum-overview',
        access: 'canViewOverview',
      },
      {
        name: 'user-statistics',
        locale: 'menu.user-statistics',
        icon: 'TeamOutlined',
        path: '/dashboard/statistics',
        component: './dashboard/identity-overview',
        access: 'canViewUserStats',
      },
    ],
  },
  {
    path: '/museums',
    name: 'museums',
    locale: 'menu.museums',
    icon: 'BankOutlined',
    access: 'canViewMuseums',
    defaultOpenAll: true,
    routes: [
      // 移除默认重定向，让ProLayout自动选择第一个有权限的子菜单
      {
        name: 'museum-list',
        locale: 'menu.museum-list',
        icon: 'HomeOutlined',
        path: '/museums/list',
        component: './museums/list',
        access: 'canViewMuseumList',
      },
      {
        name: 'museum-detail',
        locale: 'menu.museum-detail',
        hideInMenu: true,
        path: '/museums/detail/:id',
        component: './museums/detail',
        access: 'canViewMuseumList',
      },
      {
        name: 'museum-form',
        locale: 'menu.museum-form',
        hideInMenu: true,
        path: '/museums/form/:id?',
        component: './museums/form',
        access: 'canEditMuseum',
      },
      {
        name: 'exhibitions',
        locale: 'menu.exhibitions',
        icon: 'PictureOutlined',
        path: '/museums/exhibitions',
        component: './museums/exhibitions/list',
        access: 'canManageExhibitions',
      },
      {
        name: 'categories',
        locale: 'menu.categories',
        icon: 'AppstoreOutlined',
        path: '/museums/categories',
        component: './museums/categories/list',
        access: 'canManageCategories',
      },
      {
        name: 'tags',
        locale: 'menu.tags',
        icon: 'TagsOutlined',
        path: '/museums/tags',
        component: './museums/tags/list',
        access: 'canManageTags',
      },
      {
        name: 'areas',
        locale: 'menu.areas',
        icon: 'EnvironmentOutlined',
        path: '/museums/areas',
        component: './museums/areas',
        access: 'canManageRegions',
      },
    ],
  },
  {
    path: '/users',
    name: 'users',
    locale: 'menu.users',
    icon: 'SafetyCertificateOutlined',
    access: 'canViewUsersModule',
    defaultOpenAll: true,
    routes: [
      // 移除默认重定向，让ProLayout自动选择第一个有权限的子菜单
      {
        name: 'user-list',
        locale: 'menu.user-list',
        icon: 'UserOutlined',
        path: '/users/list',
        component: './users/user/list',
        access: 'canViewUsers',
      },
      {
        name: 'roles',
        locale: 'menu.roles',
        icon: 'TeamOutlined',
        path: '/users/roles',
        component: './users/role/list',
        access: 'canViewRoles',
      },
      {
        name: 'permissions',
        locale: 'menu.permissions',
        icon: 'KeyOutlined',
        path: '/users/permissions',
        component: './users/permission/list',
        access: 'canViewPermissions',
      },
    ],
  },
  {
    path: '/checkins',
    name: 'checkins',
    locale: 'menu.checkins',
    icon: 'CheckCircleOutlined',
    access: 'canViewCheckIns',
    defaultOpenAll: true,
    routes: [
      // 移除默认重定向，让ProLayout自动选择第一个有权限的子菜单
      {
        name: 'checkin-records',
        locale: 'menu.checkin-records',
        icon: 'CheckCircleOutlined',
        path: '/checkins/records',
        component: './museums/checkin-records/list',
        access: 'canManageCheckIns',
      },
    ],
  },
  {
    path: '/content',
    name: 'content',
    locale: 'menu.content',
    icon: 'FileTextOutlined',
    access: 'canViewContent',
    defaultOpenAll: true,
    routes: [
      // 移除默认重定向，让ProLayout自动选择第一个有权限的子菜单
      {
        name: 'banners',
        locale: 'menu.banners',
        icon: 'PictureOutlined',
        path: '/content/banners',
        component: './content/banner',
        access: 'canViewBanners',
      },
      {
        name: 'announcements',
        locale: 'menu.announcements',
        icon: 'NotificationOutlined',
        path: '/content/announcements',
        component: './content/announcement',
        access: 'canViewAnnouncements',
      },
    ],
  },
  {
    path: '/ai-guide',
    name: 'ai-guide',
    locale: 'menu.ai-guide',
    icon: 'RobotOutlined',
    access: 'canViewAiGuide',
    defaultOpenAll: true,
    routes: [
      // 移除默认重定向，让ProLayout自动选择第一个有权限的子菜单
      {
        name: 'generator',
        locale: 'menu.generator',
        icon: 'EditOutlined',
        path: '/ai-guide/generator',
        component: './ai-guide/generator',
        access: 'canViewGenerator',
      },
      {
        name: 'my-guides',
        locale: 'menu.my-guides',
        icon: 'BookOutlined',
        path: '/ai-guide/my-guides',
        component: './ai-guide/my-guides',
        access: 'canViewMyGuides',
      },
    ],
  },
  {
    path: '/about',
    name: 'about',
    locale: 'menu.about',
    icon: 'InfoCircleOutlined',
    access: 'canViewAbout',
    defaultOpenAll: true,
    routes: [
      {
        path: '/about',
        redirect: '/about/overview',
      },
      {
        name: 'overview',
        locale: 'menu.overview',
        icon: 'InfoCircleOutlined',
        path: '/about/overview',
        component: './about/overview',
        access: 'canViewAboutOverview',
      },
      {
        name: 'architecture',
        locale: 'menu.architecture',
        icon: 'ApartmentOutlined',
        path: '/about/architecture',
        component: './about/architecture',
        access: 'canViewAboutArchitecture',
      },
      {
        name: 'app-versions',
        locale: 'menu.app-versions',
        icon: 'MobileOutlined',
        path: '/about/app-versions',
        component: './about/app-versions',
        access: 'canViewAboutAppVersions',
      },
    ],
  },
  {
    path: '/profile',
    name: 'profile',
    locale: 'menu.profile',
    hideInMenu: true,
    component: './profile',
  },
  {
    name: 'result',
    icon: 'CheckCircleOutlined',
    path: '/result',
    hideInMenu: true,
    routes: [
      {
        path: '/result',
        redirect: '/result/success',
      },
      {
        name: 'success',
        icon: 'smile',
        path: '/result/success',
        component: './result/success',
      },
      {
        name: 'fail',
        icon: 'smile',
        path: '/result/fail',
        component: './result/fail',
      },
    ],
  },
  {
    name: 'exception',
    icon: 'warning',
    path: '/exception',
    hideInMenu: true,
    routes: [
      {
        path: '/exception',
        redirect: '/exception/403',
      },
      {
        name: '403',
        icon: 'smile',
        path: '/exception/403',
        component: './exception/403',
      },
      {
        name: '404',
        icon: 'smile',
        path: '/exception/404',
        component: './exception/404',
      },
      {
        name: '500',
        icon: 'smile',
        path: '/exception/500',
        component: './exception/500',
      },
    ],
  },
  {
    path: '/',
    redirect: '/dashboard/map',
  },
  {
    component: '404',
    path: '/*',
  },
];