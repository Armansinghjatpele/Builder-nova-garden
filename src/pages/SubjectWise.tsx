import { useAttendance } from "@/hooks/useAttendance";
import AttendanceCard from "@/components/AttendanceCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { BookOpen, Plus, Filter, TrendingUp, TrendingDown } from "lucide-react";

const SubjectWise = () => {
  const { stats, subjects, getAttendanceBySubject } = useAttendance();
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "percentage" | "total">(
    "percentage",
  );

  if (!stats) {
    return <div>Loading...</div>;
  }

  const sortedSubjects = Object.values(stats.subjectWiseStats).sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.subject.name.localeCompare(b.subject.name);
      case "percentage":
        return b.percentage - a.percentage;
      case "total":
        return b.totalClasses - a.totalClasses;
      default:
        return 0;
    }
  });

  const filteredSubjects =
    selectedSubject === "all"
      ? sortedSubjects
      : sortedSubjects.filter((s) => s.subject.id === selectedSubject);

  const getSubjectDetails = (subjectId: string) => {
    const records = getAttendanceBySubject(subjectId);
    const presentCount = records.filter((r) => r.status === "present").length;
    const lateCount = records.filter((r) => r.status === "late").length;
    const absentCount = records.filter((r) => r.status === "absent").length;

    return {
      presentCount,
      lateCount,
      absentCount,
      totalRecords: records.length,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Subject-wise Attendance
          </h1>
          <p className="text-gray-600">
            Detailed attendance breakdown by subject
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Mark Attendance
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Select
          value={sortBy}
          onValueChange={(value: "name" | "percentage" | "total") =>
            setSortBy(value)
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">Attendance Percentage</SelectItem>
            <SelectItem value="name">Subject Name</SelectItem>
            <SelectItem value="total">Total Classes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subjectStat) => (
          <AttendanceCard
            key={subjectStat.subject.id}
            subject={subjectStat.subject}
            percentage={subjectStat.percentage}
            totalClasses={subjectStat.totalClasses}
            attendedClasses={subjectStat.attendedClasses}
          />
        ))}
      </div>

      {/* Detailed Subject Information */}
      {selectedSubject !== "all" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              {subjects.find((s) => s.id === selectedSubject)?.name} - Detailed
              Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const subject = subjects.find((s) => s.id === selectedSubject);
              const details = getSubjectDetails(selectedSubject);
              const subjectStat = stats.subjectWiseStats[selectedSubject];

              if (!subject || !subjectStat) return null;

              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {details.presentCount}
                      </div>
                      <div className="text-sm text-green-600">Present</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {details.lateCount}
                      </div>
                      <div className="text-sm text-yellow-600">Late</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {details.absentCount}
                      </div>
                      <div className="text-sm text-red-600">Absent</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {subjectStat.percentage}%
                      </div>
                      <div className="text-sm text-blue-600">Attendance</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: subject.color }}
                      />
                      <span className="font-medium">
                        {subject.name} ({subject.code})
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge
                        variant={
                          subjectStat.percentage >= 75
                            ? "default"
                            : "destructive"
                        }
                      >
                        {subjectStat.percentage >= 85
                          ? "Excellent"
                          : subjectStat.percentage >= 75
                            ? "Good"
                            : "Needs Improvement"}
                      </Badge>
                      {subjectStat.percentage >= 75 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Best Performing Subject
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const best = sortedSubjects[0];
              return (
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: best.subject.color }}
                  />
                  <div>
                    <div className="font-semibold">{best.subject.name}</div>
                    <div className="text-sm text-gray-500">
                      {best.percentage}% attendance
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const worst = sortedSubjects[sortedSubjects.length - 1];
              return (
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: worst.subject.color }}
                  />
                  <div>
                    <div className="font-semibold">{worst.subject.name}</div>
                    <div className="text-sm text-gray-500">
                      {worst.percentage}% attendance
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Average Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.percentage}%</div>
            <div className="text-sm text-gray-500">Across all subjects</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubjectWise;
