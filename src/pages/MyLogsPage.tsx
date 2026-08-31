import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  Popover,
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
import { courses, currentInstructor, lectureLogs, type LectureLog } from '../mock/data';
import PageHeader from '../components/PageHeader';

const { TextArea } = Input;

const { useBreakpoint } = Grid;

export default function MyLogsPage() {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const myLogs = lectureLogs
    .filter((log) => log.instructorId === currentInstructor.id)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  // 좌측 "새 수업 일지 등록" 카드 높이에 우측 카드 높이를 맞춘다 (데스크톱 레이아웃에서만)
  const formCardRef = useRef<HTMLDivElement>(null);
  const [syncedHeight, setSyncedHeight] = useState<number>();
  const screens = useBreakpoint();

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

  // 스케줄 유무와 무관하게 모든 날짜 칸의 높이가 항상 동일하도록,
  // 남은 세로 공간을 주(week) 행 수로 나눠 픽셀 단위 행 높이를 직접 계산한다.
  // (CSS만으로는 "tbody tr { height: 1% }" 트릭이 빈 칸 행에서 깨지는 경우가 있어 JS로 보정)
  const calendarWrapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const wrap = calendarWrapRef.current;
    if (!wrap) return;

    // 좌측 폼과 높이를 맞추는 데스크톱(lg 이상) 레이아웃이 아니면
    // 칸 높이를 강제로 채우지 않고 CSS 기본값(84px)을 그대로 사용한다.
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
    // 월 이동 시 tbody의 행(tr) 개수(5주/6주)가 바뀌므로 DOM 변화도 감지
    const mutationObserver = new MutationObserver(recompute);
    mutationObserver.observe(wrap, { childList: true, subtree: true });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [view, syncedHeight]);

  const dateCellRender = (value: Dayjs) => {
    const dayLogs = myLogs.filter((log) => log.date === value.format('YYYY-MM-DD'));
    if (dayLogs.length === 0) return null;
    return (
      <div className="mylog-dot-wrap">
        <DayLogMarker date={value.format('YYYY-MM-DD')} logs={dayLogs} />
      </div>
    );
  };

  return (
    <div>
      <PageHeader title="수업 일지 작성" description="오늘 진행한 수업 내용을 빠르게 기록하세요." />

      <Row gutter={[20, 20]}>
        <Col xs={24} lg={9}>
          <Card
            ref={formCardRef}
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
    </div>
  );
}

// 캘린더 날짜 칸의 마킹(점) + 클릭 시 해당 날짜의 일지를 고르는 선택 컨트롤
function DayLogMarker({ date, logs }: { date: string; logs: LectureLog[] }) {
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
                  <Button key="edit" type="text" size="small" icon={<EditOutlined />} onClick={() => setOpen(false)} />,
                  <Button key="del" type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => setOpen(false)} />,
                ]}
              >
                <List.Item.Meta
                  title={<span style={{ fontSize: 13.5 }}>{log.courseName}</span>}
                  description={
                    <Space size={10} style={{ fontSize: 12, color: '#8c8c9a' }}>
                      <span>
                        <ClockCircleOutlined /> {log.startTime}~{log.endTime}
                      </span>
                      <span>
                        <TeamOutlined /> {log.studentCount}명
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
