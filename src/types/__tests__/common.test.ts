/**
 * 通用类型测试
 * @description 测试通用类型定义的正确性
 */
import type {
  ApiResponse,
  PaginationResponse,
  PageResult,
  AreaOption,
  CommonStatus,
} from '../common';
import { HTTP_STATUS } from '@/constants/api';

describe('Common Types', () => {
  describe('ApiResponse', () => {
    it('should accept valid API response', () => {
      const response: ApiResponse<string> = {
        code: 200,
        message: 'success',
        data: 'test data',
        timestamp: Date.now(),
        success: true,
      };

      expect(response.code).toBe(200);
      expect(response.data).toBe('test data');
    });
  });

  describe('PaginationResponse', () => {
    it('should accept valid pagination response', () => {
      const response: PaginationResponse<{ id: number; name: string }> = {
        records: [
          { id: 1, name: 'item1' },
          { id: 2, name: 'item2' },
        ],
        total: 2,
        current: 1,
        size: 10,
        pages: 1,
      };

      expect(response.records.length).toBe(2);
      expect(response.total).toBe(2);
    });
  });

  describe('PageResult', () => {
    it('should be alias of PaginationResponse', () => {
      const pageResult: PageResult<string> = {
        records: ['a', 'b', 'c'],
        total: 3,
        current: 1,
        size: 10,
      };

      const paginationResponse: PaginationResponse<string> = pageResult;
      
      expect(paginationResponse.records).toEqual(['a', 'b', 'c']);
    });
  });

  describe('AreaOption', () => {
    it('should accept valid area option', () => {
      const option: AreaOption = {
        value: '110000',
        label: '北京市',
        isLeaf: false,
        children: [
          {
            value: '110100',
            label: '北京市市辖区',
            isLeaf: true,
          },
        ],
      };

      expect(option.value).toBe('110000');
      expect(option.children?.length).toBe(1);
    });
  });

  describe('HTTP_STATUS', () => {
    it('should have correct HTTP status codes', () => {
      expect(HTTP_STATUS.OK).toBe(200);
      expect(HTTP_STATUS.CREATED).toBe(201);
      expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
      expect(HTTP_STATUS.UNAUTHORIZED).toBe(401);
      expect(HTTP_STATUS.FORBIDDEN).toBe(403);
      expect(HTTP_STATUS.NOT_FOUND).toBe(404);
      expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
    });
  });

  describe('CommonStatus', () => {
    it('should have correct common status values', () => {
      expect(CommonStatus.DISABLED).toBe(0);
      expect(CommonStatus.ENABLED).toBe(1);
    });
  });
});

