import { useEffect, useState, useCallback } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, InputNumber, Modal, Popconfirm, Row, Select, Space, Table, Tag, TimePicker, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, EditOutlined, FileExcelOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { logsApi, type LogUpdateParams } from '../api/logs';
import { usersApi } from '../api/users';
import { coursesApi } from '../api/courses';
import type { Course, LectureLog, User } from '../types/api';
import PageHeader from '../components/PageHeader';

const { RangePicker } = DatePicker;

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<LectureLog[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // 필터 옵션 데이터
  const [instructors, setInstructors] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  // 필터 상태
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [selectedInstructorId, setSelectedInstructorId] = useState<number | 'all'>('all');
  const [selectedCourseId, setSelectedCourseId] = useState<number | 'all'>('all');

  // 수정 모달 상태
  const [editingLog, setEditingLog] = useState<LectureLog | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm] = Form.useForm();
  const [editSubmitting, setEditSubmitting] = useState(false);

  // 초기 필터 메타데이터 로드
  useEffect(() => {
    usersApi.getInstructors().then(setInstructors).catch(console.error);
    coursesApi.getCourses().then(setCourses).catch(console.error);
  }, []);

  const fetchLogs = useCallback(
    async (currentPage = page, currentSize = pageSize) => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: currentSize,
          start_date: dateRange ? dateRange[0].format('YYYY-MM-DD') : undefined,
          end_date: dateRange ? dateRange[1].format('YYYY-MM-DD') : undefined,
          instructor_id: selectedInstructorId !== 'all' ? selectedInstructorId : undefined,
          course_id: selectedCourseId !== 'all' ? selectedCourseId : undefined,
        };
        const res = await logsApi.adminSearchLogs(params);
        setLogs(res.data);
        setTotalCount(res.pagination.total_count);
      } catch {
        message.error('일지 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, dateRange, selectedInstructorId, selectedCourseId]
  );

  useEffect(() => {
    fetchLogs(page, pageSize);
  }, [fetchLogs, page, pageSize]);

  const handleSearch = () => {
    setPage(1);
    fetchLogs(1, pageSize);
  };

  const handleResetFilter = () => {
    setDateRange(null);
    setSelectedInstructorId('all');
    setSelectedCourseId('all');
    setPage(1);
  };

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const params = {
        start_date: dateRange ? dateRange[0].format('YYYY-MM-DD') : undefined,
        end_date: dateRange ? dateRange[1].format('YYYY-MM-DD') : undefined,
        instructor_id: selectedInstructorId !== 'all' ? selectedInstructorId : undefined,
        course_id: selectedCourseId !== 'all' ? selectedCourseId : undefined,
      };
      await logsApi.exportAdminLogs(params);
      message.success('엑셀(CSV) 파일 다운로드가 완료되었습니다.');
    } catch {
      message.error('엑셀 다운로드에 실패했습니다.');
    } finally {
      setExporting(false);
    }
  };

  const handleOpenEdit = (log: LectureLog) => {
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
      message.success('일지가 수정되었습니다.');
      setEditModalOpen(false);
      setEditingLog(null);
      await fetchLogs(page, pageSize);
    } catch (err: any) {
      const errMsg = err.response?.data?.error?.message || '일지 수정에 실패했습니다.';
      message.error(errMsg);
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await logsApi.deleteLog(id);
      message.success('일지가 삭제되었습니다.');
      await fetchLogs(page, pageSize);
    } catch {
      message.error('일지 삭제에 실패했습니다.');
    }
  };

  const columns: ColumnsType<LectureLog> = [
    { title: '수업 일자', dataIndex: 'date', key: 'date', width: 110, sorter: (a, b) => (a.date < b.date ? -1 : 1) },
    {
      title: '강사명',
      dataIndex: 'instructor_name',
      key: 'instructor_name',
      width: 100,
      render: (v) => <Tag color="blue">{v || '미지정'}</Tag>,
    },
    { title: '과정명', dataIndex: 'course_name', key: 'course_name' },
    {
      title: '수업 시간',
      key: 'time',
      width: 170,
      render: (_, r) => `${r.start_time} ~ ${r.end_time} (총 ${r.total_hours}h)`,
    },
    { title: '참여 인원', dataIndex: 'student_count', key: 'student_count', width: 90, render: (v) => `${v}명`, align: 'center' },
    {
      title: '수업 내용',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (v) => <span style={{ color: '#666' }}>{v}</span>,
    },
    {
      title: '작성 일시',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 140,
      render: (v) => (v ? dayjs(v).format('YYYY-MM-DD HH:mm') : '-'),
    },
    {
      title: '관리',
      key: 'actions',
      width: 90,
      fixed: 'right',
      render: (_, record) => (
        <Space size={4}>
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleOpenEdit(record)} />
          <Popconfirm
            title="일지를 삭제하시겠습니까?"
            onConfirm={() => handleDelete(record.id)}
            okText="삭제"
            cancelText="취소"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
            <RangePicker
              style={{ width: '100%' }}
              size="large"
              value={dateRange}
              onChange={(val) => setDateRange(val as any)}
            />
          </Col>
          <Col xs={12} sm={6} lg={5}>
            <div style={{ marginBottom: 6, fontSize: 12.5, color: '#8c8c9a' }}>강사 선택</div>
            <Select
              size="large"
              style={{ width: '100%' }}
              value={selectedInstructorId}
              onChange={(val) => setSelectedInstructorId(val)}
              options={[{ value: 'all', label: '전체 강사' }, ...instructors.map((i) => ({ value: i.id, label: i.name }))]}
            />
          </Col>
          <Col xs={12} sm={6} lg={5}>
            <div style={{ marginBottom: 6, fontSize: 12.5, color: '#8c8c9a' }}>과정 선택</div>
            <Select
              size="large"
              style={{ width: '100%' }}
              value={selectedCourseId}
              onChange={(val) => setSelectedCourseId(val)}
              options={[{ value: 'all', label: '전체 과정' }, ...courses.map((c) => ({ value: c.id, label: c.name }))]}
            />
          </Col>
          <Col xs={24} sm={24} lg={7}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }} wrap>
              <Button size="large" onClick={handleResetFilter}>
                필터 초기화
              </Button>
              <Button type="primary" size="large" onClick={handleSearch}>
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
            검색 결과 <Tag color="purple" style={{ marginLeft: 6 }}>{totalCount}건</Tag>
          </Typography.Text>
        }
        extra={
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            style={{ background: '#12B886', borderColor: '#12B886' }}
            onClick={handleExportExcel}
            loading={exporting}
          >
            엑셀 다운로드
          </Button>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={logs}
          loading={loading}
          scroll={{ x: 1000 }}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: totalCount,
            onChange: (p, s) => {
              setPage(p);
              setPageSize(s);
            },
            showTotal: (t) => `총 ${t}건`,
          }}
        />
      </Card>

      {/* 관리자 일지 수정 모달 */}
      <Modal
        title="수업 일지 수정 (관리자)"
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
            <Input.TextArea rows={4} maxLength={500} showCount />
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
