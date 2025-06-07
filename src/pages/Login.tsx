import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { GraduationCap, User, CreditCard, LogIn, School } from "lucide-react";

const Login = () => {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!name.trim() || !rollNumber.trim()) {
      setError("Please enter both name and roll number");
      setIsLoading(false);
      return;
    }

    const success = login(name.trim(), rollNumber.trim());

    if (!success) {
      setError("Invalid credentials. Please check your name and roll number.");
    }

    setIsLoading(false);
  };

  // Demo credentials for easy testing
  const demoCredentials = [
    { name: "John Smith", rollNumber: "CS2023001" },
    { name: "Emma Johnson", rollNumber: "CS2023002" },
    { name: "Michael Brown", rollNumber: "CS2023003" },
  ];

  const fillDemo = (credentials: { name: string; rollNumber: string }) => {
    setName(credentials.name);
    setRollNumber(credentials.rollNumber);
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
            <h1 className="text-2xl font-bold text-gray-900">Student Portal</h1>
            <p className="text-gray-600">Access your attendance records</p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5" />
              Student Login
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
                <Label htmlFor="rollNumber" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Roll Number
                </Label>
                <Input
                  id="rollNumber"
                  type="text"
                  placeholder="Enter your roll number"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
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
                    Sign In
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
              <GraduationCap className="w-4 h-4" />
              Demo Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-gray-500 mb-3">
              Try these demo credentials:
            </p>
            {demoCredentials.map((cred, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full justify-start h-auto p-3"
                onClick={() => fillDemo(cred)}
              >
                <div className="text-left">
                  <div className="font-medium">{cred.name}</div>
                  <div className="text-xs text-gray-500">{cred.rollNumber}</div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>© 2024 School Attendance System</p>
          <p>Contact admin for access issues</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
