export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  totalClasses: number;
  attendedClasses: number;
}

export interface AttendanceRecord {
  id: string;
  subjectId: string;
  date: string;
  status: "present" | "absent" | "late";
  timeSlot: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  subject: Subject | null;
  day: string;
}

export interface WeeklyTimetable {
  [key: string]: TimeSlot[];
}

export interface AttendanceStats {
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  subjectWiseStats: {
    [subjectId: string]: {
      subject: Subject;
      percentage: number;
      totalClasses: number;
      attendedClasses: number;
    };
  };
}

export interface DayAttendance {
  date: string;
  records: AttendanceRecord[];
  totalClasses: number;
  attendedClasses: number;
}
