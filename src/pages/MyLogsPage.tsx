import { useState } from 'react';
import {
  Badge,
  Button,
  Calendar,
  Card,
  Col,
  DatePicker,
  Empty,
  Form,
  Input,
  InputNumber,
  List,
  Row,
  Segmented,
  Select,
  Space,
  Tag,
  TimePicker,
  Typography,
} from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { ClockCircleOutlined, DeleteOutlined, EditOutlined, TeamOutlined } from '@ant-design/icons';
import { courses, currentInstructor, lectureLogs } from '../mock/data';
import PageHeader from '../components/PageHeader';

const { TextArea } = Input;

export default function MyLogsPage() {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const myLogs = lectureLogs
    .filter((log) => log.instructorId === currentInstructor.id)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const MAX_VISIBLE = 2;

  const dateCellRender = (value: Dayjs) => {
    const dayLogs = myLogs.filter((log) => log.date === value.format('YYYY-MM-DD'));
    if (dayLogs.length === 0) return null;
    const visible = dayLogs.slice(0, MAX_VISIBLE);
    const rest = dayLogs.length - visible.length;
    return (
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {visible.map((log) => (
          <li key={log.id} className="mylog-calendar-item">
            <Badge color="#5B5BF6" text={<span style={{ fontSize: 11.5 }}>{log.courseName}</span>} />
          </li>
        ))}
        {rest > 0 && (
          <li className="mylog-calendar-item" style={{ color: '#8c8c9a', fontSize: 11.5 }}>
            +{rest}건 더보기
          </li>
        )}
      </ul>
    );
  };

  return (
    <div>
      <PageHeader title="수업 일지 작성" description="오늘 진행한 수업 내용을 빠르게 기록하세요." />

      <Row gutter={[20, 20]}>
        <Col xs={24} lg={9}>
          <Card
            title="새 수업 일지 등록"
            styles={{ header: { fontWeight: 600 } }}
          >
            <Form layout="vertical" requiredMark={false}>
              <Form.Item label="수업 일자" required>
                <DatePicker defaultValue={dayjs()} style={{ width: '100%' }} size="large" />
              </Form.Item>

              <Form.Item label="과정명" required>
                <Select
                  size="large"
                  placeholder="등록된 과정을 선택하거나 직접 입력하세요"
                  mode="tags"
                  maxCount={1}
                  options={courses.map((c) => ({ value: c.name, label: c.name }))}
                />
              </Form.Item>

              <Form.Item label="수업 시간" required>
                <TimePicker.RangePicker
                  format="HH:mm"
                  size="large"
                  style={{ width: '100%' }}
                  placeholder={['시작 시간', '종료 시간']}
                />
              </Form.Item>

              <Form.Item label="참여 인원" required>
                <InputNumber
                  size="large"
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="0"
                  addonAfter="명"
                />
              </Form.Item>

              <Form.Item label="수업 내용" required>
                <TextArea
                  rows={4}
                  placeholder="당일 진행 진도, 실습 내용, 특이사항을 입력하세요"
                  maxLength={500}
                  showCount
                />
              </Form.Item>

              <Button type="primary" size="large" block>
                일지 등록
              </Button>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={15}>
          <Card
            title={`내 작성 내역 (${myLogs.length})`}
            styles={{ header: { fontWeight: 600 } }}
            extra={
              <Segmented
                value={view}
                onChange={(v) => setView(v as 'list' | 'calendar')}
                options={[
                  { label: '리스트', value: 'list' },
                  { label: '캘린더', value: 'calendar' },
                ]}
              />
            }
          >
            {view === 'list' ? (
              myLogs.length === 0 ? (
                <Empty description="등록된 수업 일지가 없습니다." />
              ) : (
                <List
                  itemLayout="vertical"
                  dataSource={myLogs}
                  renderItem={(log) => (
                    <List.Item
                      key={log.id}
                      style={{
                        background: '#FAFAFD',
                        borderRadius: 12,
                        padding: '14px 16px',
                        marginBottom: 12,
                        border: '1px solid #EFEFF6',
                      }}
                      actions={[
                        <Button key="edit" type="text" size="small" icon={<EditOutlined />}>
                          수정
                        </Button>,
                        <Button key="del" type="text" size="small" danger icon={<DeleteOutlined />}>
                          삭제
                        </Button>,
                      ]}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                        <Space size={8} wrap>
                          <Tag color="blue" style={{ margin: 0 }}>
                            {log.date}
                          </Tag>
                          <Typography.Text strong>{log.courseName}</Typography.Text>
                        </Space>
                        <Space size={14} style={{ color: '#8c8c9a', fontSize: 12.5 }}>
                          <span>
                            <ClockCircleOutlined /> {log.startTime}~{log.endTime} ({log.totalHours}h)
                          </span>
                          <span>
                            <TeamOutlined /> {log.studentCount}명
                          </span>
                        </Space>
                      </div>
                      <Typography.Paragraph style={{ marginTop: 8, marginBottom: 0, fontSize: 13.5 }} ellipsis={{ rows: 2 }}>
                        {log.content}
                      </Typography.Paragraph>
                    </List.Item>
                  )}
                />
              )
            ) : (
              <div className="mylog-calendar">
                <Calendar fullscreen={false} cellRender={(value, info) => (info.type === 'date' ? dateCellRender(value) : info.originNode)} />
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
