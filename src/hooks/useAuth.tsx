import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Student } from "@/types/student";
import { findStudentByCredentials } from "@/lib/studentData";

interface AuthContextType {
  student: Student | null;
  isAuthenticated: boolean;
  login: (name: string, rollNumber: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved login state
    const savedStudent = localStorage.getItem("student");
    if (savedStudent) {
      try {
        setStudent(JSON.parse(savedStudent));
      } catch (error) {
        localStorage.removeItem("student");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (name: string, rollNumber: string): boolean => {
    const foundStudent = findStudentByCredentials(name, rollNumber);
    if (foundStudent) {
      setStudent(foundStudent);
      localStorage.setItem("student", JSON.stringify(foundStudent));
      return true;
    }
    return false;
  };

  const logout = () => {
    setStudent(null);
    localStorage.removeItem("student");
  };

  return (
    <AuthContext.Provider
      value={{
        student,
        isAuthenticated: !!student,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
