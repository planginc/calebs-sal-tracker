import React from 'react';
import { Activity } from '../types/activity';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ReferralsTabProps {
  activities: Activity[];
}

export const ReferralsTab: React.FC<ReferralsTabProps> = ({ activities }) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Filter activities for current month
  const monthlyActivities = activities.filter(activity => {
    const activityDate = new Date(activity.date);
    return activityDate.getMonth() === currentMonth && 
           activityDate.getFullYear() === currentYear;
  });

  // Calculate distribution by team member
  const distribution = monthlyActivities.reduce((acc, activity) => {
    const member = activity.connectedWith || 'Unassigned';
    acc[member] = (acc[member] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Prepare data for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const pieData = Object.entries(distribution).map(([name, value], index) => ({
    name,
    value,
    color: COLORS[index % COLORS.length]
  }));

  // Calculate total activities and percentages
  const totalActivities = monthlyActivities.length;

  return (
    <div className="space-y-6">
      <div className="bg-white/85 backdrop-blur-sm rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium mb-4">Referral Distribution Overview</h2>
        
        {/* Distribution Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Activities This Month</h3>
            <p className="text-2xl font-bold">{totalActivities}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Revenue</h3>
            <p className="text-2xl font-bold text-green-600">
              ${(totalActivities * 25).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Breakdown */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Detailed Breakdown</h3>
          <div className="space-y-2">
            {Object.entries(distribution).map(([member, count], index) => (
              <div key={member} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">{member}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">{count}</span>
                  <span className="text-gray-500 ml-1">
                    ({((count / totalActivities) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
