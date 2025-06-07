import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import MobileNavigation from "./components/MobileNavigation";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import StudentSubjectWise from "./pages/StudentSubjectWise";
import StudentDayWise from "./pages/StudentDayWise";
import StudentTimetable from "./pages/StudentTimetable";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();

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

  return (
    <div className="flex h-screen bg-gray-50">
      <MobileNavigation />
      <main className="flex-1 overflow-auto lg:ml-64 ml-0">
        <div className="lg:p-6 p-0">
          <Routes>
            <Route path="/" element={<StudentDashboard />} />
            <Route path="/subject-wise" element={<StudentSubjectWise />} />
            <Route path="/day-wise" element={<StudentDayWise />} />
            <Route path="/timetable" element={<StudentTimetable />} />
            <Route path="*" element={<NotFound />} />
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
