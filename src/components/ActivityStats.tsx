import React from 'react';
import { Activity } from '../types/activity';

interface StatsCardProps {
  title: string;
  amount: string;
  subtitle?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, amount, subtitle }) => (
  <div>
    <h3 className="text-lg font-medium text-gray-600 mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-900">${amount}</p>
    {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
  </div>
);

interface ActivityStatsProps {
  activities: Activity[];
}

export const ActivityStats: React.FC<ActivityStatsProps> = ({ activities }) => {
  const totalAppointments = activities.filter(a => a.appointmentBooked).length;
  const totalEarnings = totalAppointments * 10; // $10 per appointment

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard title="Monthly Earnings" amount={totalEarnings.toFixed(2)} subtitle="Total Commissions" />
      <StatsCard title="Appointment Revenue" amount={(totalAppointments * 10).toFixed(2)} subtitle={`${totalAppointments} Appt`} />
      <StatsCard title="Referral Revenue" amount="25.00" subtitle="1 SAL" />
    </div>
  );
};
