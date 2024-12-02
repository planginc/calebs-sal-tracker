export interface Holiday {
  date: Date;
  name: string;
}

export const HOLIDAYS_2024: Holiday[] = [
  { date: new Date('2024-01-01T00:00:00'), name: "New Year's Day" },         // Wednesday
  { date: new Date('2024-01-15T00:00:00'), name: "Martin Luther King Day" }, // Monday
  { date: new Date('2024-03-08T00:00:00'), name: "Monthly Wellness Day" },   // Friday
  { date: new Date('2024-04-19T00:00:00'), name: "Spring Holiday" },         // Friday
  { date: new Date('2024-05-27T00:00:00'), name: "Memorial Day" },           // Monday
  { date: new Date('2024-06-23T00:00:00'), name: "Juneteenth" },            // Thursday
  { date: new Date('2024-09-02T00:00:00'), name: "Labor Day" },             // Monday
  { date: new Date('2024-10-14T00:00:00'), name: "US Wellness Day" },        // Monday
  { date: new Date('2024-11-11T00:00:00'), name: "Veterans Day" },          // Tuesday
  { date: new Date('2024-11-28T00:00:00'), name: "US Thanksgiving Day" },    // Thursday
  { date: new Date('2024-11-29T00:00:00'), name: "Day After Thanksgiving" }, // Friday
  { date: new Date('2024-12-24T00:00:00'), name: "Christmas Eve" },         // Tuesday
  { date: new Date('2024-12-25T00:00:00'), name: "Christmas Day" }          // Wednesday
];

// For 2025, we'll use the same holidays but adjust the dates to fall on the correct weekdays
export const HOLIDAYS_2025: Holiday[] = [
  { date: new Date('2025-01-01T00:00:00'), name: "New Year's Day" },         // Wednesday
  { date: new Date('2025-01-20T00:00:00'), name: "Martin Luther King Day" }, // Monday
  { date: new Date('2025-03-07T00:00:00'), name: "Monthly Wellness Day" },   // Friday
  { date: new Date('2025-04-18T00:00:00'), name: "Spring Holiday" },         // Friday
  { date: new Date('2025-05-26T00:00:00'), name: "Memorial Day" },           // Monday
  { date: new Date('2025-06-19T00:00:00'), name: "Juneteenth" },            // Thursday
  { date: new Date('2025-09-01T00:00:00'), name: "Labor Day" },             // Monday
  { date: new Date('2025-10-13T00:00:00'), name: "US Wellness Day" },        // Monday
  { date: new Date('2025-11-11T00:00:00'), name: "Veterans Day" },          // Tuesday
  { date: new Date('2025-11-27T00:00:00'), name: "US Thanksgiving Day" },    // Thursday
  { date: new Date('2025-11-28T00:00:00'), name: "Day After Thanksgiving" }, // Friday
  { date: new Date('2025-12-24T00:00:00'), name: "Christmas Eve" },         // Wednesday
  { date: new Date('2025-12-25T00:00:00'), name: "Christmas Day" }          // Thursday
];
