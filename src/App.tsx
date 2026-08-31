import { ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';
import { Navigate, Route, HashRouter, Routes } from 'react-router-dom';
import { classflowTheme } from './theme';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import InstructorsPage from './pages/InstructorsPage';
import CoursesPage from './pages/CoursesPage';
import MyLogsPage from './pages/MyLogsPage';
import MyProfilePage from './pages/MyProfilePage';
import AdminLogsPage from './pages/AdminLogsPage';
import AdminMasterPage from './pages/AdminMasterPage';

export default function App() {
  return (
    <ConfigProvider theme={classflowTheme} locale={koKR}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/instructor" element={<MainLayout role="instructor" />}>
            <Route index element={<Navigate to="logs" replace />} />
            <Route path="logs" element={<MyLogsPage />} />
            <Route path="instructors" element={<InstructorsPage role="instructor" />} />
            <Route path="courses" element={<CoursesPage role="instructor" />} />
            <Route path="profile" element={<MyProfilePage />} />
          </Route>

          <Route path="/admin" element={<MainLayout role="admin" />}>
            <Route index element={<Navigate to="logs" replace />} />
            <Route path="logs" element={<AdminLogsPage />} />
            <Route path="instructors" element={<InstructorsPage role="admin" />} />
            <Route path="courses" element={<CoursesPage role="admin" />} />
            <Route path="master" element={<AdminMasterPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </HashRouter>
    </ConfigProvider>
  );
}
