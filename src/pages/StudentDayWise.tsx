import { useAuth } from "@/hooks/useAuth";
import {
  getStudentAttendanceByDate,
  getStudentRecentAttendance,
} from "@/lib/studentData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { getSubjectById } from "@/lib/attendanceData";

const StudentDayWise = () => {
  const { student } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  if (!student) return null;

  const selectedDateString = format(selectedDate, "yyyy-MM-dd");
  const dayAttendance = getStudentAttendanceByDate(
    student.id,
    selectedDateString,
  );
  const recentAttendance = getStudentRecentAttendance(student.id, 10);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "late":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "absent":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-50 text-green-700 border-green-200";
      case "late":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "absent":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const dayStats = {
    totalClasses: dayAttendance.length,
    presentClasses: dayAttendance.filter((r) => r.status === "present").length,
    lateClasses: dayAttendance.filter((r) => r.status === "late").length,
    absentClasses: dayAttendance.filter((r) => r.status === "absent").length,
  };

  const attendancePercentage =
    dayStats.totalClasses > 0
      ? Math.round(
          ((dayStats.presentClasses + dayStats.lateClasses) /
            dayStats.totalClasses) *
            100,
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-6">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daily Attendance</h1>
          <p className="text-gray-600">View your attendance records by date</p>
        </div>

        {/* Mobile-First Layout */}
        <div className="space-y-6">
          {/* Calendar - Mobile Optimized */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border-0 w-full"
                classNames={{
                  months: "flex flex-col space-y-4 w-full",
                  month: "space-y-4 w-full",
                  caption:
                    "flex justify-center pt-1 relative items-center text-base",
                  caption_label: "text-base font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button:
                    "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex w-full",
                  head_cell:
                    "text-gray-500 rounded-md w-full font-normal text-sm",
                  row: "flex w-full mt-2",
                  cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 w-full",
                  day: "h-10 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-md",
                  day_selected:
                    "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
                  day_today: "bg-gray-100 text-gray-900",
                  day_outside: "text-gray-500 opacity-50",
                  day_disabled: "text-gray-500 opacity-50",
                  day_range_middle:
                    "aria-selected:bg-gray-100 aria-selected:text-gray-900",
                  day_hidden: "invisible",
                }}
              />
            </CardContent>
          </Card>

          {/* Selected Day Details */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </div>
                {dayStats.totalClasses > 0 && (
                  <Badge
                    className={
                      attendancePercentage >= 80
                        ? "bg-green-50 text-green-700"
                        : attendancePercentage >= 60
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-red-50 text-red-700"
                    }
                  >
                    {attendancePercentage}%
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dayStats.totalClasses > 0 ? (
                <div className="space-y-6">
                  {/* Day Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-green-600">
                        {dayStats.presentClasses}
                      </div>
                      <div className="text-xs text-green-600">Present</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-yellow-600">
                        {dayStats.lateClasses}
                      </div>
                      <div className="text-xs text-yellow-600">Late</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <XCircle className="w-5 h-5 text-red-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-red-600">
                        {dayStats.absentClasses}
                      </div>
                      <div className="text-xs text-red-600">Absent</div>
                    </div>
                  </div>

                  {/* Class Details */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">
                      Class Schedule
                    </h4>
                    {dayAttendance
                      .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot))
                      .map((record) => {
                        const subject = getSubjectById(record.subjectId);
                        return (
                          <div
                            key={record.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span className="font-mono text-sm font-medium">
                                  {record.timeSlot}
                                </span>
                              </div>
                              <div className="flex items-center space-x-3">
                                {subject && (
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: subject.color }}
                                  />
                                )}
                                <div>
                                  <div className="font-medium text-sm">
                                    {subject?.name || "Unknown Subject"}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {subject?.code}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge className={getStatusColor(record.status)}>
                                {record.status.charAt(0).toUpperCase() +
                                  record.status.slice(1)}
                              </Badge>
                              {getStatusIcon(record.status)}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No classes scheduled
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No attendance records found for this date.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Days */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Recent Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {recentAttendance.map((dayData) => {
                  const attendancePercentage =
                    dayData.totalClasses > 0
                      ? Math.round(
                          (dayData.attendedClasses / dayData.totalClasses) *
                            100,
                        )
                      : 0;

                  return (
                    <div
                      key={dayData.date}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                      onClick={() => setSelectedDate(new Date(dayData.date))}
                    >
                      <div className="flex items-center space-x-4">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-sm">
                            {format(new Date(dayData.date), "EEEE, MMM d")}
                          </div>
                          <div className="text-xs text-gray-500">
                            {dayData.totalClasses} classes scheduled
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {dayData.attendedClasses}/{dayData.totalClasses}
                          </div>
                          <Badge
                            variant={
                              attendancePercentage >= 80
                                ? "default"
                                : attendancePercentage >= 60
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="text-xs"
                          >
                            {attendancePercentage}%
                          </Badge>
                        </div>
                        {attendancePercentage >= 80 ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : attendancePercentage >= 60 ? (
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Summary */}
          <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle>This Week's Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(
                      recentAttendance
                        .slice(0, 5)
                        .reduce(
                          (acc, day) =>
                            acc +
                            (day.totalClasses > 0
                              ? (day.attendedClasses / day.totalClasses) * 100
                              : 0),
                          0,
                        ) / 5,
                    ) || 0}
                    %
                  </div>
                  <div className="text-sm text-gray-600">Weekly Average</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {recentAttendance
                      .slice(0, 5)
                      .reduce((acc, day) => acc + day.attendedClasses, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Classes Attended</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDayWise;
