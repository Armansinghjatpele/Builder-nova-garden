import { useAuth } from "@/hooks/useAuth";
import { getStudentsInTeacherClasses } from "@/lib/teacherData";
import { calculateStudentStats } from "@/lib/studentData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAttendanceManager } from "@/hooks/useAttendanceManager";
import { useState } from "react";
import { format } from "date-fns";
import {
  Users,
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  Clock,
  Save,
  RefreshCw,
} from "lucide-react";
import { Teacher } from "@/types/teacher";
import { mockSubjects } from "@/lib/attendanceData";

const TeacherAttendance = () => {
  const { user, role } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [timeSlot, setTimeSlot] = useState<string>("");
  const { markMultipleAttendance, getTodaysAttendance } =
    useAttendanceManager();

  if (role !== "teacher" || !user) return null;

  const teacher = user as Teacher;
  const studentsInClasses = getStudentsInTeacherClasses(teacher.id);

  // Filter students by selected class
  const filteredStudents = selectedClass
    ? studentsInClasses.filter(
        (s) => `${s.class}-${s.section}` === selectedClass,
      )
    : studentsInClasses;

  // Get teacher's subjects
  const teacherSubjects = mockSubjects.filter((subject) =>
    teacher.subjects.includes(subject.id),
  );

  // Time slots
  const timeSlots = [
    "09:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    "14:00-15:00",
    "15:00-16:00",
  ];

  // Attendance state for each student
  const [attendanceState, setAttendanceState] = useState<{
    [key: string]: "present" | "absent" | "late" | null;
  }>({});

  // Get today's existing attendance
  const todaysAttendance = getTodaysAttendance(
    format(selectedDate, "yyyy-MM-dd"),
    selectedSubject,
    timeSlot,
  );

  // Initialize attendance state from existing records
  useEffect(() => {
    const initialState: {
      [key: string]: "present" | "absent" | "late" | null;
    } = {};
    filteredStudents.forEach((student) => {
      const existingRecord = todaysAttendance.find(
        (record) => record.studentId === student.id,
      );
      initialState[student.id] = existingRecord ? existingRecord.status : null;
    });
    setAttendanceState(initialState);
  }, [selectedDate, selectedSubject, timeSlot, selectedClass]);

  const markStudentAttendance = (
    studentId: string,
    status: "present" | "absent" | "late",
  ) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const saveAttendance = async () => {
    if (!selectedSubject || !timeSlot) {
      alert("Please select subject and time slot");
      return;
    }

    const attendanceRecords = Object.entries(attendanceState)
      .filter(([_, status]) => status !== null)
      .map(([studentId, status]) => ({
        studentId,
        subjectId: selectedSubject,
        date: format(selectedDate, "yyyy-MM-dd"),
        status: status as "present" | "absent" | "late",
        timeSlot,
        markedBy: teacher.id,
        markedAt: new Date().toISOString(),
      }));

    markMultipleAttendance(attendanceRecords);
    alert(`Attendance saved for ${attendanceRecords.length} students!`);
  };

  const getAttendanceStats = (studentId: string) => {
    return calculateStudentStats(studentId);
  };

  const canSaveAttendance =
    selectedSubject &&
    timeSlot &&
    Object.values(attendanceState).some((status) => status !== null);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
          <p className="text-gray-600">
            Record student attendance for your classes
          </p>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Class Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Date Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(selectedDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Class Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Class</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Classes</SelectItem>
                    {teacher.classes.map((className) => (
                      <SelectItem key={className} value={className}>
                        {className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subject Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {teacherSubjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Time Slot Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Slot</label>
                <Select value={timeSlot} onValueChange={setTimeSlot}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      {filteredStudents.length > 0 && selectedSubject && timeSlot && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Students ({filteredStudents.length})
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAttendanceState({})}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button
                onClick={saveAttendance}
                disabled={!canSaveAttendance}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Attendance
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredStudents.map((student) => {
                const studentStats = getAttendanceStats(student.id);
                const currentStatus = attendanceState[student.id];

                return (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {student.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {student.rollNumber}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {student.class}-{student.section}
                          </Badge>
                          {studentStats && (
                            <Badge
                              variant={
                                studentStats.percentage >= 75
                                  ? "default"
                                  : "destructive"
                              }
                              className="text-xs"
                            >
                              {studentStats.percentage}% overall
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant={
                          currentStatus === "present" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          markStudentAttendance(student.id, "present")
                        }
                        className={
                          currentStatus === "present"
                            ? "bg-green-600 hover:bg-green-700"
                            : ""
                        }
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Present
                      </Button>
                      <Button
                        variant={
                          currentStatus === "late" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          markStudentAttendance(student.id, "late")
                        }
                        className={
                          currentStatus === "late"
                            ? "bg-yellow-600 hover:bg-yellow-700"
                            : ""
                        }
                      >
                        <Clock className="mr-1 h-4 w-4" />
                        Late
                      </Button>
                      <Button
                        variant={
                          currentStatus === "absent" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          markStudentAttendance(student.id, "absent")
                        }
                        className={
                          currentStatus === "absent"
                            ? "bg-red-600 hover:bg-red-700"
                            : ""
                        }
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Absent
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {(!selectedSubject || !timeSlot) && (
        <Card className="border-0 shadow-sm">
          <CardContent className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Ready to Mark Attendance
            </h3>
            <p className="text-gray-500">
              Please select a subject and time slot to view students and mark
              their attendance.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {Object.keys(attendanceState).length > 0 && (
        <Card className="border-0 shadow-sm bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-blue-800">
                Attendance Summary
              </div>
              <div className="flex space-x-4 text-sm">
                <span className="text-green-600 font-medium">
                  Present:{" "}
                  {
                    Object.values(attendanceState).filter(
                      (s) => s === "present",
                    ).length
                  }
                </span>
                <span className="text-yellow-600 font-medium">
                  Late:{" "}
                  {
                    Object.values(attendanceState).filter((s) => s === "late")
                      .length
                  }
                </span>
                <span className="text-red-600 font-medium">
                  Absent:{" "}
                  {
                    Object.values(attendanceState).filter((s) => s === "absent")
                      .length
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeacherAttendance;
