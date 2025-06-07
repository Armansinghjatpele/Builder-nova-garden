import {
  Student,
  StudentAttendanceRecord,
  StudentStats,
} from "@/types/student";
import { mockSubjects } from "@/lib/attendanceData";

export const mockStudents: Student[] = [
  {
    id: "std001",
    name: "John Smith",
    rollNumber: "CS2023001",
    email: "john.smith@school.edu",
    class: "12th",
    section: "A",
    avatar:
      "https://ui-avatars.com/api/?name=John+Smith&background=3B82F6&color=fff",
  },
  {
    id: "std002",
    name: "Emma Johnson",
    rollNumber: "CS2023002",
    email: "emma.johnson@school.edu",
    class: "12th",
    section: "A",
    avatar:
      "https://ui-avatars.com/api/?name=Emma+Johnson&background=10B981&color=fff",
  },
  {
    id: "std003",
    name: "Michael Brown",
    rollNumber: "CS2023003",
    email: "michael.brown@school.edu",
    class: "12th",
    section: "A",
    avatar:
      "https://ui-avatars.com/api/?name=Michael+Brown&background=F59E0B&color=fff",
  },
  {
    id: "std004",
    name: "Sophia Davis",
    rollNumber: "CS2023004",
    email: "sophia.davis@school.edu",
    class: "12th",
    section: "B",
    avatar:
      "https://ui-avatars.com/api/?name=Sophia+Davis&background=8B5CF6&color=fff",
  },
  {
    id: "std005",
    name: "William Wilson",
    rollNumber: "CS2023005",
    email: "william.wilson@school.edu",
    class: "12th",
    section: "B",
    avatar:
      "https://ui-avatars.com/api/?name=William+Wilson&background=EF4444&color=fff",
  },
  {
    id: "std006",
    name: "Olivia Miller",
    rollNumber: "CS2023006",
    email: "olivia.miller@school.edu",
    class: "12th",
    section: "A",
    avatar:
      "https://ui-avatars.com/api/?name=Olivia+Miller&background=06B6D4&color=fff",
  },
  {
    id: "std007",
    name: "James Moore",
    rollNumber: "CS2023007",
    email: "james.moore@school.edu",
    class: "12th",
    section: "B",
    avatar:
      "https://ui-avatars.com/api/?name=James+Moore&background=84CC16&color=fff",
  },
  {
    id: "std008",
    name: "Ava Taylor",
    rollNumber: "CS2023008",
    email: "ava.taylor@school.edu",
    class: "12th",
    section: "A",
    avatar:
      "https://ui-avatars.com/api/?name=Ava+Taylor&background=F97316&color=fff",
  },
  {
    id: "std009",
    name: "Benjamin Anderson",
    rollNumber: "CS2023009",
    email: "benjamin.anderson@school.edu",
    class: "12th",
    section: "B",
    avatar:
      "https://ui-avatars.com/api/?name=Benjamin+Anderson&background=EC4899&color=fff",
  },
  {
    id: "std010",
    name: "Isabella Thomas",
    rollNumber: "CS2023010",
    email: "isabella.thomas@school.edu",
    class: "12th",
    section: "A",
    avatar:
      "https://ui-avatars.com/api/?name=Isabella+Thomas&background=6366F1&color=fff",
  },
  {
    id: "std011",
    name: "Lucas Jackson",
    rollNumber: "CS2023011",
    email: "lucas.jackson@school.edu",
    class: "12th",
    section: "B",
    avatar:
      "https://ui-avatars.com/api/?name=Lucas+Jackson&background=14B8A6&color=fff",
  },
  {
    id: "std012",
    name: "Mia White",
    rollNumber: "CS2023012",
    email: "mia.white@school.edu",
    class: "12th",
    section: "A",
    avatar:
      "https://ui-avatars.com/api/?name=Mia+White&background=F59E0B&color=fff",
  },
  {
    id: "std013",
    name: "Henry Harris",
    rollNumber: "CS2023013",
    email: "henry.harris@school.edu",
    class: "12th",
    section: "B",
    avatar:
      "https://ui-avatars.com/api/?name=Henry+Harris&background=8B5CF6&color=fff",
  },
  {
    id: "std014",
    name: "Charlotte Martin",
    rollNumber: "CS2023014",
    email: "charlotte.martin@school.edu",
    class: "12th",
    section: "A",
    avatar:
      "https://ui-avatars.com/api/?name=Charlotte+Martin&background=EF4444&color=fff",
  },
  {
    id: "std015",
    name: "Alexander Garcia",
    rollNumber: "CS2023015",
    email: "alexander.garcia@school.edu",
    class: "12th",
    section: "B",
    avatar:
      "https://ui-avatars.com/api/?name=Alexander+Garcia&background=3B82F6&color=fff",
  },
];

