import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SalesTeamMember {
  name: string;
  referrals: number;
  appointments: number;
}

interface ReferralDistributionProps {
  teamMembers: SalesTeamMember[];
}

export const ReferralDistribution: React.FC<ReferralDistributionProps> = ({ teamMembers }) => {
  const data: ChartData<'pie'> = {
    labels: teamMembers.map(member => member.name),
    datasets: [
      {
        data: teamMembers.map(member => member.referrals),
        backgroundColor: [
          'rgba(0, 122, 255, 0.8)',  // iOS blue
          'rgba(88, 86, 214, 0.8)',  // iOS purple
          'rgba(255, 45, 85, 0.8)',  // iOS pink
          'rgba(52, 199, 89, 0.8)',  // iOS green
          'rgba(255, 149, 0, 0.8)',  // iOS orange
          'rgba(90, 200, 250, 0.8)', // iOS light blue
          'rgba(175, 82, 222, 0.8)', // iOS light purple
          'rgba(255, 59, 48, 0.8)',  // iOS red
        ],
        borderColor: [
          'rgba(0, 122, 255, 1)',
          'rgba(88, 86, 214, 1)',
          'rgba(255, 45, 85, 1)',
          'rgba(52, 199, 89, 1)',
          'rgba(255, 149, 0, 1)',
          'rgba(90, 200, 250, 1)',
          'rgba(175, 82, 222, 1)',
          'rgba(255, 59, 48, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw as number;
            return `${label}: ${value} referral${value !== 1 ? 's' : ''}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Referral Distribution Overview</h2>
      <div className="w-full max-w-md mx-auto">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};
