import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import DebugAuth from "./components/DebugAuth";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated, isLoading, isStudent, isTeacher, role } = useAuth();

  // Debug: Always show debug info for now
  console.log("App State:", {
    isAuthenticated,
    isLoading,
    isStudent,
    isTeacher,
    role,
  });

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
    return (
      <div>
        <DebugAuth />
        <Login />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DebugAuth />
      <div className="p-4">
        <Routes>
          <Route
            path="/"
            element={
              isStudent ? (
                <StudentDashboard />
              ) : isTeacher ? (
                <TeacherDashboard />
              ) : (
                <div className="text-center p-8">
                  <h2 className="text-xl font-bold text-red-600">Role Error</h2>
                  <p>Unable to determine user role. Role: {role}</p>
                  <p>isStudent: {isStudent.toString()}</p>
                  <p>isTeacher: {isTeacher.toString()}</p>
                </div>
              )
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
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
