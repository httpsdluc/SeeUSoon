import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, Edit } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { scheduleAPI } from '../services/api';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function Schedule() {
  const navigate = useNavigate();
  const [meetups, setMeetups] = useState<any[]>([]);
  const [availability, setAvailability] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [showEditAvailability, setShowEditAvailability] = useState(false);
  const [editDay, setEditDay] = useState<number | null>(null);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      navigate('/login');
      return;
    }

    const userId = parseInt(studentId);
    setCurrentUserId(userId);

    const fetchData = async () => {
      try {
        const [meetupsRes, availabilityRes] = await Promise.all([
          scheduleAPI.getMeetups(userId),
          scheduleAPI.getAvailability(userId)
        ]);

        setMeetups(meetupsRes.data);
        setAvailability(availabilityRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching schedule:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleAddAvailability = async (dayOfWeek: number) => {
    if (!currentUserId) return;

    try {
      await scheduleAPI.setAvailability(currentUserId, dayOfWeek, startTime, endTime);
      
      const response = await scheduleAPI.getAvailability(currentUserId);
      setAvailability(response.data);
      
      setShowEditAvailability(false);
      setEditDay(null);
    } catch (error) {
      console.error('Error setting availability:', error);
    }
  };

  const handleConfirmMeetup = async (meetupId: number) => {
    try {
      await scheduleAPI.updateMeetupStatus(meetupId, 'confirmed');
      
      if (currentUserId) {
        const response = await scheduleAPI.getMeetups(currentUserId);
        setMeetups(response.data);
      }
    } catch (error) {
      console.error('Error confirming meetup:', error);
    }
  };

  const handleCancelMeetup = async (meetupId: number) => {
    try {
      await scheduleAPI.updateMeetupStatus(meetupId, 'cancelled');
      
      if (currentUserId) {
        const response = await scheduleAPI.getMeetups(currentUserId);
        setMeetups(response.data);
      }
    } catch (error) {
      console.error('Error cancelling meetup:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getAvailabilityForDay = (dayOfWeek: number) => {
    return availability.filter(a => a.day_of_week === dayOfWeek);
  };

  const upcomingMeetups = meetups.filter(m => {
    const meetupDate = new Date(m.meetup_date);
    return meetupDate >= new Date() || meetupDate.toDateString() === new Date().toDateString();
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading schedule...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pb-20">
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/home')}>
            ← Back
          </Button>
          <img 
            src="/seeusoon-logo.jpg" 
            alt="SeeUSoon" 
            className="h-10 w-auto object-contain"
          />
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Schedule</h1>
              <p className="text-gray-600">Manage your meetups and availability</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Meetups</h2>
          
          {upcomingMeetups.length > 0 ? (
            <div className="space-y-4">
              {upcomingMeetups.map((meetup) => (
                <Card key={meetup.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {meetup.other_user_photo ? (
                        <img
                          src={meetup.other_user_photo}
                          alt={meetup.other_user_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{meetup.other_user_name}</h3>
                          <p className="text-sm text-gray-600">{meetup.title}</p>
                        </div>
                        <Badge className={
                          meetup.status === 'confirmed' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-yellow-500 text-white'
                        }>
                          {meetup.status}
                        </Badge>
                      </div>

                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {formatDate(meetup.meetup_date)} at {formatTime(meetup.meetup_time)}
                        </div>
                        {meetup.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            {meetup.location}
                          </div>
                        )}
                      </div>

                      {meetup.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleConfirmMeetup(meetup.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                            onClick={() => handleCancelMeetup(meetup.id)}
                          >
                            Reschedule
                          </Button>
                        </div>
                      )}

                      {meetup.status === 'confirmed' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/chat?userId=${meetup.other_user_id}`)}
                          >
                            Message
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No upcoming meetups</p>
              <p className="text-sm text-gray-500 mt-1">Schedule a meetup with your matches!</p>
            </Card>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Your Availability This Week</h2>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowEditAvailability(!showEditAvailability)}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>

          {showEditAvailability && (
            <Card className="p-4 mb-4 bg-indigo-50 border-indigo-200">
              <h3 className="font-semibold text-gray-900 mb-3">Add Availability</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">Click a day to add this time slot:</p>
              <div className="grid grid-cols-7 gap-2">
                {SHORT_DAYS.map((day, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddAvailability(index)}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </Card>
          )}

          <div className="space-y-3">
            {DAYS.map((day, index) => {
              const daySlots = getAvailabilityForDay(index);
              const hasSlots = daySlots.length > 0;

              return (
                <Card 
                  key={index} 
                  className={`p-4 ${hasSlots ? 'bg-green-50 border-green-200' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {hasSlots && <Clock className="w-5 h-5 text-green-600" />}
                      <span className="font-medium text-gray-900">{day}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {daySlots.map((slot) => (
                        <Badge key={slot.id} variant="secondary">
                          {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                        </Badge>
                      ))}
                      {!hasSlots && (
                        <span className="text-sm text-gray-500">Not available</span>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
