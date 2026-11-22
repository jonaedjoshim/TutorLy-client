import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TutorsPage from './pages/TutorsPage';
import TutorProfilePage from './pages/TutorProfilePage';
import TuitionNeedsPage from './pages/TuitionNeedsPage';
import TuitionNeedDetailPage from './pages/TuitionNeedDetailPage';
import PostTuitionPage from './pages/PostTuitionPage';
import StudentDashboard from './pages/StudentDashboard';
import NotFoundPage from './pages/NotFoundPage';

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/how-it-works" element={<HomePage />} />
          <Route path="/tutors" element={<TutorsPage />} />
          <Route path="/tutors/:id" element={<TutorProfilePage />} />
          <Route path="/needs" element={<TuitionNeedsPage />} />
          <Route path="/needs/:id" element={<TuitionNeedDetailPage />} />
          <Route
            path="/post-tuition"
            element={
              <ProtectedRoute role="student">
                <PostTuitionPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#16211F',
            color: '#F7F6F2',
            borderRadius: '10px',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#5FD3B0', secondary: '#16211F' } },
          error: { iconTheme: { primary: '#E28A6A', secondary: '#16211F' } },
        }}
      />
    </BrowserRouter>
  );
}
