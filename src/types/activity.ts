export interface Department {
  name: string;
  experts: string[];
}

export const DEPARTMENTS: Department[] = [
  {
    name: 'MemberClicks',
    experts: ['Rory', 'Cam']
  },
  {
    name: 'A2Z Events',
    experts: ['Jeff', 'Jon']
  },
  {
    name: 'RegTech (GTR)',
    experts: ['Matt']
  },
  {
    name: 'Add-ons and Extensions',
    experts: ['Cindy', 'Haley']
  },
  {
    name: 'WildApricot',
    experts: ['Ben']
  }
];

export interface Activity {
  id: string;
  date: string;
  contact: string;
  connectedWith: string;
  appointmentBooked: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityStats {
  monthlyEarnings: number;
  appointmentRevenue: number;
  referralRevenue: number;
  totalSALs: number;
  totalAppointments: number;
}

export const PAYMENT_RULES = {
  BASE_SAL_PAYMENT: 25,
  APPOINTMENT_BONUS: 10,
} as const;

export const DEPARTMENTS_LIST = ['Matt', 'Other'] as const;
