import { Button, Card, Col, Input, Row, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ReadOutlined, SearchOutlined } from '@ant-design/icons';
import { courses } from '../mock/data';
import PageHeader from '../components/PageHeader';

export default function CoursesPage({ role }: { role: 'instructor' | 'admin' }) {
  return (
    <div>
      <PageHeader
        title="과정 소개"
        description="개설된 교육 과정 목록입니다. 수업 일지 작성 시 선택할 수 있는 기준 정보입니다."
        extra={
          role === 'admin' ? (
            <Button type="primary" icon={<PlusOutlined />}>
              신규 과정 등록
            </Button>
          ) : undefined
        }
      />

      <Input
        prefix={<SearchOutlined style={{ color: '#bbb' }} />}
        placeholder="과정명으로 검색"
        style={{ maxWidth: 320, marginBottom: 20 }}
        size="large"
      />

      <Row gutter={[16, 16]}>
        {courses.map((course) => (
          <Col xs={24} sm={12} lg={8} key={course.id}>
            <Card
              hoverable
              style={{ height: '100%', overflow: 'hidden' }}
              styles={{ body: { padding: 18 } }}
              cover={
                <div
                  style={{
                    height: 108,
                    background: `linear-gradient(135deg, ${course.color}CC 0%, ${course.color} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ReadOutlined style={{ fontSize: 34, color: 'rgba(255,255,255,0.85)' }} />
                </div>
              }
              actions={
                role === 'admin'
                  ? [
                      <EditOutlined key="edit" />,
                      <DeleteOutlined key="delete" style={{ color: '#F5484A' }} />,
                    ]
                  : undefined
              }
            >
              <Typography.Title level={5} style={{ margin: 0 }}>
                {course.name}
              </Typography.Title>
              <Typography.Paragraph
                type="secondary"
                style={{ marginTop: 8, marginBottom: 0, fontSize: 13.5, minHeight: 40 }}
                ellipsis={{ rows: 2 }}
              >
                {course.description}
              </Typography.Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
