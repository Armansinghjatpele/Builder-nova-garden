import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceStats } from "@/types/attendance";

interface AttendanceChartProps {
  stats: AttendanceStats;
  type?: "bar" | "pie";
}

const AttendanceChart = ({ stats, type = "bar" }: AttendanceChartProps) => {
  const chartData = Object.values(stats.subjectWiseStats).map((item) => ({
    name: item.subject.name,
    code: item.subject.code,
    percentage: item.percentage,
    attended: item.attendedClasses,
    total: item.totalClasses,
    color: item.subject.color,
  }));

  const pieData = chartData.map((item) => ({
    name: item.code,
    value: item.attended,
    color: item.color,
  }));

  const COLORS = chartData.map((item) => item.color);

  if (type === "pie") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subject Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subject-wise Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="code"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value, name) => [`${value}%`, "Attendance"]}
              labelFormatter={(label) => {
                const subject = chartData.find((item) => item.code === label);
                return subject ? subject.name : label;
              }}
            />
            <Bar dataKey="percentage" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AttendanceChart;
