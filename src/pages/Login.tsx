import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/teacher";
import {
  GraduationCap,
  User,
  CreditCard,
  LogIn,
  School,
  BookOpen,
  Users,
  UserCheck
} from 'lucide-react';

const Login = () => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!name.trim() || !id.trim()) {
      setError("Please enter both name and ID");
      setIsLoading(false);
      return;
    }

    const success = login(name.trim(), id.trim(), selectedRole);

    if (!success) {
      setError(
        `Invalid credentials. Please check your name and ${selectedRole === "student" ? "roll number" : "teacher ID"}.`,
      );
    }

    setIsLoading(false);
  };

  // Demo credentials for easy testing
  const studentCredentials = [
    { name: "John Smith", id: "CS2023001" },
    { name: "Emma Johnson", id: "CS2023002" },
    { name: "Michael Brown", id: "CS2023003" },
  ];

  const teacherCredentials = [
    { name: "Dr. Sarah Wilson", id: "MATH001" },
    { name: "Prof. David Martinez", id: "PHY001" },
    { name: "Dr. Michael Kumar", id: "PRIN001" },
  ];

  const fillDemo = (credentials: { name: string; id: string }) => {
    setName(credentials.name);
    setId(credentials.id);
  };

  const getCurrentCredentials = () => {
    return selectedRole === "student" ? studentCredentials : teacherCredentials;
  };

  const getIdLabel = () => {
    return selectedRole === "student" ? "Roll Number" : "Teacher ID";
  };

  const getIdPlaceholder = () => {
    return selectedRole === "student"
      ? "Enter your roll number"
      : "Enter your teacher ID";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <School className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">School Portal</h1>
            <p className="text-gray-600">Access your attendance system</p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5" />
              Login Portal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Role Selection */}
            <Tabs
              value={selectedRole}
              onValueChange={(value) => {
                setSelectedRole(value as UserRole);
                setName("");
                setId("");
                setError("");
              }}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="student"
                  className="flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  Student
                </TabsTrigger>
                <TabsTrigger value="teacher" className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Teacher
                </TabsTrigger>
              </TabsList>

              <TabsContent value="student" className="mt-4">
                <div className="text-center text-sm text-gray-600 mb-4">
                  <Users className="w-5 h-5 mx-auto mb-2 text-blue-600" />
                  Student access to personal attendance records
                </div>
              </TabsContent>

              <TabsContent value="teacher" className="mt-4">
                <div className="text-center text-sm text-gray-600 mb-4">
                  <BookOpen className="w-5 h-5 mx-auto mb-2 text-green-600" />
                  Teacher access to manage student attendance
                </div>
              </TabsContent>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 text-base"
                  autoComplete="name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="id" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  {getIdLabel()}
                </Label>
                <Input
                  id="id"
                  type="text"
                  placeholder={getIdPlaceholder()}
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="h-12 text-base"
                  autoComplete="username"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Sign In as{" "}
                    {selectedRole === "student" ? "Student" : "Teacher"}
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
              {selectedRole === 'student' ? (
                <GraduationCap className="w-4 h-4" />
              ) : (
                <UserCheck className="w-4 h-4" />
              )}
              )}
              Demo {selectedRole === "student" ? "Student" : "Teacher"} Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-gray-500 mb-3">
              Try these demo credentials:
            </p>
            {getCurrentCredentials().map((cred, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full justify-start h-auto p-3"
                onClick={() => fillDemo(cred)}
              >
                <div className="text-left">
                  <div className="font-medium">{cred.name}</div>
                  <div className="text-xs text-gray-500">{cred.id}</div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>© 2024 School Attendance Management System</p>
          <p>Contact admin for access issues</p>
        </div>
      </div>
    </div>
  );
};

export default Login;