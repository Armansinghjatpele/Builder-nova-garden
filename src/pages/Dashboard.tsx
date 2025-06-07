import { useAttendance } from "@/hooks/useAttendance";
import AttendanceCard from "@/components/AttendanceCard";
import AttendanceChart from "@/components/AttendanceChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  CheckCircle,
  XCircle,
  TrendingUp,
  Calendar,
  Clock,
} from "lucide-react";

const Dashboard = () => {
  const { stats, recentAttendance, subjects } = useAttendance();

  if (!stats) {
    return <div>Loading...</div>;
  }

  const getOverallStatus = (percentage: number) => {
    if (percentage >= 85)
      return {
        status: "Excellent",
        color: "bg-green-50 text-green-700 border-green-200",
      };
    if (percentage >= 75)
      return {
        status: "Good",
        color: "bg-yellow-50 text-yellow-700 border-yellow-200",
      };
    return {
      status: "Needs Improvement",
      color: "bg-red-50 text-red-700 border-red-200",
    };
  };

  const overallStatus = getOverallStatus(stats.percentage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Attendance Dashboard
          </h1>
          <p className="text-gray-600">
            Track your overall attendance performance
          </p>
        </div>
        <Badge className={overallStatus.color}>{overallStatus.status}</Badge>
      </div>

      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Attendance
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.percentage}%</div>
            <div className="text-xs text-muted-foreground">
              {stats.attendedClasses} of {stats.totalClasses} classes
            </div>
            <Progress value={stats.percentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Subjects
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.length}</div>
            <div className="text-xs text-muted-foreground">
              Active subjects this semester
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Classes Attended
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.attendedClasses}
            </div>
            <div className="text-xs text-muted-foreground">
              Total attended classes
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Classes Missed
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.totalClasses - stats.attendedClasses}
            </div>
            <div className="text-xs text-muted-foreground">
              Total missed classes
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart stats={stats} type="bar" />
        <AttendanceChart stats={stats} type="pie" />
      </div>

      {/* Subject Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Subject Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(stats.subjectWiseStats).map((subjectStat) => (
            <AttendanceCard
              key={subjectStat.subject.id}
              subject={subjectStat.subject}
              percentage={subjectStat.percentage}
              totalClasses={subjectStat.totalClasses}
              attendedClasses={subjectStat.attendedClasses}
            />
          ))}
        </div>
      </div>

      {/* Recent Attendance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Recent Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAttendance.slice(0, 5).map((dayData) => (
              <div
                key={dayData.date}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-medium">
                      {new Date(dayData.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-sm text-gray-500">
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
                      dayData.attendedClasses === dayData.totalClasses
                        ? "default"
                        : "secondary"
                    }
                  >
                    {dayData.totalClasses > 0
                      ? Math.round(
                          (dayData.attendedClasses / dayData.totalClasses) *
                            100,
                        )
                      : 0}
                    %
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
