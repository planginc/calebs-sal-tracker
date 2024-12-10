import React from 'react';
import { Activity } from '../types/activity';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ReferralsTabProps {
  activities: Activity[];
}

interface PieChartData {
  name: string;
  value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const ReferralsTab: React.FC<ReferralsTabProps> = ({ activities }) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyActivities = activities.filter(activity => {
    const activityDate = new Date(activity.date);
    return activityDate.getMonth() === currentMonth && activityDate.getFullYear() === currentYear;
  });

  const distribution = monthlyActivities.reduce<Record<string, number>>((acc, activity) => {
    if (activity.connectedWith) {
      acc[activity.connectedWith] = (acc[activity.connectedWith] || 0) + 1;
    }
    return acc;
  }, {});

  const totalActivities = monthlyActivities.length;

  const pieData: PieChartData[] = Object.entries(distribution).map(([name, value]) => ({
    name,
    value,
  }));

  const renderCustomLabel = ({ name, percent }: { name: string; percent: number }) => {
    return `${name} (${(percent * 100).toFixed(0)}%)`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">Referral Distribution Overview</h2>
        
        <div className="mb-8">
          <div className="text-gray-600 mb-1">Total Activities This Month</div>
          <div className="text-3xl font-bold">{totalActivities}</div>
        </div>

        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">Detailed Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(distribution).map(([teamMember]) => (
            <div key={teamMember} className="space-y-2">
              <h3 className="text-lg font-medium mb-2">{teamMember}</h3>
              <div className="flex justify-between items-center text-gray-600">
                <span>Referrals:</span>
                <span className="font-medium text-gray-900">{
                  monthlyActivities.filter(a => 
                    a.connectedWith === teamMember && 
                    a.type === 'referral'
                  ).length
                }</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Appointments:</span>
                <span className="font-medium text-gray-900">{
                  monthlyActivities.filter(a => 
                    a.connectedWith === teamMember && 
                    a.type === 'appointment'
                  ).length
                }</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
