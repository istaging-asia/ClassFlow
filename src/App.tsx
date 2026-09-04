import { ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';
import { Navigate, Route, HashRouter, Routes } from 'react-router-dom';
import { classflowTheme } from './theme';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
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
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />

            {/* 강사 라우트 */}
            <Route
              path="/instructor"
              element={
                <ProtectedRoute>
                  <MainLayout role="instructor" />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="logs" replace />} />
              <Route path="logs" element={<MyLogsPage />} />
              <Route path="instructors" element={<InstructorsPage role="instructor" />} />
              <Route path="courses" element={<CoursesPage role="instructor" />} />
              <Route path="profile" element={<MyProfilePage />} />
            </Route>

            {/* 관리자 라우트 */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <MainLayout role="admin" />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="logs" replace />} />
              <Route path="logs" element={<AdminLogsPage />} />
              <Route path="instructors" element={<InstructorsPage role="admin" />} />
              <Route path="courses" element={<CoursesPage role="admin" />} />
              <Route path="master" element={<AdminMasterPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </ConfigProvider>
  );
}
