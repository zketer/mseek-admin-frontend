/**
 * authUtils 单元测试
 * @description 测试权限工具函数
 */
import { validateUsername, validateEmail, validatePhone, validatePassword } from '../authUtils';

describe('authUtils', () => {
  describe('validateUsername', () => {
    it('should return true for valid username', () => {
      expect(validateUsername('user123')).toBe(true);
      expect(validateUsername('User_Name')).toBe(true);
      expect(validateUsername('test_user_123')).toBe(true);
    });

    it('should return false for invalid username', () => {
      expect(validateUsername('ab')).toBe(false); // 太短
      expect(validateUsername('abcdefghijklmnopqrstuvwxyz123')).toBe(false); // 太长
      expect(validateUsername('user-name')).toBe(false); // 包含非法字符
      expect(validateUsername('用户名')).toBe(false); // 包含中文
      expect(validateUsername('user name')).toBe(false); // 包含空格
    });
  });

  describe('validateEmail', () => {
    it('should return true for valid email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@company.co.uk')).toBe(true);
      expect(validateEmail('test+tag@domain.org')).toBe(true);
    });

    it('should return false for invalid email', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('test @example.com')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('should return true for valid phone number', () => {
      expect(validatePhone('13800138000')).toBe(true);
      expect(validatePhone('15912345678')).toBe(true);
      expect(validatePhone('18888888888')).toBe(true);
    });

    it('should return false for invalid phone number', () => {
      expect(validatePhone('12345678901')).toBe(false); // 不是1开头
      expect(validatePhone('1381234567')).toBe(false); // 长度不够
      expect(validatePhone('138123456789')).toBe(false); // 长度太长
      expect(validatePhone('13a12345678')).toBe(false); // 包含字母
    });
  });

  describe('validatePassword', () => {
    it('should return weak for short password', () => {
      const result = validatePassword('abc');
      expect(result.valid).toBe(false);
      expect(result.strength).toBe('weak');
    });

    it('should return weak for simple password', () => {
      const result = validatePassword('abcdefg');
      expect(result.valid).toBe(true);
      expect(result.strength).toBe('weak');
    });

    it('should return medium for mixed password', () => {
      const result = validatePassword('abc123456');
      expect(result.valid).toBe(true);
      expect(result.strength).toBe('medium');
    });

    it('should return strong for complex password', () => {
      const result = validatePassword('Abc123!@#');
      expect(result.valid).toBe(true);
      expect(result.strength).toBe('strong');
    });
  });
});

