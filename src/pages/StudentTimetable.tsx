import { useAuth } from "@/hooks/useAuth";
import { mockTimetable } from "@/lib/attendanceData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  Clock,
  Calendar,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const StudentTimetable = () => {
  const { user, isStudent } = useAuth();
  const [selectedDay, setSelectedDay] = useState("Monday");

  if (!user || !isStudent) return null;

  const student = user;

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const currentDayIndex = days.indexOf(selectedDay);

  const goToPreviousDay = () => {
    const prevIndex =
      currentDayIndex > 0 ? currentDayIndex - 1 : days.length - 1;
    setSelectedDay(days[prevIndex]);
  };

  const goToNextDay = () => {
    const nextIndex =
      currentDayIndex < days.length - 1 ? currentDayIndex + 1 : 0;
    setSelectedDay(days[nextIndex]);
  };

  const daySchedule = mockTimetable[selectedDay] || [];

  // Calculate timetable statistics
  const totalSlots = Object.values(mockTimetable).flat().length;
  const occupiedSlots = Object.values(mockTimetable)
    .flat()
    .filter((slot) => slot.subject !== null).length;

  // Get today's schedule
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todaySchedule = mockTimetable[today] || [];
  const nextClass = todaySchedule.find((slot) => {
    if (!slot.subject) return false;
    const now = new Date();
    const slotTime = new Date();
    const [hours, minutes] = slot.startTime.split(":");
    slotTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return slotTime > now;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-6">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Timetable</h1>
          <p className="text-gray-600">Your class schedule for the week</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <Clock className="w-5 h-5 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-blue-600">
                {occupiedSlots}
              </div>
              <div className="text-xs text-gray-500">Weekly Classes</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-5 h-5 text-green-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-green-600">5</div>
              <div className="text-xs text-gray-500">Subjects</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <Calendar className="w-5 h-5 text-purple-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-purple-600">6</div>
              <div className="text-xs text-gray-500">Hours/Day</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <Clock className="w-5 h-5 text-orange-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-orange-600">1</div>
              <div className="text-xs text-gray-500">Break Hour</div>
            </CardContent>
          </Card>
        </div>

        {/* Next Class Card */}
        {nextClass && today !== "Saturday" && today !== "Sunday" && (
          <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Clock className="mr-2 h-5 w-5 text-blue-600" />
                Next Class
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: nextClass.subject?.color }}
                  />
                  <div>
                    <div className="font-semibold">
                      {nextClass.subject?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {nextClass.subject?.code}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{nextClass.startTime}</div>
                  <div className="text-sm text-gray-500">Today</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Day Navigation */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <button
                onClick={goToPreviousDay}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                {selectedDay}
              </CardTitle>
              <button
                onClick={goToNextDay}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Day Selector */}
            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedDay === day
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {day.substring(0, 3)}
                </button>
              ))}
            </div>

            {/* Schedule for Selected Day */}
            <div className="space-y-3">
              {daySchedule.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="font-mono text-sm font-medium">
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </div>
                    {slot.subject ? (
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: slot.subject.color }}
                        />
                        <div>
                          <div className="font-medium text-sm">
                            {slot.subject.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {slot.subject.code}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-gray-300" />
                        <div>
                          <div className="font-medium text-sm text-gray-500">
                            Break
                          </div>
                          <div className="text-xs text-gray-400">
                            Lunch Break
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {slot.subject && (
                    <Badge
                      className="text-xs"
                      style={{
                        backgroundColor: `${slot.subject.color}20`,
                        color: slot.subject.color,
                        border: `1px solid ${slot.subject.color}30`,
                      }}
                    >
                      1 Hour
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Overview */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Weekly Schedule Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {days.map((day) => {
                const dayClasses =
                  mockTimetable[day]?.filter((slot) => slot.subject !== null) ||
                  [];
                const isToday = day === today;

                return (
                  <div
                    key={day}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      isToday
                        ? "bg-blue-50 border-blue-200"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedDay(day)}
                  >
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <div
                          className={`font-medium text-sm ${isToday ? "text-blue-700" : "text-gray-900"}`}
                        >
                          {day}
                          {isToday && (
                            <span className="ml-2 text-xs text-blue-600">
                              (Today)
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {dayClasses.length} classes scheduled
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {dayClasses.length} classes
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Schedule Summary */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-blue-50">
          <CardHeader>
            <CardTitle>Schedule Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">30</div>
                <div className="text-sm text-gray-600">Hours/Week</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">5</div>
                <div className="text-sm text-gray-600">Break Hours</div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white rounded-lg">
              <div className="text-sm text-gray-600">
                <strong>School Hours:</strong> 9:00 AM - 4:00 PM
              </div>
              <div className="text-sm text-gray-600">
                <strong>Lunch Break:</strong> 12:00 PM - 1:00 PM
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentTimetable;
