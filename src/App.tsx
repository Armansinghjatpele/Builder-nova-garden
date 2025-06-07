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
    <div className="flex h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 overflow-auto lg:ml-64 ml-0">
        <div className="lg:p-6 p-0">
          <Routes>
            {/* Dashboard Route - Role-based */}
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

            {/* Student-only Routes */}
            <Routes>
              {/* Dashboard Route - Role-based */}
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

              {/* Student-only Routes */}
              <Routes>
                {/* Dashboard Route - Role-based */}
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

                {/* Student-only Routes */}
                <Route
                  path="/subject-wise"
                  element={
                    isStudent ? (
                      <StudentSubjectWise />
                    ) : (
                      <ProtectedRoute allowedRoles={["student"]}>
                        <StudentSubjectWise />
                      </ProtectedRoute>
                    )
                  }
                />
                <Route
                  path="/day-wise"
                  element={
                    isStudent ? (
                      <StudentDayWise />
                    ) : (
                      <ProtectedRoute allowedRoles={["student"]}>
                        <StudentDayWise />
                      </ProtectedRoute>
                    )
                  }
                />

                {/* Teacher-only Routes */}
                <Route
                  path="/students"
                  element={
                    isTeacher ? (
                      <TeacherStudents />
                    ) : (
                      <ProtectedRoute allowedRoles={["teacher"]}>
                        <TeacherStudents />
                      </ProtectedRoute>
                    )
                  }
                />
                <Route
                  path="/attendance"
                  element={
                    isTeacher ? (
                      <TeacherDashboard />
                    ) : (
                      <ProtectedRoute allowedRoles={["teacher"]}>
                        <TeacherDashboard />
                      </ProtectedRoute>
                    )
                  }
                />
                <Route
                  path="/reports"
                  element={
                    isTeacher ? (
                      <TeacherDashboard />
                    ) : (
                      <ProtectedRoute allowedRoles={["teacher"]}>
                        <TeacherDashboard />
                      </ProtectedRoute>
                    )
                  }
                />

                {/* Shared Routes */}
                <Route path="/timetable" element={<StudentTimetable />} />

                {/* Catch-all 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Routes>
          </Routes>
        </div>
      </main>
    </div>
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
