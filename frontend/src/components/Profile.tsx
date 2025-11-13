import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MapPin, Book, Coffee, Calendar, Sparkles } from 'lucide-react';

interface ProfileProps {
  profile: any;
  onStartChat: (profile: any) => void;
}

export function Profile({ profile, onStartChat }: ProfileProps) {
  const conversationStarters = [
    { icon: '🤖', text: "What's your favorite ML framework?" },
    { icon: '☕', text: "Best coffee spot on campus?" },
    { icon: '🎵', text: "Any concert recommendations?" },
  ];

  const availability = [
    { day: 'Mon', available: true, time: '3pm - 6pm' },
    { day: 'Tue', available: false, time: 'Busy' },
    { day: 'Wed', available: true, time: '12pm - 4pm' },
    { day: 'Thu', available: true, time: '2pm - 6pm' },
    { day: 'Fri', available: true, time: '1pm - 5pm' },
  ];

  return (
    <div className="space-y-4">
      {/* Profile Image */}
      <div className="relative">
        <ImageWithFallback
          src={profile.image}
          alt={profile.name}
          className="w-full h-80 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
          <h2 className="text-white">{profile.name}, {profile.age}</h2>
          <p className="text-white/90">{profile.major} • {profile.year}</p>
        </div>
      </div>

      <div className="px-4 space-y-6 pb-6">
        {/* Match Score */}
        <Card className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/90 text-sm">Match Score</p>
              <div className="text-white">{profile.matchScore}% Compatible</div>
            </div>
            <Sparkles className="w-8 h-8" />
          </div>
        </Card>

        {/* About */}
        <div className="space-y-3">
          <h3 className="text-gray-900">About</h3>
          <p className="text-gray-600">
            CS major who loves building cool projects and exploring new coffee shops. 
            Always down to chat about tech, music, or grab a study session!
          </p>
        </div>

        {/* Commuter Info */}
        <div className="space-y-3">
          <h3 className="text-gray-900">Campus Availability</h3>
          <Card className="p-4 border-green-200 bg-green-50">
            <div className="flex items-center gap-2 text-green-700">
              <MapPin className="w-5 h-5" />
              <div>
                <p>{profile.commuterStatus}</p>
                <p className="text-sm text-green-600">Usually at library or engineering hall</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Interests */}
        <div className="space-y-3">
          <h3 className="text-gray-900">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest: string, idx: number) => (
              <Badge key={idx} className="bg-indigo-100 text-indigo-700 border-indigo-300">
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        {/* AI Conversation Starters */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="text-gray-900">AI Conversation Starters</h3>
          </div>
          <div className="space-y-2">
            {conversationStarters.map((starter, idx) => (
              <button
                key={idx}
                className="w-full text-left p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 hover:border-indigo-300 transition-colors"
              >
                <p className="text-gray-700">
                  <span className="mr-2">{starter.icon}</span>
                  {starter.text}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Weekly Availability */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h3 className="text-gray-900">This Week's Schedule</h3>
          </div>
          <div className="space-y-2">
            {availability.map((slot, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  slot.available
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <span className="text-gray-700">{slot.day}</span>
                <span
                  className={
                    slot.available ? 'text-green-700' : 'text-gray-500'
                  }
                >
                  {slot.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 sticky bottom-20 bg-white py-3">
          <Button
            variant="outline"
            className="flex-1"
          >
            Skip
          </Button>
          <Button
            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
            onClick={() => onStartChat(profile)}
          >
            Start Chatting
          </Button>
        </div>
      </div>
    </div>
  );
}
