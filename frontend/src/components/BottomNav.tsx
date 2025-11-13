import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Heart, Calendar, BookOpen, User } from 'lucide-react';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/home', icon: Home, label: 'Discover' },
    { path: '/matches', icon: Heart, label: 'Matches' },
    { path: '/schedule', icon: Calendar, label: 'Schedule' },
    { path: '/learn', icon: BookOpen, label: 'Learn' },
    { path: '/complete-profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-lg mx-auto px-2 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all ${
                  active
                    ? 'text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon
                  className={`w-6 h-6 mb-1 ${
                    active ? 'fill-indigo-600' : ''
                  }`}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span className={`text-xs font-medium ${
                  active ? 'text-indigo-600' : 'text-gray-600'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
