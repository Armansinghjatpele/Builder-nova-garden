import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import MobileNavigation from "./components/MobileNavigation";
import TeacherNavigation from "./components/TeacherNavigation";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";

// Student Pages
import StudentDashboard from "./pages/StudentDashboard";
import StudentSubjectWise from "./pages/StudentSubjectWise";
import StudentDayWise from "./pages/StudentDayWise";
import StudentTimetable from "./pages/StudentTimetable";

// Teacher Pages
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherStudents from "./pages/TeacherStudents";
import TeacherAttendance from "./pages/TeacherAttendance";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated, isLoading, isStudent, isTeacher } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  // Render appropriate navigation based on role
  const Navigation = isTeacher ? TeacherNavigation : MobileNavigation;

  return (
    <>
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <Navigation />
        <main className="pt-16 pb-20 min-h-screen bg-gray-50">
          <Routes>
            <Route
              path="/"
              element={
                isStudent ? (
                  <StudentDashboard />
                ) : isTeacher ? (
                  <TeacherDashboard />
                ) : (
                  <NotFound />
                )
              }
            />
            <Route
              path="/subject-wise"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentSubjectWise />
                </ProtectedRoute>
              }
            />
            <Route
              path="/day-wise"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDayWise />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <TeacherStudents />
                </ProtectedRoute>
              }
            />
            <Route
            <Route path="/attendance" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherAttendance />
              </ProtectedRoute>
            } />
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/timetable" element={<StudentTimetable />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex lg:h-screen bg-gray-50">
        <Navigation />
        <main className="flex-1 overflow-auto ml-64">
          <div className="p-6">
            <Routes>
              <Route
                path="/"
                element={
                  isStudent ? (
                    <StudentDashboard />
                  ) : isTeacher ? (
                    <TeacherDashboard />
                  ) : (
                    <NotFound />
                  )
                }
              />
              <Route
                path="/subject-wise"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <StudentSubjectWise />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/day-wise"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <StudentDayWise />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students"
                element={
                  <ProtectedRoute allowedRoles={["teacher"]}>
                    <TeacherStudents />
                  </ProtectedRoute>
                }
              />
              <Route
              <Route path="/attendance" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherAttendance />
                </ProtectedRoute>
              } />
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute allowedRoles={["teacher"]}>
                    <TeacherDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/timetable" element={<StudentTimetable />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </div>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;