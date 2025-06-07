export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email?: string;
  class: string;
  section: string;
  avatar?: string;
}

export interface StudentAttendanceRecord {
  id: string;
  studentId: string;
  subjectId: string;
  date: string;
  status: "present" | "absent" | "late";
  timeSlot: string;
  markedBy?: string;
  markedAt?: string;
}

export interface StudentStats {
  student: Student;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  subjectWiseStats: {
    [subjectId: string]: {
      subject: Subject;
      percentage: number;
      totalClasses: number;
      attendedClasses: number;
      lateCount: number;
    };
  };
}

export interface LoginCredentials {
  name: string;
  rollNumber: string;
}

import { Subject } from "./attendance";
