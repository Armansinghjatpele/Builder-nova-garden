import { useState, useEffect } from "react";
import {
  mockSubjects,
  mockAttendanceRecords,
  mockTimetable,
  calculateAttendanceStats,
  getRecentAttendance,
} from "@/lib/attendanceData";
import {
  Subject,
  AttendanceRecord,
  WeeklyTimetable,
  AttendanceStats,
  DayAttendance,
} from "@/types/attendance";

export const useAttendance = () => {
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >(mockAttendanceRecords);
  const [timetable, setTimetable] = useState<WeeklyTimetable>(mockTimetable);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [recentAttendance, setRecentAttendance] = useState<DayAttendance[]>([]);

  useEffect(() => {
    setStats(calculateAttendanceStats());
    setRecentAttendance(getRecentAttendance());
  }, [subjects, attendanceRecords]);

  const markAttendance = (
    subjectId: string,
    date: string,
    status: "present" | "absent" | "late",
    timeSlot: string,
  ) => {
    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      subjectId,
      date,
      status,
      timeSlot,
    };

    setAttendanceRecords((prev) => [...prev, newRecord]);

    // Update subject attendance counts
    setSubjects((prev) =>
      prev.map((subject) => {
        if (subject.id === subjectId) {
          return {
            ...subject,
            totalClasses: subject.totalClasses + 1,
            attendedClasses:
              status === "present" || status === "late"
                ? subject.attendedClasses + 1
                : subject.attendedClasses,
          };
        }
        return subject;
      }),
    );
  };

  const getAttendanceBySubject = (subjectId: string) => {
    return attendanceRecords.filter((record) => record.subjectId === subjectId);
  };

  const getAttendanceByDate = (date: string) => {
    return attendanceRecords.filter((record) => record.date === date);
  };

  return {
    subjects,
    attendanceRecords,
    timetable,
    stats,
    recentAttendance,
    markAttendance,
    getAttendanceBySubject,
    getAttendanceByDate,
    setSubjects,
    setTimetable,
  };
};
