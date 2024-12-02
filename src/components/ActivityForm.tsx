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
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Contact Name</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Enter contact name"
              className="w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Connected With</label>
            <select
              value={connectedWith}
              onChange={(e) => setConnectedWith(e.target.value)}
              className="w-full"
              required
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
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-500">Appointment (+$10)</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes..."
            className="w-full h-24"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Activity
        </button>
      </form>
    </div>
  );
};
