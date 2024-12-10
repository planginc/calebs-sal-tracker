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
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyActivities = activities.filter(activity => {
    const activityDate = new Date(activity.date);
    return activityDate.getMonth() === currentMonth && 
           activityDate.getFullYear() === currentYear;
  });

  const appointmentCount = monthlyActivities.filter(a => a.appointmentBooked).length;
  const appointmentRevenue = appointmentCount * 10;
  const referralCount = monthlyActivities.length;
  const referralRevenue = referralCount * 25;
  const totalRevenue = appointmentRevenue + referralRevenue;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Monthly Statistics</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Total Activities</p>
          <p className="text-xl font-medium">{monthlyActivities.length}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Appointments</p>
          <p className="text-xl font-medium">{appointmentCount}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-xl font-medium text-green-600">${totalRevenue.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Average Revenue per Activity</p>
          <p className="text-xl font-medium text-green-600">
            ${monthlyActivities.length > 0 
              ? (totalRevenue / monthlyActivities.length).toFixed(2) 
              : '0.00'}
          </p>
        </div>
      </div>
    </div>
  );
};
