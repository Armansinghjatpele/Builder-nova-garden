import { Student, StudentStats } from "@/types/student";
import { mockStudents } from "@/lib/studentData";
import { mockSubjects } from "@/lib/attendanceData";

// Use the attendance manager to get live data
export const calculateLiveStudentStats = (
  studentId: string,
  attendanceRecords: any[],
): StudentStats | null => {
  const student = mockStudents.find((s) => s.id === studentId);
  if (!student) return null;

  const studentRecords = attendanceRecords.filter(
    (record) => record.studentId === studentId,
  );

  const subjectWiseStats = mockSubjects.reduce(
    (acc, subject) => {
      const subjectRecords = studentRecords.filter(
        (record) => record.subjectId === subject.id,
      );
      const attendedClasses = subjectRecords.filter(
        (record) => record.status === "present" || record.status === "late",
      ).length;
      const lateCount = subjectRecords.filter(
        (record) => record.status === "late",
      ).length;
      const totalClasses = subjectRecords.length;

      acc[subject.id] = {
        subject,
        percentage:
          totalClasses > 0
            ? Math.round((attendedClasses / totalClasses) * 100)
            : 0,
        totalClasses,
        attendedClasses,
        lateCount,
      };
      return acc;
    },
    {} as StudentStats["subjectWiseStats"],
  );

  const totalClasses = studentRecords.length;
  const attendedClasses = studentRecords.filter(
    (record) => record.status === "present" || record.status === "late",
  ).length;

  return {
    student,
    totalClasses,
    attendedClasses,
    percentage:
      totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0,
    subjectWiseStats,
  };
};

export const getLiveStudentAttendanceByDate = (
  studentId: string,
  date: string,
  attendanceRecords: any[],
) => {
  return attendanceRecords.filter(
    (record) => record.studentId === studentId && record.date === date,
  );
};

export const getLiveStudentRecentAttendance = (
  studentId: string,
  days: number = 7,
  attendanceRecords: any[],
) => {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }

  return dates.map((date) => {
    const records = getLiveStudentAttendanceByDate(
      studentId,
      date,
      attendanceRecords,
    );
    const attendedClasses = records.filter(
      (record) => record.status === "present" || record.status === "late",
    ).length;
    return {
      date,
      records,
      totalClasses: records.length,
      attendedClasses,
    };
  });
};