export const generateStudentAttendanceRecords =
  (): StudentAttendanceRecord[] => {
    const records: StudentAttendanceRecord[] = [];
    const dates = [
      "2024-01-15",
      "2024-01-16",
      "2024-01-17",
      "2024-01-18",
      "2024-01-19",
      "2024-01-22",
      "2024-01-23",
      "2024-01-24",
    ];
    const timeSlots = [
      "09:00-10:00",
      "10:00-11:00",
      "11:00-12:00",
      "14:00-15:00",
      "15:00-16:00",
    ];

    mockStudents.forEach((student) => {
      dates.forEach((date) => {
        mockSubjects.forEach((subject, subjectIndex) => {
          // Generate 3-4 random classes per student per day
          const numClasses = Math.floor(Math.random() * 2) + 3;
          for (let i = 0; i < numClasses && i < timeSlots.length; i++) {
            const attendanceRate = 0.75 + Math.random() * 0.2; // 75-95% attendance rate per student
            const randomValue = Math.random();

            let status: "present" | "absent" | "late";
            if (randomValue < attendanceRate * 0.85) {
              status = "present";
            } else if (randomValue < attendanceRate * 0.95) {
              status = "late";
            } else {
              status = "absent";
            }

            records.push({
              id: `${student.id}-${subject.id}-${date}-${i}`,
              studentId: student.id,
              subjectId: subject.id,
              date,
              status,
              timeSlot: timeSlots[i],
              markedAt: new Date().toISOString(),
            });
          }
        });
      });
    });

    return records;
  };

export const mockStudentAttendanceRecords = generateStudentAttendanceRecords();

export const findStudentByCredentials = (
  name: string,
  rollNumber: string,
): Student | null => {
  return (
    mockStudents.find(
      (student) =>
        student.name.toLowerCase() === name.toLowerCase() &&
        student.rollNumber.toLowerCase() === rollNumber.toLowerCase(),
    ) || null
  );
};

export const getStudentAttendanceRecords = (
  studentId: string,
): StudentAttendanceRecord[] => {
  return mockStudentAttendanceRecords.filter(
    (record) => record.studentId === studentId,
  );
};

export const calculateStudentStats = (
  studentId: string,
): StudentStats | null => {
  const student = mockStudents.find((s) => s.id === studentId);
  if (!student) return null;

  const studentRecords = getStudentAttendanceRecords(studentId);

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

export const getStudentAttendanceByDate = (
  studentId: string,
  date: string,
): StudentAttendanceRecord[] => {
  return mockStudentAttendanceRecords.filter(
    (record) => record.studentId === studentId && record.date === date,
  );
};

export const getStudentRecentAttendance = (
  studentId: string,
  days: number = 7,
) => {
  const dates = [
    "2024-01-24",
    "2024-01-23",
    "2024-01-22",
    "2024-01-19",
    "2024-01-18",
    "2024-01-17",
    "2024-01-16",
  ];
  return dates.slice(0, days).map((date) => {
    const records = getStudentAttendanceByDate(studentId, date);
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
