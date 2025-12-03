/**
 * 统一消息提示工具
 * @description 使用 notification 替代 message，提供更好的用户体验
 * @author zlynn
 * @date 2024-11-07
 */

import { notification } from 'antd';
import type { ArgsProps } from 'antd/es/notification';

/**
 * 消息提示配置
 */
interface NotificationConfig {
  /** 消息内容（支持简短文本或详细描述） */
  content: string;
  /** 详细描述（可选，用于更复杂的提示） */
  description?: string;
  /** 显示时长（秒），默认3秒，0表示不自动关闭 */
  duration?: number;
  /** 显示位置，默认右上角 */
  placement?: ArgsProps['placement'];
  /** 是否显示关闭按钮，默认true */
  closable?: boolean;
  /** 点击通知时的回调 */
  onClick?: () => void;
  /** 关闭时的回调 */
  onClose?: () => void;
}

/**
 * 提取标题和描述
 * @param config 配置对象
 * @returns 标题和描述
 */
const extractTitleAndDescription = (config: string | NotificationConfig) => {
  if (typeof config === 'string') {
    // 简单文本，作为描述显示
    return {
      description: config,
      duration: 3,
      placement: 'topRight' as const,
    };
  }

  return {
    description: config.description || config.content,
    duration: config.duration ?? 3,
    placement: config.placement || 'topRight',
    onClick: config.onClick,
    onClose: config.onClose,
  };
};

/**
 * 成功提示（绿色）
 * @example
 * notify.success('操作成功');
 * notify.success({ content: '保存成功', description: '您的数据已成功保存' });
 */
const success = (config: string | NotificationConfig) => {
  const { description, duration, placement, onClick, onClose } = extractTitleAndDescription(config);
  
  notification.success({
    message: '成功',
    description,
    duration,
    placement,
    onClick,
    onClose,
  });
};

/**
 * 错误提示（红色）
 * @example
 * notify.error('操作失败');
 * notify.error({ content: '删除失败', description: '该数据正在被使用，无法删除' });
 */
const error = (config: string | NotificationConfig) => {
  const { description, duration, placement, onClick, onClose } = extractTitleAndDescription(config);
  
  notification.error({
    message: '错误',
    description,
    duration,
    placement,
    onClick,
    onClose,
  });
};

/**
 * 警告提示（橙色）
 * @example
 * notify.warning('请注意检查输入');
 * notify.warning({ content: '权限不足', description: '您没有执行此操作的权限' });
 */
const warning = (config: string | NotificationConfig) => {
  const { description, duration, placement, onClick, onClose } = extractTitleAndDescription(config);
  
  notification.warning({
    message: '警告',
    description,
    duration,
    placement,
    onClick,
    onClose,
  });
};

/**
 * 信息提示（蓝色）
 * @example
 * notify.info('这是一条提示信息');
 * notify.info({ content: '系统维护', description: '系统将于今晚22:00进行维护' });
 */
const info = (config: string | NotificationConfig) => {
  const { description, duration, placement, onClick, onClose } = extractTitleAndDescription(config);
  
  notification.info({
    message: '提示',
    description,
    duration,
    placement,
    onClick,
    onClose,
  });
};

/**
 * 自定义标题的成功提示
 * @example
 * notify.successWithTitle('发布成功', '您的内容已成功发布');
 */
const successWithTitle = (title: string, description: string, duration: number = 3) => {
  notification.success({
    message: title,
    description,
    duration,
    placement: 'topRight',
  });
};

/**
 * 自定义标题的错误提示
 * @example
 * notify.errorWithTitle('上传失败', '文件格式不正确');
 */
const errorWithTitle = (title: string, description: string, duration: number = 3) => {
  notification.error({
    message: title,
    description,
    duration,
    placement: 'topRight',
  });
};

/**
 * 自定义标题的警告提示
 * @example
 * notify.warningWithTitle('注意', '该操作不可撤销');
 */
const warningWithTitle = (title: string, description: string, duration: number = 3) => {
  notification.warning({
    message: title,
    description,
    duration,
    placement: 'topRight',
  });
};

/**
 * 自定义标题的信息提示
 * @example
 * notify.infoWithTitle('系统通知', '您有新的消息');
 */
const infoWithTitle = (title: string, description: string, duration: number = 3) => {
  notification.info({
    message: title,
    description,
    duration,
    placement: 'topRight',
  });
};

/**
 * 确认提示（需要用户手动关闭）
 * @example
 * notify.confirm('重要操作', '此操作将删除所有数据，确定继续吗？');
 */
const confirm = (title: string, description: string) => {
  notification.warning({
    message: title,
    description,
    duration: 0, // 不自动关闭
    placement: 'topRight',
  });
};

/**
 * 导出统一的消息提示工具
 * 
 * @example 基础用法
 * ```ts
 * import { notify } from '@/utils/messageNotification';
 * 
 * // 简单提示
 * notify.success('操作成功');
 * notify.error('操作失败');
 * notify.warning('请注意');
 * notify.info('提示信息');
 * 
 * // 详细提示
 * notify.success({
 *   content: '保存成功',
 *   description: '您的数据已成功保存到服务器',
 *   duration: 5,
 * });
 * 
 * // 自定义标题
 * notify.successWithTitle('发布成功', '您的文章已成功发布');
 * 
 * // 确认提示（不自动关闭）
 * notify.confirm('重要提示', '此操作不可撤销');
 * ```
 */
export const notify = {
  success,
  error,
  warning,
  info,
  successWithTitle,
  errorWithTitle,
  warningWithTitle,
  infoWithTitle,
  confirm,
};

/**
 * 兼容旧的 message API（逐步迁移用）
 * @deprecated 请使用 notify 替代
 * 
 * @example 迁移示例
 * ```ts
 * // 旧写法
 * import { message } from 'antd';
 * message.success('操作成功');
 * 
 * // 新写法
 * import { notify } from '@/utils/messageNotification';
 * notify.success('操作成功');
 * ```
 */
export const compatMessage = {
  success: (content: string, duration?: number) => {
    notification.success({
      message: '成功',
      description: content,
      duration: duration ?? 3,
      placement: 'topRight',
    });
  },
  error: (content: string, duration?: number) => {
    notification.error({
      message: '错误',
      description: content,
      duration: duration ?? 3,
      placement: 'topRight',
    });
  },
  warning: (content: string, duration?: number) => {
    notification.warning({
      message: '警告',
      description: content,
      duration: duration ?? 3,
      placement: 'topRight',
    });
  },
  info: (content: string, duration?: number) => {
    notification.info({
      message: '提示',
      description: content,
      duration: duration ?? 3,
      placement: 'topRight',
    });
  },
  loading: (content: string) => {
    // loading状态暂时使用info
    notification.info({
      message: '加载中',
      description: content,
      duration: 0,
      placement: 'topRight',
    });
  },
};

export default notify;

