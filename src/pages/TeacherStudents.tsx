import { useAuth } from "@/hooks/useAuth";
import { getStudentsInTeacherClasses } from "@/lib/teacherData";
import { calculateStudentStats } from "@/lib/studentData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import { Teacher } from "@/types/teacher";

const TeacherStudents = () => {
  const { user, role } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  if (role !== "teacher" || !user) return null;

  const teacher = user as Teacher;
  const studentsInClasses = getStudentsInTeacherClasses(teacher.id);

  // Get student statistics
  const studentsWithStats = studentsInClasses
    .map((student) => {
      const stats = calculateStudentStats(student.id);
      return {
        student,
        stats,
      };
    })
    .filter((item) => item.stats !== null);

  // Filter and sort students
  const filteredStudents = studentsWithStats.filter(({ student, stats }) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass =
      classFilter === "all" ||
      `${student.class}-${student.section}` === classFilter;
    return matchesSearch && matchesClass;
  });

  const sortedStudents = filteredStudents.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.student.name.localeCompare(b.student.name);
      case "attendance":
        return (b.stats?.percentage || 0) - (a.stats?.percentage || 0);
      case "rollNumber":
        return a.student.rollNumber.localeCompare(b.student.rollNumber);
      default:
        return 0;
    }
  });

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 85)
      return {
        status: "Excellent",
        color: "bg-green-50 text-green-700",
        icon: CheckCircle,
      };
    if (percentage >= 75)
      return {
        status: "Good",
        color: "bg-blue-50 text-blue-700",
        icon: CheckCircle,
      };
    if (percentage >= 60)
      return {
        status: "Average",
        color: "bg-yellow-50 text-yellow-700",
        icon: AlertTriangle,
      };
    return { status: "Poor", color: "bg-red-50 text-red-700", icon: XCircle };
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-6">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
            <p className="text-gray-600">
              Manage attendance for {studentsInClasses.length} students
            </p>
          </div>
          <Button className="lg:w-auto w-full">
            <BookOpen className="mr-2 h-4 w-4" />
            Mark Attendance
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <Users className="w-5 h-5 text-blue-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-blue-600">
                {studentsInClasses.length}
              </div>
              <div className="text-xs text-gray-500">Total Students</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-green-600">
                {
                  studentsWithStats.filter(
                    (s) => s.stats && s.stats.percentage >= 85,
                  ).length
                }
              </div>
              <div className="text-xs text-gray-500">Excellent</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-yellow-600">
                {
                  studentsWithStats.filter(
                    (s) =>
                      s.stats &&
                      s.stats.percentage >= 75 &&
                      s.stats.percentage < 85,
                  ).length
                }
              </div>
              <div className="text-xs text-gray-500">Good</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <XCircle className="w-5 h-5 text-red-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-red-600">
                {
                  studentsWithStats.filter(
                    (s) => s.stats && s.stats.percentage < 75,
                  ).length
                }
              </div>
              <div className="text-xs text-gray-500">Need Help</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {teacher.classes.map((className) => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="attendance">Attendance</SelectItem>
                  <SelectItem value="rollNumber">Roll Number</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sortedStudents.map(({ student, stats }) => {
            const attendanceStatus = getAttendanceStatus(
              stats?.percentage || 0,
            );
            const StatusIcon = attendanceStatus.icon;

            return (
              <Card
                key={student.id}
                className="border-0 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-sm">
                          {student.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {student.rollNumber}
                        </p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {student.class}-{student.section}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${attendanceStatus.color} text-xs`}>
                        {attendanceStatus.status}
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          Attendance Rate
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-bold">
                            {stats?.percentage || 0}%
                          </span>
                          <StatusIcon className="h-4 w-4" />
                        </div>
                      </div>
                      <Progress
                        value={stats?.percentage || 0}
                        className="h-2"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-green-50 rounded">
                        <div className="text-sm font-bold text-green-600">
                          {stats?.attendedClasses || 0}
                        </div>
                        <div className="text-xs text-green-600">Present</div>
                      </div>
                      <div className="p-2 bg-red-50 rounded">
                        <div className="text-sm font-bold text-red-600">
                          {(stats?.totalClasses || 0) -
                            (stats?.attendedClasses || 0)}
                        </div>
                        <div className="text-xs text-red-600">Absent</div>
                      </div>
                      <div className="p-2 bg-blue-50 rounded">
                        <div className="text-sm font-bold text-blue-600">
                          {stats?.totalClasses || 0}
                        </div>
                        <div className="text-xs text-blue-600">Total</div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                      >
                        View Details
                      </Button>
                      <Button size="sm" className="flex-1 text-xs">
                        Mark Present
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Results */}
        {sortedStudents.length === 0 && (
          <Card className="border-0 shadow-sm">
            <CardContent className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No students found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TeacherStudents;
