import { useAuth } from "@/hooks/useAuth";

const DebugAuth = () => {
  const { user, role, isAuthenticated, isLoading, isStudent, isTeacher } =
    useAuth();

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-400 rounded m-4">
      <h3 className="font-bold">Debug Auth State:</h3>
      <p>isLoading: {isLoading.toString()}</p>
      <p>isAuthenticated: {isAuthenticated.toString()}</p>
      <p>role: {role || "null"}</p>
      <p>isStudent: {isStudent.toString()}</p>
      <p>isTeacher: {isTeacher.toString()}</p>
      <p>user: {user ? user.name : "null"}</p>
    </div>
  );
};

export default DebugAuth;
