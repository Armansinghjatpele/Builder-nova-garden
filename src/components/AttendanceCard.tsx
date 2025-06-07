import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Subject } from "@/types/attendance";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface AttendanceCardProps {
  subject: Subject;
  percentage: number;
  totalClasses: number;
  attendedClasses: number;
  variant?: "default" | "compact";
}

const AttendanceCard = ({
  subject,
  percentage,
  totalClasses,
  attendedClasses,
  variant = "default",
}: AttendanceCardProps) => {
  const getStatusColor = (percentage: number) => {
    if (percentage >= 85) return "text-green-600 bg-green-50 border-green-200";
    if (percentage >= 75)
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 85)
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (percentage >= 75) return <Clock className="h-4 w-4 text-yellow-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  if (variant === "compact") {
    return (
      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: subject.color }}
          />
          <div>
            <h3 className="font-medium text-gray-900">{subject.name}</h3>
            <p className="text-sm text-gray-500">{subject.code}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">
              {percentage}%
            </div>
            <div className="text-xs text-gray-500">
              {attendedClasses}/{totalClasses}
            </div>
          </div>
          {getStatusIcon(percentage)}
        </div>
      </div>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: subject.color }}
            />
            <div>
              <CardTitle className="text-lg font-semibold">
                {subject.name}
              </CardTitle>
              <p className="text-sm text-gray-500">{subject.code}</p>
            </div>
          </div>
          <Badge className={getStatusColor(percentage)}>
            {percentage >= 85
              ? "Good"
              : percentage >= 75
                ? "Warning"
                : "Critical"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Attendance
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {percentage}%
            </span>
          </div>
          <Progress
            value={percentage}
            className="h-2"
            style={{
              backgroundColor: "#f3f4f6",
            }}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-gray-900">
              {totalClasses}
            </div>
            <div className="text-xs text-gray-500">Total Classes</div>
          </div>
          <div>
            <div className="text-xl font-bold text-green-600">
              {attendedClasses}
            </div>
            <div className="text-xs text-gray-500">Attended</div>
          </div>
          <div>
            <div className="text-xl font-bold text-red-600">
              {totalClasses - attendedClasses}
            </div>
            <div className="text-xs text-gray-500">Missed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceCard;
