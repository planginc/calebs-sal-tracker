import React, { useState, useEffect } from 'react';
import { ActivityForm } from './components/ActivityForm';
import { ActivityList } from './components/ActivityList';
import { ActivityStats } from './components/ActivityStats';
import { MonthlyProgress } from './components/MonthlyProgress';
import { Calendar } from './components/Calendar';
import { ReferralsTab } from './components/ReferralsTab';
import { Activity } from './types/activity';
import { v4 as uuidv4 } from 'uuid';

type Tab = 'activities' | 'calendar' | 'referrals';

interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  type: 'event' | 'dayOff';
  notes?: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('activities');
  const [activities, setActivities] = useState<Activity[]>(() => {
    const savedActivities = localStorage.getItem('sal-tracker-activities');
    return savedActivities ? JSON.parse(savedActivities) : [
      {
        id: '1',
        date: new Date().toISOString(),
        contact: 'John Doe',
        connectedWith: 'Matt',
        appointmentBooked: false,
        notes: 'Initial contact with client',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const savedEvents = localStorage.getItem('sal-tracker-calendar');
    return savedEvents ? JSON.parse(savedEvents) : [];
  });

  const calculateRevenues = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyActivities = activities.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate.getMonth() === currentMonth && 
             activityDate.getFullYear() === currentYear;
    });

    const appointmentRevenue = monthlyActivities
      .filter(activity => activity.appointmentBooked)
      .length * 10; // $10 per appointment

    const referralCount = monthlyActivities.length; // Each activity counts as a SAL
    const referralRevenue = referralCount * 25; // $25 per SAL

    const totalEarnings = appointmentRevenue + referralRevenue;

    return {
      appointmentRevenue,
      appointmentCount: monthlyActivities.filter(activity => activity.appointmentBooked).length,
      referralRevenue,
      referralCount,
      totalEarnings
    };
  };

  const revenues = calculateRevenues();

  useEffect(() => {
    localStorage.setItem('sal-tracker-activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('sal-tracker-calendar', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  const handleAddActivity = (newActivity: Activity) => {
    setActivities(prevActivities => [...prevActivities, newActivity]);
  };

  const handleEditActivity = (editedActivity: Activity) => {
    setActivities(prevActivities =>
      prevActivities.map(activity =>
        activity.id === editedActivity.id ? editedActivity : activity
      )
    );
  };

  const handleDeleteActivity = (activityId: string) => {
    setActivities(prevActivities =>
      prevActivities.filter(activity => activity.id !== activityId)
    );
  };

  const handleAddCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: uuidv4(),
      date: new Date(event.date)
    };
    setCalendarEvents(prev => [...prev, newEvent]);
  };

  const handleUpdateCalendarEvent = (updatedEvent: CalendarEvent) => {
    const eventWithDateFixed = {
      ...updatedEvent,
      date: new Date(updatedEvent.date)
    };
    setCalendarEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventWithDateFixed.id ? eventWithDateFixed : event
      )
    );
  };

  const handleDeleteCalendarEvent = (eventId: string) => {
    setCalendarEvents(prevEvents => 
      prevEvents.filter(event => event.id !== eventId)
    );
  };

  const getDaysOff = () => {
    return calendarEvents
      .filter(event => event.type === 'dayOff')
      .map(event => new Date(event.date));
  };

  const tabs = ['activities', 'calendar', 'referrals'] as const;
  type Tab = typeof tabs[number];

  return (
    <div className="min-h-screen bg-gray-50 bg-opacity-80">
      <div className="bg-overlay"></div>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Caleb's SAL Tracker</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/85 backdrop-blur-sm rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Monthly Earnings</h3>
            <p className="text-2xl font-bold text-green-600">${revenues.totalEarnings.toFixed(2)}</p>
            <p className="text-xs text-gray-500">Total Commissions</p>
          </div>
          <div className="bg-white/85 backdrop-blur-sm rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Appointment Revenue</h3>
            <p className="text-2xl font-bold text-green-600">${revenues.appointmentRevenue.toFixed(2)}</p>
            <p className="text-xs text-gray-500">{revenues.appointmentCount} Appt</p>
          </div>
          <div className="bg-white/85 backdrop-blur-sm rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Referral Revenue</h3>
            <p className="text-2xl font-bold text-green-600">${revenues.referralRevenue.toFixed(2)}</p>
            <p className="text-xs text-gray-500">{revenues.referralCount} SAL</p>
          </div>
        </div>

        {/* Monthly Progress */}
        <div className="bg-white/85 backdrop-blur-sm rounded-lg shadow-sm p-6 mb-6">
          <MonthlyProgress 
            activities={activities} 
            calendarEvents={calendarEvents}
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 p-4 bg-white/85 backdrop-blur-sm rounded-lg shadow-sm mb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as Tab)}
              className={`
                tab-button px-6 py-3 rounded-lg font-medium text-base transition-colors duration-200
                ${activeTab === tab ? 'active' : ''}
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'activities' && (
          <div className="space-y-6">
            <div className="bg-white/85 backdrop-blur-sm rounded-lg shadow-sm p-6">
              <ActivityForm onSubmit={handleAddActivity} />
            </div>

            <div className="bg-white/85 backdrop-blur-sm rounded-lg shadow-sm p-6">
              <ActivityList 
                activities={activities}
                onEdit={handleEditActivity}
                onDelete={handleDeleteActivity}
              />
            </div>
            <div className="bg-white/85 backdrop-blur-sm rounded-lg shadow-sm p-6">
              <ActivityStats activities={activities} />
            </div>
          </div>
        )}
        {activeTab === 'calendar' && (
          <div className="bg-white/85 backdrop-blur-sm rounded-lg shadow-sm p-6">
            <Calendar
              events={calendarEvents}
              onAddEvent={handleAddCalendarEvent}
              onEventUpdate={handleUpdateCalendarEvent}
              onDeleteEvent={handleDeleteCalendarEvent}
            />
          </div>
        )}
        {activeTab === 'referrals' && (
          <div className="bg-white/85 backdrop-blur-sm rounded-lg shadow-sm p-6">
            <ReferralsTab />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
