import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Users,
  Calendar,
  Clock,
  Menu,
  X,
  LogOut,
  UserCheck,
  BookOpen,
  BarChart3,
} from "lucide-react";
import { useState } from "react";
import { Teacher } from "@/types/teacher";

const TeacherNavigation = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const teacher = user as Teacher;

  const navItems = [
    {
      to: "/",
      label: "Dashboard",
      icon: Home,
      description: "Overview & statistics",
    },
    {
      to: "/students",
      label: "Students",
      icon: Users,
      description: "Manage student attendance",
    },
    {
      to: "/attendance",
      label: "Attendance",
      icon: Calendar,
      description: "Mark & view attendance",
    },
    {
      to: "/reports",
      label: "Reports",
      icon: BarChart3,
      description: "Generate reports",
    },
    {
      to: "/timetable",
      label: "Timetable",
      icon: Clock,
      description: "Class schedule",
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={teacher?.avatar} alt={teacher?.name} />
            <AvatarFallback className="bg-green-100 text-green-600 text-sm">
              {teacher?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Teacher Portal
            </h1>
            <p className="text-xs text-gray-500">{teacher?.teacherId}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMobileMenu}
          className="p-2"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-80 bg-white transform transition-transform duration-200 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Profile Section */}
          <div className="p-6 bg-gradient-to-r from-green-600 to-blue-700 text-white">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12 border-2 border-white">
                <AvatarImage src={teacher?.avatar} alt={teacher?.name} />
                <AvatarFallback className="bg-white text-green-600">
                  {teacher?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{teacher?.name}</h2>
                <p className="text-green-100 text-sm">{teacher?.teacherId}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 text-xs"
                  >
                    {teacher?.department}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-green-50 text-green-700 border border-green-200 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <Icon className="mr-4 h-5 w-5" />
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500">
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-200 space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-start h-auto p-3"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <UserCheck className="mr-3 h-4 w-4" />
              <div className="text-left">
                <div className="text-sm font-medium">Teacher Profile</div>
                <div className="text-xs text-gray-500">
                  Manage your information
                </div>
              </div>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start h-auto p-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-4 w-4" />
              <div className="text-left">
                <div className="text-sm font-medium">Sign Out</div>
                <div className="text-xs text-gray-500">
                  Return to login screen
                </div>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Desktop Profile Section */}
          <div className="p-6 bg-gradient-to-r from-green-600 to-blue-700 text-white">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10 border-2 border-white">
                <AvatarImage src={teacher?.avatar} alt={teacher?.name} />
                <AvatarFallback className="bg-white text-green-600">
                  {teacher?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{teacher?.name}</h2>
                <p className="text-green-100 text-sm">{teacher?.teacherId}</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  <div>
                    <div>{item.label}</div>
                    <div className="text-xs text-gray-500">
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Footer */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-3 z-30 min-h-[72px]">
        <div className="flex justify-around items-center">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center py-1 px-2 rounded-lg transition-colors min-w-0 flex-1 min-h-[48px] justify-center",
                  isActive
                    ? "text-green-600 bg-green-50"
                    : "text-gray-600"
                )}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium truncate">{item.label}</span>
              </Link>
            );
          })}
          })}
        </div>
      </div>
    </>
  );
};

export default TeacherNavigation;