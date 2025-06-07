import { useAttendance } from "@/hooks/useAttendance";
import TimetableGrid from "@/components/TimetableGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { TimeSlot } from "@/types/attendance";
import {
  Clock,
  Calendar,
  BookOpen,
  Edit,
  Download,
  Settings,
} from "lucide-react";

const Timetable = () => {
  const { timetable, subjects } = useAttendance();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const handleEditSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleAddSlot = (day: string, time: string) => {
    console.log(`Add slot for ${day} at ${time}`);
  };

  // Calculate timetable statistics
  const totalSlots = Object.values(timetable).flat().length;
  const occupiedSlots = Object.values(timetable)
    .flat()
    .filter((slot) => slot.subject !== null).length;
  const freeSlots = totalSlots - occupiedSlots;

  // Get subject distribution
  const subjectDistribution = subjects
    .map((subject) => {
      const count = Object.values(timetable)
        .flat()
        .filter((slot) => slot.subject?.id === subject.id).length;
      return { subject, count };
    })
    .filter((item) => item.count > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timetable</h1>
          <p className="text-gray-600">Manage your class schedule</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            Edit Schedule
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Time Slots
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSlots}</div>
            <div className="text-xs text-muted-foreground">Per week</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Occupied Slots
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {occupiedSlots}
            </div>
            <div className="text-xs text-muted-foreground">
              {Math.round((occupiedSlots / totalSlots) * 100)}% utilization
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Free Slots</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{freeSlots}</div>
            <div className="text-xs text-muted-foreground">
              Available for scheduling
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subjects
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subjectDistribution.length}
            </div>
            <div className="text-xs text-muted-foreground">
              In current schedule
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timetable Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Weekly Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TimetableGrid
            timetable={timetable}
            onEditSlot={handleEditSlot}
            onAddSlot={handleAddSlot}
          />
        </CardContent>
      </Card>

      {/* Subject Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Subject Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subjectDistribution.map(({ subject, count }) => (
                <div
                  key={subject.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    />
                    <div>
                      <div className="font-medium">{subject.name}</div>
                      <div className="text-sm text-gray-500">
                        {subject.code}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {count} {count === 1 ? "hour" : "hours"}/week
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Monday to Friday</span>
                <Badge>5 days</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Daily Hours</span>
                <Badge>6 hours</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Break Time</span>
                <Badge variant="secondary">12:00 - 13:00</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Weekly Hours</span>
                <Badge variant="outline">{occupiedSlots} hours</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start"
            >
              <Edit className="h-5 w-5 mb-2" />
              <div className="text-left">
                <div className="font-medium">Edit Schedule</div>
                <div className="text-xs text-gray-500">
                  Modify time slots and subjects
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start"
            >
              <Calendar className="h-5 w-5 mb-2" />
              <div className="text-left">
                <div className="font-medium">Add Subject</div>
                <div className="text-xs text-gray-500">
                  Include new subject in schedule
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start"
            >
              <Download className="h-5 w-5 mb-2" />
              <div className="text-left">
                <div className="font-medium">Export Schedule</div>
                <div className="text-xs text-gray-500">
                  Download as PDF or image
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Timetable;
