import { useEffect, useState, useCallback } from 'react';
import { Avatar, Button, Card, Col, Form, Input, Modal, Popconfirm, Row, Select, Spin, Tag, Typography, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, PhoneOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { usersApi, type InstructorUpdateParams } from '../api/users';
import type { User } from '../types/api';
import PageHeader from '../components/PageHeader';

export default function InstructorsPage({ role }: { role: 'instructor' | 'admin' }) {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // 상세 정보 모달 상태
  const [selectedInst, setSelectedInst] = useState<User | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // 수정 모달 상태
  const [editingInst, setEditingInst] = useState<User | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm] = Form.useForm();
  const [editSubmitting, setEditSubmitting] = useState(false);

  const fetchInstructors = useCallback(async (searchQuery?: string) => {
    setLoading(true);
    try {
      const data = await usersApi.getInstructors(searchQuery);
      setInstructors(data);
    } catch {
      message.error('강사 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInstructors(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchInstructors]);

  // 강사 상세 정보 모달 오픈
  const handleOpenDetail = (inst: User) => {
    setSelectedInst(inst);
    setDetailModalOpen(true);
  };

  // 강사 정보 수정 모달 오픈
  const handleOpenEdit = (inst: User) => {
    setEditingInst(inst);
    editForm.setFieldsValue({
      name: inst.name,
      dept: inst.dept,
      phone: inst.phone,
      intro: inst.intro,
      role: inst.role,
    });
    setEditModalOpen(true);
  };

  // 강사 수정 처리
  const handleUpdate = async (values: InstructorUpdateParams) => {
    if (!editingInst) return;
    setEditSubmitting(true);
    try {
      await usersApi.updateInstructor(editingInst.id, values);
      message.success('강사 정보가 수정되었습니다.');
      setEditModalOpen(false);
      setEditingInst(null);
      await fetchInstructors(search);
    } catch (err: any) {
      const errMsg = err.response?.data?.error?.message || '강사 정보 수정에 실패했습니다.';
      message.error(errMsg);
    } finally {
      setEditSubmitting(false);
    }
  };

  // 강사 계정 삭제 처리
  const handleDelete = async (id: number) => {
    try {
      await usersApi.deleteInstructor(id);
      message.success('강사 계정이 삭제되었습니다.');
      await fetchInstructors(search);
    } catch {
      message.error('강사 계정 삭제에 실패했습니다.');
    }
  };

  return (
    <div>
      <PageHeader
        title="강사 소개"
        description="내부 구성원들의 강사 프로필을 확인할 수 있습니다."
        extra={
          role === 'admin' ? (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/admin/master')}
            >
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
          {instructors.map((inst) => (
            <Col xs={24} sm={12} lg={8} key={inst.id}>
              <Card
                hoverable
                style={{ height: '100%', cursor: 'pointer' }}
                styles={{ body: { padding: 20 } }}
                onClick={() => handleOpenDetail(inst)}
                actions={
                  role === 'admin'
                    ? [
                        <span
                          key="edit"
                          style={{ display: 'inline-block', width: '100%' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEdit(inst);
                          }}
                        >
                          <EditOutlined />
                        </span>,
                        <span
                          key="delete"
                          style={{ display: 'inline-block', width: '100%' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Popconfirm
                            title="강사 계정을 비활성화/삭제하시겠습니까?"
                            onConfirm={() => handleDelete(inst.id)}
                            okText="삭제"
                            cancelText="취소"
                            okButtonProps={{ danger: true }}
                          >
                            <DeleteOutlined style={{ color: '#F5484A' }} />
                          </Popconfirm>
                        </span>,
                      ]
                    : undefined
                }
              >
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <Avatar size={56} style={{ background: inst.color || '#5B5BF6', fontSize: 20, fontWeight: 600, flexShrink: 0 }}>
                    {inst.name[0]}
                  </Avatar>
                  <div style={{ minWidth: 0 }}>
                    <Typography.Title level={5} style={{ margin: 0 }}>
                      {inst.name}
                    </Typography.Title>
                    <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                      {inst.dept || '소속 미지정'}
                    </Typography.Text>
                    <div style={{ marginTop: 4, color: '#8c8c9a', fontSize: 12.5 }}>
                      <PhoneOutlined style={{ marginRight: 6 }} />
                      {inst.phone || '연락처 미등록'}
                    </div>
                  </div>
                </div>
                <Typography.Paragraph
                  type="secondary"
                  style={{
                    marginTop: 14,
                    marginBottom: 0,
                    fontSize: 13.5,
                    minHeight: 44,
                    whiteSpace: 'pre-line',
                    wordBreak: 'break-word',
                  }}
                  ellipsis={{ rows: 2 }}
                >
                  {inst.intro || '등록된 소개글이 없습니다.'}
                </Typography.Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* 강사 상세 정보 모달 */}
      <Modal
        title="강사 상세 정보"
        open={detailModalOpen}
        onCancel={() => {
          setDetailModalOpen(false);
          setSelectedInst(null);
        }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            {role === 'admin' && selectedInst && (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  const target = selectedInst;
                  setDetailModalOpen(false);
                  setSelectedInst(null);
                  handleOpenEdit(target);
                }}
              >
                수정
              </Button>
            )}
            <Button
              onClick={() => {
                setDetailModalOpen(false);
                setSelectedInst(null);
              }}
            >
              닫기
            </Button>
          </div>
        }
        destroyOnClose
      >
        {selectedInst && (
          <div style={{ paddingTop: 8 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
              <Avatar
                size={64}
                style={{
                  background: selectedInst.color || '#5B5BF6',
                  fontSize: 24,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {selectedInst.name[0]}
              </Avatar>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Typography.Title level={4} style={{ margin: 0 }}>
                    {selectedInst.name}
                  </Typography.Title>
                  <Tag color={selectedInst.role === 'ADMIN' ? 'purple' : 'blue'}>
                    {selectedInst.role === 'ADMIN' ? '관리자' : '강사'}
                  </Tag>
                </div>
                <Typography.Text type="secondary" style={{ fontSize: 14, display: 'block', marginTop: 4 }}>
                  {selectedInst.dept || '소속 미지정'}
                </Typography.Text>
                <div style={{ marginTop: 4, color: '#666', fontSize: 13 }}>
                  <PhoneOutlined style={{ marginRight: 6 }} />
                  {selectedInst.phone || '연락처 미등록'}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <Typography.Text strong style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>
                간단 소개글
              </Typography.Text>
              <div
                style={{
                  background: '#F9FAFC',
                  padding: '14px 16px',
                  borderRadius: 8,
                  border: '1px solid #ECEEF4',
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: selectedInst.intro ? '#333' : '#999',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  minHeight: 80,
                }}
              >
                {selectedInst.intro || '등록된 소개글이 없습니다.'}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 강사 정보 수정 모달 */}
      <Modal
        title="강사 정보 수정"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdate} requiredMark={false}>
          <Form.Item label="강사명" name="name" rules={[{ required: true, message: '강사명을 입력하세요.' }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item label="소속 / 직책" name="dept">
            <Input size="large" />
          </Form.Item>
          <Form.Item label="연락처" name="phone">
            <Input size="large" />
          </Form.Item>
          <Form.Item label="간단 소개글" name="intro">
            <Input.TextArea rows={3} maxLength={150} showCount />
          </Form.Item>
          <Form.Item label="권한" name="role">
            <Select size="large" options={[
              { value: 'INSTRUCTOR', label: '강사 (Instructor)' },
              { value: 'ADMIN', label: '관리자 (Admin)' },
            ]} />
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
