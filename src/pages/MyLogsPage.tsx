import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import {
  Button,
  Calendar,
  Card,
  Col,
  DatePicker,
  Empty,
  Form,
  Grid,
  Input,
  InputNumber,
  List,
  Modal,
  Popconfirm,
  Popover,
  Row,
  Segmented,
  Select,
  Space,
  Spin,
  Tag,
  TimePicker,
  Typography,
  message,
} from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { ClockCircleOutlined, DeleteOutlined, EditOutlined, TeamOutlined } from '@ant-design/icons';
import { logsApi, type LogCreateParams, type LogUpdateParams } from '../api/logs';
import { coursesApi } from '../api/courses';
import type { Course, LectureLog } from '../types/api';
import PageHeader from '../components/PageHeader';

const { TextArea } = Input;
const { useBreakpoint } = Grid;

export default function MyLogsPage() {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [logs, setLogs] = useState<LectureLog[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 수정 모달 상태
  const [editingLog, setEditingLog] = useState<LectureLog | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm] = Form.useForm();
  const [editSubmitting, setEditSubmitting] = useState(false);

  const [createForm] = Form.useForm();

  // 좌측 "새 수업 일지 등록" 카드 높이에 우측 카드 높이를 맞춘다 (데스크톱 레이아웃)
  const formCardRef = useRef<HTMLDivElement>(null);
  const [syncedHeight, setSyncedHeight] = useState<number>();
  const screens = useBreakpoint();

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await logsApi.getMyLogs();
      setLogs(data);
    } catch (err: any) {
      message.error('수업 일지 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCourses = useCallback(async () => {
    try {
      const data = await coursesApi.getCourses();
      setCourses(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    fetchCourses();
  }, [fetchLogs, fetchCourses]);

  useEffect(() => {
    const el = formCardRef.current;
    if (!el || !screens.lg) {
      setSyncedHeight(undefined);
      return;
    }
    const update = () => setSyncedHeight(el.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [screens.lg]);

  const calendarWrapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const wrap = calendarWrapRef.current;
    if (!wrap) return;

    if (view !== 'calendar' || !syncedHeight) {
      wrap.style.removeProperty('--mylog-row-h');
      return;
    }

    const recompute = () => {
      const body = wrap.querySelector<HTMLElement>('.ant-picker-body');
      const thead = wrap.querySelector<HTMLElement>('thead');
      const rows = wrap.querySelectorAll<HTMLElement>('tbody tr');
      if (!body || !thead || rows.length === 0) return;
      const rowHeight = Math.floor((body.clientHeight - thead.clientHeight) / rows.length);
      wrap.style.setProperty('--mylog-row-h', `${rowHeight}px`);
    };

    recompute();
    const resizeObserver = new ResizeObserver(recompute);
    resizeObserver.observe(wrap);
    const mutationObserver = new MutationObserver(recompute);
    mutationObserver.observe(wrap, { childList: true, subtree: true });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [view, syncedHeight]);

  // 일지 등록 처리
  const handleCreate = async (values: any) => {
    const [startTime, endTime] = values.time;
    const courseValue = Array.isArray(values.course_name) ? values.course_name[0] : values.course_name;
    const matchedCourse = courses.find((c) => c.name === courseValue);

    const payload: LogCreateParams = {
      date: values.date.format('YYYY-MM-DD'),
      course_id: matchedCourse ? matchedCourse.id : null,
      course_name: courseValue,
      start_time: startTime.format('HH:mm'),
      end_time: endTime.format('HH:mm'),
      student_count: values.student_count || 0,
      content: values.content,
    };

    setSubmitting(true);
    try {
      await logsApi.createLog(payload);
      message.success('수업 일지가 성공적으로 등록되었습니다.');
      createForm.resetFields();
      createForm.setFieldsValue({ date: dayjs() });
      await fetchLogs();
    } catch (err: any) {
      const errMsg = err.response?.data?.error?.message || '일지 등록에 실패했습니다.';
      message.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // 일지 수정 모달 열기
  const handleOpenEditModal = (log: LectureLog) => {
    setEditingLog(log);
    editForm.setFieldsValue({
      date: dayjs(log.date),
      course_name: [log.course_name],
      time: [dayjs(log.start_time, 'HH:mm'), dayjs(log.end_time, 'HH:mm')],
      student_count: log.student_count,
      content: log.content,
    });
    setEditModalOpen(true);
  };

  // 일지 수정 처리
  const handleUpdate = async (values: any) => {
    if (!editingLog) return;
    const [startTime, endTime] = values.time;
    const courseValue = Array.isArray(values.course_name) ? values.course_name[0] : values.course_name;
    const matchedCourse = courses.find((c) => c.name === courseValue);

    const payload: LogUpdateParams = {
      date: values.date.format('YYYY-MM-DD'),
      course_id: matchedCourse ? matchedCourse.id : null,
      course_name: courseValue,
      start_time: startTime.format('HH:mm'),
      end_time: endTime.format('HH:mm'),
      student_count: values.student_count || 0,
      content: values.content,
    };

    setEditSubmitting(true);
    try {
      await logsApi.updateLog(editingLog.id, payload);
      message.success('수업 일지가 수정되었습니다.');
      setEditModalOpen(false);
      setEditingLog(null);
      await fetchLogs();
    } catch (err: any) {
      const errMsg = err.response?.data?.error?.message || '일지 수정에 실패했습니다.';
      message.error(errMsg);
    } finally {
      setEditSubmitting(false);
    }
  };

  // 일지 삭제 처리
  const handleDelete = async (id: number) => {
    try {
      await logsApi.deleteLog(id);
      message.success('수업 일지가 삭제되었습니다.');
      await fetchLogs();
    } catch {
      message.error('일지 삭제에 실패했습니다.');
    }
  };

  const dateCellRender = (value: Dayjs) => {
    const formatted = value.format('YYYY-MM-DD');
    const dayLogs = logs.filter((log) => log.date === formatted);
    if (dayLogs.length === 0) return null;
    return (
      <div className="mylog-dot-wrap">
        <DayLogMarker
          date={formatted}
          logs={dayLogs}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      </div>
    );
  };

  return (
    <div>
      <PageHeader title="수업 일지 작성" description="오늘 진행한 수업 내용을 빠르게 기록하세요." />

      <Row gutter={[20, 20]}>
        {/* 좌측: 일지 등록 폼 */}
        <Col xs={24} lg={9}>
          <Card ref={formCardRef} title="새 수업 일지 등록" styles={{ header: { fontWeight: 600 } }}>
            <Form
              form={createForm}
              layout="vertical"
              requiredMark={false}
              onFinish={handleCreate}
              initialValues={{ date: dayjs() }}
            >
              <Form.Item label="수업 일자" name="date" rules={[{ required: true, message: '일자를 선택하세요.' }]}>
                <DatePicker style={{ width: '100%' }} size="large" />
              </Form.Item>

              <Form.Item label="과정명" name="course_name" rules={[{ required: true, message: '과정명을 입력하세요.' }]}>
                <Select
                  size="large"
                  placeholder="등록된 과정을 선택하거나 직접 입력하세요"
                  mode="tags"
                  maxCount={1}
                  options={courses.map((c) => ({ value: c.name, label: c.name }))}
                />
              </Form.Item>

              <Form.Item label="수업 시간" name="time" rules={[{ required: true, message: '시간을 선택하세요.' }]}>
                <TimePicker.RangePicker
                  format="HH:mm"
                  size="large"
                  style={{ width: '100%' }}
                  placeholder={['시작 시간', '종료 시간']}
                />
              </Form.Item>

              <Form.Item label="참여 인원" name="student_count" rules={[{ required: true, message: '인원을 입력하세요.' }]}>
                <InputNumber size="large" min={0} style={{ width: '100%' }} placeholder="0" addonAfter="명" />
              </Form.Item>

              <Form.Item label="수업 내용" name="content" rules={[{ required: true, message: '수업 내용을 입력하세요.' }]}>
                <TextArea rows={4} placeholder="당일 진행 진도, 실습 내용, 특이사항을 입력하세요" maxLength={500} showCount />
              </Form.Item>

              <Button type="primary" size="large" block htmlType="submit" loading={submitting}>
                일지 등록
              </Button>
            </Form>
          </Card>
        </Col>

        {/* 우측: 내 일지 목록 / 캘린더 */}
        <Col xs={24} lg={15}>
          <Card
            title={`내 작성 내역 (${logs.length})`}
            styles={{
              header: { fontWeight: 600, flex: '0 0 auto' },
              body: { flex: '1 1 auto', overflow: 'auto', minHeight: 0 },
            }}
            style={syncedHeight ? { height: syncedHeight, display: 'flex', flexDirection: 'column' } : undefined}
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
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin />
              </div>
            ) : view === 'list' ? (
              logs.length === 0 ? (
                <Empty description="등록된 수업 일지가 없습니다." />
              ) : (
                <List
                  itemLayout="vertical"
                  dataSource={logs}
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
                        <Button
                          key="edit"
                          type="text"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => handleOpenEditModal(log)}
                        >
                          수정
                        </Button>,
                        <Popconfirm
                          key="del"
                          title="일지를 삭제하시겠습니까?"
                          onConfirm={() => handleDelete(log.id)}
                          okText="삭제"
                          cancelText="취소"
                          okButtonProps={{ danger: true }}
                        >
                          <Button type="text" size="small" danger icon={<DeleteOutlined />}>
                            삭제
                          </Button>
                        </Popconfirm>,
                      ]}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                        <Space size={8} wrap>
                          <Tag color="blue" style={{ margin: 0 }}>
                            {log.date}
                          </Tag>
                          <Typography.Text strong>{log.course_name}</Typography.Text>
                        </Space>
                        <Space size={14} style={{ color: '#8c8c9a', fontSize: 12.5 }}>
                          <span>
                            <ClockCircleOutlined /> {log.start_time}~{log.end_time} ({log.total_hours}h)
                          </span>
                          <span>
                            <TeamOutlined /> {log.student_count}명
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
              <div
                className={`mylog-calendar${syncedHeight ? ' mylog-calendar--synced' : ''}`}
                ref={calendarWrapRef}
                style={syncedHeight ? { height: '100%' } : undefined}
              >
                <Calendar fullscreen={false} cellRender={(value, info) => (info.type === 'date' ? dateCellRender(value) : info.originNode)} />
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 일지 수정 모달 */}
      <Modal
        title="수업 일지 수정"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdate} requiredMark={false}>
          <Form.Item label="수업 일자" name="date" rules={[{ required: true, message: '일자를 선택하세요.' }]}>
            <DatePicker style={{ width: '100%' }} size="large" />
          </Form.Item>

          <Form.Item label="과정명" name="course_name" rules={[{ required: true, message: '과정명을 입력하세요.' }]}>
            <Select
              size="large"
              placeholder="과정 선택 또는 직접 입력"
              mode="tags"
              maxCount={1}
              options={courses.map((c) => ({ value: c.name, label: c.name }))}
            />
          </Form.Item>

          <Form.Item label="수업 시간" name="time" rules={[{ required: true, message: '시간을 선택하세요.' }]}>
            <TimePicker.RangePicker format="HH:mm" size="large" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="참여 인원" name="student_count" rules={[{ required: true, message: '인원을 입력하세요.' }]}>
            <InputNumber size="large" min={0} style={{ width: '100%' }} addonAfter="명" />
          </Form.Item>

          <Form.Item label="수업 내용" name="content" rules={[{ required: true, message: '수업 내용을 입력하세요.' }]}>
            <TextArea rows={4} maxLength={500} showCount />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
            <Button onClick={() => setEditModalOpen(false)}>취소</Button>
            <Button type="primary" htmlType="submit" loading={editSubmitting}>
              수정 저장
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

function DayLogMarker({
  date,
  logs,
  onEdit,
  onDelete,
}: {
  date: string;
  logs: LectureLog[];
  onEdit: (log: LectureLog) => void;
  onDelete: (id: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const isMulti = logs.length > 1;

  return (
    <Popover
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottom"
      title={
        <Space size={8}>
          <span>{date}</span>
          <Tag color={isMulti ? 'orange' : 'blue'} style={{ margin: 0 }}>
            {logs.length}건
          </Tag>
        </Space>
      }
      content={
        <div style={{ width: 268 }}>
          {isMulti && (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              수정 또는 삭제할 일지를 선택하세요.
            </Typography.Text>
          )}
          <List
            size="small"
            dataSource={logs}
            split={logs.length > 1}
            renderItem={(log) => (
              <List.Item
                style={{ padding: '10px 0' }}
                actions={[
                  <Button
                    key="edit"
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setOpen(false);
                      onEdit(log);
                    }}
                  />,
                  <Popconfirm
                    key="del"
                    title="이 일지를 삭제하시겠습니까?"
                    onConfirm={() => {
                      setOpen(false);
                      onDelete(log.id);
                    }}
                    okText="삭제"
                    cancelText="취소"
                    okButtonProps={{ danger: true }}
                  >
                    <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  title={<span style={{ fontSize: 13.5 }}>{log.course_name}</span>}
                  description={
                    <Space size={10} style={{ fontSize: 12, color: '#8c8c9a' }}>
                      <span>
                        <ClockCircleOutlined /> {log.start_time}~{log.end_time}
                      </span>
                      <span>
                        <TeamOutlined /> {log.student_count}명
                      </span>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      }
    >
      <span
        className={`mylog-dot ${isMulti ? 'mylog-dot-multi' : 'mylog-dot-single'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {isMulti ? logs.length : ''}
      </span>
    </Popover>
  );
}
