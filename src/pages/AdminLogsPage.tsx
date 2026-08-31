import { Button, Card, Col, DatePicker, Row, Select, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, EditOutlined, FileExcelOutlined } from '@ant-design/icons';
import { courses, instructors, lectureLogs, type LectureLog } from '../mock/data';
import PageHeader from '../components/PageHeader';

const { RangePicker } = DatePicker;

const columns: ColumnsType<LectureLog> = [
  { title: '수업 일자', dataIndex: 'date', key: 'date', width: 110, sorter: (a, b) => (a.date < b.date ? -1 : 1) },
  {
    title: '강사명',
    dataIndex: 'instructorName',
    key: 'instructorName',
    width: 100,
    render: (v) => <Tag color="blue">{v}</Tag>,
  },
  { title: '과정명', dataIndex: 'courseName', key: 'courseName' },
  {
    title: '수업 시간',
    key: 'time',
    width: 170,
    render: (_, r) => `${r.startTime} ~ ${r.endTime} (총 ${r.totalHours}h)`,
  },
  { title: '참여 인원', dataIndex: 'studentCount', key: 'studentCount', width: 90, render: (v) => `${v}명`, align: 'center' },
  {
    title: '수업 내용',
    dataIndex: 'content',
    key: 'content',
    ellipsis: true,
    render: (v) => <span style={{ color: '#666' }}>{v}</span>,
  },
  { title: '작성 일시', dataIndex: 'createdAt', key: 'createdAt', width: 140 },
  {
    title: '관리',
    key: 'actions',
    width: 90,
    fixed: 'right',
    render: () => (
      <Space size={4}>
        <Button type="text" size="small" icon={<EditOutlined />} />
        <Button type="text" size="small" danger icon={<DeleteOutlined />} />
      </Space>
    ),
  },
];

export default function AdminLogsPage() {
  return (
    <div>
      <PageHeader
        title="전체 일지 관리"
        description="전 강사의 수업 일지를 통합 조회하고, 조건에 맞는 데이터를 엑셀로 추출할 수 있습니다."
      />

      <Card style={{ marginBottom: 20 }} styles={{ body: { padding: '18px 20px' } }}>
        <Row gutter={[12, 12]} align="bottom">
          <Col xs={24} sm={12} lg={7}>
            <div style={{ marginBottom: 6, fontSize: 12.5, color: '#8c8c9a' }}>기간 선택</div>
            <RangePicker style={{ width: '100%' }} size="large" />
          </Col>
          <Col xs={12} sm={6} lg={5}>
            <div style={{ marginBottom: 6, fontSize: 12.5, color: '#8c8c9a' }}>강사 선택</div>
            <Select
              size="large"
              style={{ width: '100%' }}
              defaultValue="all"
              options={[{ value: 'all', label: '전체 강사' }, ...instructors.map((i) => ({ value: i.id, label: i.name }))]}
            />
          </Col>
          <Col xs={12} sm={6} lg={5}>
            <div style={{ marginBottom: 6, fontSize: 12.5, color: '#8c8c9a' }}>과정 선택</div>
            <Select
              size="large"
              style={{ width: '100%' }}
              defaultValue="all"
              options={[{ value: 'all', label: '전체 과정' }, ...courses.map((c) => ({ value: c.id, label: c.name }))]}
            />
          </Col>
          <Col xs={24} sm={24} lg={7}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }} wrap>
              <Button size="large">필터 초기화</Button>
              <Button type="primary" size="large">
                검색
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card
        styles={{ body: { padding: 0 } }}
        title={
          <Typography.Text style={{ fontWeight: 600 }}>
            검색 결과 <Tag color="purple" style={{ marginLeft: 6 }}>{lectureLogs.length}건</Tag>
          </Typography.Text>
        }
        extra={
          <Button type="primary" icon={<FileExcelOutlined />} style={{ background: '#12B886', borderColor: '#12B886' }}>
            엑셀 다운로드
          </Button>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={lectureLogs}
          scroll={{ x: 1000 }}
          pagination={{ pageSize: 10, showTotal: (t) => `총 ${t}건` }}
        />
      </Card>
    </div>
  );
}
