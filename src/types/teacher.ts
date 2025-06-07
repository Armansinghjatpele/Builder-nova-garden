export interface Teacher {
  id: string;
  name: string;
  teacherId: string;
  email: string;
  department: string;
  subjects: string[];
  classes: string[];
  avatar?: string;
  role: "teacher";
}

export interface TeacherStats {
  totalStudents: number;
  totalClasses: number;
  averageAttendance: number;
  subjectsTeaching: number;
  classesTeaching: string[];
}

export interface ClassAttendance {
  date: string;
  subjectId: string;
  studentAttendance: {
    studentId: string;
    status: "present" | "absent" | "late";
    timeSlot: string;
  }[];
}

export type UserRole = "student" | "teacher";

export interface LoginCredentials {
  name: string;
  id: string;
  role: UserRole;
}
