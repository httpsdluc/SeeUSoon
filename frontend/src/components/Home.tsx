import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Sparkles, Clock, User, Heart, X, MessageCircle, MapPin, AlertCircle, Calendar, LogOut } from 'lucide-react';
import { studentsAPI, matchesAPI } from '../services/api';
import { BottomNav } from './BottomNav';

interface HomeProps {
  onViewProfile?: (profile: any) => void;
  onStartChat?: (profile: any) => void;
}

export function Home({ onViewProfile, onStartChat }: HomeProps) {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [matchModal, setMatchModal] = useState<any>(null);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState('');
  const [showCompleteBanner, setShowCompleteBanner] = useState(false);

  useEffect(() => {
    const studentData = localStorage.getItem('student');
    if (studentData) {
      const student = JSON.parse(studentData);
      setCurrentUser(student);
      
      const isIncomplete = !student.bio && (!student.interests || student.interests.length === 0) && !student.prompt1_answer && !student.prompt2_answer;
      setShowCompleteBanner(isIncomplete);
    }

    const fetchStudents = async () => {
      try {
        const response = await studentsAPI.getAll();
        const currentUserId = localStorage.getItem('studentId');
        const otherProfiles = response.data.filter(
          (profile: any) => profile.id.toString() !== currentUserId
        );
        setProfiles(otherProfiles);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('student');
    localStorage.removeItem('studentId');
    navigate('/login');
  };

  const handleLike = async () => {
    if (!currentUser || currentIndex >= profiles.length) return;
    const likedProfile = profiles[currentIndex];

    try {
      const response = await matchesAPI.like(currentUser.id, likedProfile.id);
      
      if (response.data.match) {
        setMatchModal(response.data.matchedUser);
      }

      setCurrentIndex(currentIndex + 1);
    } catch (err: any) {
      console.error('Error liking profile:', err);
    }
  };

  const handlePass = () => {
    if (currentIndex < profiles.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const currentProfile = profiles[currentIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading profiles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 pb-20">
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">SeeUSoon</h1>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-red-600"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {showCompleteBanner && (
        <div className="max-w-lg mx-auto mt-4 px-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-yellow-800">
                <strong>Complete your profile!</strong> Add a bio, interests, and answer prompts to help others get to know you better.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto px-4 py-6">
        {currentIndex >= profiles.length ? (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">You're all caught up!</h2>
            <p className="text-gray-600 mb-4">Check back later for more profiles</p>
            <Button 
              onClick={() => setCurrentIndex(0)}
              className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white"
            >
              Start Over
            </Button>
          </Card>
        ) : currentProfile ? (
          <Card className="overflow-hidden">
            {currentProfile.profile_photo && (
              <div className="relative h-96">
                <img
                  src={currentProfile.profile_photo}
                  alt={currentProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{currentProfile.name}</h2>
                  <p className="text-gray-600">{currentProfile.school}</p>
                  <p className="text-sm text-gray-500">{currentProfile.major} • Year {currentProfile.year}</p>
                </div>
              </div>

              {currentProfile.prompt1_answer && (
                <div className="mb-4 bg-pink-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-pink-900 mb-1">{currentProfile.prompt1_question}</p>
                  <p className="text-gray-700">{currentProfile.prompt1_answer}</p>
                </div>
              )}

              {currentProfile.prompt2_answer && (
                <div className="mb-4 bg-pink-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-pink-900 mb-1">{currentProfile.prompt2_question}</p>
                  <p className="text-gray-700">{currentProfile.prompt2_answer}</p>
                </div>
              )}

              {currentProfile.bio && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-gray-700">{currentProfile.bio}</p>
                </div>
              )}

              {currentProfile.interests && currentProfile.interests.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.interests.map((interest: string, idx: number) => (
                      <Badge key={idx} variant="secondary">{interest}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {currentProfile.hobbies && currentProfile.hobbies.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Hobbies</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.hobbies.map((hobby: string, idx: number) => (
                      <Badge key={idx} variant="outline">{hobby}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <Button
                  onClick={handlePass}
                  variant="outline"
                  size="lg"
                  className="flex-1 border-2 hover:bg-gray-50"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </Button>
                <Button
                  onClick={handleLike}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white"
                >
                  <Heart className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </Card>
        ) : null}
      </div>

      {matchModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">It's a Match! 💕</h2>
            <p className="text-gray-600 mb-6">
              You and {matchModal.name} liked each other!
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setMatchModal(null)}
                variant="outline"
                className="flex-1"
              >
                Keep Swiping
              </Button>
              <Button
                onClick={() => {
                  setMatchModal(null);
                  if (onStartChat) onStartChat(matchModal);
                }}
                className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </Card>
        </div>
      )}

      <BottomNav active="home" />
    </div>
  );
}
