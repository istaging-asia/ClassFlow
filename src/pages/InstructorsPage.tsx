import { Avatar, Button, Card, Col, Input, Row, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, PhoneOutlined, SearchOutlined } from '@ant-design/icons';
import { instructors } from '../mock/data';
import PageHeader from '../components/PageHeader';

export default function InstructorsPage({ role }: { role: 'instructor' | 'admin' }) {
  return (
    <div>
      <PageHeader
        title="강사 소개"
        description="내부 구성원들의 강사 프로필을 확인할 수 있습니다."
        extra={
          role === 'admin' ? (
            <Button type="primary" icon={<PlusOutlined />}>
              강사 계정 발급
            </Button>
          ) : undefined
        }
      />

      <Input
        prefix={<SearchOutlined style={{ color: '#bbb' }} />}
        placeholder="강사명, 소속으로 검색"
        style={{ maxWidth: 320, marginBottom: 20 }}
        size="large"
      />

      <Row gutter={[16, 16]}>
        {instructors.map((inst) => (
          <Col xs={24} sm={12} lg={8} key={inst.id}>
            <Card
              hoverable
              style={{ height: '100%' }}
              styles={{ body: { padding: 20 } }}
              actions={
                role === 'admin'
                  ? [
                      <EditOutlined key="edit" />,
                      <DeleteOutlined key="delete" style={{ color: '#F5484A' }} />,
                    ]
                  : undefined
              }
            >
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <Avatar size={56} style={{ background: inst.color, fontSize: 20, fontWeight: 600, flexShrink: 0 }}>
                  {inst.name[0]}
                </Avatar>
                <div style={{ minWidth: 0 }}>
                  <Typography.Title level={5} style={{ margin: 0 }}>
                    {inst.name}
                  </Typography.Title>
                  <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                    {inst.dept}
                  </Typography.Text>
                  <div style={{ marginTop: 4, color: '#8c8c9a', fontSize: 12.5 }}>
                    <PhoneOutlined style={{ marginRight: 6 }} />
                    {inst.phone}
                  </div>
                </div>
              </div>
              <Typography.Paragraph
                type="secondary"
                style={{ marginTop: 14, marginBottom: 0, fontSize: 13.5, minHeight: 44 }}
                ellipsis={{ rows: 2 }}
              >
                {inst.intro}
              </Typography.Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
