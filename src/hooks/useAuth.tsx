import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Student } from "@/types/student";
import { Teacher, UserRole } from "@/types/teacher";
import { findStudentByCredentials } from "@/lib/studentData";
import { findTeacherByCredentials } from "@/lib/teacherData";

interface AuthContextType {
  user: Student | Teacher | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (name: string, id: string, role: UserRole) => boolean;
  logout: () => void;
  isLoading: boolean;
  isStudent: boolean;
  isTeacher: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Student | Teacher | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved login state
    const savedUser = localStorage.getItem("user");
    const savedRole = localStorage.getItem("userRole");

    if (savedUser && savedRole) {
      try {
        setUser(JSON.parse(savedUser));
        setRole(savedRole as UserRole);
      } catch (error) {
        localStorage.removeItem("user");
        localStorage.removeItem("userRole");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (name: string, id: string, selectedRole: UserRole): boolean => {
    let foundUser: Student | Teacher | null = null;

    if (selectedRole === "student") {
      foundUser = findStudentByCredentials(name, id);
    } else if (selectedRole === "teacher") {
      foundUser = findTeacherByCredentials(name, id);
    }

    if (foundUser) {
      setUser(foundUser);
      setRole(selectedRole);
      localStorage.setItem("user", JSON.stringify(foundUser));
      localStorage.setItem("userRole", selectedRole);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
        isStudent: role === "student",
        isTeacher: role === "teacher",
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
