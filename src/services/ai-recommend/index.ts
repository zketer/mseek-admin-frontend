import type { MuseumsAPI } from '@/services/museum-service-api/typings';
import { STORAGE_KEYS } from '@/constants';

// 推荐类型枚举
export enum RecommendType {
  PERSONAL = 'personal',
  LOCATION = 'location',
  TRENDING = 'trending',
  SIMILAR = 'similar',
  COLLABORATIVE = 'collaborative',
}

// 用户偏好接口
export interface UserPreferences {
  categories?: string[];
  freeAdmission?: boolean;
  minLevel?: number;
  minRating?: number;
  maxDistance?: number;
  preferredCities?: string[];
  preferredTime?: 'morning' | 'afternoon' | 'evening' | 'any';
  groupSize?: 'solo' | 'couple' | 'family' | 'group';
  interests?: string[];
  avoidCrowded?: boolean;
  accessibilityNeeds?: boolean;
  languagePreference?: 'chinese' | 'english' | 'bilingual';
}

// 推荐配置接口
export interface RecommendConfig {
  type: RecommendType;
  location?: { longitude: number; latitude: number };
  userPreferences?: UserPreferences;
  limit?: number;
  userId?: string;
}

// 推荐结果接口
export interface RecommendResult {
  museum: MuseumsAPI.MuseumResponse;
  score: number;
  reason: string;
  tags: string[];
  distance?: number;
  confidence: number; // 推荐置信度 0-1
}

// 用户行为数据接口
export interface UserBehavior {
  userId: string;
  museumId: number;
  action: 'view' | 'favorite' | 'visit' | 'rate' | 'share';
  rating?: number;
  timestamp: number;
  duration?: number; // 浏览时长（秒）
}

// AI推荐服务类
export class AIRecommendService {
  private static instance: AIRecommendService;
  private userBehaviors: UserBehavior[] = [];
  private userPreferences: Map<string, UserPreferences> = new Map();

  private constructor() {
    // 从localStorage加载用户行为数据
    this.loadUserBehaviors();
    this.loadUserPreferences();
  }

  public static getInstance(): AIRecommendService {
    if (!AIRecommendService.instance) {
      AIRecommendService.instance = new AIRecommendService();
    }
    return AIRecommendService.instance;
  }

