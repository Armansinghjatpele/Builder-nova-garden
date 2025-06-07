import {
  Subject,
  AttendanceRecord,
  TimeSlot,
  WeeklyTimetable,
  AttendanceStats,
  DayAttendance,
} from "@/types/attendance";

export const mockSubjects: Subject[] = [
  {
    id: "1",
    name: "Mathematics",
    code: "MATH101",
    color: "#3B82F6",
    totalClasses: 45,
    attendedClasses: 42,
  },
  {
    id: "2",
    name: "Physics",
    code: "PHY101",
    color: "#10B981",
    totalClasses: 40,
    attendedClasses: 35,
  },
  {
    id: "3",
    name: "Chemistry",
    code: "CHEM101",
    color: "#F59E0B",
    totalClasses: 38,
    attendedClasses: 36,
  },
  {
    id: "4",
    name: "Computer Science",
    code: "CS101",
    color: "#8B5CF6",
    totalClasses: 50,
    attendedClasses: 48,
  },
  {
    id: "5",
    name: "English",
    code: "ENG101",
    color: "#EF4444",
    totalClasses: 35,
    attendedClasses: 33,
  },
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  // Recent records for demonstration
  {
    id: "1",
    subjectId: "1",
    date: "2024-01-15",
    status: "present",
    timeSlot: "09:00-10:00",
  },
  {
    id: "2",
    subjectId: "2",
    date: "2024-01-15",
    status: "present",
    timeSlot: "10:00-11:00",
  },
  {
    id: "3",
    subjectId: "3",
    date: "2024-01-15",
    status: "absent",
    timeSlot: "11:00-12:00",
  },
  {
    id: "4",
    subjectId: "4",
    date: "2024-01-15",
    status: "present",
    timeSlot: "14:00-15:00",
  },
  {
    id: "5",
    subjectId: "1",
    date: "2024-01-16",
    status: "late",
    timeSlot: "09:00-10:00",
  },
  {
    id: "6",
    subjectId: "5",
    date: "2024-01-16",
    status: "present",
    timeSlot: "15:00-16:00",
  },
  {
    id: "7",
    subjectId: "2",
    date: "2024-01-17",
    status: "present",
    timeSlot: "10:00-11:00",
  },
  {
    id: "8",
    subjectId: "3",
    date: "2024-01-17",
    status: "present",
    timeSlot: "11:00-12:00",
  },
  {
    id: "9",
    subjectId: "4",
    date: "2024-01-17",
    status: "present",
    timeSlot: "14:00-15:00",
  },
  {
    id: "10",
    subjectId: "1",
    date: "2024-01-18",
    status: "present",
    timeSlot: "09:00-10:00",
  },
];

