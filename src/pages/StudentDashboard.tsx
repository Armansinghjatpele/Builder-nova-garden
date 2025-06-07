import { useAuth } from "@/hooks/useAuth";
import {
  calculateStudentStats,
  getStudentRecentAttendance,
} from "@/lib/studentData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  CheckCircle,
  XCircle,
  TrendingUp,
  Calendar,
  Clock,
  AlertTriangle,
  Target,
} from "lucide-react";
import { format } from "date-fns";

const StudentDashboard = () => {
  const { user, isStudent } = useAuth();

  if (!user || !isStudent) return null;

  const student = user;
  const stats = calculateStudentStats(student.id);
  const recentAttendance = getStudentRecentAttendance(student.id, 5);

  if (!stats) {
    return <div>Loading...</div>;
  }

  const getOverallStatus = (percentage: number) => {
    if (percentage >= 90)
      return {
        status: "Excellent",
        color: "bg-green-50 text-green-700 border-green-200",
        icon: TrendingUp,
      };
    if (percentage >= 80)
      return {
        status: "Good",
        color: "bg-blue-50 text-blue-700 border-blue-200",
        icon: CheckCircle,
      };
    if (percentage >= 70)
      return {
        status: "Average",
        color: "bg-yellow-50 text-yellow-700 border-yellow-200",
        icon: AlertTriangle,
      };
    return {
      status: "Needs Improvement",
      color: "bg-red-50 text-red-700 border-red-200",
      icon: XCircle,
    };
  };

  const overallStatus = getOverallStatus(stats.percentage);
  const StatusIcon = overallStatus.icon;

  // Get subjects that need attention (below 75%)
  const subjectsNeedingAttention = Object.values(stats.subjectWiseStats).filter(
    (s) => s.percentage < 75,
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-6">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16 border-3 border-white">
                <AvatarImage src={student.avatar} alt={student.name} />
                <AvatarFallback className="bg-white text-blue-600 text-lg font-semibold">
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold mb-1">
                  Welcome back, {student.name.split(" ")[0]}!
                </h1>
                <p className="text-blue-100 text-sm">
                  {student.rollNumber} • {student.class}-{student.section}
                </p>
                <div className="flex items-center mt-2">
                  <Badge className={`${overallStatus.color} text-xs`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {overallStatus.status}
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
              <div className="text-2xl font-bold text-blue-600">
                {stats.percentage}%
              </div>
              <div className="text-xs text-gray-500 mt-1">Overall</div>
              <Progress value={stats.percentage} className="mt-2 h-1" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.attendedClasses}
              </div>
              <div className="text-xs text-gray-500 mt-1">Attended</div>
              <CheckCircle className="w-4 h-4 text-green-600 mx-auto mt-2" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {stats.totalClasses - stats.attendedClasses}
              </div>
              <div className="text-xs text-gray-500 mt-1">Missed</div>
              <XCircle className="w-4 h-4 text-red-600 mx-auto mt-2" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(stats.subjectWiseStats).length}
              </div>
              <div className="text-xs text-gray-500 mt-1">Subjects</div>
              <BookOpen className="w-4 h-4 text-purple-600 mx-auto mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Subjects Overview */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <BookOpen className="mr-2 h-5 w-5" />
              Subject Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.values(stats.subjectWiseStats).map((subjectStat) => (
              <div key={subjectStat.subject.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: subjectStat.subject.color }}
                    />
                    <div>
                      <div className="font-medium text-sm">
                        {subjectStat.subject.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {subjectStat.subject.code}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold">
                      {subjectStat.percentage}%
                    </span>
                    <Badge
                      variant={
                        subjectStat.percentage >= 75 ? "default" : "destructive"
                      }
                      className="text-xs"
                    >
                      {subjectStat.attendedClasses}/{subjectStat.totalClasses}
                    </Badge>
                  </div>
                </div>
                <Progress value={subjectStat.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alerts */}
        {subjectsNeedingAttention.length > 0 && (
          <Card className="border-0 shadow-sm border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="flex items-center text-lg text-red-700">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Attention Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                These subjects have attendance below 75%:
              </p>
              <div className="space-y-2">
                {subjectsNeedingAttention.map((subject) => (
                  <div
                    key={subject.subject.id}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: subject.subject.color }}
                      />
                      <span className="font-medium text-sm">
                        {subject.subject.name}
                      </span>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      {subject.percentage}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Attendance */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Calendar className="mr-2 h-5 w-5" />
              Recent Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAttendance.map((dayData) => {
                const percentage =
                  dayData.totalClasses > 0
                    ? Math.round(
                        (dayData.attendedClasses / dayData.totalClasses) * 100,
                      )
                    : 0;

                return (
                  <div
                    key={dayData.date}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="font-medium text-sm">
                          {format(new Date(dayData.date), "EEEE, MMM d")}
                        </div>
                        <div className="text-xs text-gray-500">
                          {dayData.totalClasses} classes scheduled
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {dayData.attendedClasses}/{dayData.totalClasses}
                      </span>
                      <Badge
                        variant={
                          percentage >= 80
                            ? "default"
                            : percentage >= 60
                              ? "secondary"
                              : "destructive"
                        }
                        className="text-xs"
                      >
                        {percentage}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Goals/Targets */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Target className="mr-2 h-5 w-5 text-green-600" />
              Your Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Maintain 85% attendance</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.percentage >= 85
                    ? "🎉 Goal achieved! Keep it up!"
                    : `${85 - stats.percentage}% more needed to reach your goal`}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {stats.percentage}%
                </div>
                <div className="text-xs text-gray-500">Current</div>
              </div>
            </div>
            <Progress
              value={Math.min(stats.percentage, 85) * (100 / 85)}
              className="mt-3"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