  // 加载用户行为数据
  private loadUserBehaviors(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AI_USER_BEHAVIORS);
      if (stored) {
        this.userBehaviors = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('加载用户行为数据失败:', error);
    }
  }

  // 保存用户行为数据
  private saveUserBehaviors(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AI_USER_BEHAVIORS, JSON.stringify(this.userBehaviors));
    } catch (error) {
      console.warn('保存用户行为数据失败:', error);
    }
  }

  // 加载用户偏好设置
  private loadUserPreferences(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AI_USER_PREFERENCES);
      if (stored) {
        const preferences = JSON.parse(stored);
        Object.entries(preferences).forEach(([userId, prefs]) => {
          this.userPreferences.set(userId, prefs as UserPreferences);
        });
      }
    } catch (error) {
      console.warn('加载用户偏好设置失败:', error);
    }
  }

  // 保存用户偏好设置
  private saveUserPreferences(): void {
    try {
      const preferences: Record<string, UserPreferences> = {};
      this.userPreferences.forEach((prefs, userId) => {
        preferences[userId] = prefs;
      });
      localStorage.setItem(STORAGE_KEYS.AI_USER_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.warn('保存用户偏好设置失败:', error);
    }
  }

  // 记录用户行为
  public recordUserBehavior(behavior: Omit<UserBehavior, 'timestamp'>): void {
    const fullBehavior: UserBehavior = {
      ...behavior,
      timestamp: Date.now(),
    };

    this.userBehaviors.push(fullBehavior);

    // 保持最近1000条记录
    if (this.userBehaviors.length > 1000) {
      this.userBehaviors = this.userBehaviors.slice(-1000);
    }

    this.saveUserBehaviors();
  }

  // 设置用户偏好
  public setUserPreferences(userId: string, preferences: UserPreferences): void {
    this.userPreferences.set(userId, preferences);
    this.saveUserPreferences();
  }

  // 获取用户偏好
  public getUserPreferences(userId: string): UserPreferences | undefined {
    return this.userPreferences.get(userId);
  }

  // 计算两点间距离（使用Haversine公式）
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // 地球半径（公里）
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  // 基于内容的推荐算法
  private contentBasedRecommend(
    museums: MuseumsAPI.MuseumResponse[],
    config: RecommendConfig
  ): RecommendResult[] {
    const { userPreferences, location } = config;

    return museums.map((museum) => {
      let score = 50; // 基础分数
      let confidence = 0.6; // 基础置信度
      const tags: string[] = [];
      const reasons: string[] = [];

      // 博物馆等级评分
      if (museum.level) {
        score += museum.level * 8;
        if (museum.level >= 4) {
          tags.push('高等级');
          reasons.push('高等级博物馆');
        }
      }

      // 用户偏好匹配
      if (userPreferences) {
        // 免费偏好
        if (userPreferences.freeAdmission && museum.freeAdmission === 1) {
          score += 15;
          confidence += 0.1;
          tags.push('免费');
          reasons.push('符合免费偏好');
        }

        // 等级偏好
        if (userPreferences.minLevel && museum.level && museum.level >= userPreferences.minLevel) {
          score += 10;
          confidence += 0.1;
        }

        // 分类偏好
        if (userPreferences.categories && userPreferences.categories.length > 0 && museum.categories) {
          const categoryMatch = museum.categories.some(cat =>
            userPreferences.categories!.includes(cat.code || '')
          );
          if (categoryMatch) {
            score += 20;
            confidence += 0.15;
            tags.push('兴趣匹配');
            reasons.push('符合分类偏好');
          }
        }

        // 城市偏好
        if (userPreferences.preferredCities && userPreferences.preferredCities.includes(museum.city || '')) {
          score += 15;
          confidence += 0.1;
          tags.push('偏好城市');
          reasons.push('位于偏好城市');
        }
      }

      // 位置距离评分
      let distance: number | undefined;
      if (location && museum.longitude && museum.latitude) {
        distance = this.calculateDistance(
          location.latitude,
          location.longitude,
          museum.latitude,
          museum.longitude
        );

        if (distance <= 10) {
          score += 25;
          tags.push('就近');
          reasons.push('距离很近');
        } else if (distance <= 30) {
          score += 15;
          tags.push('附近');
          reasons.push('交通便利');
        } else if (distance <= 100) {
          score += 5;
        }
      }

      // 藏品和展览丰富度
      if (museum.collectionCount && museum.collectionCount > 10000) {
        score += 10;
        tags.push('藏品丰富');
        reasons.push('藏品丰富');
      }

      if (museum.exhibitions && museum.exhibitions > 10) {
        score += 8;
        tags.push('展览丰富');
        reasons.push('展览丰富');
      }

      // 访客数量（热门程度）
      if (museum.visitorCount && museum.visitorCount > 100) {
        score += 5;
        tags.push('热门');
        reasons.push('热门景点');
      }

      return {
        museum,
        score: Math.min(100, Math.max(0, score)),
        reason: reasons.length > 0 ? reasons.join(' • ') : '推荐给您',
        tags,
        distance,
        confidence: Math.min(1, Math.max(0, confidence)),
      };
    });
  }

  // 协同过滤推荐算法
  private collaborativeFilteringRecommend(
    museums: MuseumsAPI.MuseumResponse[],
    config: RecommendConfig
  ): RecommendResult[] {
    const { userId } = config;
    if (!userId) {
      return this.contentBasedRecommend(museums, config);
    }

    // 获取用户行为数据
    const userBehaviors = this.userBehaviors.filter(b => b.userId === userId);
    const userLikedMuseums = userBehaviors
      .filter(b => b.action === 'favorite' || (b.action === 'rate' && (b.rating || 0) >= 4))
      .map(b => b.museumId);

    // 找到相似用户
    const similarUsers = this.findSimilarUsers(userId, userLikedMuseums);

    // 基于相似用户的推荐
    const recommendations = museums.map((museum) => {
      let score = 40; // 较低的基础分数，因为依赖协同过滤
      let confidence = 0.4;
      const tags: string[] = ['协同推荐'];
      const reasons: string[] = [];

      // 检查相似用户是否喜欢这个博物馆
      const similarUserLikes = similarUsers.filter(su =>
        su.likedMuseums.includes(museum.id || 0)
      ).length;

      if (similarUserLikes > 0) {
        score += similarUserLikes * 15;
        confidence += similarUserLikes * 0.1;
        reasons.push(`${similarUserLikes}个相似用户推荐`);
      }

      // 结合内容特征
      if (museum.level && museum.level >= 4) {
        score += 10;
        tags.push('高等级');
      }

      if (museum.freeAdmission === 1) {
        score += 5;
        tags.push('免费');
      }

      return {
        museum,
        score: Math.min(100, Math.max(0, score)),
        reason: reasons.length > 0 ? reasons.join(' • ') : '相似用户推荐',
        tags,
        confidence: Math.min(1, Math.max(0, confidence)),
      };
    });

    return recommendations;
  }

  // 找到相似用户
  private findSimilarUsers(userId: string, userLikedMuseums: number[]): Array<{
    userId: string;
    similarity: number;
    likedMuseums: number[];
  }> {
    const allUsers = Array.from(new Set(this.userBehaviors.map(b => b.userId)));
    const similarities: Array<{
      userId: string;
      similarity: number;
      likedMuseums: number[];
    }> = [];

    for (const otherUserId of allUsers) {
      if (otherUserId === userId) continue;

      const otherUserBehaviors = this.userBehaviors.filter(b => b.userId === otherUserId);
      const otherLikedMuseums = otherUserBehaviors
        .filter(b => b.action === 'favorite' || (b.action === 'rate' && (b.rating || 0) >= 4))
        .map(b => b.museumId);

      // 计算Jaccard相似度
      const intersection = userLikedMuseums.filter(m => otherLikedMuseums.includes(m)).length;
      const union = new Set([...userLikedMuseums, ...otherLikedMuseums]).size;
      const similarity = union > 0 ? intersection / union : 0;

      if (similarity > 0.1) { // 只考虑相似度大于0.1的用户
        similarities.push({
          userId: otherUserId,
          similarity,
          likedMuseums: otherLikedMuseums,
        });
      }
    }

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10); // 取前10个最相似的用户
  }

  // 热门推荐算法
  private trendingRecommend(
    museums: MuseumsAPI.MuseumResponse[],
    config: RecommendConfig
  ): RecommendResult[] {
    return museums.map((museum) => {
      let score = 30; // 较低的基础分数
      const tags: string[] = ['热门推荐'];
      const reasons: string[] = [];

      // 基于访客数量
      if (museum.visitorCount) {
        score += Math.min(museum.visitorCount / 10, 40);
        if (museum.visitorCount > 200) {
          reasons.push('超高人气');
        } else if (museum.visitorCount > 100) {
          reasons.push('热门景点');
        }
      }

      // 基于展览数量
      if (museum.exhibitions) {
        score += Math.min(museum.exhibitions, 20);
        if (museum.exhibitions > 15) {
          reasons.push('展览丰富');
        }
      }

      // 基于用户行为数据中的热门程度
      const museumBehaviors = this.userBehaviors.filter(b => b.museumId === museum.id);
      const recentBehaviors = museumBehaviors.filter(b =>
        Date.now() - b.timestamp < 30 * 24 * 60 * 60 * 1000 // 最近30天
      );

      if (recentBehaviors.length > 5) {
        score += Math.min(recentBehaviors.length * 2, 20);
        reasons.push('最近热门');
        tags.push('最近热门');
      }

      return {
        museum,
        score: Math.min(100, Math.max(0, score)),
        reason: reasons.length > 0 ? reasons.join(' • ') : '热门推荐',
        tags,
        confidence: 0.7,
      };
    });
  }

  // 主推荐方法
  public recommend(
    museums: MuseumsAPI.MuseumResponse[],
    config: RecommendConfig
  ): RecommendResult[] {
    let results: RecommendResult[] = [];

    switch (config.type) {
      case RecommendType.PERSONAL:
        results = this.contentBasedRecommend(museums, config);
        break;
      case RecommendType.LOCATION:
        results = this.contentBasedRecommend(museums, config);
        break;
      case RecommendType.TRENDING:
        results = this.trendingRecommend(museums, config);
        break;
      case RecommendType.COLLABORATIVE:
        results = this.collaborativeFilteringRecommend(museums, config);
        break;
      case RecommendType.SIMILAR:
        // 基于相似博物馆的推荐（可以后续实现）
        results = this.contentBasedRecommend(museums, config);
        break;
      default:
        results = this.contentBasedRecommend(museums, config);
    }

    // 过滤和排序
    results = results
      .filter((result) => {
        // 根据配置过滤结果
        if (config.userPreferences?.maxDistance && result.distance) {
          return result.distance <= config.userPreferences.maxDistance;
        }
        return true;
      })
      .sort((a, b) => {
        // 首先按置信度排序，然后按分数排序
        if (Math.abs(a.confidence - b.confidence) > 0.1) {
          return b.confidence - a.confidence;
        }
        return b.score - a.score;
      })
      .slice(0, config.limit || 12);

    return results;
  }

  // 获取用户行为统计
  public getUserBehaviorStats(userId: string): {
    totalActions: number;
    favoriteCount: number;
    viewCount: number;
    averageRating: number;
    mostViewedCategories: string[];
  } {
    const userBehaviors = this.userBehaviors.filter(b => b.userId === userId);

    const favoriteCount = userBehaviors.filter(b => b.action === 'favorite').length;
    const viewCount = userBehaviors.filter(b => b.action === 'view').length;

    const ratings = userBehaviors
      .filter(b => b.action === 'rate' && b.rating)
      .map(b => b.rating!);
    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : 0;

    // 这里需要结合博物馆数据来统计最常浏览的分类
    // 暂时返回空数组，实际实现时需要查询博物馆数据
    const mostViewedCategories: string[] = [];

    return {
      totalActions: userBehaviors.length,
      favoriteCount,
      viewCount,
      averageRating,
      mostViewedCategories,
    };
  }
}