export const mockTimetable: WeeklyTimetable = {
  Monday: [
    {
      id: "mon-1",
      startTime: "09:00",
      endTime: "10:00",
      subject: mockSubjects[0],
      day: "Monday",
    },
    {
      id: "mon-2",
      startTime: "10:00",
      endTime: "11:00",
      subject: mockSubjects[1],
      day: "Monday",
    },
    {
      id: "mon-3",
      startTime: "11:00",
      endTime: "12:00",
      subject: mockSubjects[2],
      day: "Monday",
    },
    {
      id: "mon-4",
      startTime: "12:00",
      endTime: "13:00",
      subject: null,
      day: "Monday",
    }, // Break
    {
      id: "mon-5",
      startTime: "14:00",
      endTime: "15:00",
      subject: mockSubjects[3],
      day: "Monday",
    },
    {
      id: "mon-6",
      startTime: "15:00",
      endTime: "16:00",
      subject: mockSubjects[4],
      day: "Monday",
    },
  ],
  Tuesday: [
    {
      id: "tue-1",
      startTime: "09:00",
      endTime: "10:00",
      subject: mockSubjects[1],
      day: "Tuesday",
    },
    {
      id: "tue-2",
      startTime: "10:00",
      endTime: "11:00",
      subject: mockSubjects[0],
      day: "Tuesday",
    },
    {
      id: "tue-3",
      startTime: "11:00",
      endTime: "12:00",
      subject: mockSubjects[3],
      day: "Tuesday",
    },
    {
      id: "tue-4",
      startTime: "12:00",
      endTime: "13:00",
      subject: null,
      day: "Tuesday",
    },
    {
      id: "tue-5",
      startTime: "14:00",
      endTime: "15:00",
      subject: mockSubjects[2],
      day: "Tuesday",
    },
    {
      id: "tue-6",
      startTime: "15:00",
      endTime: "16:00",
      subject: mockSubjects[4],
      day: "Tuesday",
    },
  ],
  Wednesday: [
    {
      id: "wed-1",
      startTime: "09:00",
      endTime: "10:00",
      subject: mockSubjects[2],
      day: "Wednesday",
    },
    {
      id: "wed-2",
      startTime: "10:00",
      endTime: "11:00",
      subject: mockSubjects[3],
      day: "Wednesday",
    },
    {
      id: "wed-3",
      startTime: "11:00",
      endTime: "12:00",
      subject: mockSubjects[0],
      day: "Wednesday",
    },
    {
      id: "wed-4",
      startTime: "12:00",
      endTime: "13:00",
      subject: null,
      day: "Wednesday",
    },
    {
      id: "wed-5",
      startTime: "14:00",
      endTime: "15:00",
      subject: mockSubjects[1],
      day: "Wednesday",
    },
    {
      id: "wed-6",
      startTime: "15:00",
      endTime: "16:00",
      subject: mockSubjects[4],
      day: "Wednesday",
    },
  ],
  Thursday: [
    {
      id: "thu-1",
      startTime: "09:00",
      endTime: "10:00",
      subject: mockSubjects[3],
      day: "Thursday",
    },
    {
      id: "thu-2",
      startTime: "10:00",
      endTime: "11:00",
      subject: mockSubjects[2],
      day: "Thursday",
    },
    {
      id: "thu-3",
      startTime: "11:00",
      endTime: "12:00",
      subject: mockSubjects[1],
      day: "Thursday",
    },
    {
      id: "thu-4",
      startTime: "12:00",
      endTime: "13:00",
      subject: null,
      day: "Thursday",
    },
    {
      id: "thu-5",
      startTime: "14:00",
      endTime: "15:00",
      subject: mockSubjects[0],
      day: "Thursday",
    },
    {
      id: "thu-6",
      startTime: "15:00",
      endTime: "16:00",
      subject: mockSubjects[4],
      day: "Thursday",
    },
  ],
  Friday: [
    {
      id: "fri-1",
      startTime: "09:00",
      endTime: "10:00",
      subject: mockSubjects[4],
      day: "Friday",
    },
    {
      id: "fri-2",
      startTime: "10:00",
      endTime: "11:00",
      subject: mockSubjects[0],
      day: "Friday",
    },
    {
      id: "fri-3",
      startTime: "11:00",
      endTime: "12:00",
      subject: mockSubjects[2],
      day: "Friday",
    },
    {
      id: "fri-4",
      startTime: "12:00",
      endTime: "13:00",
      subject: null,
      day: "Friday",
    },
    {
      id: "fri-5",
      startTime: "14:00",
      endTime: "15:00",
      subject: mockSubjects[3],
      day: "Friday",
    },
    {
      id: "fri-6",
      startTime: "15:00",
      endTime: "16:00",
      subject: mockSubjects[1],
      day: "Friday",
    },
  ],
};

export const calculateAttendanceStats = (): AttendanceStats => {
  const totalClasses = mockSubjects.reduce(
    (acc, subject) => acc + subject.totalClasses,
    0,
  );
  const attendedClasses = mockSubjects.reduce(
    (acc, subject) => acc + subject.attendedClasses,
    0,
  );

  const subjectWiseStats = mockSubjects.reduce(
    (acc, subject) => {
      acc[subject.id] = {
        subject,
        percentage: Math.round(
          (subject.attendedClasses / subject.totalClasses) * 100,
        ),
        totalClasses: subject.totalClasses,
        attendedClasses: subject.attendedClasses,
      };
      return acc;
    },
    {} as AttendanceStats["subjectWiseStats"],
  );

  return {
    totalClasses,
    attendedClasses,
    percentage: Math.round((attendedClasses / totalClasses) * 100),
    subjectWiseStats,
  };
};

export const getAttendanceByDate = (date: string): DayAttendance => {
  const records = mockAttendanceRecords.filter(
    (record) => record.date === date,
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
};

export const getRecentAttendance = (): DayAttendance[] => {
  const dates = ["2024-01-18", "2024-01-17", "2024-01-16", "2024-01-15"];
  return dates.map((date) => getAttendanceByDate(date));
};

export const getSubjectById = (id: string): Subject | undefined => {
  return mockSubjects.find((subject) => subject.id === id);
};
