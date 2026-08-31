import { Avatar, Button, Card, Col, Form, Input, List, Row, Select, Tag, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReadOutlined, UserAddOutlined } from '@ant-design/icons';
import { courses, instructors } from '../mock/data';
import PageHeader from '../components/PageHeader';

const { TextArea } = Input;

export default function AdminMasterPage() {
  return (
    <div>
      <PageHeader title="마스터 관리" description="강사 계정을 발급하고 교육 과정 마스터 데이터를 관리합니다." />

      <Row gutter={[20, 20]}>
        {/* 강사 계정 발급 */}
        <Col xs={24} lg={12}>
          <Card title="강사 계정 발급" styles={{ header: { fontWeight: 600 } }} style={{ marginBottom: 20 }}>
            <Form layout="vertical" requiredMark={false}>
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item label="로그인 아이디" required>
                    <Input size="large" placeholder="아이디 입력" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="초기 비밀번호" required>
                    <Input.Password size="large" placeholder="초기 비밀번호" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item label="강사명" required>
                    <Input size="large" placeholder="이름 입력" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="연락처">
                    <Input size="large" placeholder="010-0000-0000" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="소속 / 직책">
                <Input size="large" placeholder="예: 개발교육팀 / 강사" />
              </Form.Item>
              <Form.Item label="권한">
                <Select size="large" defaultValue="INSTRUCTOR" options={[
                  { value: 'INSTRUCTOR', label: '강사 (Instructor)' },
                  { value: 'ADMIN', label: '관리자 (Admin)' },
                ]} />
              </Form.Item>
              <Button type="primary" size="large" icon={<UserAddOutlined />}>
                계정 발급
              </Button>
            </Form>
          </Card>

          <Card title={`강사 계정 목록 (${instructors.length})`} styles={{ header: { fontWeight: 600 } }}>
            <List
              dataSource={instructors}
              renderItem={(inst) => (
                <List.Item
                  actions={[
                    <Button key="edit" type="text" size="small" icon={<EditOutlined />} />,
                    <Button key="del" type="text" size="small" danger icon={<DeleteOutlined />} />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar style={{ background: inst.color }}>{inst.name[0]}</Avatar>}
                    title={inst.name}
                    description={inst.dept}
                  />
                  <Tag color="blue">INSTRUCTOR</Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 과정 등록 */}
        <Col xs={24} lg={12}>
          <Card title="신규 과정 등록" styles={{ header: { fontWeight: 600 } }} style={{ marginBottom: 20 }}>
            <Form layout="vertical" requiredMark={false}>
              <Form.Item label="과정명" required>
                <Input size="large" placeholder="과정명을 입력하세요" />
              </Form.Item>
              <Form.Item label="대표 썸네일 이미지" extra="선택 사항입니다.">
                <Button icon={<PlusOutlined />} style={{ width: '100%', height: 96, borderStyle: 'dashed' }}>
                  이미지 업로드
                </Button>
              </Form.Item>
              <Form.Item label="과정 설명" required>
                <TextArea rows={3} placeholder="교육 대상 및 핵심 주제를 요약해주세요" maxLength={300} showCount />
              </Form.Item>
              <Button type="primary" size="large" icon={<PlusOutlined />}>
                과정 등록
              </Button>
            </Form>
          </Card>

          <Card title={`등록된 과정 목록 (${courses.length})`} styles={{ header: { fontWeight: 600 } }}>
            <List
              dataSource={courses}
              renderItem={(course) => (
                <List.Item
                  actions={[
                    <Button key="edit" type="text" size="small" icon={<EditOutlined />} />,
                    <Button key="del" type="text" size="small" danger icon={<DeleteOutlined />} />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar shape="square" style={{ background: course.color }} icon={<ReadOutlined />} />
                    }
                    title={course.name}
                    description={
                      <Typography.Text type="secondary" ellipsis style={{ maxWidth: 320, display: 'inline-block' }}>
                        {course.description}
                      </Typography.Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
