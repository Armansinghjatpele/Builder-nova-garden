import { useAttendance } from "@/hooks/useAttendance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

const DayWise = () => {
  const { getAttendanceByDate, recentAttendance } = useAttendance();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const selectedDateString = format(selectedDate, "yyyy-MM-dd");
  const dayAttendance = getAttendanceByDate(selectedDateString);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Day-wise Attendance
          </h1>
          <p className="text-gray-600">
            View attendance records by specific dates
          </p>
        </div>
        <Button>
          <CalendarIcon className="mr-2 h-4 w-4" />
          Mark Today's Attendance
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Selected Day Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5" />
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dayAttendance.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {dayAttendance.length}
                    </div>
                    <div className="text-sm text-blue-600">Total Classes</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {
                        dayAttendance.filter(
                          (r) => r.status === "present" || r.status === "late",
                        ).length
                      }
                    </div>
                    <div className="text-sm text-green-600">Attended</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {
                        dayAttendance.filter((r) => r.status === "absent")
                          .length
                      }
                    </div>
                    <div className="text-sm text-red-600">Missed</div>
                  </div>
                </div>

                <div className="space-y-3">
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
                              <span className="font-mono text-sm">
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
                                <div className="font-medium">
                                  {subject?.name || "Unknown Subject"}
                                </div>
                                <div className="text-sm text-gray-500">
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
      </div>

      {/* Recent Days */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentAttendance.slice(0, 8).map((dayData) => {
              const attendancePercentage =
                dayData.totalClasses > 0
                  ? Math.round(
                      (dayData.attendedClasses / dayData.totalClasses) * 100,
                    )
                  : 0;

              return (
                <div
                  key={dayData.date}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() => setSelectedDate(new Date(dayData.date))}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">
                      {format(new Date(dayData.date), "MMM d")}
                    </div>
                    <Badge
                      variant={
                        attendancePercentage >= 80 ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {attendancePercentage}%
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(dayData.date), "EEEE")}
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="text-green-600 font-medium">
                      {dayData.attendedClasses}
                    </span>
                    <span className="text-gray-400"> / </span>
                    <span className="text-gray-600">
                      {dayData.totalClasses}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DayWise;
