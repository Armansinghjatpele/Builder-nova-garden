import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  BookOpen,
  Calendar,
  Clock,
  Menu,
  X,
  LogOut,
  User,
} from "lucide-react";
import { useState } from "react";

const MobileNavigation = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const student = user;

  const navItems = [
    {
      to: "/",
      label: "Dashboard",
      icon: Home,
      description: "My attendance overview",
    },
    {
      to: "/subject-wise",
      label: "Subjects",
      icon: BookOpen,
      description: "Subject-wise attendance",
    },
    {
      to: "/day-wise",
      label: "Calendar",
      icon: Calendar,
      description: "Day-wise records",
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
      {/* Fixed Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-50 h-16">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={student?.avatar} alt={student?.name} />
            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
              {student?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-gray-900 truncate">
              My Attendance
            </h1>
            <p className="text-xs text-gray-500 truncate">
              {student?.rollNumber}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMobileMenu}
          className="p-2 flex-shrink-0"
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
          className="fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 bg-white transform transition-transform duration-200 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Profile Section */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12 border-2 border-white">
                <AvatarImage src={student?.avatar} alt={student?.name} />
                <AvatarFallback className="bg-white text-blue-600">
                  {student?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{student?.name}</h2>
                <p className="text-blue-100 text-sm">{student?.rollNumber}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700 text-xs"
                  >
                    {student?.class} - {student?.section}
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
                      ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
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
              <User className="mr-3 h-4 w-4" />
              <div className="text-left">
                <div className="text-sm font-medium">Profile Settings</div>
                <div className="text-xs text-gray-500">
                  Update your information
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

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-40 h-20">
        <div className="flex justify-around items-center h-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors min-w-0 flex-1 h-14",
                  isActive ? "text-blue-600 bg-blue-50" : "text-gray-600",
                )}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium truncate">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;
