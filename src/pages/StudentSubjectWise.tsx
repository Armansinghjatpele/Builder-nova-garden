import { useAuth } from "@/hooks/useAuth";
import {
  calculateStudentStats,
  getStudentAttendanceRecords,
} from "@/lib/studentData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  BookOpen,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { getSubjectById } from "@/lib/attendanceData";

const StudentSubjectWise = () => {
  const { user, isStudent } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  if (!user || !isStudent) return null;

  const student = user;

  const stats = calculateStudentStats(student.id);
  const allRecords = getStudentAttendanceRecords(student.id);

  if (!stats) {
    return <div>Loading...</div>;
  }

  const sortedSubjects = Object.values(stats.subjectWiseStats).sort(
    (a, b) => b.percentage - a.percentage,
  );
  const filteredSubjects =
    selectedSubject === "all"
      ? sortedSubjects
      : sortedSubjects.filter((s) => s.subject.id === selectedSubject);

  const getSubjectRecords = (subjectId: string) => {
    return allRecords.filter((record) => record.subjectId === subjectId);
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 85) return "text-green-600 bg-green-50 border-green-200";
    if (percentage >= 75)
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-6">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Subject Performance
            </h1>
            <p className="text-gray-600">
              Detailed attendance breakdown by subject
            </p>
          </div>

          {/* Filter */}
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full h-12">
              <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {sortedSubjects.map((subjectStat) => (
                <SelectItem
                  key={subjectStat.subject.id}
                  value={subjectStat.subject.id}
                >
                  {subjectStat.subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subject Cards */}
        <div className="space-y-4">
          {filteredSubjects.map((subjectStat) => (
            <Card
              key={subjectStat.subject.id}
              className="border-0 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: subjectStat.subject.color }}
                    />
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        {subjectStat.subject.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        {subjectStat.subject.code}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(subjectStat.percentage)}>
                    {subjectStat.percentage >= 85
                      ? "Excellent"
                      : subjectStat.percentage >= 75
                        ? "Good"
                        : "Needs Attention"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Attendance Rate
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {subjectStat.percentage}%
                    </span>
                  </div>
                  <Progress value={subjectStat.percentage} className="h-3" />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-green-600">
                      {subjectStat.attendedClasses}
                    </div>
                    <div className="text-xs text-green-600">Present</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-yellow-600">
                      {subjectStat.lateCount}
                    </div>
                    <div className="text-xs text-yellow-600">Late</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-red-600">
                      {subjectStat.totalClasses - subjectStat.attendedClasses}
                    </div>
                    <div className="text-xs text-red-600">Absent</div>
                  </div>
                </div>

                {/* Trend Indicator */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Performance Trend</span>
                  <div className="flex items-center space-x-2">
                    {subjectStat.percentage >= 75 ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">
                          Good
                        </span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-600 font-medium">
                          Needs Improvement
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Analysis for Selected Subject */}
        {selectedSubject !== "all" && (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Detailed Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const subject = getSubjectById(selectedSubject);
                const records = getSubjectRecords(selectedSubject);
                const subjectStat = stats.subjectWiseStats[selectedSubject];

                if (!subject || !subjectStat) return null;

                const recentRecords = records.slice(-10).reverse(); // Last 10 records

                return (
                  <div className="space-y-6">
                    {/* Subject Header */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: subject.color }}
                        />
                        <div>
                          <h3 className="font-semibold">{subject.name}</h3>
                          <p className="text-sm text-gray-500">
                            {subject.code}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(subjectStat.percentage)}>
                        {subjectStat.percentage}%
                      </Badge>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 border border-gray-200 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {subjectStat.totalClasses}
                        </div>
                        <div className="text-sm text-gray-500">
                          Total Classes
                        </div>
                      </div>
                      <div className="text-center p-4 border border-gray-200 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {subjectStat.attendedClasses}
                        </div>
                        <div className="text-sm text-gray-500">
                          Classes Attended
                        </div>
                      </div>
                    </div>

                    {/* Recent Records */}
                    <div>
                      <h4 className="font-medium mb-3">Recent Attendance</h4>
                      <div className="space-y-2">
                        {recentRecords.map((record) => (
                          <div
                            key={record.id}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <div>
                                <div className="text-sm font-medium">
                                  {new Date(record.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      weekday: "short",
                                      month: "short",
                                      day: "numeric",
                                    },
                                  )}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {record.timeSlot}
                                </div>
                              </div>
                            </div>
                            <Badge
                              className={
                                record.status === "present"
                                  ? "bg-green-50 text-green-700"
                                  : record.status === "late"
                                    ? "bg-yellow-50 text-yellow-700"
                                    : "bg-red-50 text-red-700"
                              }
                            >
                              {record.status.charAt(0).toUpperCase() +
                                record.status.slice(1)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-lg">Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {sortedSubjects.filter((s) => s.percentage >= 85).length}
                </div>
                <div className="text-sm text-gray-600">Excellent Subjects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {
                    sortedSubjects.filter(
                      (s) => s.percentage >= 75 && s.percentage < 85,
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">Good Subjects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {sortedSubjects.filter((s) => s.percentage < 75).length}
                </div>
                <div className="text-sm text-gray-600">Need Attention</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentSubjectWise;
