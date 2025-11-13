import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { X, Calendar, Clock, MapPin } from 'lucide-react';
import { scheduleAPI } from '../services/api';

interface ScheduleMeetupModalProps {
  matchId: number;
  matchName: string;
  currentUserId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function ScheduleMeetupModal({ 
  matchId, 
  matchName, 
  currentUserId, 
  onClose, 
  onSuccess 
}: ScheduleMeetupModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    meetup_date: '',
    meetup_time: '12:00'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.title || !formData.meetup_date) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      await scheduleAPI.createMeetup({
        student1_id: currentUserId,
        student2_id: matchId,
        title: formData.title,
        location: formData.location,
        meetup_date: formData.meetup_date,
        meetup_time: formData.meetup_time,
        created_by: currentUserId
      });

      onSuccess();
    } catch (err: any) {
      setError('Failed to schedule meetup');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 bg-white shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Schedule Meetup</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          Propose a meetup with <span className="font-semibold">{matchName}</span>
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="mb-2 block">
              What's the plan? *
            </Label>
            <Input
              id="title"
              placeholder="Coffee & Study Session"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="location" className="mb-2 block flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </Label>
            <Input
              id="location"
              placeholder="Student Center Café"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="meetup_date" className="mb-2 block flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date *
              </Label>
              <Input
                id="meetup_date"
                type="date"
                value={formData.meetup_date}
                onChange={(e) => setFormData({ ...formData, meetup_date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div>
              <Label htmlFor="meetup_time" className="mb-2 block flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Time *
              </Label>
              <Input
                id="meetup_time"
                type="time"
                value={formData.meetup_time}
                onChange={(e) => setFormData({ ...formData, meetup_time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={loading}
            >
              {loading ? 'Scheduling...' : 'Send Proposal'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
