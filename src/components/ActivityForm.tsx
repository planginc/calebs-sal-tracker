import React, { useState, useEffect } from 'react';
import { Activity } from '../types/activity';

interface Department {
  name: string;
  experts: string[];
}

interface ActivityFormProps {
  onSubmit: (activity: Activity) => void;
  departments: Department[];
}

interface ActivityFormData {
  date: string;
  contactName: string;
  connectedWith: string;
  notes: string;
  appointment: boolean;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({ onSubmit, departments }) => {
  const [formData, setFormData] = useState<ActivityFormData>(() => {
    const savedForm = localStorage.getItem('sal-tracker-form-draft');
    return savedForm ? JSON.parse(savedForm) : {
      date: new Date().toISOString().split('T')[0],
      contactName: '',
      connectedWith: '',
      notes: '',
      appointment: false
    };
  });

  // Save form draft to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sal-tracker-form-draft', JSON.stringify(formData));
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newActivity: Activity = {
      id: Date.now().toString(),
      date: formData.date,
      type: formData.appointment ? 'appointment' : 'referral',
      contact: formData.contactName,
      connectedWith: formData.connectedWith,
      appointmentBooked: formData.appointment,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSubmit(newActivity);

    // Clear form and draft after successful submission
    setFormData({
      date: new Date().toISOString().split('T')[0],
      contactName: '',
      connectedWith: '',
      notes: '',
      appointment: false
    });
    localStorage.removeItem('sal-tracker-form-draft');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Add New Sales Activity</h2>

      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="bg-white/95 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex-1">
          <input
            type="text"
            placeholder="Enter contact name"
            value={formData.contactName}
            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
            className="w-full bg-white/95 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex-1">
          <select
            value={formData.connectedWith}
            onChange={(e) => setFormData({ ...formData, connectedWith: e.target.value })}
            className="w-full bg-white/95 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select team member</option>
            {departments.map(dept => (
              <optgroup key={dept.name} label={dept.name}>
                {dept.experts.map(expert => (
                  <option key={expert} value={expert}>{expert}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.appointment}
            onChange={(e) => setFormData({ ...formData, appointment: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">Appointment (+$10)</span>
        </label>

        <div className="flex-1">
          <input
            type="text"
            placeholder="Add notes..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full bg-white/95 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="!bg-[#2563eb] hover:!bg-[#1d4ed8] text-white font-medium rounded-lg px-6 py-2"
        >
          Add Activity
        </button>
      </div>
    </form>
  );
};
