import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Camera, Edit, Settings, Bell, Shield, Heart } from 'lucide-react';

export function MyProfile() {
  const myInterests = [
    'Machine Learning',
    'React',
    'Coffee',
    'Photography',
    'Hiking',
    'Gaming',
  ];

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Profile Picture */}
      <div className="flex flex-col items-center space-y-3">
        <div className="relative">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1704748082631-84621da1dc59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwc3R1ZGVudCUyMHN0dWR5aW5nfGVufDF8fHx8MTc2MDYzMTU3N3ww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Your profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-indigo-200"
          />
          <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center">
          <h2 className="text-gray-900">Alex Rivera</h2>
          <p className="text-gray-600">Computer Science • Junior</p>
          <p className="text-gray-600 text-sm">UC Berkeley</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Edit className="w-4 h-4" />
          Edit Profile
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center">
          <div className="text-indigo-600">94%</div>
          <div className="text-xs text-gray-600 mt-1">Avg Match</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-indigo-600">12</div>
          <div className="text-xs text-gray-600 mt-1">Connections</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-indigo-600">8</div>
          <div className="text-xs text-gray-600 mt-1">Meetups</div>
        </Card>
      </div>

      {/* About */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-900">About Me</h3>
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-gray-600">
          Junior studying CS with a passion for AI and machine learning. Love coffee, 
          photography, and meeting new people. Always down for a study session or campus adventure!
        </p>
      </Card>

      {/* Interests */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-900">Interests</h3>
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {myInterests.map((interest, idx) => (
            <Badge key={idx} className="bg-indigo-100 text-indigo-700">
              {interest}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Settings */}
      <div className="space-y-3">
        <h3 className="text-gray-900">Settings</h3>

        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-600">Get notified of new matches</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-gray-900">Privacy Mode</p>
                <p className="text-sm text-gray-600">Only show to verified students</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-gray-900">Show Availability</p>
                <p className="text-sm text-gray-600">Let others see when you're free</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </Card>
      </div>

      {/* Account Actions */}
      <Card className="p-4 space-y-2">
        <Button variant="ghost" className="w-full justify-start text-gray-700">
          <Settings className="w-4 h-4 mr-2" />
          Account Settings
        </Button>
        <Button variant="ghost" className="w-full justify-start text-gray-700">
          Safety & Privacy
        </Button>
        <Button variant="ghost" className="w-full justify-start text-gray-700">
          Help & Support
        </Button>
        <Button variant="ghost" className="w-full justify-start text-red-600">
          Log Out
        </Button>
      </Card>
    </div>
  );
}
