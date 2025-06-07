import { useState, useEffect } from "react";
import { StudentAttendanceRecord } from "@/types/student";
import { mockStudentAttendanceRecords } from "@/lib/studentData";

interface NewAttendanceRecord {
  studentId: string;
  subjectId: string;
  date: string;
  status: "present" | "absent" | "late";
  timeSlot: string;
  markedBy?: string;
  markedAt?: string;
}

export const useAttendanceManager = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<
    StudentAttendanceRecord[]
  >(mockStudentAttendanceRecords);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("attendanceRecords");
    if (stored) {
      try {
        const parsedRecords = JSON.parse(stored);
        setAttendanceRecords(parsedRecords);
      } catch (error) {
        console.error("Failed to parse stored attendance records:", error);
      }
    }
  }, []);

  // Save to localStorage whenever records change
  useEffect(() => {
    localStorage.setItem(
      "attendanceRecords",
      JSON.stringify(attendanceRecords),
    );
  }, [attendanceRecords]);

  const markAttendance = (record: NewAttendanceRecord) => {
    const newRecord: StudentAttendanceRecord = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...record,
      markedAt: record.markedAt || new Date().toISOString(),
    };

    // Remove existing record for same student, subject, date, and time slot
    setAttendanceRecords((prev) => {
      const filtered = prev.filter(
        (r) =>
          !(
            r.studentId === record.studentId &&
            r.subjectId === record.subjectId &&
            r.date === record.date &&
            r.timeSlot === record.timeSlot
          ),
      );
      return [...filtered, newRecord];
    });

    return newRecord;
  };

  const markMultipleAttendance = (records: NewAttendanceRecord[]) => {
    const newRecords: StudentAttendanceRecord[] = records.map((record) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...record,
      markedAt: record.markedAt || new Date().toISOString(),
    }));

    setAttendanceRecords((prev) => {
      // Remove existing records for the same date, subject, and time slot
      const filtered = prev.filter(
        (existingRecord) =>
          !records.some(
            (newRecord) =>
              existingRecord.studentId === newRecord.studentId &&
              existingRecord.subjectId === newRecord.subjectId &&
              existingRecord.date === newRecord.date &&
              existingRecord.timeSlot === newRecord.timeSlot,
          ),
      );
      return [...filtered, ...newRecords];
    });

    return newRecords;
  };

  const getAttendanceRecords = () => {
    return attendanceRecords;
  };

  const getStudentAttendanceRecords = (studentId: string) => {
    return attendanceRecords.filter((record) => record.studentId === studentId);
  };

  const getAttendanceByDate = (date: string) => {
    return attendanceRecords.filter((record) => record.date === date);
  };

  const getAttendanceBySubject = (subjectId: string) => {
    return attendanceRecords.filter((record) => record.subjectId === subjectId);
  };

  const getTodaysAttendance = (
    date: string,
    subjectId?: string,
    timeSlot?: string,
  ) => {
    return attendanceRecords.filter((record) => {
      const matchesDate = record.date === date;
      const matchesSubject = !subjectId || record.subjectId === subjectId;
      const matchesTimeSlot = !timeSlot || record.timeSlot === timeSlot;
      return matchesDate && matchesSubject && matchesTimeSlot;
    });
  };

  const deleteAttendanceRecord = (recordId: string) => {
    setAttendanceRecords((prev) =>
      prev.filter((record) => record.id !== recordId),
    );
  };

  const updateAttendanceRecord = (
    recordId: string,
    updates: Partial<StudentAttendanceRecord>,
  ) => {
    setAttendanceRecords((prev) =>
      prev.map((record) =>
        record.id === recordId ? { ...record, ...updates } : record,
      ),
    );
  };

  // Calculate real-time stats for a student
  const calculateLiveStudentStats = (studentId: string) => {
    const studentRecords = getStudentAttendanceRecords(studentId);
    const totalClasses = studentRecords.length;
    const attendedClasses = studentRecords.filter(
      (r) => r.status === "present" || r.status === "late",
    ).length;
    const percentage =
      totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;

    return {
      totalClasses,
      attendedClasses,
      percentage,
      records: studentRecords,
    };
  };

  return {
    attendanceRecords,
    markAttendance,
    markMultipleAttendance,
    getAttendanceRecords,
    getStudentAttendanceRecords,
    getAttendanceByDate,
    getAttendanceBySubject,
    getTodaysAttendance,
    deleteAttendanceRecord,
    updateAttendanceRecord,
    calculateLiveStudentStats,
  };
};
