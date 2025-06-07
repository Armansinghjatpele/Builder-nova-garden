import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WeeklyTimetable, TimeSlot } from "@/types/attendance";
import { Edit, Plus, Clock } from "lucide-react";

interface TimetableGridProps {
  timetable: WeeklyTimetable;
  onEditSlot?: (slot: TimeSlot) => void;
  onAddSlot?: (day: string, time: string) => void;
}

const TimetableGrid = ({
  timetable,
  onEditSlot,
  onAddSlot,
}: TimetableGridProps) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00"];

  const getSlotForTime = (day: string, time: string): TimeSlot | null => {
    const daySchedule = timetable[day] || [];
    return daySchedule.find((slot) => slot.startTime === time) || null;
  };

  const isBreakTime = (time: string) => time === "12:00";

  return (
    <div className="overflow-x-auto">
      <div className="min-w-full">
        {/* Header */}
        <div className="grid grid-cols-6 gap-2 mb-4">
          <div className="p-3 text-center font-semibold text-gray-700 bg-gray-50 rounded-lg">
            Time
          </div>
          {days.map((day) => (
            <div
              key={day}
              className="p-3 text-center font-semibold text-gray-700 bg-gray-50 rounded-lg"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Time slots */}
        <div className="space-y-2">
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-6 gap-2">
              {/* Time column */}
              <div className="p-3 text-center font-medium text-gray-600 bg-gray-50 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 mr-2" />
                {time}:00
              </div>

              {/* Day columns */}
              {days.map((day) => {
                const slot = getSlotForTime(day, time);
                const isBreak = isBreakTime(time);

                if (isBreak) {
                  return (
                    <Card
                      key={`${day}-${time}`}
                      className="min-h-[80px] bg-gray-100"
                    >
                      <CardContent className="p-3 flex items-center justify-center">
                        <Badge variant="secondary" className="text-xs">
                          Break
                        </Badge>
                      </CardContent>
                    </Card>
                  );
                }

                if (slot && slot.subject) {
                  return (
                    <Card
                      key={`${day}-${time}`}
                      className="min-h-[80px] cursor-pointer hover:shadow-md transition-shadow"
                      style={{ backgroundColor: `${slot.subject.color}15` }}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: slot.subject.color }}
                          />
                          {onEditSlot && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => onEditSlot(slot)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="font-semibold text-sm leading-tight">
                            {slot.subject.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {slot.subject.code}
                          </div>
                          <div className="text-xs text-gray-500">
                            {slot.startTime} - {slot.endTime}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                }

                return (
                  <Card
                    key={`${day}-${time}`}
                    className="min-h-[80px] border-dashed border-gray-300"
                  >
                    <CardContent className="p-3 flex items-center justify-center">
                      {onAddSlot && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full h-full text-gray-400 hover:text-gray-600"
                          onClick={() => onAddSlot(day, time)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimetableGrid;
