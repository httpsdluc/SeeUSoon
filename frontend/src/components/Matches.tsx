import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Heart, MessageCircle, User, Calendar, Sparkles } from 'lucide-react';
import { matchesAPI } from '../services/api';
import { BottomNav } from './BottomNav';

export function Matches() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const studentData = localStorage.getItem('student');
    if (studentData) {
      const student = JSON.parse(studentData);
      setCurrentUser(student);
    }

    const fetchMatches = async () => {
      try {
        const studentId = localStorage.getItem('studentId');
        if (!studentId) {
          navigate('/login');
          return;
        }

        const response = await matchesAPI.getMatches(parseInt(studentId));
        setMatches(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching matches:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMatches();
  }, [navigate]);

  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading your matches...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pb-20">
      {/* Simple Header - Mobile First */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-4">
          <img 
            src="/seeusoon-logo.jpg" 
            alt="SeeUSoon" 
            className="h-10 w-auto mx-auto object-contain"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Matches</h1>
              <p className="text-gray-600 text-sm">
                {matches.length} {matches.length === 1 ? 'match' : 'matches'}
              </p>
            </div>
          </div>
        </div>

        {/* Matches Grid - Single Column on Mobile */}
        {matches.length > 0 ? (
          <div className="space-y-4">
            {matches.map((match) => (
              <Card key={match.id} className="overflow-hidden shadow-lg">
                {/* Profile Photo */}
                <div className="relative aspect-square bg-gradient-to-br from-indigo-400 to-purple-500">
                  {match.profile_photo ? (
                    <img
                      src={match.profile_photo}
                      alt={match.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-20 h-20 text-white/50" />
                    </div>
                  )}
                  
                  {/* Match Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-pink-500 text-white shadow-lg font-semibold">
                      <Heart className="w-3 h-3 mr-1 fill-white" />
                      Match!
                    </Badge>
                  </div>

                  {/* Name Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {match.name}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {match.major} • Year {match.year}
                    </p>
                  </div>
                </div>

                {/* Match Info */}
                <div className="p-4">
                  {/* School */}
                  {match.school && (
                    <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                      <span>🎓</span> {match.school}
                    </p>
                  )}

                  {/* Matched Date */}
                  <div className="bg-pink-50 rounded-lg p-3 mb-3">
                    <p className="text-xs text-pink-900 flex items-center gap-2 font-medium">
                      <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                      Matched {formatMatchDate(match.matched_at)}
                    </p>
                  </div>

                  {/* Bio Preview */}
                  {match.bio && (
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                      {match.bio}
                    </p>
                  )}

                  {/* Interests */}
                  {match.interests && match.interests.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {match.interests.slice(0, 3).map((interest: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                      {match.interests.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{match.interests.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Action Buttons - Stacked on Mobile */}
                  <div className="flex gap-2">
                    <Button
                      size="lg"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                      onClick={() => window.location.href = `/chat?userId=${match.id}`}
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Message
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="flex-1 border-2 font-semibold"
                      onClick={() => {/* TODO: Open schedule modal */}}
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Meet Up
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-12 h-12 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No matches yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start swiping to find your matches!
            </p>
            <Button 
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              onClick={() => navigate('/home')}
            >
              Start Browsing
            </Button>
          </div>
        )}

        {/* Call to Action - Better Contrast */}
        {matches.length > 0 && (
          <div className="mt-8">
            <Card className="p-6 bg-white border-2 border-indigo-200 text-center shadow-lg">
              <Sparkles className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Keep the momentum going!
              </h3>
              <p className="text-gray-700 mb-4">
                Browse more profiles to find even more matches
              </p>
              <Button 
                size="lg"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                onClick={() => navigate('/home')}
              >
                Continue Browsing
              </Button>
            </Card>
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
}
