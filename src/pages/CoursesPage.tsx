import { useEffect, useState, useCallback } from 'react';
import { Button, Card, Col, Form, Input, Modal, Popconfirm, Row, Spin, Typography, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ReadOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { coursesApi, type CourseUpdateParams } from '../api/courses';
import type { Course } from '../types/api';
import PageHeader from '../components/PageHeader';

export default function CoursesPage({ role }: { role: 'instructor' | 'admin' }) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // 수정 모달 상태
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm] = Form.useForm();
  const [editSubmitting, setEditSubmitting] = useState(false);

  const fetchCourses = useCallback(async (searchQuery?: string) => {
    setLoading(true);
    try {
      const data = await coursesApi.getCourses(searchQuery);
      setCourses(data);
    } catch {
      message.error('과정 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchCourses]);

  const handleOpenEdit = (course: Course) => {
    setEditingCourse(course);
    editForm.setFieldsValue({
      name: course.name,
      description: course.description,
    });
    setEditModalOpen(true);
  };

  const handleUpdate = async (values: CourseUpdateParams) => {
    if (!editingCourse) return;
    setEditSubmitting(true);
    try {
      await coursesApi.updateCourse(editingCourse.id, values);
      message.success('과정 정보가 수정되었습니다.');
      setEditModalOpen(false);
      setEditingCourse(null);
      await fetchCourses(search);
    } catch (err: any) {
      const errMsg = err.response?.data?.error?.message || '과정 정보 수정에 실패했습니다.';
      message.error(errMsg);
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await coursesApi.deleteCourse(id);
      message.success('과정이 삭제되었습니다.');
      await fetchCourses(search);
    } catch {
      message.error('과정 삭제에 실패했습니다.');
    }
  };

  return (
    <div>
      <PageHeader
        title="과정 소개"
        description="개설된 교육 과정 목록입니다. 수업 일지 작성 시 선택할 수 있는 기준 정보입니다."
        extra={
          role === 'admin' ? (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/admin/master')}
            >
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
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        allowClear
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
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
                      background: `linear-gradient(135deg, ${course.color || '#5B5BF6'}CC 0%, ${course.color || '#5B5BF6'} 100%)`,
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
                        <EditOutlined key="edit" onClick={() => handleOpenEdit(course)} />,
                        <Popconfirm
                          key="delete"
                          title="과정을 삭제하시겠습니까?"
                          onConfirm={() => handleDelete(course.id)}
                          okText="삭제"
                          cancelText="취소"
                          okButtonProps={{ danger: true }}
                        >
                          <DeleteOutlined style={{ color: '#F5484A' }} />
                        </Popconfirm>,
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
                  {course.description || '등록된 과정 설명이 없습니다.'}
                </Typography.Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* 과정 정보 수정 모달 */}
      <Modal
        title="교육 과정 수정"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdate} requiredMark={false}>
          <Form.Item label="과정명" name="name" rules={[{ required: true, message: '과정명을 입력하세요.' }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item label="과정 설명" name="description" rules={[{ required: true, message: '과정 설명을 입력하세요.' }]}>
            <Input.TextArea rows={4} maxLength={300} showCount />
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
