import React from 'react';
import { 
  isWeekend, 
  isSameDay,
  isSameMonth,
  startOfMonth,
  endOfMonth,
  addDays,
  differenceInDays,
  isAfter,
  startOfDay
} from 'date-fns';
import { HOLIDAYS_2024, HOLIDAYS_2025 } from '../data/holidays';
import { Activity } from '../types/activity';

interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  type: 'event' | 'dayOff';
  notes?: string;
}

interface MonthlyProgressProps {
  activities: Activity[];
  calendarEvents?: CalendarEvent[];
}

const isHoliday = (date: Date): boolean => {
  const allHolidays = [...HOLIDAYS_2024, ...HOLIDAYS_2025];
  return allHolidays.some(holiday => isSameDay(new Date(holiday.date), date));
};

const calculateRemainingBusinessDays = (daysOff: Date[], calendarEvents: CalendarEvent[]) => {
  const today = new Date();
  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  // Get all days in the current month
  const dayCount = differenceInDays(monthEnd, monthStart) + 1;
  const daysInMonth: Date[] = Array.from({ length: dayCount }, (_, i) => 
    addDays(monthStart, i)
  );

  // Filter for remaining business days (excluding weekends, holidays, and days off)
  const remainingDays = daysInMonth.filter((date: Date) => {
    // Only count days from today onwards
    if (date < today && isSameMonth(date, today)) {
      return false;
    }

    // Exclude weekends
    if (isWeekend(date)) {
      return false;
    }

    // Exclude holidays
    if (isHoliday(date)) {
      return false;
    }

    // Exclude days off
    if (daysOff.some(dayOff => isSameDay(dayOff, date))) {
      return false;
    }

    // Exclude days marked as day off in calendar events
    if (calendarEvents.some(event => 
      event.type === 'dayOff' && isSameDay(new Date(event.date), date)
    )) {
      return false;
    }

    return true;
  });

  return remainingDays.length;
};

export const MonthlyProgress: React.FC<MonthlyProgressProps> = ({ 
  activities,
  calendarEvents = []
}) => {
  const today = startOfDay(new Date());
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const monthlyGoal = 80;

  // Calculate total SALs this month
  const currentSALs = activities.filter(activity => 
    isSameMonth(new Date(activity.date), today)
  ).length;

  // Calculate working days left in the month
  const calculateRemainingWorkDays = () => {
    const dayCount = differenceInDays(monthEnd, today) + 1;
    const remainingDays = Array.from({ length: dayCount }, (_, i) => 
      addDays(today, i)
    ).filter(date => {
      // Exclude weekends
      if (isWeekend(date)) return false;

      // Exclude holidays
      if (isHoliday(date)) return false;

      // Exclude days marked as day off in calendar events
      if (calendarEvents.some(event => 
        event.type === 'dayOff' && isSameDay(new Date(event.date), date)
      )) return false;

      return true;
    });

    return remainingDays.length;
  };

  const workingDaysLeft = calculateRemainingWorkDays();
  const salNeeded = monthlyGoal - currentSALs;
  const dailyTarget = workingDaysLeft > 0 ? Math.ceil(salNeeded / workingDaysLeft) : 0;

  const progressPercentage = Math.min((currentSALs / monthlyGoal) * 100, 100);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Monthly Progress</h2>
      
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Progress ({currentSALs}/{monthlyGoal} SALs)</span>
          <span className="text-gray-600">{progressPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-gray-600">
          <span className="font-medium">{workingDaysLeft}</span> working days left this month
        </p>
        {salNeeded > 0 && (
          <p className="text-gray-600">
            Need <span className="font-medium">{dailyTarget}</span> SALs per day to reach goal
          </p>
        )}
        {salNeeded <= 0 && (
          <p className="text-green-600 font-medium">
            Monthly goal achieved! 🎉
          </p>
        )}
      </div>
    </div>
  );
};
