import { Button } from './ui/button';
import { Card } from './ui/card';
import { Sparkles, Calendar, Heart, MessageCircle, Shield } from 'lucide-react';

interface WelcomeProps {
  onGetStarted: () => void;
}

export function Welcome({ onGetStarted }: WelcomeProps) {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Starters',
      description: 'Never worry about awkward first messages',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      icon: Calendar,
      title: 'Smart Calendar Sync',
      description: 'See when you both have free time',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      icon: Heart,
      title: 'Privacy First',
      description: 'Your data stays yours, always',
      color: 'text-pink-600',
      bg: 'bg-pink-50',
    },
    {
      icon: MessageCircle,
      title: 'Real Connections',
      description: 'Match by interests, not just looks',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center max-w-3xl mx-auto">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <img 
              src="/seeusoon-logo.jpg" 
              alt="SeeUSoon" 
              className="w-40 h-40 md:w-56 md:h-56 object-contain"
            />
          </div>

          {/* Headline */}
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your Match at
            <span className="text-indigo-600"> College</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-6">
            Calendar-syncing dating app exclusively for college students.
            <br />
            See when you both have free time to actually meet.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-base md:text-lg"
              onClick={onGetStarted}
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 text-base md:text-lg"
            >
              Learn More
            </Button>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>College students only • .edu email required</span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="p-4 md:p-6 text-center hover:shadow-lg transition-shadow">
              <div className={`w-12 h-12 ${feature.bg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">{feature.title}</h3>
              <p className="text-xs md:text-sm text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
