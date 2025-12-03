declare namespace MuseumsAPI {
  type AchievementResponse = {
    /** 成就唯一标识符 */
    id?: string;
    /** 成就名称 */
    name?: string;
    /** 成就描述 */
    description?: string;
    /** 成就图标 */
    icon?: string;
    /** 成就分类 */
    category?: string;
    /** 解锁要求描述 */
    requirement?: string;
    /** 当前进度 */
    progress?: number;
    /** 目标数值 */
    target?: number;
    /** 是否已解锁 */
    unlocked?: boolean;
    /** 解锁时间 */
    unlockedDate?: string;
    /** 稀有度 */
    rarity?: string;
  };

  type AchievementStatsResponse = {
    /** 总成就数量 */
    totalAchievements?: number;
    /** 已解锁成就数量 */
    unlockedAchievements?: number;
    /** 完成率（百分比） */
    completionRate?: number;
    /** 分类统计 */
    categories?: CategoryStats[];
  };

  type AnnouncementCreateRequest = {
    /** 公告标题 */
    title: string;
    /** 公告内容 */
    content: string;
    /** 公告类型：general/maintenance/activity */
    type: string;
    /** 优先级：0-普通，1-重要，2-紧急 */
    priority: number;
    /** 状态：0-草稿，1-发布，2-下线 */
    status: number;
    /** 启用状态：0-禁用（隐藏），1-启用（显示） */
    enabled?: number;
    /** 发布时间（时间戳） */
    publishTime?: number;
    /** 过期时间（时间戳） */
    expireTime?: number;
  };

  type AnnouncementQueryRequest = {
    /** 当前页码 */
    current?: number;
    /** 页面大小 */
    size?: number;
    /** 公告标题 */
    title?: string;
    /** 公告类型 */
    type?: string;
    /** 优先级：0-普通，1-重要，2-紧急 */
    priority?: number;
    /** 状态：0-草稿，1-发布，2-下线 */
    status?: number;
    /** 开始时间 */
    startTime?: string;
    /** 结束时间 */
    endTime?: string;
  };

  type AnnouncementResponse = {
    /** 公告ID */
    id?: number;
    /** 公告标题 */
    title?: string;
    /** 公告内容 */
    content?: string;
    /** 公告类型 */
    type?: string;
    /** 优先级：0-普通，1-重要，2-紧急 */
    priority?: number;
    /** 状态：0-草稿，1-发布，2-下线 */
    status?: number;
    /** 启用状态：0-禁用（隐藏），1-启用（显示） */
    enabled?: number;
    /** 发布时间（时间戳） */
    publishTime?: number;
    /** 过期时间（时间戳） */
    expireTime?: number;
    /** 阅读次数 */
    readCount?: number;
    /** 创建人 */
    createBy?: string;
    /** 创建时间 */
    createAt?: string;
    /** 更新时间 */
    updateAt?: string;
  };

  type AppVersionCreateRequest = {
    /** 版本名称 */
    versionName: string;
    /** 版本号 */
    versionCode: number;
    /** 平台 */
    platform: "android" | "ios" | "all";
    /** 发布日期 */
    releaseDate: string;
    /** 更新类型 */
    updateType: "major" | "minor" | "patch";
    /** 关联文件ID（APK/IPA文件） */
    fileId: number;
    /** 更新日志 */
    changeLog: string[];
    /** 是否为最新版本 */
    isLatest?: boolean;
    /** 状态 */
    status?: "published" | "draft" | "deprecated";
    /** 最低Android版本要求 */
    minAndroidVersion?: string;
    /** 最低iOS版本要求 */
    minIosVersion?: string;
    /** 是否强制更新 */
    forceUpdate?: boolean;
    /** 备注信息 */
    remark?: string;
  };

  type AppVersionQueryRequest = {
    /** 当前页 */
    current?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 搜索关键词（版本名称或更新日志） */
    keyword?: string;
    /** 平台筛选 */
    platform?: "android" | "ios" | "all";
    /** 状态筛选 */
    status?: "published" | "draft" | "deprecated";
  };

  type AppVersionResponse = {
    /** 版本ID */
    id?: number;
    /** 版本名称 */
    versionName?: string;
    /** 版本号 */
    versionCode?: number;
    /** 平台 */
    platform?: string;
    /** 发布日期 */
    releaseDate?: string;
    /** 更新类型 */
    updateType?: string;
    /** 文件大小（易读格式） */
    fileSize?: string;
    /** 下载URL */
    downloadUrl?: string;
    /** 更新日志 */
    changeLog?: string[];
    /** 是否为最新版本 */
    isLatest?: boolean;
    /** 下载次数 */
    downloadCount?: number;
    /** 文件关系表ID */
    fileRelationId?: number;
    /** 文件ID */
    fileId?: number;
    /** 状态 */
    status?: string;
    /** 最低Android版本要求 */
    minAndroidVersion?: string;
    /** 最低iOS版本要求 */
    minIosVersion?: string;
    /** 是否强制更新 */
    forceUpdate?: boolean;
    /** 备注信息 */
    remark?: string;
    /** 创建时间 */
    createAt?: string;
    /** 更新时间 */
    updateAt?: string;
  };

  type AppVersionStatsResponse = {
    /** 版本总数 */
    totalVersions?: number;
    /** 最新版本号 */
    latestVersion?: string;
    /** 总下载量 */
    totalDownloads?: number;
    /** Android版本数 */
    androidVersions?: number;
    /** iOS版本数 */
    iosVersions?: number;
  };

  type AppVersionUpdateRequest = {
    /** 版本名称 */
    versionName?: string;
    /** 版本号 */
    versionCode?: number;
    /** 平台 */
    platform?: "android" | "ios" | "all";
    /** 发布日期 */
    releaseDate?: string;
    /** 更新类型 */
    updateType?: "major" | "minor" | "patch";
    /** 关联文件ID（APK/IPA文件） */
    fileId?: number;
    /** 文件关联表ID */
    fileRelationId?: number;
    /** 更新者ID */
    updateBy?: number;
    /** 更新日志 */
    changeLog?: string[];
    /** 是否为最新版本 */
    isLatest?: boolean;
    /** 状态 */
    status?: "published" | "draft" | "deprecated";
    /** 最低Android版本要求 */
    minAndroidVersion?: string;
    /** 最低iOS版本要求 */
    minIosVersion?: string;
    /** 是否强制更新 */
    forceUpdate?: boolean;
    /** 备注信息 */
    remark?: string;
  };

  type AreaDivisionResponse = {
    /** ID */
    id?: number;
    /** 区域代码 */
    adcode?: string;
    /** 名称 */
    name?: string;
    /** 经度 */
    longitude?: number;
    /** 纬度 */
    latitude?: number;
    /** 层级：province/city/district */
    level?: string;
    /** 父级代码 */
    parentCode?: string;
    /** 城市编码（仅城市级别有） */
    citycode?: string;
    /** 子级区域列表 */
    children?: AreaDivisionResponse[];
    /** 所属城市名称 */
    cityName?: string;
    /** 所属城市代码 */
    cityAdcode?: string;
    /** 所属省份名称 */
    provinceName?: string;
    /** 所属省份代码 */
    provinceAdcode?: string;
  };

  type auditCheckinRecordParams = {
    /** 打卡记录ID */
    id: number;
  };

  type BannerCreateRequest = {
    /** 轮播图标题 */
    title: string;
    /** 图片URL */
    imageUrl: string;
    /** 链接类型：museum/exhibition/external/none */
    linkType?: string;
    /** 链接值 */
    linkValue?: string;
    /** 排序权重 */
    sort: number;
    /** 状态：0-下线，1-上线 */
    status: number;
    /** 开始时间 */
    startTime?: string;
    /** 结束时间 */
    endTime?: string;
    /** 文件ID（上传的图片文件ID） */
    fileId?: number;
  };

  type BannerQueryRequest = {
    /** 当前页码 */
    current?: number;
    /** 页面大小 */
    size?: number;
    /** 标题 */
    title?: string;
    /** 链接类型：museum/exhibition/external/none */
    linkType?: string;
    /** 状态：0-下线，1-上线 */
    status?: number;
  };

  type BannerResponse = {
    /** 轮播图ID */
    id?: number;
    /** 轮播图标题 */
    title?: string;
    /** 图片URL */
    imageUrl?: string;
    /** 链接类型：museum/exhibition/external/none */
    linkType?: string;
    /** 链接值 */
    linkValue?: string;
    /** 排序权重 */
    sort?: number;
    /** 状态：0-下线，1-上线 */
    status?: number;
    /** 开始时间 */
    startTime?: string;
    /** 结束时间 */
    endTime?: string;
    /** 点击次数 */
    clickCount?: number;
    /** 创建时间 */
    createAt?: string;
    /** 更新时间 */
    updateAt?: string;
    /** 创建人 */
    createBy?: number;
    /** 更新人 */
    updateBy?: number;
    /** 文件ID（关联的图片文件ID） */
    fileId?: number;
  };

  type BatchCheckinAuditRequest = {
    /** 审核状态：1-审核通过，2-审核拒绝，3-异常标记 */
    auditStatus: number;
    /** 审核备注 */
    auditRemark?: string;
    ids?: number[];
  };

  type BatchCreateRelationRequest = {
    fileIds?: number[];
    businessId?: number;
    businessType?: string;
    relationType?: string;
    createBy?: number;
  };

  type CategoryCreateRequest = {
    /** 分类名称 */
    name: string;
    /** 分类编码 */
    code: string;
    /** 分类描述 */
    description?: string;
    /** 排序 */
    sortOrder?: number;
    /** 状态：0-禁用，1-启用 */
    status: number;
  };

  type CategoryDistribution = {
    /** 类别名称 */
    category?: string;
    /** 博物馆数量 */
    count?: number;
  };

  type CategoryInfo = {
    /** 分类ID */
    id?: number;
    /** 分类名称 */
    name?: string;
    /** 分类编码 */
    code?: string;
  };

  type CategoryQueryRequest = {
    /** 页码 */
    page?: number;
    /** 每页大小 */
    size?: number;
    /** 分类名称（模糊搜索） */
    name?: string;
    /** 状态：0-禁用，1-启用 */
    status?: number;
  };

  type CategoryResponse = {
    /** 分类ID */
    id?: number;
    /** 分类名称 */
    name?: string;
    /** 分类编码 */
    code?: string;
    /** 分类描述 */
    description?: string;
    /** 排序 */
    sortOrder?: number;
    /** 状态：0-禁用，1-启用 */
    status?: number;
    /** 创建时间 */
    createAt?: string;
    /** 更新时间 */
    updateAt?: string;
  };

  type CategoryStats = {
    /** 分类ID */
    id?: string;
    /** 分类名称 */
    name?: string;
    /** 分类总数 */
    count?: number;
    /** 已解锁数量 */
    unlockedCount?: number;
  };

  type CategoryUpdateRequest = {
    /** 分类ID */
    id: number;
    /** 分类名称 */
    name: string;
    /** 分类描述 */
    description?: string;
    /** 排序 */
    sortOrder?: number;
    /** 状态：0-禁用，1-启用 */
    status: number;
  };

  type checkCode1Params = {
    /** 博物馆编码 */
    code: string;
    /** 排除的博物馆ID（可选） */
    excludeId?: number;
  };

  type checkCode2Params = {
    /** 分类编码 */
    code: string;
    /** 排除的分类ID（可选） */
    excludeId?: number;
  };

  type checkCodeParams = {
    /** 标签编码 */
    code: string;
    /** 排除的标签ID（可选） */
    excludeId?: number;
  };

  type checkExhibitionFavoriteParams = {
    /** 展览ID */
    exhibitionId: number;
  };

  type CheckinAuditRequest = {
    /** 审核状态：1-审核通过，2-审核拒绝，3-异常标记 */
    auditStatus: number;
    /** 审核备注 */
    auditRemark?: string;
  };

  type CheckinRecord = {
    /** 创建时间 */
    createAt?: string;
    /** 更新时间 */
    updateAt?: string;
    /** 创建人ID */
    createBy?: number;
    /** 更新人ID */
    updateBy?: number;
    id?: number;
    /** 删除标志：0-未删除，1-已删除 */
    deleted?: number;
    userId?: number;
    museumId?: number;
    museumName?: string;
    checkinTime?: string;
    latitude?: number;
    longitude?: number;
    photoUrl?: string;
    remark?: string;
    auditStatus?: number;
    auditTime?: string;
    auditUserId?: number;
    auditRemark?: string;
    anomalyType?: string;
    photoUrls?: string;
    photos?: string;
    feeling?: string;
    rating?: number;
    weather?: string;
    companions?: string;
    tags?: string;
    address?: string;
    isDraft?: boolean;
    draftId?: string;
    mood?: string;
    deviceInfo?: string;
  };

  type CheckinRecordQueryRequest = {
    /** 当前页码 */
    current?: number;
    /** 页面大小 */
    size?: number;
    /** 页码（兼容小程序） */
    page?: number;
    /** 页大小（兼容小程序） */
    pageSize?: number;
    /** 用户ID */
    userId?: number;
    /** 用户名 */
    userName?: string;
    /** 博物馆ID */
    museumId?: number;
    /** 博物馆名称 */
    museumName?: string;
    /** 审核状态：0-待审核，1-审核通过，2-审核拒绝，3-异常标记 */
    auditStatus?: number;
    /** 异常类型 */
    anomalyType?: string;
    /** 开始时间 */
    startTime?: string;
    /** 结束时间 */
    endTime?: string;
    /** 是否只查询异常记录 */
    anomalyOnly?: boolean;
    /** 是否为暂存记录 */
    isDraft?: boolean;
    /** 开始日期（字符串格式） */
    startDate?: string;
    /** 结束日期（字符串格式） */
    endDate?: string;
    /** 搜索关键词（博物馆名称、省市） */
    keyword?: string;
    /** 筛选类型 */
    filterType?: "all" | "thisMonth" | "thisYear";
  };

  type CheckinRecordResponse = {
    /** 打卡记录ID */
    id?: number;
    /** 用户ID */
    userId?: number;
    /** 用户名 */
    userName?: string;
    /** 用户昵称 */
    userNickname?: string;
    /** 博物馆ID */
    museumId?: number;
    /** 博物馆名称 */
    museumName?: string;
    /** 博物馆地址 */
    museumAddress?: string;
    /** 打卡时间 */
    checkinTime?: string;
    /** 打卡纬度 */
    latitude?: number;
    /** 打卡经度 */
    longitude?: number;
    /** 打卡备注 */
    remark?: string;
    /** 审核状态：0-待审核，1-审核通过，2-审核拒绝，3-异常标记 */
    auditStatus?: number;
    /** 审核时间 */
    auditTime?: string;
    /** 审核人ID */
    auditUserId?: number;
    /** 审核人姓名 */
    auditUserName?: string;
    /** 审核备注 */
    auditRemark?: string;
    /** 异常类型 */
    anomalyType?: string;
    /** 打卡照片列表（JSON字符串） */
    photoUrls?: string;
    /** 照片列表（JSON字符串） */
    photos?: string;
    /** 打卡感受 */
    feeling?: string;
    /** 评分（1-5） */
    rating?: number;
    /** 心情状态 */
    mood?: string;
    /** 天气状况 */
    weather?: string;
    /** 同行伙伴（JSON字符串） */
    companions?: string;
    /** 标签（JSON字符串） */
    tags?: string;
    /** 地址描述 */
    address?: string;
    /** 设备信息 */
    deviceInfo?: string;
    /** 距离博物馆距离（米） */
    distance?: number;
    /** 创建时间 */
    createAt?: string;
  };

  type CheckinStatsResponse = {
    /** 总打卡次数 */
    totalCheckins?: number;
    /** 本月打卡次数 */
    thisMonthCheckins?: number;
    /** 已访问博物馆数量 */
    visitedMuseums?: number;
    /** 总照片数量 */
    totalPhotos?: number;
  };

  type CheckinSubmitRequest = {
    /** 博物馆ID */
    museumId: number;
    /** 博物馆名称 */
    museumName: string;
    /** 照片URLs */
    photos?: string[];
    /** 打卡感受 */
    feeling?: string;
    /** 评分(1-5) */
    rating?: number;
    /** 心情状态 */
    mood?: string;
    /** 天气状况 */
    weather?: string;
    /** 同行伙伴 */
    companions?: string[];
    /** 标签 */
    tags?: string[];
    location?: LocationInfo;
    /** 是否为暂存记录 */
    isDraft: boolean;
    /** 暂存ID（用于更新暂存记录） */
    draftId?: string;
  };

  type CheckinSubmitResponse = {
    /** 记录ID */
    id?: number;
    /** 打卡时间 */
    checkinTime?: string;
    /** 操作是否成功 */
    success?: boolean;
    /** 消息 */
    message?: string;
  };

  type checkMuseumFavoriteParams = {
    /** 博物馆ID */
    museumId: number;
  };

  type CityCreateRequest = {
    /** 区域代码 */
    adcode: string;
    /** 城市名称 */
    name: string;
    /** 所属省份代码 */
    provinceAdcode: string;
    /** 城市编码 */
    citycode?: string;
    /** 经度 */
    longitude?: number;
    /** 纬度 */
    latitude?: number;
  };

  type CityQueryRequest = {
    /** 当前页 */
    current?: number;
    /** 页面大小 */
    pageSize?: number;
    /** 关键词搜索（城市名称） */
    keyword?: string;
    /** 区域代码 */
    adcode?: string;
    /** 所属省份代码 */
    provinceAdcode?: string;
    /** 城市编码 */
    citycode?: string;
  };

  type CityResponse = {
    /** 主键ID */
    id?: number;
    /** 区域代码 */
    adcode?: string;
    /** 城市名称 */
    name?: string;
    /** 所属省份代码 */
    provinceAdcode?: string;
    /** 所属省份名称 */
    provinceName?: string;
    /** 城市编码 */
    citycode?: string;
    /** 经度 */
    longitude?: number;
    /** 纬度 */
    latitude?: number;
  };

  type CityStatsInfo = {
    /** 城市名称 */
    cityName?: string;
    /** 该城市总博物馆数量 */
    totalMuseums?: number;
    /** 用户已访问博物馆数量 */
    visitedMuseums?: number;
    /** 完成度百分比 */
    completionRate?: number;
    /** 是否已解锁（有打卡记录） */
    isUnlocked?: boolean;
    /** 最后打卡时间 */
    lastCheckinTime?: string;
    /** 打卡次数 */
    checkinCount?: number;
  };

  type CityUpdateRequest = {
    /** 城市名称 */
    name: string;
    /** 所属省份代码 */
    provinceAdcode?: string;
    /** 城市编码 */
    citycode?: string;
    /** 经度 */
    longitude?: number;
    /** 纬度 */
    latitude?: number;
  };

  type convertDraftToCheckinParams = {
    /** 暂存ID */
    draftId: string;
  };

  type createExhibitionParams = {
    /** 博物馆ID */
    museumId: number;
  };

  type CreateRelationRequest = {
    fileId?: number;
    businessId?: number;
    businessType?: string;
    relationType?: string;
    sortOrder?: number;
    remark?: string;
    createBy?: number;
  };

  type deleteAnnouncementParams = {
    /** 公告ID */
    id: number;
  };

  type deleteAppVersionParams = {
    /** 版本ID */
    id: number;
  };

  type deleteBannerParams = {
    /** 轮播图ID */
    id: number;
  };

  type deleteByBusinessParams = {
    /** 业务实体ID */
    businessId: number;
    /** 业务类型 */
    businessType: string;
    /** 关系类型 */
    relationType?: string;
  };

  type deleteByFileIdParams = {
    /** 文件ID */
    fileId: number;
  };

  type deleteCategoryParams = {
    /** 分类ID */
    id: number;
  };

  type deleteCheckinRecord1Params = {
    /** 打卡记录ID */
    id: number;
  };

  type deleteCheckinRecordParams = {
    /** 打卡记录ID */
    checkinId: number;
  };

  type deleteCityParams = {
    /** 城市ID */
    id: number;
  };

  type deleteDistrictParams = {
    /** 区县ID */
    id: number;
  };

  type deleteDraftParams = {
    /** 暂存ID */
    draftId: string;
  };

  type deleteExhibitionParams = {
    /** 博物馆ID */
    museumId: number;
    /** 展览ID */
    id: number;
  };

  type deleteMuseumParams = {
    /** 博物馆ID */
    id: number;
  };

  type deleteProvinceParams = {
    /** 省份ID */
    id: number;
  };

  type deleteStreetParams = {
    /** 街道ID */
    id: number;
  };

  type deleteTagParams = {
    /** 标签ID */
    id: number;
  };

  type deprecateVersionParams = {
    /** 版本ID */
    id: number;
  };

  type DistrictCreateRequest = {
    /** 区域代码 */
    adcode: string;
    /** 区县名称 */
    name: string;
    /** 所属城市代码 */
    cityAdcode: string;
    /** 经度 */
    longitude?: number;
    /** 纬度 */
    latitude?: number;
  };

  type DistrictResponse = {
    /** 主键ID */
    id?: number;
    /** 区域代码 */
    adcode?: string;
    /** 区县名称 */
    name?: string;
    /** 所属城市代码 */
    cityAdcode?: string;
    /** 经度 */
    longitude?: number;
    /** 纬度 */
    latitude?: number;
  };

  type DistrictUpdateRequest = {
    /** 区县名称 */
    name: string;
    /** 所属城市代码 */
    cityAdcode?: string;
    /** 经度 */
    longitude?: number;
    /** 纬度 */
    latitude?: number;
  };

  type ExhibitionCreateRequest = {
    /** 博物馆ID */
    museumId: number;
    /** 展览标题 */
    title: string;
    /** 展览描述 */
    description?: string;
    /** 封面图片URL */
    coverImage?: string;
    /** 开始日期 */
    startDate?: string;
    /** 结束日期 */
    endDate?: string;
    /** 展厅位置 */
    location?: string;
    /** 门票价格 */
    ticketPrice?: number;
    /** 状态：0-已结束，1-进行中，2-未开始 */
    status: number;
    /** 是否常设展览：0-临时展览，1-常设展览 */
    isPermanent: number;
    /** 图片文件ID列表 */
    fileIds?: number[];
  };

  type ExhibitionQueryRequest = {
    /** 博物馆ID */
    museumId?: number;
    /** 页码 */
    page?: number;
    /** 每页大小 */
    size?: number;
    /** 展览标题（模糊搜索） */
    title?: string;
    /** 状态：0-已结束，1-进行中，2-未开始 */
    status?: number;
    /** 是否常设展览：0-临时展览，1-常设展览 */
    isPermanent?: number;
  };

  type ExhibitionResponse = {
    /** 展览ID */
    id?: number;
    /** 博物馆ID */
    museumId?: number;
    /** 博物馆名称 */
    museumName?: string;
    /** 展览标题 */
    title?: string;
    /** 展览描述 */
    description?: string;
    /** 封面图片URL */
    coverImage?: string;
    /** 开始日期 */
    startDate?: string;
    /** 结束日期 */
    endDate?: string;
    /** 展厅位置 */
    location?: string;
    /** 门票价格 */
    ticketPrice?: number;
    /** 状态：0-已结束，1-进行中，2-未开始 */
    status?: number;
    /** 是否常设展览：0-临时展览，1-常设展览 */
    isPermanent?: number;
    /** 创建时间 */
    createAt?: string;
    /** 更新时间 */
    updateAt?: string;
    /** 图片URL列表 */
    imageUrls?: string[];
    /** 图片文件ID列表 */
    imageFileIds?: number[];
  };

  type ExhibitionUpdateRequest = {
    /** 展览ID */
    id: number;
    /** 博物馆ID */
    museumId: number;
    /** 展览标题 */
    title: string;
    /** 展览描述 */
    description?: string;
    /** 封面图片URL */
    coverImage?: string;
    /** 开始日期 */
    startDate?: string;
    /** 结束日期 */
    endDate?: string;
    /** 展厅位置 */
    location?: string;
    /** 门票价格 */
    ticketPrice?: number;
    /** 状态：0-已结束，1-进行中，2-未开始 */
    status: number;
    /** 是否常设展览：0-临时展览，1-常设展览 */
    isPermanent: number;
    /** 图片文件ID列表 */
    fileIds?: number[];
  };

  type favoriteExhibitionParams = {
    /** 展览ID */
    exhibitionId: number;
  };

  type favoriteMuseumParams = {
    /** 博物馆ID */
    museumId: number;
  };

  type FavoriteStats = {
    museumCount?: number;
    exhibitionCount?: number;
    totalCount?: number;
  };

  type FeedbackRequest = {
    /** 收件人邮箱 */
    to: string;
    /** 邮件主题 */
    subject: string;
    /** 反馈类型 */
    type: string;
    /** 反馈类型名称 */
    typeName: string;
    /** 反馈内容 */
    content: string;
    /** 联系方式 */
    contact?: string;
    /** 提交时间 */
    timestamp?: string;
    /** 用户环境 */
    userAgent?: string;
  };

  type FileBusinessRelation = {
    /** 创建时间 */
    createAt?: string;
    /** 更新时间 */
    updateAt?: string;
    /** 创建人ID */
    createBy?: number;
    /** 更新人ID */
    updateBy?: number;
    /** 主键ID */
    id?: number;
    /** 文件ID，关联file表 */
    fileId?: number;
    /** 业务实体ID */
    businessId?: number;
    /** 业务类型：MUSEUM-博物馆, EXHIBITION-展览, BANNER-横幅, ANNOUNCEMENT-公告, RECOMMENDATION-推荐 */
    businessType?:
      | "MUSEUM"
      | "EXHIBITION"
      | "BANNER"
      | "ANNOUNCEMENT"
      | "RECOMMENDATION"
      | "CHECKIN"
      | "USER_AVATAR"
      | "APP_VERSION";
    /** 关系类型：MAIN_IMAGE-主图, THUMBNAIL-缩略图, GALLERY-图库, DOCUMENT-文档, AVATAR-头像 */
    relationType?:
      | "MAIN_IMAGE"
      | "THUMBNAIL"
      | "GALLERY"
      | "DETAIL_IMAGE"
      | "DOCUMENT"
      | "AVATAR"
      | "BACKGROUND"
      | "QR_CODE"
      | "VIDEO"
      | "AUDIO"
      | "INSTALLATION_PACKAGE"
      | "LOGO";
    /** 排序字段，数字越小排序越前 */
    sortOrder?: number;
    /** 状态：0=禁用, 1=启用 */
    status?: number;
    /** 备注说明 */
    remark?: string;
    /** 逻辑删除：0=未删除, 1=已删除 */
    deleted?: number;
  };

  type getActiveAnnouncementsParams = {
    /** 限制数量 */
    limit?: number;
  };

  type getActiveBannersParams = {
    /** 限制数量 */
    limit?: number;
  };

  type getAllExhibitionsParams = {
    /** 当前页 */
    page?: number;
    /** 页面大小 */
    pageSize?: number;
    /** 博物馆ID（可选） */
    museumId?: number;
    /** 展览标题搜索（可选） */
    title?: string;
    /** 状态：0-已结束，1-进行中，2-未开始（可选） */
    status?: number;
    /** 是否常设展览：0-临时展览，1-常设展览（可选） */
    isPermanent?: number;
  };

  type getAnnouncementDetail1Params = {
    /** 公告ID */
    id: number;
  };

  type getAnnouncementDetailParams = {
    /** 公告ID */
    id: number;
  };

  type getAnnouncementsParams = {
    request: AnnouncementQueryRequest;
  };

  type getAnomalyCheckinRecordsParams = {
    query: CheckinRecordQueryRequest;
  };

  type getAppVersionDetailParams = {
    /** 版本ID */
    id: number;
  };

  type getAppVersionsParams = {
    query: AppVersionQueryRequest;
  };

  type getBannersParams = {
    query: BannerQueryRequest;
  };

  type getBusinessFileIdsParams = {
    /** 业务实体ID */
    businessId: number;
    /** 业务类型 */
    businessType: string;
    /** 关系类型 */
    relationType?: string;
  };

  type getByBusinessParams = {
    /** 业务实体ID */
    businessId: number;
    /** 业务类型 */
    businessType: string;
    /** 关系类型 */
    relationType?: string;
  };

  type getByFileIdParams = {
    /** 文件ID */
    fileId: number;
  };

  type getCategoryByIdParams = {
    /** 分类ID */
    id: number;
  };

  type getCategoryPageParams = {
    query: CategoryQueryRequest;
  };

  type getCheckinDetailParams = {
    /** 打卡记录ID */
    checkinId: number;
  };

  type getCheckinRecordDetailParams = {
    /** 打卡记录ID */
    id: number;
  };

  type getCheckinRecords1Params = {
    query: CheckinRecordQueryRequest;
  };

  type getCheckinRecordsParams = {
    page?: number;
    pageSize?: number;
    museumId?: number;
    startDate?: string;
    endDate?: string;
    isDraft?: boolean;
    keyword?: string;
    filterType?: string;
  };

  type getCitiesByProvinceParams = {
    /** 省份代码 */
    provinceAdcode: string;
  };

  type getCityByAdcodeParams = {
    /** 区域代码 */
    adcode: string;
  };

  type getCityByIdParams = {
    /** 城市ID */
    id: number;
  };

  type getCityListParams = {
    request: CityQueryRequest;
  };

  type getDistrictByAdcodeParams = {
    /** 区域代码 */
    adcode: string;
  };

  type getDistrictByIdParams = {
    /** 区县ID */
    id: number;
  };

  type getDistrictsByCityParams = {
    /** 城市代码 */
    cityCode: string;
  };

  type getDistrictsPageParams = {
    /** 当前页 */
    current?: number;
    /** 每页大小 */
    pageSize?: number;
    /** 关键词搜索 */
    keyword?: string;
    /** 区域代码搜索 */
    adcode?: string;
  };

  type getDownloadUrlParams = {
    /** 版本ID */
    id: number;
  };

  type getEnabledAnnouncementsParams = {
    request: AnnouncementQueryRequest;
  };

  type getExhibitionByIdParams = {
    /** 博物馆ID */
    museumId: number;
    /** 展览ID */
    id: number;
  };

  type getExhibitionDetailParams = {
    /** 展览ID */
    id: number;
  };

  type getExhibitionPageParams = {
    /** 博物馆ID */
    museumId: number;
    query: ExhibitionQueryRequest;
  };

  type getHotMuseums1Params = {
    /** 当前页 */
    page?: number;
    /** 页面大小 */
    pageSize?: number;
    /** 博物馆名称 */
    name?: string;
  };

  type getHotMuseumsParams = {
    /** 限制数量 */
    limit?: number;
  };

  type getLatestExhibitionsParams = {
    /** 当前页 */
    page?: number;
    /** 页面大小 */
    pageSize?: number;
  };

  type getMainImageFileIdParams = {
    /** 业务实体ID */
    businessId: number;
    /** 业务类型 */
    businessType: string;
  };

  type getMuseumByIdParams = {
    /** 博物馆ID */
    id: number;
  };

  type getMuseumCountByCityParams = {
    /** 省份编码 */
    provinceCode?: string;
  };

  type getMuseumDetailParams = {
    /** 博物馆ID */
    id: number;
  };

  type getMuseumPage1Params = {
    query: MuseumQueryRequest;
  };

  type getMuseumPageParams = {
    /** 当前页码 */
    page?: number;
    /** 每页大小 */
    pageSize?: number;
    /** 城市代码 */
    cityCode?: string;
    /** 搜索关键词 */
    keyword?: string;
    /** 分类ID */
    categoryId?: number;
    /** 排序方式 */
    sortBy?: string;
  };

  type getMuseumsByCityParams = {
    /** 城市代码 */
    cityCode: string;
    /** 当前页码 */
    page?: number;
    /** 每页大小 */
    pageSize?: number;
    /** 搜索关键词 */
    keyword?: string;
    /** 排序方式 */
    sortBy?: string;
  };

  type getMuseumStatisticsParams = {
    /** 统计天数 */
    days?: number;
  };

  type getNearbyMuseums1Params = {
    /** 纬度 */
    latitude: number;
    /** 经度 */
    longitude: number;
    /** 搜索半径(km) */
    radius?: number;
    /** 当前页 */
    page?: number;
    /** 页面大小 */
    pageSize?: number;
    /** 博物馆名称搜索 */
    name?: string;
    /** 城市编码（可选，如果提供则不重新调用高德API） */
    cityCode?: string;
    /** 城市名称（可选） */
    cityName?: string;
  };

  type getNearbyMuseumsParams = {
    /** 纬度 */
    latitude: number;
    /** 经度 */
    longitude: number;
    /** 限制数量 */
    limit?: number;
    /** 搜索半径(km) */
    radius?: number;
  };

  type getNewExhibitionMuseumsParams = {
    /** 限制数量 */
    limit?: number;
  };

  type getProvinceByAdcodeParams = {
    /** 区域代码 */
    adcode: string;
  };

  type getProvinceByIdParams = {
    /** 省份ID */
    id: number;
  };

  type getProvinceListParams = {
    request: ProvinceQueryRequest;
  };

  type getProvinceMuseumDetailParams = {
    /** 省份编码 */
    provinceCode: string;
  };

  type getStreetByAdcodeParams = {
    /** 区域代码 */
    adcode: string;
  };

  type getStreetByIdParams = {
    /** 街道ID */
    id: number;
  };

  type getStreetsByDistrictParams = {
    /** 区县代码 */
    districtCode: string;
  };

  type getStreetsPageParams = {
    /** 当前页 */
    current?: number;
    /** 每页大小 */
    pageSize?: number;
    /** 关键词搜索 */
    keyword?: string;
    /** 区域代码搜索 */
    adcode?: string;
  };

  type getTagByIdParams = {
    /** 标签ID */
    id: number;
  };

  type getTagPageParams = {
    query: TagQueryRequest;
  };

  type getUserFavoriteExhibitionsParams = {
    /** 页码 */
    page?: number;
    /** 页面大小 */
    pageSize?: number;
    /** 搜索关键词 */
    keyword?: string;
    /** 展览状态：0-已结束，1-进行中，2-未开始 */
    status?: number;
    /** 排序方式：time-收藏时间，name-名称 */
    sortBy?: string;
  };

  type getUserFavoriteMuseumsParams = {
    /** 页码 */
    page?: number;
    /** 页面大小 */
    pageSize?: number;
    /** 搜索关键词 */
    keyword?: string;
    /** 打卡状态：true-已打卡，false-未打卡 */
    visitStatus?: boolean;
    /** 排序方式：time-收藏时间，name-名称，distance-距离 */
    sortBy?: string;
  };

  type IPageAnnouncementResponse = {
    size?: number;
    total?: number;
    pages?: number;
    current?: number;
    records?: AnnouncementResponse[];
  };

  type IPageAppVersionResponse = {
    size?: number;
    total?: number;
    pages?: number;
    current?: number;
    records?: AppVersionResponse[];
  };

  type IPageAreaDivisionResponse = {
    size?: number;
    total?: number;
    pages?: number;
    current?: number;
    records?: AreaDivisionResponse[];
  };

  type IPageBannerResponse = {
    size?: number;
    total?: number;
    pages?: number;
    current?: number;
    records?: BannerResponse[];
  };

  type IPageCategoryResponse = {
    size?: number;
    total?: number;
    pages?: number;
    current?: number;
    records?: CategoryResponse[];
  };

  type IPageCheckinRecord = {
    size?: number;
    total?: number;
    pages?: number;
    current?: number;
    records?: CheckinRecord[];
  };

  type IPageCheckinRecordResponse = {
    size?: number;
    total?: number;
    pages?: number;
    current?: number;
    records?: CheckinRecordResponse[];
  };

  type IPageCityResponse = {
    size?: number;
    total?: number;
    pages?: number;
    current?: number;
    records?: CityResponse[];
  };

  type IPageExhibitionResponse = {
    size?: number;
    total?: number;
    pages?: number;
    current?: number;
    records?: ExhibitionResponse[];
  };

  type IPageMuseumResponse = {
    size?: number;
    total?: number;
    pages?: number;
    current?: number;
    records?: MuseumResponse[];
  };

  type IPageProvinceResponse = {
    size?: number;
    total?: number;
    pages?: number;
    current?: number;
    records?: ProvinceResponse[];
  };

  type IPageStreetResponse = {
    size?: number;
    total?: number;
    pages?: number;
    current?: number;
    records?: StreetResponse[];
  };

  type IPageTagResponse = {
    size?: number;
    total?: number;
    pages?: number;
    current?: number;
    records?: TagResponse[];
  };

  type isFileInUseParams = {
    /** 文件ID */
    fileId: number;
    /** 业务实体ID */
    businessId?: number;
    /** 业务类型 */
    businessType?: string;
  };

  type LocationInfo = {
    /** 经度 */
    longitude: number;
    /** 纬度 */
    latitude: number;
    /** 地址描述 */
    address?: string;
  };

  type markAsLatestParams = {
    /** 版本ID */
    id: number;
  };

  type MuseumCreateRequest = {
    /** 博物馆名称 */
    name: string;
    /** 博物馆编码 */
    code: string;
    /** 博物馆描述 */
    description?: string;
    /** 详细地址 */
    address?: string;
    /** 省份代码 */
    provinceCode?: string;
    /** 城市代码 */
    cityCode?: string;
    /** 区县代码 */
    districtCode?: string;
    /** 经度 */
    longitude?: number;
    /** 纬度 */
    latitude?: number;
    /** 联系电话 */
    phone?: string;
    /** 官方网站 */
    website?: string;
    /** 开放时间 */
    openTime?: string;
    /** 门票价格（元） */
    ticketPrice?: number;
    /** 门票说明 */
    ticketDescription?: string;
    /** 日接待能力 */
    capacity?: number;
    /** 状态：0-关闭，1-开放 */
    status: number;
    /** 等级：0-无等级，1-一级，2-二级，3-三级，4-四级，5-五级 */
    level: number;
    /** 博物馆类型 */
    type?: string;
    /** 是否免费：0-收费，1-免费 */
    freeAdmission?: number;
    /** 官方统计-藏品总数 */
    collectionCount?: number;
    /** 官方统计-珍贵文物数量 */
    preciousItems?: number;
    /** 官方统计-年度展览数量 */
    exhibitions?: number;
    /** 官方统计-教育活动数量 */
    educationActivities?: number;
    /** 官方统计-年度访客数（人次） */
    visitorCount?: number;
    /** 分类ID列表 */
    categoryIds?: number[];
    /** 标签ID列表 */
    tagIds?: number[];
    /** 文件ID列表（博物馆图片） */
    fileIds?: number[];
    /** Logo文件ID */
    logoFileId?: number;
  };

  type MuseumDetailInfo = {
    /** 博物馆ID */
    id?: number;
    /** 博物馆名称 */
    name?: string;
    /** 详细地址 */
    address?: string;
    /** 博物馆等级 */
    level?: string;
    /** 博物馆类型 */
    category?: string;
    /** 用户是否已访问 */
    isVisited?: boolean;
    /** 首次访问时间 */
    firstVisitDate?: string;
    /** 最后访问时间 */
    lastVisitDate?: string;
    /** 用户打卡次数 */
    visitCount?: number;
    /** 开放时间 */
    openTime?: string;
    /** 门票价格 */
    ticketPrice?: number;
    /** 是否免费 */
    freeAdmission?: number;
    /** 描述信息 */
    description?: string;
    /** 博物馆状态 */
    status?: number;
    /** 城市名称 */
    cityName?: string;
  };

  type MuseumInfo = {
    /** 创建时间 */
    createAt?: string;
    /** 更新时间 */
    updateAt?: string;
    /** 创建人ID */
    createBy?: number;
    /** 更新人ID */
    updateBy?: number;
    id?: number;
    /** 删除标志：0-未删除，1-已删除 */
    deleted?: number;
    name?: string;
    code?: string;
    description?: string;
    address?: string;
    provinceCode?: string;
    cityCode?: string;
    districtCode?: string;
    longitude?: number;
    latitude?: number;
    phone?: string;
    website?: string;
    openTime?: string;
    ticketPrice?: number;
    ticketDescription?: string;
    capacity?: number;
    status?: number;
    level?: number;
    type?: string;
    freeAdmission?: number;
    collectionCount?: number;
    preciousItems?: number;
    exhibitions?: number;
    educationActivities?: number;
    visitorCount?: number;
    display?: number;
  };

  type MuseumQueryRequest = {
    /** 页码 */
    page?: number;
    /** 每页大小 */
    size?: number;
    /** 博物馆名称（模糊搜索） */
    name?: string;
    /** 省份代码 */
    provinceCode?: string;
    /** 城市代码 */
    cityCode?: string;
    /** 区县代码 */
    districtCode?: string;
    /** 街道代码 */
    streetCode?: string;
    /** 分类ID */
    categoryId?: number;
    /** 标签ID */
    tagId?: number;
    /** 状态：0-关闭，1-开放 */
    status?: number;
    /** 等级：0-无等级，1-一级，2-二级，3-三级，4-四级，5-五级 */
    level?: number;
    /** 博物馆类型 */
    type?: string;
    /** 是否免费：0-收费，1-免费 */
    freeAdmission?: number;
    /** 最小藏品数量 */
    minCollectionCount?: number;
    /** 最大藏品数量 */
    maxCollectionCount?: number;
    /** 排序方式：hot-人气最高，collection-藏品最多 */
    sortBy?: string;
  };

  type MuseumResponse = {
    /** 博物馆ID */
    id?: number;
    /** 博物馆名称 */
    name?: string;
    /** 博物馆编码 */
    code?: string;
    /** 博物馆描述 */
    description?: string;
    /** 详细地址 */
    address?: string;
    /** 省份代码 */
    provinceCode?: string;
    /** 省份名称 */
    provinceName?: string;
    /** 城市代码 */
    cityCode?: string;
    /** 城市名称 */
    cityName?: string;
    /** 区县代码 */
    districtCode?: string;
    /** 区县名称 */
    districtName?: string;
    /** 经度 */
    longitude?: number;
    /** 纬度 */
    latitude?: number;
    /** 联系电话 */
    phone?: string;
    /** 官方网站 */
    website?: string;
    /** 开放时间 */
    openTime?: string;
    /** 门票价格（元） */
    ticketPrice?: number;
    /** 门票说明 */
    ticketDescription?: string;
    /** 日接待能力 */
    capacity?: number;
    /** 状态：0-关闭，1-开放 */
    status?: number;
    /** 等级：0-无等级，1-一级，2-二级，3-三级，4-四级，5-五级 */
    level?: number;
    /** 博物馆类型 */
    type?: string;
    /** 是否免费：0-收费，1-免费 */
    freeAdmission?: number;
    /** 官方统计-藏品总数 */
    collectionCount?: number;
    /** 官方统计-珍贵文物数量 */
    preciousItems?: number;
    /** 官方统计-年度展览数量 */
    exhibitions?: number;
    /** 官方统计-教育活动数量 */
    educationActivities?: number;
    /** 官方统计-年度访客数（人次） */
    visitorCount?: number;
    /** 分类列表 */
    categories?: CategoryInfo[];
    /** 标签列表 */
    tags?: TagInfo[];
    /** 图片URL列表 */
    imageUrls?: string[];
    /** 图片文件ID列表 */
    imageFileIds?: number[];
    /** 创建时间 */
    createAt?: string;
    /** 更新时间 */
    updateAt?: string;
    /** 距离用户的距离（格式：1.5km 或 500m） */
    distance?: string;
    /** Logo文件ID */
    logoFileId?: number;
    /** Logo访问URL（动态生成） */
    logoUrl?: string;
  };

  type MuseumStatisticsResponse = {
    /** 总博物馆数 */
    totalMuseums?: number;
    /** 开放中博物馆数 */
    activeMuseums?: number;
    /** 维护中博物馆数 */
    maintenanceMuseums?: number;
    /** 今日访客数 */
    visitorsToday?: number;
    /** 本周访客数 */
    visitorsWeek?: number;
    /** 本月访客数 */
    visitorsMonth?: number;
    /** 本年访客数 */
    visitorsYear?: number;
    /** 月访客趋势 */
    visitorsTrend?: VisitorsTrend[];
    /** 展览类别分布 */
    categoryDistribution?: CategoryDistribution[];
    /** 热门博物馆 */
    topMuseums?: TopMuseum[];
  };

  type MuseumUpdateRequest = {
    /** 博物馆ID */
    id: number;
    /** 博物馆名称 */
    name: string;
    /** 博物馆描述 */
    description?: string;
    /** 详细地址 */
    address?: string;
    /** 省份代码 */
    provinceCode?: string;
    /** 城市代码 */
    cityCode?: string;
    /** 区县代码 */
    districtCode?: string;
    /** 经度 */
    longitude?: number;
    /** 纬度 */
    latitude?: number;
    /** 联系电话 */
    phone?: string;
    /** 官方网站 */
    website?: string;
    /** 开放时间 */
    openTime?: string;
    /** 门票价格（元） */
    ticketPrice?: number;
    /** 门票说明 */
    ticketDescription?: string;
    /** 日接待能力 */
    capacity?: number;
    /** 状态：0-关闭，1-开放 */
    status: number;
    /** 等级：0-无等级，1-一级，2-二级，3-三级，4-四级，5-五级 */
    level: number;
    /** 博物馆类型 */
    type?: string;
    /** 是否免费：0-收费，1-免费 */
    freeAdmission?: number;
    /** 官方统计-藏品总数 */
    collectionCount?: number;
    /** 官方统计-珍贵文物数量 */
    preciousItems?: number;
    /** 官方统计-年度展览数量 */
    exhibitions?: number;
    /** 官方统计-教育活动数量 */
    educationActivities?: number;
    /** 官方统计-年度访客数（人次） */
    visitorCount?: number;
    /** 分类ID列表 */
    categoryIds?: number[];
    /** 标签ID列表 */
    tagIds?: number[];
    /** 文件ID列表（博物馆图片） */
    fileIds?: number[];
    /** 图片URL列表（用于全量更新） */
    imageUrls?: string[];
    /** Logo文件ID */
    logoFileId?: number;
  };

  type NearbyMuseumsResponse = {
    location?: LocationInfo;
    museums?: IPageMuseumResponse;
  };

  type offlineAnnouncementParams = {
    /** 公告ID */
    id: number;
  };

  type OverallStats = {
    /** 已解锁省份数 */
    unlockedProvinces?: number;
    /** 全国总省份数 */
    totalProvinces?: number;
    /** 已访问国家级博物馆数 */
    visitedNationalMuseums?: number;
    /** 全国国家级博物馆总数 */
    totalNationalMuseums?: number;
    /** 覆盖率百分比 */
    coverageRate?: number;
  };

  type ProvinceCheckinStatsResponse = {
    /** 省份统计数据列表 */
    provinces?: ProvinceStatsData[];
    overall?: OverallStats;
  };

  type ProvinceCreateRequest = {
    /** 区域代码 */
    adcode: string;
    /** 省份名称 */
    name: string;
    /** 国家代码 */
    countryAdcode: string;
    /** 经度 */
    longitude?: number;
    /** 纬度 */
    latitude?: number;
  };

  type ProvinceMuseumDetailResponse = {
    /** 省份编码 */
    provinceCode?: string;
    /** 省份名称 */
    provinceName?: string;
    /** 该省份总博物馆数量 */
    totalMuseums?: number;
    /** 用户已访问博物馆数量 */
    visitedMuseums?: number;
    /** 博物馆列表 */
    museums?: MuseumDetailInfo[];
    /** 城市统计列表 */
    cities?: CityStatsInfo[];
  };

  type ProvinceQueryRequest = {
    /** 当前页 */
    current?: number;
    /** 页面大小 */
    pageSize?: number;
    /** 关键词搜索（省份名称） */
    keyword?: string;
    /** 区域代码 */
    adcode?: string;
    /** 国家代码 */
    countryAdcode?: string;
  };

  type ProvinceResponse = {
    /** 主键ID */
    id?: number;
    /** 区域代码 */
    adcode?: string;
    /** 省份名称 */
    name?: string;
    /** 国家代码 */
    countryAdcode?: string;
    /** 经度 */
    longitude?: number;
    /** 纬度 */
    latitude?: number;
  };

  type ProvinceStatsData = {
    /** 省份编码 */
    provinceCode?: string;
    /** 省份名称 */
    provinceName?: string;
    /** 该省份总博物馆数量 */
    totalMuseums?: number;
    /** 已访问博物馆数量 */
    visitedMuseums?: number;
    /** 是否已解锁（有打卡记录） */
    isUnlocked?: boolean;
    /** 打卡次数 */
    checkinCount?: number;
    /** 最后打卡时间 */
    lastCheckinTime?: string;
    /** 已访问的博物馆列表 */
    visitedMuseumList?: VisitedMuseum[];
  };

  type ProvinceUpdateRequest = {
    /** 省份名称 */
    name: string;
    /** 国家代码 */
    countryAdcode?: string;
    /** 经度 */
    longitude?: number;
    /** 纬度 */
    latitude?: number;
  };

  type publishAnnouncementParams = {
    /** 公告ID */
    id: number;
  };

  type publishVersionParams = {
    /** 版本ID */
    id: number;
  };

  type recordBannerClickParams = {
    /** 轮播图ID */
    id: number;
  };

  type ResultAchievementStatsResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: AchievementStatsResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultAnnouncementResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: AnnouncementResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultAppVersionResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: AppVersionResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultAppVersionStatsResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: AppVersionStatsResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
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

  type ResultCategoryResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: CategoryResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultCheckinRecord = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: CheckinRecord;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultCheckinRecordResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: CheckinRecordResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultCheckinStatsResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: CheckinStatsResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultCheckinSubmitResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: CheckinSubmitResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultCityResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: CityResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultDistrictResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: DistrictResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultExhibitionResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: ExhibitionResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultFavoriteStats = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: FavoriteStats;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultFileBusinessRelation = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: FileBusinessRelation;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultIPageAnnouncementResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: IPageAnnouncementResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultIPageAppVersionResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: IPageAppVersionResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultIPageAreaDivisionResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: IPageAreaDivisionResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultIPageBannerResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: IPageBannerResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultIPageCategoryResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: IPageCategoryResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultIPageCheckinRecord = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: IPageCheckinRecord;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultIPageCheckinRecordResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: IPageCheckinRecordResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultIPageCityResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: IPageCityResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultIPageExhibitionResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: IPageExhibitionResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultIPageMuseumResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: IPageMuseumResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultIPageProvinceResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: IPageProvinceResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultIPageStreetResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: IPageStreetResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultIPageTagResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: IPageTagResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultListAchievementResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: AchievementResponse[];
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultListAnnouncementResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: AnnouncementResponse[];
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultListAreaDivisionResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: AreaDivisionResponse[];
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultListBannerResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: BannerResponse[];
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultListCategoryResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: CategoryResponse[];
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultListCityResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: CityResponse[];
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultListFileBusinessRelation = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: FileBusinessRelation[];
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

  type ResultListMuseumInfo = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: MuseumInfo[];
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultListProvinceResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: ProvinceResponse[];
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultListStreetResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: StreetResponse[];
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultListTagResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: TagResponse[];
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

  type ResultMapStringAppVersionResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: Record<string, any>;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultMapStringLong = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: Record<string, any>;
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

  type ResultMuseumResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: MuseumResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultNearbyMuseumsResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: NearbyMuseumsResponse;
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

  type ResultProvinceCheckinStatsResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: ProvinceCheckinStatsResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultProvinceMuseumDetailResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: ProvinceMuseumDetailResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultProvinceResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: ProvinceResponse;
    timestamp?: number;
    requestId?: string;
    error?: boolean;
    success?: boolean;
  };

  type ResultStreetResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: StreetResponse;
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

  type ResultTagResponse = {
    code?: number;
    message?: string;
    messageEn?: string;
    data?: TagResponse;
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

  type searchMuseumsParams = {
    /** 搜索关键词 */
    keyword: string;
    /** 当前页码 */
    page?: number;
    /** 每页大小 */
    pageSize?: number;
    /** 城市代码 */
    cityCode?: string;
    /** 排序方式 */
    sortBy?: string;
  };

  type setMainImageParams = {
    /** 业务实体ID */
    businessId: number;
    /** 业务类型 */
    businessType: string;
    /** 文件ID */
    fileId: number;
    /** 更新者ID */
    updateBy?: number;
  };

  type StreetCreateRequest = {
    /** 街道代码 */
    adcode: string;
    /** 街道名称 */
    name: string;
    /** 所属区县代码 */
    districtAdcode: string;
    /** 经度 */
    longitude?: number;
    /** 纬度 */
    latitude?: number;
  };

  type StreetResponse = {
    /** 主键ID */
    id?: number;
    /** 街道代码 */
    adcode?: string;
    /** 街道名称 */
    name?: string;
    /** 所属区县代码 */
    districtAdcode?: string;
    /** 经度 */
    longitude?: number;
    /** 纬度 */
    latitude?: number;
    /** 所属区县名称 */
    districtName?: string;
    /** 所属城市名称 */
    cityName?: string;
    /** 所属城市代码 */
    cityAdcode?: string;
    /** 所属省份名称 */
    provinceName?: string;
    /** 所属省份代码 */
    provinceAdcode?: string;
  };

  type StreetUpdateRequest = {
    /** 街道名称 */
    name?: string;
    /** 经度 */
    longitude?: number;
    /** 纬度 */
    latitude?: number;
  };

  type TagCreateRequest = {
    /** 标签名称 */
    name: string;
    /** 标签编码 */
    code: string;
    /** 标签描述 */
    description?: string;
    /** 标签颜色 */
    color?: string;
  };

  type TagInfo = {
    /** 标签ID */
    id?: number;
    /** 标签名称 */
    name?: string;
    /** 标签编码 */
    code?: string;
    /** 标签颜色 */
    color?: string;
  };

  type TagQueryRequest = {
    /** 页码 */
    page?: number;
    /** 每页大小 */
    size?: number;
    /** 标签名称（模糊搜索） */
    name?: string;
  };

  type TagResponse = {
    /** 标签ID */
    id?: number;
    /** 标签名称 */
    name?: string;
    /** 标签编码 */
    code?: string;
    /** 标签描述 */
    description?: string;
    /** 标签颜色 */
    color?: string;
    /** 创建时间 */
    createAt?: string;
    /** 更新时间 */
    updateAt?: string;
  };

  type TagUpdateRequest = {
    /** 标签ID */
    id: number;
    /** 标签名称 */
    name: string;
    /** 标签描述 */
    description?: string;
    /** 标签颜色 */
    color?: string;
  };

  type TopMuseum = {
    /** 博物馆ID */
    id?: number;
    /** 博物馆名称 */
    name?: string;
    /** 访客数 */
    visitors?: number;
    /** 状态：0-关闭，1-开放 */
    status?: number;
    /** 容量使用率 */
    capacityUsage?: number;
  };

  type triggerAutoAuditParams = {
    /** 打卡记录ID */
    id: number;
  };

  type unfavoriteExhibitionParams = {
    /** 展览ID */
    exhibitionId: number;
  };

  type unfavoriteMuseumParams = {
    /** 博物馆ID */
    museumId: number;
  };

  type updateAnnouncementEnabledParams = {
    /** 公告ID */
    id: number;
    /** 启用状态：0-禁用（隐藏），1-启用（显示） */
    enabled: number;
  };

  type updateAnnouncementParams = {
    /** 公告ID */
    id: number;
  };

  type updateAnnouncementStatusParams = {
    /** 公告ID */
    id: number;
    /** 状态：0-草稿，1-发布，2-下线 */
    status: number;
  };

  type updateAppVersionParams = {
    /** 版本ID */
    id: number;
  };

  type updateBannerParams = {
    /** 轮播图ID */
    id: number;
  };

  type updateBannerStatusParams = {
    /** 轮播图ID */
    id: number;
    /** 状态：0-下线，1-上线 */
    status: number;
  };

  type updateCategoryParams = {
    /** 分类ID */
    id: number;
  };

  type updateCityParams = {
    /** 城市ID */
    id: number;
  };

  type updateDistrictParams = {
    /** 区县ID */
    id: number;
  };

  type updateDownloadCountParams = {
    /** 版本ID */
    id: number;
  };

  type updateExhibitionParams = {
    /** 博物馆ID */
    museumId: number;
    /** 展览ID */
    id: number;
  };

  type updateMuseumParams = {
    /** 博物馆ID */
    id: number;
  };

  type updateProvinceParams = {
    /** 省份ID */
    id: number;
  };

  type updateSortOrderParams = {
    /** 关联ID */
    id: number;
    /** 排序值 */
    sortOrder: number;
  };

  type updateStatus1Params = {
    /** 博物馆ID */
    id: number;
    /** 状态：0-关闭，1-开放 */
    status: number;
  };

  type updateStatus2Params = {
    /** 分类ID */
    id: number;
    /** 状态：0-禁用，1-启用 */
    status: number;
  };

  type updateStatusParams = {
    /** 博物馆ID */
    museumId: number;
    /** 展览ID */
    id: number;
    /** 状态：0-已结束，1-进行中，2-未开始 */
    status: number;
  };

  type updateStreetParams = {
    /** 街道ID */
    id: number;
  };

  type updateTagParams = {
    /** 标签ID */
    id: number;
  };

  type VisitedMuseum = {
    /** 博物馆ID */
    id?: number;
    /** 博物馆名称 */
    name?: string;
    /** 打卡次数 */
    checkinCount?: number;
    /** 首次打卡时间 */
    firstCheckinTime?: string;
    /** 最后打卡时间 */
    lastCheckinTime?: string;
  };

  type VisitorsTrend = {
    /** 月份 */
    month?: string;
    /** 访客数 */
    visitors?: number;
  };
}
