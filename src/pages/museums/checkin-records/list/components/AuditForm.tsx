import { FormattedMessage, useIntl } from '@umijs/max';
import { 
  Drawer, 
  Form, 
  Input, 
  Select, 
  Row, 
  Col, 
  Button,
  Space,
  App 
} from 'antd';
import React, { cloneElement, useCallback, useState } from 'react';
// TODO: 这些导入需要在执行 npm run openapi 后更新
// import { auditCheckinRecord } from '@/services/museum-service-api/checkinRecordController';

export type AuditFormProps = {
  trigger?: React.ReactElement<any>;
  onOk?: () => void;
  values: any;
};

const AuditForm: React.FC<AuditFormProps> = (props) => {
  const { onOk, values, trigger } = props;

  const intl = useIntl();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { message } = App.useApp();

  // 表单提交
  const handleFinish = useCallback(async (formData: any) => {
    setLoading(true);
    try {
      // TODO: 在 npm run openapi 后实现
      // await auditCheckinRecord(
      //   { id: values.id },
      //   {
      //     auditStatus: formData.auditStatus,
      //     auditRemark: formData.auditRemark || '',
      //   }
      // );

      message.success(
        intl.formatMessage({
          id: 'pages.checkinRecord.auditSuccess',
          defaultMessage: 'Audit successful',
        })
      );

      setOpen(false);
      form.resetFields();
      onOk?.();
    } catch (error) {
      console.error('Failed to audit checkin record:', error);
      message.error(
        intl.formatMessage({
          id: 'pages.checkinRecord.auditFailed',
          defaultMessage: 'Audit failed',
        })
      );
    } finally {
      setLoading(false);
    }
  }, [values, intl, message, form, onOk]);

  // 取消操作
  const handleCancel = useCallback(() => {
    setOpen(false);
    form.resetFields();
  }, [form]);

  // 打开表单时设置初始值
  const handleOpen = useCallback(() => {
    setOpen(true);
    // 设置表单初始值
    form.setFieldsValue({
      auditStatus: values?.auditStatus || 0,
      auditRemark: values?.auditRemark || '',
    });
  }, [form, values]);

  return (
    <>
      {trigger && 
        cloneElement(trigger, {
          onClick: handleOpen,
        })
      }
      
      <Drawer
        title={intl.formatMessage(
          {
            id: 'pages.checkinRecord.auditTitle',
            defaultMessage: 'Audit Checkin Record: {id}',
          },
          { id: values?.id }
        )}
        width={600}
        open={open}
        onClose={handleCancel}
        destroyOnClose
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>
                <FormattedMessage id="pages.common.cancel" defaultMessage="Cancel" />
              </Button>
              <Button 
                type="primary" 
                onClick={() => form.submit()}
                loading={loading}
              >
                <FormattedMessage id="pages.common.submit" defaultMessage="Submit" />
              </Button>
            </Space>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            auditStatus: 0,
            auditRemark: '',
          }}
        >
          {/* 基本信息 - 只读 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={intl.formatMessage({
                  id: 'pages.checkinRecord.recordId',
                  defaultMessage: 'Record ID',
                })}
              >
                <Input value={values?.id} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={intl.formatMessage({
                  id: 'pages.checkinRecord.userName',
                  defaultMessage: 'User Name',
                })}
              >
                <Input value={values?.userName} disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={intl.formatMessage({
                  id: 'pages.checkinRecord.museumName',
                  defaultMessage: 'Museum Name',
                })}
              >
                <Input value={values?.museumName} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={intl.formatMessage({
                  id: 'pages.checkinRecord.checkinTime',
                  defaultMessage: 'Checkin Time',
                })}
              >
                <Input value={values?.checkinTime} disabled />
              </Form.Item>
            </Col>
          </Row>

          {/* 审核操作 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="auditStatus"
                label={intl.formatMessage({
                  id: 'pages.checkinRecord.auditStatus',
                  defaultMessage: 'Audit Status',
                })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.checkinRecord.auditStatusRequired',
                      defaultMessage: 'Please select audit status',
                    }),
                  },
                ]}
              >
                <Select
                  placeholder={intl.formatMessage({
                    id: 'pages.checkinRecord.auditStatusPlaceholder',
                    defaultMessage: 'Please select audit status',
                  })}
                  options={[
                    {
                      label: intl.formatMessage({
                        id: 'pages.checkinRecord.statusPending',
                        defaultMessage: 'Pending',
                      }),
                      value: 0,
                    },
                    {
                      label: intl.formatMessage({
                        id: 'pages.checkinRecord.statusApproved',
                        defaultMessage: 'Approved',
                      }),
                      value: 1,
                    },
                    {
                      label: intl.formatMessage({
                        id: 'pages.checkinRecord.statusRejected',
                        defaultMessage: 'Rejected',
                      }),
                      value: 2,
                    },
                    {
                      label: intl.formatMessage({
                        id: 'pages.checkinRecord.statusAnomalous',
                        defaultMessage: 'Anomalous',
                      }),
                      value: 3,
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="auditRemark"
                label={intl.formatMessage({
                  id: 'pages.checkinRecord.auditRemark',
                  defaultMessage: 'Audit Remark',
                })}
              >
                <Input.TextArea
                  placeholder={intl.formatMessage({
                    id: 'pages.checkinRecord.auditRemarkPlaceholder',
                    defaultMessage: 'Please enter audit remark',
                  })}
                  rows={4}
                  maxLength={500}
                  showCount
                />
              </Form.Item>
            </Col>
          </Row>

          {/* 显示打卡详情 */}
          {values?.remark && (
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label={intl.formatMessage({
                    id: 'pages.checkinRecord.checkinRemark',
                    defaultMessage: 'Checkin Remark',
                  })}
                >
                  <Input.TextArea value={values.remark} disabled rows={3} />
                </Form.Item>
              </Col>
            </Row>
          )}

          {values?.latitude && values?.longitude && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={intl.formatMessage({
                    id: 'pages.checkinRecord.latitude',
                    defaultMessage: 'Latitude',
                  })}
                >
                  <Input value={values.latitude} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={intl.formatMessage({
                    id: 'pages.checkinRecord.longitude',
                    defaultMessage: 'Longitude',
                  })}
                >
                  <Input value={values.longitude} disabled />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
      </Drawer>
    </>
  );
};

export default AuditForm;