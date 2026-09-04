import { useState } from 'react';
import { Button, Form, Input, Typography, Divider, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { brandGradient } from '../theme';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { login_id: string; password: string }) => {
    setLoading(true);
    try {
      const user = await login(values);
      message.success(`${user.name}님 환영합니다.`);
      if (user.role === 'ADMIN') {
        navigate('/admin/logs');
      } else {
        navigate('/instructor/logs');
      }
    } catch (err: any) {
      const errMsg =
        err.response?.data?.error?.message ||
        err.response?.data?.detail ||
        '아이디 또는 비밀번호를 확인해 주세요.';
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleFillAccount = (loginId: string, pw: string) => {
    form.setFieldsValue({ login_id: loginId, password: pw });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F5F6FB',
        padding: 16,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 880,
          display: 'flex',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(30,30,80,0.10)',
        }}
      >
        {/* 좌측 브랜드 패널 */}
        <div
          style={{
            flex: 1,
            background: brandGradient,
            padding: 48,
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minWidth: 320,
          }}
          className="login-brand-panel"
        >
          <div>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}
            >
              <img src="/favicon/android-icon-96x96.png" alt="ClassFlow" width={32} height={32} />
            </div>
            <Typography.Title level={2} style={{ color: '#fff', margin: 0, letterSpacing: -0.5 }}>
              ClassFlow
            </Typography.Title>
            <Typography.Paragraph style={{ color: 'rgba(255,255,255,0.85)', marginTop: 12, fontSize: 15, lineHeight: 1.7 }}>
              강사 수업 관리 시스템
              <br />
              오늘 진행한 수업을 간편하게 기록하고,
              <br />
              전체 수업 현황을 한눈에 확인하세요.
            </Typography.Paragraph>
          </div>
          <Typography.Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
            © 2026 ClassFlow. Internal use only.
          </Typography.Text>
        </div>

        {/* 우측 로그인 폼 */}
        <div style={{ flex: 1, background: '#fff', padding: '48px 44px', minWidth: 320 }}>
          <Typography.Title level={3} style={{ marginTop: 0, marginBottom: 4 }}>
            로그인
          </Typography.Title>
          <Typography.Text type="secondary">사내 계정으로 로그인해 주세요.</Typography.Text>

          <Form
            form={form}
            layout="vertical"
            style={{ marginTop: 28 }}
            requiredMark={false}
            onFinish={handleSubmit}
            initialValues={{ login_id: 'admin', password: 'admin1234!' }}
          >
            <Form.Item
              label="아이디"
              name="login_id"
              rules={[{ required: true, message: '아이디를 입력해 주세요.' }]}
            >
              <Input size="large" prefix={<UserOutlined style={{ color: '#bbb' }} />} placeholder="사내 아이디를 입력하세요" />
            </Form.Item>
            <Form.Item
              label="비밀번호"
              name="password"
              rules={[{ required: true, message: '비밀번호를 입력해 주세요.' }]}
            >
              <Input.Password size="large" prefix={<LockOutlined style={{ color: '#bbb' }} />} placeholder="비밀번호를 입력하세요" />
            </Form.Item>
            <Button type="primary" size="large" block htmlType="submit" loading={loading}>
              로그인
            </Button>

            <Divider style={{ fontSize: 12, color: '#bbb', margin: '24px 0 16px' }}>테스트 계정 자동 입력</Divider>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button block onClick={() => handleFillAccount('inst1', 'pass1234!')}>
                강사 (김도윤)
              </Button>
              <Button block onClick={() => handleFillAccount('admin', 'admin1234!')}>
                관리자 (admin)
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
