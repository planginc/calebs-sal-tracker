import React, { useState, useMemo } from 'react';
import { Activity } from '../types/activity';

interface ActivityListProps {
  activities: Activity[];
  onEdit?: (activity: Activity) => void;
  onDelete?: (id: string) => void;
}

export const ActivityList: React.FC<ActivityListProps> = ({ 
  activities,
  onEdit,
  onDelete
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Activity | null>(null);
  
  // Filter states
  const [dateFilter, setDateFilter] = useState<string>('');
  const [contactFilter, setContactFilter] = useState<string>('');
  const [appointmentFilter, setAppointmentFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'unpaid'>('all');

  // Apply filters
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      // Date filter
      if (dateFilter && activity.date !== dateFilter) {
        return false;
      }

      // Contact filter
      if (contactFilter && !activity.contact.toLowerCase().includes(contactFilter.toLowerCase())) {
        return false;
      }

      // Appointment filter
      if (appointmentFilter === 'yes' && !activity.appointmentBooked) {
        return false;
      }
      if (appointmentFilter === 'no' && activity.appointmentBooked) {
        return false;
      }

      return true;
    });
  }, [activities, dateFilter, contactFilter, appointmentFilter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const handleEditClick = (activity: Activity) => {
    setEditingId(activity.id);
    setEditForm(activity);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleSaveEdit = (activity: Activity) => {
    if (onEdit && editForm) {
      onEdit(editForm);
    }
    setEditingId(null);
    setEditForm(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (editForm) {
      setEditForm(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          [name]: type === 'checkbox' 
            ? (e.target as HTMLInputElement).checked 
            : value
        };
      });
    }
  };

  const clearFilters = () => {
    setDateFilter('');
    setContactFilter('');
    setAppointmentFilter('all');
    setPaymentFilter('all');
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-40"
          />
          <input
            type="text"
            placeholder="Filter by contact"
            value={contactFilter}
            onChange={(e) => setContactFilter(e.target.value)}
            className="w-48"
          />
          <select
            value={appointmentFilter}
            onChange={(e) => setAppointmentFilter(e.target.value as 'all' | 'yes' | 'no')}
            className="w-48"
          >
            <option value="all">All Appointments</option>
            <option value="yes">With Appointment</option>
            <option value="no">Without Appointment</option>
          </select>
          {(dateFilter || contactFilter || appointmentFilter !== 'all') && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear Filters
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* Column Headers */}
          <div className="grid gap-4" style={{ gridTemplateColumns: "120px 150px 120px 80px 100px 1fr 100px" }}>
            <div className="px-4 py-2 font-medium text-gray-700">
              Date
            </div>
            <div className="px-4 py-2 font-medium text-gray-700">
              Contact
            </div>
            <div className="px-4 py-2 font-medium text-gray-700">
              Sales Rep
            </div>
            <div className="px-4 py-2 font-medium text-gray-700">
              Appt
            </div>
            <div className="px-4 py-2 font-medium text-gray-700">
              Amount
            </div>
            <div className="px-4 py-2 font-medium text-gray-700">
              Notes
            </div>
            <div className="px-4 py-2 font-medium text-gray-700 text-right">
              Actions
            </div>
          </div>

          {/* Activity Rows */}
          {filteredActivities.map((activity) => (
            <div key={activity.id}>
              {editingId === activity.id && editForm ? (
                // Edit Mode
                <>
                  <div className="grid gap-4" style={{ gridTemplateColumns: "120px 150px 120px 80px 100px 1fr 100px" }}>
                    <input
                      type="date"
                      name="date"
                      value={editForm.date}
                      onChange={handleInputChange}
                      className="text-sm border rounded px-2 py-1 w-full"
                    />
                    <input
                      type="text"
                      name="contact"
                      value={editForm.contact}
                      onChange={handleInputChange}
                      className="text-sm border rounded px-2 py-1 w-full"
                    />
                    <input
                      type="text"
                      name="connectedWith"
                      value={editForm.connectedWith}
                      onChange={handleInputChange}
                      className="text-sm border rounded px-2 py-1 w-full"
                    />
                    <input
                      type="checkbox"
                      name="appointmentBooked"
                      checked={editForm.appointmentBooked}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="text-sm text-green-600">
                      ${editForm.appointmentBooked ? '35.00' : '25.00'}
                    </div>
                    <textarea
                      name="notes"
                      value={editForm.notes}
                      onChange={handleInputChange}
                      className="text-sm border rounded px-2 py-1 w-full"
                      rows={2}
                    />
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSaveEdit(activity)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // View Mode
                <>
                  <div className="grid gap-4" style={{ gridTemplateColumns: "120px 150px 120px 80px 100px 1fr 100px" }}>
                    <div className="px-4 py-2 border rounded-md">
                      {formatDate(activity.date)}
                    </div>
                    <div className="px-4 py-2 border rounded-md">
                      {activity.contact}
                    </div>
                    <div className="px-4 py-2 border rounded-md">
                      {activity.connectedWith}
                    </div>
                    <div className="px-4 py-2 border rounded-md text-green-600">
                      {activity.appointmentBooked ? '$10.00' : '$0'}
                    </div>
                    <div className="px-4 py-2 border rounded-md text-green-600">
                      ${activity.appointmentBooked ? '35.00' : '25.00'}
                    </div>
                    <div className="px-4 py-2 border rounded-md">
                      {activity.notes}
                    </div>
                    <div className="px-4 py-2 flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEditClick(activity)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete?.(activity.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
