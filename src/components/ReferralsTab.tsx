import React, { useState } from 'react';
import { ReferralDistribution } from './ReferralDistribution';
import { DetailedDistribution } from './DetailedDistribution';

interface SalesTeamMember {
  name: string;
  referrals: number;
  appointments: number;
}

export const ReferralsTab: React.FC = () => {
  // This would eventually come from your backend/state management
  const [teamMembers] = useState<SalesTeamMember[]>([
    { name: 'Matt', referrals: 1, appointments: 1 },
    { name: 'Rory', referrals: 0, appointments: 0 },
    { name: 'Cam', referrals: 0, appointments: 0 },
    { name: 'Garrett', referrals: 0, appointments: 0 },
    { name: 'Jeff', referrals: 0, appointments: 0 },
    { name: 'Jon', referrals: 0, appointments: 0 },
    { name: 'Cindy', referrals: 0, appointments: 0 },
    { name: 'Haley', referrals: 0, appointments: 0 },
    { name: 'Ben', referrals: 0, appointments: 0 },
  ]);

  return (
    <div className="p-6 space-y-6">
      <ReferralDistribution teamMembers={teamMembers} />
      <DetailedDistribution teamMembers={teamMembers} />
    </div>
  );
};
