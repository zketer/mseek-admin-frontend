declare namespace UsersAPI {
  type ArchitectureInfo = {
    /** 架构ID */
    id?: number;
    /** 架构类型 */
    type?: string;
    /** 架构标题 */
    title?: string;
    /** Mermaid图表代码 */
    mermaidCode?: string;
    /** 架构说明 */
    description?: string;
    /** 架构详细信息 */
    architectureDetails?: Record<string, any>;
    /** 排序索引 */
    orderIndex?: number;
    /** 状态 */
    status?: string;
  };

  type assignPermissionsParams = {
    /** 角色ID */
    id: number;
  };

  type assignRolesParams = {
    /** 用户ID */
    id: number;
  };

  type changePasswordParams = {
    /** 用户ID */
    id: number;
    /** 旧密码 */
    oldPassword: string;
    /** 新密码 */
    newPassword: string;
  };

  type checkDeptCodeParams = {
    /** 部门编码 */
    deptCode: string;
    /** 排除的部门ID */
    excludeId?: number;
  };

  type checkEmailExistsParams = {
    /** 邮箱 */
    email: string;
  };

  type checkEmailParams = {
    /** 邮箱 */
    email: string;
    /** 排除的用户ID（可选） */
    excludeId?: number;
  };

  type checkPhoneParams = {
    /** 手机号 */
    phone: string;
    /** 排除的用户ID（可选） */
    excludeId?: number;
  };

  type checkRoleCodeParams = {
    /** 角色编码 */
    roleCode: string;
    /** 排除的角色ID */
    excludeId?: number;
  };

  type checkUsernameExistsParams = {
    /** 用户名 */
    username: string;
  };

  type checkUsernameParams = {
    /** 用户名 */
    username: string;
    /** 排除的用户ID（可选） */
    excludeId?: number;
  };

  type cleanLogsParams = {
    /** 保留天数 */
    days: number;
  };

  type deleteByIdParams = {
    /** 日志ID */
    id: number;
  };

  type deleteDepartmentParams = {
    /** 部门ID */
    id: number;
  };

  type deletePermissionParams = {
    /** 权限ID */
    id: number;
  };

  type deleteRoleParams = {
    /** 角色ID */
    id: number;
  };

  type deleteUserParams = {
    /** 用户ID */
    id: number;
  };

  type DepartmentCreateRequest = {
    /** 部门名称 */
    deptName: string;
    /** 部门编码 */
    deptCode: string;
    /** 父级部门ID */
    parentId: number;
    /** 部门负责人 */
    leader?: string;
    /** 负责人手机号 */
    leaderPhone?: string;
    /** 负责人邮箱 */
    leaderEmail?: string;
    /** 显示顺序 */
    orderNum?: number;
    /** 状态：0-停用，1-正常 */
    status?: number;
    /** 部门描述 */
    description?: string;
    /** 备注 */
    remark?: string;
  };

  type DepartmentQueryRequest = {
    /** 部门名称（模糊查询） */
    deptName?: string;
    /** 部门编码（模糊查询） */
    deptCode?: string;
    /** 父级部门ID */
    parentId?: number;
    /** 状态：0-停用，1-正常 */
    status?: number;
    /** 部门负责人（模糊查询） */
    leader?: string;
  };

  type DepartmentResponse = {
    /** 部门ID */
    id?: number;
    /** 部门名称 */
    deptName?: string;
    /** 部门编码 */
    deptCode?: string;
    /** 父级部门ID */
    parentId?: number;
    /** 祖级列表 */
    ancestors?: string;
    /** 部门负责人 */
    leader?: string;
    /** 负责人手机号 */
    leaderPhone?: string;
    /** 负责人邮箱 */
    leaderEmail?: string;
    /** 显示顺序 */
    orderNum?: number;
    /** 状态：0-停用，1-正常 */
    status?: number;
    /** 部门描述 */
    description?: string;
    /** 备注 */
    remark?: string;
    /** 创建时间 */
    createAt?: string;
    /** 更新时间 */
    updateAt?: string;
    /** 子部门列表 */
    children?: DepartmentResponse[];
    /** 部门用户数量 */
    userCount?: number;
  };

  type DepartmentUpdateRequest = {
    /** 部门ID */
    id: number;
    /** 部门名称 */
    deptName: string;
    /** 部门编码 */
    deptCode: string;
    /** 父级部门ID */
    parentId: number;
    /** 部门负责人 */
    leader?: string;
    /** 负责人手机号 */
    leaderPhone?: string;
    /** 负责人邮箱 */
    leaderEmail?: string;
    /** 显示顺序 */
    orderNum?: number;
    /** 状态：0-停用，1-正常 */
    status?: number;
    /** 部门描述 */
    description?: string;
    /** 备注 */
    remark?: string;
  };

  type DevelopmentPlanInfo = {
    /** 计划类型 */
    planType?: string;
    /** 计划标题 */
    title?: string;
    /** 计划项目 */
    items?: string[];
  };

  type existsByPermissionCodeParams = {
    /** 权限编码 */
    permissionCode: string;
    /** 排除的权限ID */
    excludeId?: number;
  };

  type exportUsers1Params = {
    /** 查询条件 */
    query: UserQueryRequest;
  };

  type exportUsersByQueryParams = {
    /** 用户名 */
    username?: string;
    /** 昵称 */
    nickname?: string;
    /** 邮箱 */
    email?: string;
    /** 手机号 */
    phone?: string;
    /** 部门ID */
    deptId?: number;
    /** 状态 */
    status?: number;
  };

  type FeatureModuleInfo = {
    /** 模块名称 */
    moduleName?: string;
    /** 模块类型 */
    moduleType?: string;
    /** 模块描述 */
    description?: string;
    /** 完成进度 */
    progress?: number;
    /** 标签文本 */
    tagText?: string;
    /** 标签颜色 */
    tagColor?: string;
  };

  type forceLogoutByUserIdParams = {
    /** 用户ID */
    userId: number;
  };

  type forceLogoutParams = {
    /** 会话ID */
    sessionId: string;
  };

  type getByUsernameParams = {
    /** 用户名 */
    username: string;
  };

  type getChildrenByParentIdParams = {
    /** 父级部门ID */
    parentId: number;
  };

  type getDepartmentListParams = {
    query: DepartmentQueryRequest;
  };

  type getDepartmentTreeParams = {
    query: DepartmentQueryRequest;
  };

  type getDepartmentUsersParams = {
    /** 部门ID */
    id: number;
  };

  type getDeptByIdParams = {
    /** 部门ID */
    id: number;
  };

  type getOnlineUsersParams = {
    query: OnlineUserQueryRequest;
  };

  type getOperateLogByIdParams = {
    /** 日志ID */
    id: number;
  };

  type getOperateLogPageParams = {
    query: OperationLogQueryRequest;
  };

  type getPermissionByIdParams = {
    /** 权限ID */
    id: number;
  };

  type getPermissionPageParams = {
    query: PermissionQueryRequest;
  };

  type getPermissionsByParentIdParams = {
    /** 父级权限ID */
    parentId: number;
    /** 权限类型：1-菜单，2-操作，3-接口，0或不传-全部 */
    permissionType?: number;
  };

  type getPermissionsByRoleIdParams = {
    /** 角色ID */
    roleId: number;
  };

  type getPermissionsByUserIdParams = {
    /** 用户ID */
    userId: number;
  };

  type getPermissionTreeParams = {
    /** 权限类型：1-菜单，2-操作，3-接口，0或不传-全部 */
    permissionType?: number;
  };

  type getPopularOperationsParams = {
    /** 统计天数 */
    days?: number;
    /** 返回数量 */
    limit?: number;
  };

  type getRoleByCodeParams = {
    /** 角色编码 */
    roleCode: string;
  };

  type getRoleByIdParams = {
    /** 角色ID */
    id: number;
  };

  type getRolePageParams = {
    query: RoleQueryRequest;
  };

  type getRolePermissionsParams = {
    /** 角色ID */
    id: number;
  };

  type getRolesByUserIdParams = {
    /** 用户ID */
    userId: number;
  };

  type getStatisticsParams = {
    /** 统计天数 */
    days?: number;
  };

  type getUserBasicInfoByEmailParams = {
    /** 邮箱 */
    email: string;
  };

  type getUserBasicInfoByUsernameParams = {
    /** 用户名 */
    username: string;
  };

  type getUserByIdParams = {
    /** 用户ID */
    id: number;
  };

  type getUserOperationStatisticsParams = {
    /** 统计天数 */
    days?: number;
    /** 返回数量 */
    limit?: number;
  };

  type getUserPageParams = {
    query: UserQueryRequest;
  };

  type getUserPermissionsParams = {
    /** 用户ID */
    id: number;
  };

  type getUserProfileParams = {
    /** 用户ID */
    id: number;
  };

  type getUserRolesParams = {
    /** 用户ID */
    id: number;
  };

  type getUsersByDeptIdParams = {
    /** 部门ID */
    deptId: number;
  };

  type getUsersByRoleIdParams = {
    /** 角色ID */
    roleId: number;
  };

  type getUserStatistics1Params = {
    /** 统计天数 */
    days?: number;
  };

  type IPageOnlineUserResponse = {
    size?: number;
    pages?: number;
    total?: number;
    current?: number;
    records?: OnlineUserResponse[];
  };

  type IPageOperationLogResponse = {
    size?: number;
    pages?: number;
    total?: number;
    current?: number;
    records?: OperationLogResponse[];
  };

  type IPageUserResponse = {
    size?: number;
    pages?: number;
    total?: number;
    current?: number;
    records?: UserResponse[];
  };

  type lockUserParams = {
    /** 用户ID */
    id: number;
    /** 锁定原因 */
    reason?: string;
  };

  type MicroserviceInfo = {
    /** 服务名称 */
    serviceName?: string;
    /** 服务代码 */
    serviceCode?: string;
    /** 端口号 */
    port?: number;
    /** 服务描述 */
    description?: string;
    /** 主要功能 */
    features?: string[];
    /** 状态 */
    status?: string;
    /** 状态标签颜色 */
    statusTagColor?: string;
  };

  type moveUsersToDepartParams = {
    /** 部门ID */
    id: number;
  };

  type OnlineUserQueryRequest = {
    /** 页码，从1开始 */
    pageNum?: number;
    /** 每页大小 */
    pageSize?: number;
    /** 排序字段 */
    orderBy?: string;
    /** 排序方向：asc-升序，desc-降序 */
    orderDirection?: string;
    /** 用户名（模糊查询） */
    username?: string;
    /** 昵称（模糊查询） */
    nickname?: string;
    /** 部门ID */
    deptId?: number;
    /** 登录IP */
    ipAddr?: string;
    /** 会话状态：0-离线，1-在线 */
    status?: number;
  };

  type OnlineUserResponse = {
    /** 会话ID */
    sessionId?: string;
    /** 用户ID */
    userId?: number;
    /** 用户名 */
    username?: string;
    /** 昵称 */
    nickname?: string;
    /** 部门名称 */
    deptName?: string;
    /** 登录IP */
    ipAddr?: string;
    /** 登录地点 */
    loginLocation?: string;
    /** 浏览器 */
    browser?: string;
    /** 操作系统 */
    os?: string;
    /** 登录时间 */
    loginTime?: string;
    /** 最后访问时间 */
    lastAccessTime?: string;
    /** 会话状态：0-离线，1-在线 */
    status?: number;
  };

  type OperationLogQueryRequest = {
    /** 页码，从1开始 */
    pageNum?: number;
    /** 每页大小 */
    pageSize?: number;
    /** 排序字段 */
    orderBy?: string;
    /** 排序方向：asc-升序，desc-降序 */
    orderDirection?: string;
    /** 操作用户ID */
    userId?: number;
    /** 操作用户名（模糊查询） */
    username?: string;
    /** 操作模块 */
    module?: string;
    /** 操作内容（模糊查询） */
    operation?: string;
    /** 操作IP */
    ip?: string;
    /** 操作状态：0-失败，1-成功 */
    status?: number;
    /** 开始时间 */
    startTime?: string;
    /** 结束时间 */
    endTime?: string;
  };

  type OperationLogResponse = {
    /** 日志ID */
    id?: number;
    /** 操作用户ID */
    userId?: number;
    /** 操作用户名 */
    username?: string;
    /** 操作模块 */
    module?: string;
    /** 操作内容 */
    operation?: string;
    /** 请求方法 */
    method?: string;
    /** 请求URL */
    requestUrl?: string;
    /** 请求参数 */
    params?: string;
    /** 返回结果 */
    result?: string;
    /** 操作IP */
    ip?: string;
    /** 操作地点 */
    location?: string;
    /** 用户代理 */
    userAgent?: string;
    /** 操作状态：0-失败，1-成功 */
    status?: number;
    /** 错误信息 */
    errorMsg?: string;
    /** 耗时(毫秒) */
    costTime?: number;
    /** 创建时间 */
    createAt?: string;
  };

  type PageResultPermissionResponse = {
    records?: PermissionResponse[];
    total?: number;
    pageNum?: number;
    pageSize?: number;
    pages?: number;
    hasNext?: boolean;
    hasPrevious?: boolean;
  };

  type PageResultRoleResponse = {
    records?: RoleResponse[];
    total?: number;
    pageNum?: number;
    pageSize?: number;
    pages?: number;
    hasNext?: boolean;
    hasPrevious?: boolean;
  };

  type PermissionCreateRequest = {
    /** 权限名称 */
    permissionName: string;
    /** 权限编码 */
    permissionCode: string;
    /** 权限类型：1-菜单，2-按钮，3-接口 */
    permissionType: number;
    /** 父级ID */
    parentId?: number;
    /** 路径 */
    path?: string;
    /** 描述 */
    description?: string;
    /** 状态：0-禁用，1-启用 */
    status: number;
    /** 组件路径 */
    component?: string;
    /** 图标 */
    icon?: string;
    /** 排序 */
    sortOrder?: number;
    /** 是否可见：0-隐藏，1-显示 */
    visible?: number;
    /** 备注 */
    remark?: string;
  };

  type PermissionDistribution = {
    /** 权限类型 */
    type?: string;
    /** 权限数量 */
    value?: number;
  };

  type PermissionInfo = {
    /** 权限ID */
    id?: number;
    /** 权限名称 */
    permissionName?: string;
    /** 权限编码 */
    permissionCode?: string;
    /** 权限类型：1-菜单，2-按钮 */
    permissionType?: number;
  };

  type PermissionQueryRequest = {
    pageNum: number;
    pageSize: number;
    orderBy?: string;
    orderDirection?: string;
    /** 权限名称 */
    permissionName?: string;
    /** 权限编码 */
    permissionCode?: string;
    /** 权限类型：1-菜单，2-按钮 */
    permissionType?: number;
    /** 父级ID */
    parentId?: number;
    /** 状态：0-禁用，1-启用 */
    status?: number;
    /** 路径 */
    path?: string;
    /** 描述 */
    description?: string;
    /** 创建时间开始 */
    createAteStart?: string;
    /** 创建时间结束 */
    createAteEnd?: string;
    offset?: number;
  };

  type PermissionResponse = {
    /** 权限ID */
    id?: number;
    /** 权限名称 */
    permissionName?: string;
    /** 权限编码 */
    permissionCode?: string;
    /** 权限类型：1-菜单，2-按钮 */
    permissionType?: number;
    /** 父级ID */
    parentId?: number;
    /** 路径 */
    path?: string;
    /** 描述 */
    description?: string;
    /** 状态：0-禁用，1-启用 */
    status?: number;
    /** 排序 */
    sortOrder?: number;
    /** 组件路径 */
    component?: string;
    /** 图标 */
    icon?: string;
    /** 是否可见：0-隐藏，1-显示 */
    visible?: number;
    /** 子权限列表 */
    children?: PermissionResponse[];
    /** 创建时间 */
    createAt?: string;
    /** 更新时间 */
    updateAt?: string;
    /** 创建者 */
    createBy?: string;
    /** 更新者 */
    updateBy?: string;
    /** 备注 */
    remark?: string;
  };

  type PermissionUpdateRequest = {
    /** 权限ID */
    id: number;
    /** 权限名称 */
    permissionName: string;
    /** 权限编码 */
    permissionCode: string;
    /** 权限类型：1-菜单，2-按钮 */
    permissionType: number;
    /** 父级ID */
    parentId?: number;
    /** 路径 */
    path?: string;
    /** 描述 */
    description?: string;
    /** 状态：0-禁用，1-启用 */
    status: number;
    /** 排序 */
    sortOrder?: number;
    /** 组件路径 */
    component?: string;
    /** 图标 */
    icon?: string;
    /** 是否可见：0-隐藏，1-显示 */
    visible?: number;
    /** 备注 */
    remark?: string;
  };

  type resetPasswordParams = {
    /** 用户ID */
    id: number;
  };

  type ResultBoolean = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: boolean;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultDepartmentResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: DepartmentResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultInteger = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: number;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultIPageOnlineUserResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: IPageOnlineUserResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultIPageOperationLogResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: IPageOperationLogResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultIPageUserResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: IPageUserResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultListDepartmentResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: DepartmentResponse[];
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultListLong = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: number[];
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultListMapStringObject = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: Record<string, any>[];
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultListPermissionResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: PermissionResponse[];
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultListRoleResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: RoleResponse[];
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultListString = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: string[];
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultListUserResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: UserResponse[];
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultLong = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: number;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultMapStringObject = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: Record<string, any>;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultObject = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: Record<string, any>;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultOperationLogResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: OperationLogResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultPageResultPermissionResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: PageResultPermissionResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultPageResultRoleResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: PageResultRoleResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultPermissionResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: PermissionResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultRoleResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: RoleResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultString = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: string;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultSystemArchitectureResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: SystemArchitectureResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultSystemOverviewResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: SystemOverviewResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultUserBasicInfo = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: UserBasicInfo;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultUserImportResult = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: UserImportResult;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultUserResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: UserResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultVoid = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: Record<string, any>;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type RoleCreateRequest = {
    /** 角色名称 */
    roleName: string;
    /** 角色编码 */
    roleCode: string;
    /** 描述 */
    description?: string;
    /** 状态：0-禁用，1-启用 */
    status: number;
    /** 排序 */
    sortOrder?: number;
    /** 权限ID列表 */
    permissionIds?: number[];
    /** 备注 */
    remark?: string;
  };

  type RoleDistribution = {
    /** 角色名称 */
    type?: string;
    /** 用户数量 */
    value?: number;
  };

  type RoleInfo = {
    /** 角色ID */
    roleId?: number;
    /** 角色名称 */
    roleName?: string;
    /** 角色编码 */
    roleCode?: string;
  };

  type RoleQueryRequest = {
    pageNum: number;
    pageSize: number;
    orderBy?: string;
    orderDirection?: string;
    /** 角色名称 */
    roleName?: string;
    /** 角色编码 */
    roleCode?: string;
    /** 状态：0-禁用，1-启用 */
    status?: number;
    /** 描述 */
    description?: string;
    /** 创建时间开始 */
    createAteStart?: string;
    /** 创建时间结束 */
    createAteEnd?: string;
    offset?: number;
  };

  type RoleResponse = {
    /** 角色ID */
    id?: number;
    /** 角色名称 */
    roleName?: string;
    /** 角色编码 */
    roleCode?: string;
    /** 描述 */
    description?: string;
    /** 状态：0-禁用，1-启用 */
    status?: number;
    /** 排序 */
    sortOrder?: number;
    /** 权限列表 */
    permissions?: PermissionInfo[];
    /** 创建时间 */
    createAt?: string;
    /** 更新时间 */
    updateAt?: string;
    /** 创建者 */
    createBy?: string;
    /** 更新者 */
    updateBy?: string;
    /** 备注 */
    remark?: string;
  };

  type RoleUpdateRequest = {
    /** 角色ID */
    id: number;
    /** 角色名称 */
    roleName: string;
    /** 角色编码 */
    roleCode: string;
    /** 描述 */
    description?: string;
    /** 状态：0-禁用，1-启用 */
    status: number;
    /** 排序 */
    sortOrder?: number;
    /** 权限ID列表 */
    permissionIds?: number[];
    /** 备注 */
    remark?: string;
  };

  type SystemArchitectureResponse = {
    /** 架构列表 */
    architectures?: ArchitectureInfo[];
  };

  type SystemBasicInfo = {
    /** 系统名称 */
    systemName?: string;
    /** 系统版本 */
    systemVersion?: string;
    /** 架构模式 */
    architectureMode?: string;
    /** 部署方式 */
    deploymentMethod?: string;
    /** 技术栈 */
    techStack?: string;
    /** 数据存储 */
    dataStorage?: string;
    /** 服务治理 */
    serviceGovernance?: string;
    /** 认证方案 */
    authSolution?: string;
    /** 系统描述 */
    systemDescription?: string;
    /** 系统状态消息 */
    statusMessage?: string;
  };

  type SystemOverviewResponse = {
    basicInfo?: SystemBasicInfo;
    /** 技术栈列表 */
    techStack?: TechStackInfo[];
    /** 微服务列表 */
    microservices?: MicroserviceInfo[];
    /** 功能模块列表 */
    featureModules?: FeatureModuleInfo[];
    /** 开发计划列表 */
    developmentPlans?: DevelopmentPlanInfo[];
    /** 第三方服务列表 */
    thirdPartyServices?: ThirdPartyServiceInfo[];
  };

  type TechStackInfo = {
    /** 分类 */
    category?: string;
    /** 技术名称 */
    name?: string;
    /** 版本号 */
    version?: string;
    /** 描述 */
    description?: string;
    /** 标签颜色 */
    tagColor?: string;
    /** 端口号 */
    port?: string;
  };

  type ThirdPartyServiceInfo = {
    /** 服务名称 */
    serviceName?: string;
    /** 服务类型 */
    serviceType?: string;
    /** 状态 */
    status?: string;
    /** 状态标签颜色 */
    statusTagColor?: string;
    /** 服务描述 */
    description?: string;
  };

  type unlockUserParams = {
    /** 用户ID */
    id: number;
  };

  type updateDepartmentStatusParams = {
    /** 部门ID */
    id: number;
    /** 状态：0-停用，1-正常 */
    status: number;
  };

  type updatePermissionStatusParams = {
    /** 权限ID */
    id: number;
    /** 状态：1-启用，0-禁用 */
    status: number;
  };

  type updateRoleStatusParams = {
    /** 角色ID */
    id: number;
    /** 状态：0-禁用，1-启用 */
    status: number;
  };

  type updateUserProfileParams = {
    /** 用户ID */
    id: number;
  };

  type updateUserStatusParams = {
    /** 用户ID */
    id: number;
    /** 状态：0-禁用，1-启用 */
    status: number;
  };

  type uploadAvatarBase64Params = {
    /** 用户ID */
    id: string;
  };

  type UserBasicInfo = {
    id?: number;
    username?: string;
    password?: string;
    email?: string;
    phone?: string;
    nickname?: string;
    avatar?: string;
    gender?: number;
    status?: number;
    createAt?: string;
    updateAt?: string;
  };

  type UserCreateRequest = {
    username: string;
    password: string;
    email?: string;
    phone?: string;
    nickname?: string;
    avatar?: string;
    gender?: number;
    birthday?: string;
    status: number;
    roleIds?: number[];
    remark?: string;
  };

  type UserExportRequest = {
    /** 用户ID列表（为空时导出所有） */
    userIds?: number[];
    /** 部门ID列表 */
    deptIds?: number[];
    /** 角色ID列表 */
    roleIds?: number[];
    /** 用户状态：0-禁用，1-启用 */
    status?: number;
    /** 用户名（模糊查询） */
    username?: string;
    /** 昵称（模糊查询） */
    nickname?: string;
    /** 邮箱（模糊查询） */
    email?: string;
    /** 手机号（模糊查询） */
    phone?: string;
    /** 导出字段列表 */
    exportFields?: string[];
  };

  type UserGrowthTrend = {
    /** 日期 */
    date?: string;
    /** 用户数量 */
    count?: number;
  };

  type UserImportRequest = {
    /** 是否更新已存在用户 */
    updateSupport: boolean;
    /** 默认密码 */
    defaultPassword?: string;
    /** 默认部门ID */
    defaultDeptId?: number;
    /** 默认角色ID */
    defaultRoleId?: number;
  };

  type UserImportResult = {
    /** 总记录数 */
    total?: number;
    /** 成功导入数 */
    successCount?: number;
    /** 失败导入数 */
    failureCount?: number;
    /** 更新记录数 */
    updateCount?: number;
    /** 错误信息列表 */
    errorMessages?: string[];
    /** 导入是否成功 */
    success?: boolean;
    /** 导入消息 */
    message?: string;
  };

  type UserQueryRequest = {
    pageNum: number;
    pageSize: number;
    orderBy?: string;
    orderDirection?: string;
    username?: string;
    email?: string;
    phone?: string;
    nickname?: string;
    gender?: number;
    status?: number;
    createAteStart?: string;
    createAteEnd?: string;
    deleted?: number;
    offset?: number;
  };

  type UserResponse = {
    /** 用户ID */
    id?: number;
    /** 用户名 */
    username?: string;
    /** 昵称 */
    nickname?: string;
    /** 邮箱 */
    email?: string;
    /** 手机 */
    phone?: string;
    /** 头像 */
    avatar?: string;
    /** 性别：0-保密，1-男，2-女 */
    gender?: number;
    /** 生日 */
    birthday?: string;
    /** 状态：0-禁用，1-正常 */
    status?: number;
    /** 最后登录时间 */
    lastLoginTime?: string;
    /** 最后登录IP */
    lastLoginIp?: string;
    /** 登录次数 */
    loginCount?: number;
    /** 备注 */
    remark?: string;
    /** 创建时间 */
    createAt?: string;
    /** 更新时间 */
    updateAt?: string;
    /** 创建人 */
    createBy?: string;
    /** 更新人 */
    updateBy?: string;
    /** 权限列表 */
    permissions?: string[];
    /** 角色列表 */
    roles?: RoleInfo[];
  };

  type UserStatisticsResponse = {
    /** 总用户数 */
    totalUsers?: number;
    /** 活跃用户数 */
    activeUsers?: number;
    /** 非活跃用户数 */
    inactiveUsers?: number;
    /** 锁定用户数 */
    lockedUsers?: number;
    /** 用户增长趋势 */
    userGrowthTrend?: UserGrowthTrend[];
    /** 角色分布 */
    roleDistribution?: RoleDistribution[];
    /** 总角色数 */
    totalRoles?: number;
    /** 权限分布 */
    permissionDistribution?: PermissionDistribution[];
    /** 总权限数 */
    totalPermissions?: number;
  };

  type UserUpdateRequest = {
    id: number;
    username?: string;
    email?: string;
    phone?: string;
    nickname?: string;
    avatar?: string;
    gender?: number;
    birthday?: string;
    status?: number;
    roleIds?: number[];
    remark?: string;
  };
}
