import { useAuth } from "@/hooks/useAuth";

const TestDashboard = () => {
  const { user, role } = useAuth();

  return (
    <div className="p-8 bg-white">
      <h1 className="text-2xl font-bold mb-4">Test Dashboard</h1>
      <p>User: {user?.name}</p>
      <p>Role: {role}</p>
      <p>
        This is a simple test component to check if the issue is with the
        original dashboard.
      </p>
    </div>
  );
};

export default TestDashboard;
