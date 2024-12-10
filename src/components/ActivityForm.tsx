import React, { useState, useEffect } from 'react';
import { Activity, DEPARTMENTS } from '../types/activity';

interface ActivityFormProps {
  onSubmit?: (activity: Activity) => void;
}

interface ActivityFormData {
  date: string;
  contactName: string;
  connectedWith: string;
  notes: string;
  appointment: boolean;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({ onSubmit }) => {
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

  // Save form draft as user types
  useEffect(() => {
    localStorage.setItem('sal-tracker-form-draft', JSON.stringify(formData));
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        id: Date.now().toString(),
        date: formData.date,
        contact: formData.contactName,
        connectedWith: formData.connectedWith,
        appointmentBooked: formData.appointment,
        notes: formData.notes,
      });
    }
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
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-medium">Add New Sales Activity</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="bg-white/95 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
            <input
              type="text"
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              placeholder="Enter contact name"
              className="bg-white/95 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Connected With</label>
            <select
              value={formData.connectedWith}
              onChange={(e) => setFormData({ ...formData, connectedWith: e.target.value })}
              className="bg-white/95 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select team member</option>
              {DEPARTMENTS.map((dept) => (
                <optgroup key={dept.name} label={dept.name}>
                  {dept.experts.map((expert) => (
                    <option key={expert} value={expert}>
                      {expert}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.appointment}
                onChange={(e) => setFormData({ ...formData, appointment: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Appointment (+$10)</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add notes..."
            rows={3}
            className="bg-white/95 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="mt-4 w-full !bg-[#2563eb] hover:!bg-[#1d4ed8] text-white font-medium rounded-lg px-6 py-3 
          focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 transition-colors duration-200"
        >
          Add Activity
        </button>
      </form>
    </div>
  );
};
