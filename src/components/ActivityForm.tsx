import React, { useState } from 'react';
import { Activity, DEPARTMENTS } from '../types/activity';

interface ActivityFormProps {
  onSubmit?: (activity: Activity) => void;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({ onSubmit }) => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  const [date, setDate] = useState(today);
  const [contact, setContact] = useState('');
  const [connectedWith, setConnectedWith] = useState('');
  const [appointmentBooked, setAppointmentBooked] = useState(false);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        id: Date.now().toString(),
        date,
        contact,
        connectedWith,
        appointmentBooked,
        notes,
      });
    }
    // Reset form except date
    setContact('');
    setConnectedWith('');
    setAppointmentBooked(false);
    setNotes('');
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
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-white/95 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Enter contact name"
              className="bg-white/95 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Connected With</label>
            <select
              value={connectedWith}
              onChange={(e) => setConnectedWith(e.target.value)}
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
                checked={appointmentBooked}
                onChange={(e) => setAppointmentBooked(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Appointment (+$10)</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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
