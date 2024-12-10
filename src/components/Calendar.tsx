import React, { useState, useEffect } from 'react';
import {
  format,
  getDate,
  getDaysInMonth,
  isToday,
  isSameDay,
  isSameMonth,
  startOfMonth,
  endOfMonth,
  isWeekend,
  addMonths,
  subMonths,
  getDay,
  addDays,
  lastDayOfMonth
} from 'date-fns';
import { HOLIDAYS_2024, HOLIDAYS_2025, Holiday } from '../data/holidays';

interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  type: 'event' | 'dayOff';
  notes?: string;
}

interface CalendarProps {
  events?: CalendarEvent[];
  onAddEvent?: (event: Omit<CalendarEvent, 'id'>) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onDeleteEvent?: (eventId: string) => void;
  onEditEvent?: (eventId: string, event: CalendarEvent) => void;
}

interface EditEventModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  onSave: (updatedEvent: CalendarEvent) => void;
}

const EditEventModal: React.FC<EditEventModalProps> = ({
  event,
  isOpen,
  onClose,
  onDelete,
  onSave
}) => {
  const [title, setTitle] = useState(event?.title || '');
  const [notes, setNotes] = useState(event?.notes || '');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setNotes(event.notes || '');
    }
  }, [event]);

  const handleSave = () => {
    if (event) {
      onSave({
        ...event,
        title,
        notes
      });
    }
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {event.type === 'dayOff' ? 'Edit Day Off' : 'Edit Event'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {event.type === 'dayOff' ? 'Reason (Optional)' : 'Title'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder={event.type === 'dayOff' ? 'e.g., Vacation, Personal Day' : 'Event Title'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 h-24 resize-none"
              placeholder="Add any additional notes..."
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-red-600 hover:text-red-700 font-medium"
            >
              Delete
            </button>
            <div className="space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Calendar: React.FC<CalendarProps> = ({
  events = [],
  onAddEvent,
  onEventUpdate,
  onDeleteEvent,
  onEditEvent
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const savedDate = localStorage.getItem('sal-tracker-selected-date');
    return savedDate ? new Date(savedDate) : new Date();
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [newEvent, setNewEvent] = useState<Omit<CalendarEvent, 'id'>>({
    date: new Date(),
    title: '',
    type: 'event',
    notes: ''
  });

  useEffect(() => {
    localStorage.setItem('sal-tracker-selected-date', selectedDate.toISOString());
  }, [selectedDate]);

  useEffect(() => {
    if (events.length > 0) {
      const parsedEvents = events.map(event => ({
        ...event,
        date: new Date(event.date)
      }));
    }
  }, [events]);

  const allHolidays = [...HOLIDAYS_2024, ...HOLIDAYS_2025];

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  // Generate calendar days including padding for previous and next month
  const generateCalendarDays = (date: Date): Date[] => {
    const start = startOfMonth(date);
    const end = lastDayOfMonth(date);
    const daysInMonth = getDaysInMonth(date);
    const startDay = getDay(start); // 0-6, where 0 is Sunday
    
    const days: Date[] = [];
    
    // Add previous month's days
    for (let i = 0; i < startDay; i++) {
      days.push(addDays(start, -startDay + i));
    }
    
    // Add current month's days
    for (let i = 0; i < daysInMonth; i++) {
      days.push(addDays(start, i));
    }
    
    // Add next month's days to complete the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days = 42
    for (let i = 0; i < remainingDays; i++) {
      days.push(addDays(end, i + 1));
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setNewEvent({
      date,
      title: '',
      type: 'event',
      notes: ''
    });
    setIsAddModalOpen(true);
  };

  const handleEventClick = (e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const handleDeleteEvent = () => {
    if (selectedEvent && onDeleteEvent) {
      onDeleteEvent(selectedEvent.id);
      setIsEditModalOpen(false);
      setSelectedEvent(null);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleAddEvent = () => {
    if (onAddEvent) {
      onAddEvent(newEvent);
    }
    setIsAddModalOpen(false);
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    if (onEventUpdate) {
      onEventUpdate(updatedEvent);
    }
    setIsEditModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="p-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 border border-gray-200 rounded-lg overflow-hidden">
        {/* Week day headers */}
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`
              p-2 text-center font-semibold bg-white border-b border-gray-200
              ${index === 0 || index === 6 ? 'text-gray-400' : 'text-gray-700'}
              ${index < 6 ? 'border-r border-gray-200' : ''}
            `}
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((date: Date) => {
          const isWeekendDay = isWeekend(date);
          const isCurrentMonth = isSameMonth(date, currentDate);
          const dayEvents = events.filter(event => 
            format(new Date(event.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
          );

          return (
            <button
              key={date.toString()}
              onClick={() => handleDateClick(date)}
              className={`
                min-h-[100px] p-2 relative border-b border-r border-gray-200
                hover:bg-gray-50 transition-colors
                ${!isCurrentMonth ? 'bg-gray-50' : 'bg-white'}
                ${isWeekendDay && isCurrentMonth ? 'bg-gray-50' : ''}
                ${isToday(date) ? 'border-2 border-blue-500' : ''}
              `}
            >
              <div className={`
                text-right mb-1
                ${!isCurrentMonth ? 'text-gray-400' : ''}
                ${isWeekendDay && isCurrentMonth ? 'text-gray-400' : ''}
                ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-700'}
                ${isToday(date) ? 'font-bold' : ''}
              `}>
                {format(date, 'd')}
              </div>

              {/* Events for the day */}
              <div className="space-y-1">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => handleEventClick(e, event)}
                    className={`
                      text-xs p-1 rounded cursor-pointer relative group
                      ${event.type === 'dayOff' 
                        ? 'bg-gray-100 text-gray-700' 
                        : 'bg-blue-100 text-blue-700'
                      }
                      hover:opacity-75
                    `}
                  >
                    {event.title || (event.type === 'dayOff' ? 'Day Off' : 'Event')}
                    
                    {/* Tooltip */}
                    {event.notes && (
                      <div className="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded py-1 px-2 left-1/2 transform -translate-x-1/2 -translate-y-full -mt-1 w-max max-w-xs">
                        {event.notes}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Holiday indicators */}
              {format(date, 'MM-dd') === '12-25' && (
                <div className="text-xs text-red-500">Christmas</div>
              )}
              {format(date, 'MM-dd') === '12-24' && (
                <div className="text-xs text-red-500">Christmas Eve</div>
              )}
              {format(date, 'MM-dd') === '01-01' && (
                <div className="text-xs text-red-500">New Year's Day</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Add Event Modal */}
      {isAddModalOpen && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg font-semibold mb-4">
              Add Event for {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type
                </label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent(prev => ({ 
                    ...prev, 
                    type: e.target.value as 'event' | 'dayOff'
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="event">Event</option>
                  <option value="dayOff">Day Off</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={newEvent.type === 'dayOff' ? 'e.g., Vacation, Personal Day' : 'Event Title'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={newEvent.notes}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any additional notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 h-24"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEvent}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {isEditModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg font-semibold mb-4">
              Edit Event for {format(new Date(selectedEvent.date), 'MMMM d, yyyy')}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type
                </label>
                <div className="text-gray-700">
                  {selectedEvent.type === 'dayOff' ? 'Day Off' : 'Event'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  value={selectedEvent.title}
                  onChange={(e) => setSelectedEvent(prev => prev ? { ...prev, title: e.target.value } : null)}
                  placeholder={selectedEvent.type === 'dayOff' ? 'e.g., Vacation, Personal Day' : 'Event Title'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={selectedEvent.notes || ''}
                  onChange={(e) => setSelectedEvent(prev => prev ? { ...prev, notes: e.target.value } : null)}
                  placeholder="Add any additional notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 h-24"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={handleDeleteEvent}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded"
                >
                  Delete
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setSelectedEvent(null);
                    }}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (selectedEvent && onEventUpdate) {
                        onEventUpdate(selectedEvent);
                      }
                      setIsEditModalOpen(false);
                      setSelectedEvent(null);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
