import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Send, Sparkles, Calendar, MapPin } from 'lucide-react';
import { Input } from './ui/input';

interface ChatProps {
  selectedUser?: any;
  onSelectChat?: (user: any) => void;
}

const mockChats = [
  {
    id: 1,
    name: 'Sarah Chen',
    image: 'https://images.unsplash.com/photo-1525786210598-d527194d3e9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwc21pbGluZ3xlbnwxfHx8fDE3NjA2NzUwNDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    lastMessage: "That sounds great! See you at the library?",
    time: '2m ago',
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    image: 'https://images.unsplash.com/photo-1750926013403-407ff0b0db06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwc3R1ZGVudCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MDcxMDE3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    lastMessage: "Just finished my robotics project!",
    time: '1h ago',
    unread: 0,
    online: false,
  },
];

export function Chat({ selectedUser, onSelectChat }: ChatProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'them',
      text: "Hey! I saw you're into ML too 👋",
      time: '2:30 PM',
    },
    {
      id: 2,
      sender: 'me',
      text: "Yes! Just finished Andrew Ng's course. What are you working on?",
      time: '2:32 PM',
    },
    {
      id: 3,
      sender: 'them',
      text: "Cool! I'm building a sentiment analysis project. Want to grab coffee and chat about it?",
      time: '2:35 PM',
    },
    {
      id: 4,
      sender: 'me',
      text: "That sounds great! When are you free?",
      time: '2:36 PM',
    },
    {
      id: 5,
      sender: 'them',
      text: "I'm on campus until 6pm today. How about 4pm at the student center?",
      time: '2:38 PM',
    },
  ]);

  const handleSend = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: 'me',
          text: message,
          time: 'Just now',
        },
      ]);
      setMessage('');
    }
  };

  // If no user selected, show chat list
  if (!selectedUser) {
    return (
      <div className="px-4 py-6 space-y-4">
        <div>
          <h2 className="text-gray-900">Messages</h2>
          <p className="text-gray-600">Your active conversations</p>
        </div>

        <div className="space-y-3">
          {mockChats.map((chat) => (
            <Card
              key={chat.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onSelectChat?.(chat)}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ImageWithFallback
                    src={chat.image}
                    alt={chat.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-gray-900 truncate">{chat.name}</h4>
                    <span className="text-xs text-gray-500">{chat.time}</span>
                  </div>
                  <p className="text-gray-600 text-sm truncate">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <Badge className="bg-indigo-600">{chat.unread}</Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show individual chat
  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Chat Header */}
      <div className="px-4 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <ImageWithFallback
            src={selectedUser.image}
            alt={selectedUser.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="text-gray-900">{selectedUser.name}</h3>
            <p className="text-sm text-green-600">Online now</p>
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-200">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <p className="text-xs text-indigo-600 mb-1">Smart Suggestion</p>
            <p className="text-sm text-gray-700">
              You're both free Thursday 2-6pm. Perfect for a study session!
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                msg.sender === 'me'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p>{msg.text}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.sender === 'me' ? 'text-indigo-200' : 'text-gray-500'
                }`}
              >
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-3 border-t border-gray-200 bg-white">
        <div className="flex gap-2 mb-3">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Schedule
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            Share location
          </Button>
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            className="bg-indigo-600 hover:bg-indigo-700"
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
