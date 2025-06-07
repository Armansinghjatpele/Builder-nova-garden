import { Teacher, TeacherStats } from "@/types/teacher";
import { mockStudents, mockStudentAttendanceRecords } from "@/lib/studentData";
import { mockSubjects } from "@/lib/attendanceData";

export const mockTeachers: Teacher[] = [
  {
    id: "tch001",
    name: "Dr. Sarah Wilson",
    teacherId: "MATH001",
    email: "sarah.wilson@school.edu",
    department: "Mathematics",
    subjects: ["1"], // Mathematics
    classes: ["12th-A", "12th-B"],
    avatar:
      "https://ui-avatars.com/api/?name=Dr.+Sarah+Wilson&background=3B82F6&color=fff",
    role: "teacher",
  },
  {
    id: "tch002",
    name: "Prof. David Martinez",
    teacherId: "PHY001",
    email: "david.martinez@school.edu",
    department: "Physics",
    subjects: ["2"], // Physics
    classes: ["12th-A", "12th-B"],
    avatar:
      "https://ui-avatars.com/api/?name=Prof.+David+Martinez&background=10B981&color=fff",
    role: "teacher",
  },
  {
    id: "tch003",
    name: "Dr. Emily Chen",
    teacherId: "CHEM001",
    email: "emily.chen@school.edu",
    department: "Chemistry",
    subjects: ["3"], // Chemistry
    classes: ["12th-A", "12th-B"],
    avatar:
      "https://ui-avatars.com/api/?name=Dr.+Emily+Chen&background=F59E0B&color=fff",
    role: "teacher",
  },
  {
    id: "tch004",
    name: "Mr. James Rodriguez",
    teacherId: "CS001",
    email: "james.rodriguez@school.edu",
    department: "Computer Science",
    subjects: ["4"], // Computer Science
    classes: ["12th-A", "12th-B"],
    avatar:
      "https://ui-avatars.com/api/?name=Mr.+James+Rodriguez&background=8B5CF6&color=fff",
    role: "teacher",
  },
  {
    id: "tch005",
    name: "Ms. Lisa Thompson",
    teacherId: "ENG001",
    email: "lisa.thompson@school.edu",
    department: "English",
    subjects: ["5"], // English
    classes: ["12th-A", "12th-B"],
    avatar:
      "https://ui-avatars.com/api/?name=Ms.+Lisa+Thompson&background=EF4444&color=fff",
    role: "teacher",
  },
  {
    id: "tch006",
    name: "Dr. Michael Kumar",
    teacherId: "PRIN001",
    email: "michael.kumar@school.edu",
    department: "Administration",
    subjects: ["1", "2", "3", "4", "5"], // All subjects (Principal)
    classes: ["12th-A", "12th-B"],
    avatar:
      "https://ui-avatars.com/api/?name=Dr.+Michael+Kumar&background=6366F1&color=fff",
    role: "teacher",
  },
];

export const findTeacherByCredentials = (
  name: string,
  teacherId: string,
): Teacher | null => {
  return (
    mockTeachers.find(
      (teacher) =>
        teacher.name.toLowerCase() === name.toLowerCase() &&
        teacher.teacherId.toLowerCase() === teacherId.toLowerCase(),
    ) || null
  );
};

export const calculateTeacherStats = (
  teacherId: string,
): TeacherStats | null => {
  const teacher = mockTeachers.find((t) => t.id === teacherId);
  if (!teacher) return null;

  // Get students in teacher's classes
  const studentsInClasses = mockStudents.filter((student) =>
    teacher.classes.includes(`${student.class}-${student.section}`),
  );

  // Get all attendance records for teacher's subjects and students
  const relevantRecords = mockStudentAttendanceRecords.filter(
    (record) =>
      teacher.subjects.includes(record.subjectId) &&
      studentsInClasses.some((student) => student.id === record.studentId),
  );

  const totalClasses = relevantRecords.length;
  const attendedClasses = relevantRecords.filter(
    (record) => record.status === "present" || record.status === "late",
  ).length;

  return {
    totalStudents: studentsInClasses.length,
    totalClasses,
    averageAttendance:
      totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0,
    subjectsTeaching: teacher.subjects.length,
    classesTeaching: teacher.classes,
  };
};

export const getStudentsInTeacherClasses = (teacherId: string) => {
  const teacher = mockTeachers.find((t) => t.id === teacherId);
  if (!teacher) return [];

  return mockStudents.filter((student) =>
    teacher.classes.includes(`${student.class}-${student.section}`),
  );
};

export const getTeacherSubjectAttendance = (
  teacherId: string,
  subjectId: string,
) => {
  const teacher = mockTeachers.find((t) => t.id === teacherId);
  if (!teacher || !teacher.subjects.includes(subjectId)) return [];

  const studentsInClasses = getStudentsInTeacherClasses(teacherId);

  return mockStudentAttendanceRecords.filter(
    (record) =>
      record.subjectId === subjectId &&
      studentsInClasses.some((student) => student.id === record.studentId),
  );
};

export const getTeacherClassAttendanceByDate = (
  teacherId: string,
  date: string,
) => {
  const teacher = mockTeachers.find((t) => t.id === teacherId);
  if (!teacher) return [];

  const studentsInClasses = getStudentsInTeacherClasses(teacherId);

  return mockStudentAttendanceRecords.filter(
    (record) =>
      record.date === date &&
      teacher.subjects.includes(record.subjectId) &&
      studentsInClasses.some((student) => student.id === record.studentId),
  );
};

export const getStudentAttendanceForTeacher = (
  teacherId: string,
  studentId: string,
) => {
  const teacher = mockTeachers.find((t) => t.id === teacherId);
  if (!teacher) return [];

  return mockStudentAttendanceRecords.filter(
    (record) =>
      record.studentId === studentId &&
      teacher.subjects.includes(record.subjectId),
  );
};
