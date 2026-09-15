import { useEffect, useState, useCallback } from 'react';
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  List,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Tag,
  Typography,
  message,
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReadOutlined, UserAddOutlined } from '@ant-design/icons';
import { usersApi, type InstructorCreateParams, type InstructorUpdateParams } from '../api/users';
import { coursesApi, type CourseCreateParams, type CourseUpdateParams } from '../api/courses';
import type { Course, User } from '../types/api';
import PageHeader from '../components/PageHeader';

const { TextArea } = Input;

export default function AdminMasterPage() {
  const [instructors, setInstructors] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingInst, setLoadingInst] = useState(false);
  const [loadingCourse, setLoadingCourse] = useState(false);

  const [instForm] = Form.useForm();
  const [courseForm] = Form.useForm();
  const [submittingInst, setSubmittingInst] = useState(false);
  const [submittingCourse, setSubmittingCourse] = useState(false);

  // 강사 수정 모달
  const [editingInst, setEditingInst] = useState<User | null>(null);
  const [editInstModalOpen, setEditInstModalOpen] = useState(false);
  const [editInstForm] = Form.useForm();

  // 과정 수정 모달
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editCourseModalOpen, setEditCourseModalOpen] = useState(false);
  const [editCourseForm] = Form.useForm();

  // 강사 담당 과정 배정 모달
  const [assigningInst, setAssigningInst] = useState<User | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);
  const [assignSearch, setAssignSearch] = useState('');
  const [loadingAssign, setLoadingAssign] = useState(false);

  const fetchInstructors = useCallback(async () => {
    setLoadingInst(true);
    try {
      const data = await usersApi.getInstructors();
      setInstructors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInst(false);
    }
  }, []);

  const fetchCourses = useCallback(async () => {
    setLoadingCourse(true);
    try {
      const data = await coursesApi.getCourses();
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCourse(false);
    }
  }, []);

  useEffect(() => {
    fetchInstructors();
    fetchCourses();
  }, [fetchInstructors, fetchCourses]);

  // 강사 발급 처리
  const handleCreateInstructor = async (values: InstructorCreateParams) => {
    setSubmittingInst(true);
    try {
      await usersApi.createInstructor(values);
      message.success(`강사 계정(${values.login_id})이 발급되었습니다.`);
      instForm.resetFields();
      await fetchInstructors();
    } catch (err: any) {
      const errMsg = err.response?.data?.error?.message || '강사 계정 발급에 실패했습니다.';
      message.error(errMsg);
    } finally {
      setSubmittingInst(false);
    }
  };

  // 과정 등록 처리
  const handleCreateCourse = async (values: CourseCreateParams) => {
    setSubmittingCourse(true);
    try {
      await coursesApi.createCourse(values);
      message.success(`과정(${values.name})이 등록되었습니다.`);
      courseForm.resetFields();
      await fetchCourses();
    } catch (err: any) {
      const errMsg = err.response?.data?.error?.message || '과정 등록에 실패했습니다.';
      message.error(errMsg);
    } finally {
      setSubmittingCourse(false);
    }
  };

  // 강사 수정 처리
  const handleUpdateInstructor = async (values: InstructorUpdateParams) => {
    if (!editingInst) return;
    try {
      await usersApi.updateInstructor(editingInst.id, values);
      message.success('강사 정보가 수정되었습니다.');
      setEditInstModalOpen(false);
      setEditingInst(null);
      await fetchInstructors();
    } catch (err: any) {
      const errMsg = err.response?.data?.error?.message || '수정에 실패했습니다.';
      message.error(errMsg);
    }
  };

  // 과정 수정 처리
  const handleUpdateCourse = async (values: CourseUpdateParams) => {
    if (!editingCourse) return;
    try {
      await coursesApi.updateCourse(editingCourse.id, values);
      message.success('과정 정보가 수정되었습니다.');
      setEditCourseModalOpen(false);
      setEditingCourse(null);
      await fetchCourses();
    } catch (err: any) {
      const errMsg = err.response?.data?.error?.message || '수정에 실패했습니다.';
      message.error(errMsg);
    }
  };

  // 강사 삭제 처리
  const handleDeleteInstructor = async (id: number) => {
    try {
      await usersApi.deleteInstructor(id);
      message.success('강사 계정이 삭제되었습니다.');
      await fetchInstructors();
    } catch {
      message.error('삭제에 실패했습니다.');
    }
  };

  // 과정 삭제 처리
  const handleDeleteCourse = async (id: number) => {
    try {
      await coursesApi.deleteCourse(id);
      message.success('과정이 삭제되었습니다.');
      await fetchCourses();
    } catch {
      message.error('삭제에 실패했습니다.');
    }
  };

  // 과정 배정 click 시 모달 열기 => 특정 강사에게 할당된 과정 목록 조회 -> 체크 상태 구성
  const openAssignModal = async (inst: User) => {
    console.log('강사 정보 : ', inst);
    // assigningInst: 지금 배정 중인 강사 (저장 시 instructor_id, 모달 제목용)
    setAssigningInst(inst);
    // assignSearch: 모달 안 과정명 검색어 초기화 (프론트 필터용, API 무관)
    setAssignSearch('');
    // selectedCourseIds: 조회 전 체크 상태를 비워 이전 강사 선택값 잔존 방지
    setSelectedCourseIds([]);
    // assignModalOpen: 배정 모달 열기
    setAssignModalOpen(true);
    // loadingAssign: 배정 목록 조회 중 로딩 표시
    setLoadingAssign(true);
    try {
      // API GET getInstructorCourses: 해당 강사에게 이미 배정된 과정 목록 조회
      const assigned = await coursesApi.getInstructorCourses(inst.id);
      console.log('특정 강사에게 할당된 과정 목록 : ', assigned);
      // selectedCourseIds: 조회된 과정 id로 체크박스 초기 선택 구성
      setSelectedCourseIds(assigned.map((c) => c.id));
    } catch (err) {
      console.error('특정 강사에게 할당된 과정 목록 조회 실패 : ', err);
      // selectedCourseIds: 조회 실패 시 빈 선택으로 모달만 유지
      setSelectedCourseIds([]);
    } finally {
      // loadingAssign: 조회 종료 후 로딩 해제
      setLoadingAssign(false);
    }
  };

  // 과정 배정 저장 처리
  const handleSaveAssign = async () => {
    // assigningInst: 배정 대상 강사가 없으면 저장하지 않음
    console.log('배정 대상 강사 : ', assigningInst);
    console.log('체크된 과정 id 목록 : ', selectedCourseIds);
    if (!assigningInst) return;
    try {
      // API PUT assignInstructorCourses: 체크된 과정 id 배열을 해당 강사 배정으로 저장
      // assigningInst.id → instructor_id, selectedCourseIds → course_ids
      await coursesApi.assignInstructorCourses(
        assigningInst.id,
        selectedCourseIds,
      );
      message.success('과정 배정이 저장되었습니다.');
    } catch (err) {
      console.error('과정 배정 저장 실패 : ', err);
      message.error('과정 배정 저장에 실패했습니다.');
    }
    // assignModalOpen / assigningInst: 저장 시도 후 모달 닫고 배정 대상 초기화
    setAssignModalOpen(false);
    setAssigningInst(null);
  };

  // assignSearch + courses(전체 과정): 검색어로 모달 체크박스 목록만 프론트 필터
  const filteredAssignCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(assignSearch.trim().toLowerCase()),
  );

  return (
    <div>
      <PageHeader title="마스터 관리" description="강사 계정을 발급하고 교육 과정 마스터 데이터를 관리합니다." />

      <Row gutter={[20, 20]}>
        {/* 강사 계정 발급 */}
        <Col xs={24} lg={12}>
          <Card title="강사 계정 발급" styles={{ header: { fontWeight: 600 } }} style={{ marginBottom: 20 }}>
            <Form
              form={instForm}
              layout="vertical"
              requiredMark={false}
              onFinish={handleCreateInstructor}
              initialValues={{ role: 'INSTRUCTOR' }}
            >
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item
                    label="로그인 아이디"
                    name="login_id"
                    rules={[{ required: true, message: '아이디를 입력하세요.' }]}
                  >
                    <Input size="large" placeholder="아이디 입력" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="초기 비밀번호"
                    name="password"
                    rules={[{ required: true, message: '비밀번호를 입력하세요.' }]}
                  >
                    <Input.Password size="large" placeholder="초기 비밀번호" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item
                    label="강사명"
                    name="name"
                    rules={[{ required: true, message: '이름을 입력하세요.' }]}
                  >
                    <Input size="large" placeholder="이름 입력" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="연락처" name="phone">
                    <Input size="large" placeholder="010-0000-0000" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="소속 / 직책" name="dept">
                <Input size="large" placeholder="예: 개발교육팀 / 강사" />
              </Form.Item>
              <Form.Item label="권한" name="role">
                <Select
                  size="large"
                  options={[
                    { value: 'INSTRUCTOR', label: '강사 (Instructor)' },
                    { value: 'ADMIN', label: '관리자 (Admin)' },
                  ]}
                />
              </Form.Item>
              <Button type="primary" size="large" icon={<UserAddOutlined />} htmlType="submit" loading={submittingInst}>
                계정 발급
              </Button>
            </Form>
          </Card>

          <Card
            title={`강사 계정 목록 (${instructors.length})`}
            styles={{ header: { fontWeight: 600 } }}
            loading={loadingInst}
          >
            <List
              dataSource={instructors}
              renderItem={(inst) => (
                <List.Item
                  actions={[
                    <Button
                      key="assign"
                      type="text"
                      size="small"
                      icon={<ReadOutlined />}
                      onClick={() => openAssignModal(inst)}
                    >
                      과정 배정
                    </Button>,
                    <Button
                      key="edit"
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setEditingInst(inst);
                        editInstForm.setFieldsValue({
                          name: inst.name,
                          dept: inst.dept,
                          phone: inst.phone,
                          role: inst.role,
                        });
                        setEditInstModalOpen(true);
                      }}
                    />,
                    <Popconfirm
                      key="del"
                      title="강사 계정을 삭제하시겠습니까?"
                      onConfirm={() => handleDeleteInstructor(inst.id)}
                      okText="삭제"
                      cancelText="취소"
                      okButtonProps={{ danger: true }}
                    >
                      <Button key="del" type="text" size="small" danger icon={<DeleteOutlined />} />
                    </Popconfirm>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar style={{ background: inst.color || '#5B5BF6' }}>{inst.name[0]}</Avatar>}
                    title={inst.name}
                    description={inst.dept || inst.login_id}
                  />
                  <Tag color={inst.role === 'ADMIN' ? 'purple' : 'blue'}>{inst.role}</Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 과정 등록 */}
        <Col xs={24} lg={12}>
          <Card title="신규 과정 등록" styles={{ header: { fontWeight: 600 } }} style={{ marginBottom: 20 }}>
            <Form form={courseForm} layout="vertical" requiredMark={false} onFinish={handleCreateCourse} initialValues={{ student_count: 20 }}>
              <Row gutter={12}>
                <Col span={16}>
                  <Form.Item
                    label="과정명"
                    name="name"
                    rules={[{ required: true, message: '과정명을 입력하세요.' }]}
                  >
                    <Input size="large" placeholder="과정명을 입력하세요" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="과정 인원"
                    name="student_count"
                    rules={[{ required: true, message: '인원을 입력하세요.' }]}
                  >
                    <InputNumber size="large" min={0} style={{ width: '100%' }} placeholder="20" addonAfter="명" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                label="과정 설명"
                name="description"
                rules={[{ required: true, message: '과정 설명을 입력하세요.' }]}
              >
                <TextArea rows={3} placeholder="교육 대상 및 핵심 주제를 요약해주세요" maxLength={300} showCount />
              </Form.Item>
              <Button type="primary" size="large" icon={<PlusOutlined />} htmlType="submit" loading={submittingCourse}>
                과정 등록
              </Button>
            </Form>
          </Card>

          <Card
            title={`등록된 과정 목록 (${courses.length})`}
            styles={{ header: { fontWeight: 600 } }}
            loading={loadingCourse}
          >
            <List
              dataSource={courses}
              renderItem={(course) => (
                <List.Item
                  actions={[
                    <Button
                      key="edit"
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setEditingCourse(course);
                        editCourseForm.setFieldsValue({
                          name: course.name,
                          description: course.description,
                          student_count: course.student_count ?? 0,
                        });
                        setEditCourseModalOpen(true);
                      }}
                    />,
                    <Popconfirm
                      key="del"
                      title="과정을 삭제하시겠습니까?"
                      onConfirm={() => handleDeleteCourse(course.id)}
                      okText="삭제"
                      cancelText="취소"
                      okButtonProps={{ danger: true }}
                    >
                      <Button key="del" type="text" size="small" danger icon={<DeleteOutlined />} />
                    </Popconfirm>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        shape="square"
                        style={{ background: course.color || '#5B5BF6' }}
                        icon={<ReadOutlined />}
                      />
                    }
                    title={course.name}
                    description={
                      <Typography.Text type="secondary" ellipsis style={{ maxWidth: 320, display: 'inline-block' }}>
                        {course.description}
                      </Typography.Text>
                    }
                  />
                  <Tag color="blue">{course.student_count ?? 0}명</Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 강사 수정 모달 */}
      <Modal
        title="강사 계정 수정"
        open={editInstModalOpen}
        onCancel={() => setEditInstModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={editInstForm} layout="vertical" onFinish={handleUpdateInstructor} requiredMark={false}>
          <Form.Item label="강사명" name="name" rules={[{ required: true, message: '이름을 입력하세요.' }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item label="소속 / 직책" name="dept">
            <Input size="large" />
          </Form.Item>
          <Form.Item label="연락처" name="phone">
            <Input size="large" />
          </Form.Item>
          <Form.Item label="권한" name="role">
            <Select
              size="large"
              options={[
                { value: 'INSTRUCTOR', label: '강사 (Instructor)' },
                { value: 'ADMIN', label: '관리자 (Admin)' },
              ]}
            />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
            <Button onClick={() => setEditInstModalOpen(false)}>취소</Button>
            <Button type="primary" htmlType="submit">
              수정 저장
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 과정 수정 모달 */}
      <Modal
        title="교육 과정 수정"
        open={editCourseModalOpen}
        onCancel={() => setEditCourseModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={editCourseForm} layout="vertical" onFinish={handleUpdateCourse} requiredMark={false}>
          <Row gutter={12}>
            <Col span={16}>
              <Form.Item label="과정명" name="name" rules={[{ required: true, message: '과정명을 입력하세요.' }]}>
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="과정 인원" name="student_count" rules={[{ required: true, message: '인원을 입력하세요.' }]}>
                <InputNumber size="large" min={0} style={{ width: '100%' }} addonAfter="명" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="과정 설명" name="description" rules={[{ required: true, message: '과정 설명을 입력하세요.' }]}>
            <TextArea rows={4} maxLength={300} showCount />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
            <Button onClick={() => setEditCourseModalOpen(false)}>취소</Button>
            <Button type="primary" htmlType="submit">
              수정 저장
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 강사 담당 과정 배정 모달 */}
      <Modal
        title={
          assigningInst
            ? `${assigningInst.name} · 담당 과정 배정`
            : '담당 과정 배정'
        }
        open={assignModalOpen}
        onCancel={() => {
          setAssignModalOpen(false);
          setAssigningInst(null);
        }}
        onOk={handleSaveAssign}
        okText={`저장 (${selectedCourseIds.length}개)`}
        destroyOnClose
      >
        <Typography.Paragraph type="secondary" style={{ marginBottom: 12 }}>
          선택한 과정만 해당 강사의 수업 일지 작성 화면에서 과정명으로
          나타납니다.
        </Typography.Paragraph>
        <Input
          allowClear
          placeholder="과정명 검색"
          value={assignSearch}
          onChange={(e) => setAssignSearch(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <div style={{ maxHeight: 360, overflowY: 'auto' }}>
          {loadingAssign ? (
            <Typography.Text type="secondary">불러오는 중…</Typography.Text>
          ) : filteredAssignCourses.length === 0 ? (
            <Typography.Text type="secondary">
              배정할 과정이 없습니다.
            </Typography.Text>
          ) : (
            <Space direction="vertical" style={{ width: '100%' }} size={8}>
              {filteredAssignCourses.map((course) => (
                <Checkbox
                  key={course.id}
                  checked={selectedCourseIds.includes(course.id)}
                  onChange={(e) => {
                    setSelectedCourseIds((prev) =>
                      e.target.checked
                        ? [...prev, course.id]
                        : prev.filter((id) => id !== course.id),
                    );
                  }}
                >
                  <span>{course.name}</span>
                  <Typography.Text
                    type="secondary"
                    style={{ marginLeft: 8, fontSize: 12 }}
                  >
                    {course.student_count ?? 0}명
                  </Typography.Text>
                </Checkbox>
              ))}
            </Space>
          )}
        </div>
      </Modal>
    </div>
  );
}
