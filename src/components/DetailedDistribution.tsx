import React from 'react';

interface SalesTeamMember {
  name: string;
  referrals: number;
  appointments: number;
}

interface DetailedDistributionProps {
  teamMembers: SalesTeamMember[];
}

export const DetailedDistribution: React.FC<DetailedDistributionProps> = ({ teamMembers }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Detailed Distribution</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <div key={member.name} className="space-y-2">
            <h3 className="font-medium text-gray-900">{member.name}</h3>
            <div className="text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Referrals:</span>
                <span className="font-medium text-gray-900">{member.referrals}</span>
              </div>
              <div className="flex justify-between">
                <span>Appointments:</span>
                <span className="font-medium text-gray-900">{member.appointments}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
