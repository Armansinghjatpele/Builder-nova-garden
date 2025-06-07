import { useAuth } from "@/hooks/useAuth";
import {
  calculateTeacherStats,
  getStudentsInTeacherClasses,
} from "@/lib/teacherData";
import { calculateStudentStats } from "@/lib/studentData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  TrendingUp,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  GraduationCap,
  ChalkboardTeacher,
} from "lucide-react";
import { Teacher } from "@/types/teacher";

const TeacherDashboard = () => {
  const { user, role } = useAuth();

  if (role !== "teacher" || !user) return null;

  const teacher = user as Teacher;
  const stats = calculateTeacherStats(teacher.id);
  const studentsInClasses = getStudentsInTeacherClasses(teacher.id);

  if (!stats) {
    return <div>Loading...</div>;
  }

  // Get student statistics for students in teacher's classes
  const studentsWithStats = studentsInClasses
    .map((student) => {
      const studentStats = calculateStudentStats(student.id);
      return {
        student,
        stats: studentStats,
      };
    })
    .filter((item) => item.stats !== null);

  // Get students needing attention (below 75%)
  const studentsNeedingAttention = studentsWithStats.filter(
    (item) => item.stats && item.stats.percentage < 75,
  );

  // Get top performing students
  const topStudents = studentsWithStats
    .filter((item) => item.stats && item.stats.percentage >= 85)
    .sort((a, b) => (b.stats?.percentage || 0) - (a.stats?.percentage || 0))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-6">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-700 rounded-2xl p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16 border-3 border-white">
                <AvatarImage src={teacher.avatar} alt={teacher.name} />
                <AvatarFallback className="bg-white text-green-600 text-lg font-semibold">
                  {teacher.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold mb-1">
                  Welcome, {teacher.name}
                </h1>
                <p className="text-green-100 text-sm">
                  {teacher.teacherId} • {teacher.department}
                </p>
                <div className="flex items-center mt-2 space-x-2">
                  <Badge className="bg-white text-green-700 text-xs">
                    <ChalkboardTeacher className="w-3 h-3 mr-1" />
                    {teacher.subjects.length} Subject
                    {teacher.subjects.length > 1 ? "s" : ""}
                  </Badge>
                  <Badge className="bg-green-100 text-green-700 text-xs">
                    {teacher.classes.join(", ")}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalStudents}
              </div>
              <div className="text-xs text-gray-500 mt-1">Total Students</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {stats.totalClasses}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Classes Conducted
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {stats.averageAttendance}%
              </div>
              <div className="text-xs text-gray-500 mt-1">Avg Attendance</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">
                {studentsNeedingAttention.length}
              </div>
              <div className="text-xs text-gray-500 mt-1">Need Attention</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Button className="h-16 flex-col space-y-1 bg-blue-600 hover:bg-blue-700">
            <Calendar className="w-5 h-5" />
            <span className="text-sm">Mark Attendance</span>
          </Button>
          <Button variant="outline" className="h-16 flex-col space-y-1">
            <Users className="w-5 h-5" />
            <span className="text-sm">View All Students</span>
          </Button>
          <Button variant="outline" className="h-16 flex-col space-y-1">
            <BookOpen className="w-5 h-5" />
            <span className="text-sm">Generate Report</span>
          </Button>
        </div>

        {/* Students Needing Attention */}
        {studentsNeedingAttention.length > 0 && (
          <Card className="border-0 shadow-sm border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="flex items-center text-lg text-red-700">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Students Needing Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                These students have attendance below 75%:
              </p>
              <div className="space-y-3">
                {studentsNeedingAttention.map(({ student, stats }) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback className="bg-red-100 text-red-600 text-xs">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">
                          {student.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {student.rollNumber}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="destructive" className="text-xs">
                        {stats?.percentage}%
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        Contact
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Performing Students */}
        {topStudents.length > 0 && (
          <Card className="border-0 shadow-sm border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center text-lg text-green-700">
                <CheckCircle className="mr-2 h-5 w-5" />
                Top Performing Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topStudents.map(({ student, stats }, index) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback className="bg-green-100 text-green-600 text-xs">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">
                          {student.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {student.rollNumber}
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      {stats?.percentage}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Class Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="mr-2 h-5 w-5" />
                Class Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teacher.classes.map((className) => {
                  const classStudents = studentsInClasses.filter(
                    (s) => `${s.class}-${s.section}` === className,
                  );
                  const avgAttendance =
                    classStudents.length > 0
                      ? Math.round(
                          classStudents.reduce((acc, student) => {
                            const studentStats = calculateStudentStats(
                              student.id,
                            );
                            return acc + (studentStats?.percentage || 0);
                          }, 0) / classStudents.length,
                        )
                      : 0;

                  return (
                    <div key={className} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{className}</span>
                        <Badge
                          variant={
                            avgAttendance >= 75 ? "default" : "destructive"
                          }
                        >
                          {avgAttendance}%
                        </Badge>
                      </div>
                      <Progress value={avgAttendance} className="h-2" />
                      <div className="text-xs text-gray-500">
                        {classStudents.length} students
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">Mathematics</div>
                    <div className="text-xs text-gray-500">12th-A</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">09:00 AM</div>
                    <div className="text-xs text-gray-500">1 hour</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">Mathematics</div>
                    <div className="text-xs text-gray-500">12th-B</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">10:00 AM</div>
                    <div className="text-xs text-gray-500">1 hour</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
