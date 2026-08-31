import { Avatar, Button, Card, Col, Form, Input, Row, Typography, Upload } from 'antd';
import { CameraOutlined, SaveOutlined } from '@ant-design/icons';
import { currentInstructor } from '../mock/data';
import PageHeader from '../components/PageHeader';

const { TextArea } = Input;

export default function MyProfilePage() {
  return (
    <div>
      <PageHeader title="내 프로필" description="다른 구성원에게 보여지는 내 프로필 정보를 관리합니다." />

      <Row gutter={[20, 20]}>
        <Col xs={24} md={8}>
          <Card style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Avatar size={104} style={{ background: currentInstructor.color, fontSize: 40, fontWeight: 600 }}>
                {currentInstructor.name[0]}
              </Avatar>
              <Upload showUploadList={false}>
                <Button
                  shape="circle"
                  icon={<CameraOutlined />}
                  style={{ position: 'absolute', right: -4, bottom: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}
                />
              </Upload>
            </div>
            <Typography.Title level={5} style={{ marginTop: 16, marginBottom: 0 }}>
              {currentInstructor.name}
            </Typography.Title>
            <Typography.Text type="secondary">{currentInstructor.dept}</Typography.Text>
            <div style={{ marginTop: 4 }}>
              <Typography.Text type="secondary" style={{ fontSize: 12.5 }}>
                프로필 사진은 JPG, PNG 파일 (5MB 이하)만 업로드 가능합니다.
              </Typography.Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card title="기본 정보" styles={{ header: { fontWeight: 600 } }}>
            <Form layout="vertical" requiredMark={false} initialValues={currentInstructor}>
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
                <Input size="large" />
              </Form.Item>
              <Form.Item label="간단 소개글" name="intro" extra="2~3줄 이내로 간단히 작성해주세요.">
                <TextArea rows={3} maxLength={150} showCount />
              </Form.Item>
              <Button type="primary" size="large" icon={<SaveOutlined />}>
                저장하기
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
