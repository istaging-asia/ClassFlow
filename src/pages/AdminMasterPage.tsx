import { useEffect, useState, useCallback } from 'react';
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  List,
  Modal,
  Popconfirm,
  Row,
  Select,
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
            <Form form={courseForm} layout="vertical" requiredMark={false} onFinish={handleCreateCourse}>
              <Form.Item
                label="과정명"
                name="name"
                rules={[{ required: true, message: '과정명을 입력하세요.' }]}
              >
                <Input size="large" placeholder="과정명을 입력하세요" />
              </Form.Item>
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
          <Form.Item label="과정명" name="name" rules={[{ required: true, message: '과정명을 입력하세요.' }]}>
            <Input size="large" />
          </Form.Item>
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
    </div>
  );
}
