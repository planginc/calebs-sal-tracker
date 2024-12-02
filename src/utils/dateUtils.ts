export const HOLIDAYS_2024 = [
  { date: '2024-12-24', name: 'Christmas Eve' },
  { date: '2024-12-25', name: 'Christmas Day' },
];

export const HOLIDAYS_2025 = [
  { date: '2025-01-01', name: 'New Year\'s Day' },
  { date: '2025-01-20', name: 'Martin Luther King Day' },
  { date: '2025-03-07', name: 'Personal Wellness Day' },
  { date: '2025-04-18', name: 'Spring Holiday' },
  { date: '2025-05-26', name: 'Memorial Day' },
  { date: '2025-06-19', name: 'Juneteenth' },
  { date: '2025-07-04', name: 'Independence Day' },
  { date: '2025-09-01', name: 'Labor Day' },
  { date: '2025-10-13', name: 'US Wellness Day' },
  { date: '2025-11-11', name: 'Veteran\'s Day' },
  { date: '2025-11-27', name: 'US Thanksgiving Day' },
  { date: '2025-11-28', name: 'Day After Thanksgiving' },
  { date: '2025-12-24', name: 'Christmas Eve' },
  { date: '2025-12-25', name: 'Christmas Day' },
];

export interface CustomDayOff {
  date: string;
  reason?: string;
}

export function isHoliday(date: Date): boolean {
  const year = date.getFullYear();
  const holidays = year === 2024 ? HOLIDAYS_2024 : HOLIDAYS_2025;
  const dateString = date.toISOString().split('T')[0];
  return holidays.some(holiday => holiday.date === dateString);
}

export function isCustomDayOff(date: Date, customDaysOff: CustomDayOff[]): boolean {
  const dateString = date.toISOString().split('T')[0];
  return customDaysOff.some(dayOff => dayOff.date === dateString);
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
}

export function isBusinessDay(date: Date, customDaysOff: CustomDayOff[] = []): boolean {
  const dateString = date.toISOString().split('T')[0];
  const isWeekendDay = isWeekend(date);
  const isHolidayDay = isHoliday(date);
  const isDayOff = customDaysOff.some(d => d.date === dateString);
  
  return !isWeekendDay && !isHolidayDay && !isDayOff;
}

export function getBusinessDaysInMonth(year: number, month: number): number {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  let businessDays = 0;

  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    if (isBusinessDay(new Date(d))) {
      businessDays++;
    }
  }

  return businessDays;
}

export function getRemainingBusinessDays(year: number, month: number, currentDate: Date, customDaysOff: CustomDayOff[] = []): number {
  const endDate = new Date(year, month + 1, 0);
  let businessDays = 0;

  const startDate = new Date(currentDate);
  startDate.setHours(0, 0, 0, 0);

  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    const currentDay = new Date(d);
    if (isBusinessDay(currentDay, customDaysOff)) {
      businessDays++;
    }
  }

  return businessDays;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}
