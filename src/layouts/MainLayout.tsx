import { Layout, Menu, Avatar, Dropdown, Typography, Tag, Grid } from 'antd';
import type { MenuProps } from 'antd';
import {
  TeamOutlined,
  ReadOutlined,
  FormOutlined,
  UserOutlined,
  UnorderedListOutlined,
  SettingOutlined,
  LogoutOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { currentInstructor } from '../mock/data';

const { Header, Content } = Layout;
const { useBreakpoint } = Grid;

type Role = 'instructor' | 'admin';

const instructorMenuItems: MenuProps['items'] = [
  { key: '/instructor/logs', icon: <FormOutlined />, label: '수업 일지 작성' },
  { key: '/instructor/instructors', icon: <TeamOutlined />, label: '강사 소개' },
  { key: '/instructor/courses', icon: <ReadOutlined />, label: '과정 소개' },
  { key: '/instructor/profile', icon: <UserOutlined />, label: '내 프로필' },
];

const adminMenuItems: MenuProps['items'] = [
  { key: '/admin/logs', icon: <UnorderedListOutlined />, label: '전체 일지 관리' },
  { key: '/admin/instructors', icon: <TeamOutlined />, label: '강사 소개' },
  { key: '/admin/courses', icon: <ReadOutlined />, label: '과정 소개' },
  { key: '/admin/master', icon: <SettingOutlined />, label: '마스터 관리' },
];

export default function MainLayout({ role }: { role: Role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const items = role === 'admin' ? adminMenuItems : instructorMenuItems;

  const selectedKey =
    items?.map((i) => i!.key as string).find((key) => location.pathname.startsWith(key)) ??
    (items?.[0]!.key as string);

  const userMenu: MenuProps['items'] = [
    { key: 'logout', icon: <LogoutOutlined />, label: '로그아웃' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #EEEEF3',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          gap: 24,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            flexShrink: 0,
          }}
          onClick={() => navigate(role === 'admin' ? '/admin/logs' : '/instructor/logs')}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #6C6CF9 0%, #4C4CE0 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            C
          </div>
          {screens.sm && (
            <Typography.Title level={5} style={{ margin: 0, letterSpacing: -0.3 }}>
              ClassFlow
            </Typography.Title>
          )}
        </div>

        <Menu
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={items}
          onClick={(e) => navigate(e.key)}
          style={{ flex: 1, borderBottom: 'none', minWidth: 0 }}
          disabledOverflow={false}
        />

        <Dropdown menu={{ items: userMenu, onClick: () => navigate('/login') }} trigger={['click']}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flexShrink: 0 }}>
            <Avatar style={{ background: currentInstructor.color }}>
              {role === 'admin' ? '관' : currentInstructor.name[0]}
            </Avatar>
            {screens.sm && (
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>
                  {role === 'admin' ? '관리자' : currentInstructor.name}
                </div>
                <Tag color={role === 'admin' ? 'purple' : 'blue'} style={{ marginTop: 2, fontSize: 11, lineHeight: '16px' }}>
                  {role === 'admin' ? 'ADMIN' : 'INSTRUCTOR'}
                </Tag>
              </div>
            )}
            <DownOutlined style={{ fontSize: 10, color: '#999' }} />
          </div>
        </Dropdown>
      </Header>
      <Content style={{ padding: screens.md ? '28px 32px 48px' : '16px 16px 32px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
}
