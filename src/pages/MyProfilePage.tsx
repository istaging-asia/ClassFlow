import { useState, useEffect } from 'react';
import { Avatar, Button, Card, Col, Form, Input, Row, Tag, Typography, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { usersApi } from '../api/users';
import PageHeader from '../components/PageHeader';

const { TextArea } = Input;

export default function MyProfilePage() {
  const { user, updateUser } = useAuth();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        dept: user.dept || '',
        phone: user.phone || '',
        intro: user.intro || '',
      });
    }
  }, [user, form]);

  const handleSave = async (values: { phone?: string; intro?: string }) => {
    setSaving(true);
    try {
      const updated = await usersApi.updateMyProfile(values);
      updateUser(updated);
      message.success('프로필 정보가 성공적으로 저장되었습니다.');
    } catch (err: any) {
      const errMsg = err.response?.data?.error?.message || '프로필 저장에 실패했습니다.';
      message.error(errMsg);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div>
      <PageHeader title="내 프로필" description="다른 구성원에게 보여지는 내 프로필 정보를 관리합니다." />

      <Row gutter={[20, 20]}>
        <Col xs={24} md={8}>
          <Card style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Avatar size={104} style={{ background: user.color || '#5B5BF6', fontSize: 40, fontWeight: 600 }}>
                {user.name[0]}
              </Avatar>
            </div>
            <Typography.Title level={5} style={{ marginTop: 16, marginBottom: 0 }}>
              {user.name}
            </Typography.Title>
            <Typography.Text type="secondary">{user.dept || '소속 정보 없음'}</Typography.Text>
            <div style={{ marginTop: 12 }}>
              <Tag color={user.role === 'ADMIN' ? 'purple' : 'blue'}>
                {user.role}
              </Tag>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card title="기본 정보" styles={{ header: { fontWeight: 600 } }}>
            <Form form={form} layout="vertical" requiredMark={false} onFinish={handleSave}>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="강사명" name="name">
                    <Input size="large" disabled />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="소속 / 직책" name="dept">
                    <Input size="large" disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="연락처" name="phone">
                <Input size="large" placeholder="010-0000-0000" />
              </Form.Item>
              <Form.Item label="간단 소개글" name="intro" extra="2~3줄 이내로 간단히 작성해주세요.">
                <TextArea rows={3} maxLength={150} showCount placeholder="자기소개를 입력해 주세요" />
              </Form.Item>
              <Button type="primary" size="large" icon={<SaveOutlined />} htmlType="submit" loading={saving}>
                저장하기
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
