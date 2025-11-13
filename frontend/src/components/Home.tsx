import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Sparkles, Clock, User, Heart, X, MessageCircle, MapPin, AlertCircle, Calendar } from 'lucide-react';
import { studentsAPI, matchesAPI } from '../services/api';
import { BottomNav } from './BottomNav';

interface HomeProps {
  onViewProfile?: (profile: any) => void;
  onStartChat?: (profile: any) => void;
}

export function Home({ onViewProfile, onStartChat }: HomeProps) {
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading profiles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pb-20">
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <img 
            src="/seeusoon-logo.jpg" 
            alt="SeeUSoon" 
            className="h-10 md:h-12 w-auto object-contain"
          />
        </div>
      </div>

      {showCompleteBanner && (
        <div className="bg-amber-50 border-b border-amber-200 py-3 px-4">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900">Complete your profile to get more matches!</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="text-amber-700 border-amber-300"
              onClick={() => window.location.href = '/complete-profile'}
            >
              Complete
            </Button>
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto px-4 py-6">
        {currentIndex < profiles.length ? (
          <div>
            <Card className="overflow-hidden shadow-xl">
              <div className="relative aspect-[3/4] bg-gradient-to-br from-indigo-400 to-purple-500">
                {currentProfile.profile_photo ? (
                  <img
                    src={currentProfile.profile_photo}
                    alt={currentProfile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-32 h-32 text-white/50" />
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {currentProfile.name}, {currentProfile.year ? `Year ${currentProfile.year}` : ''}
                  </h2>
                  <div className="flex items-center gap-2 text-white/90 text-sm mb-3">
                    <span>{currentProfile.major}</span>
                    {currentProfile.school && (
                      <>
                        <span>•</span>
                        <span>{currentProfile.school}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {currentProfile.bio && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                    <p className="text-gray-700">{currentProfile.bio}</p>
                  </div>
                )}

                {currentProfile.prompt1_answer && (
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-indigo-900 mb-1">
                      {currentProfile.prompt1_question}
                    </p>
                    <p className="text-gray-700">{currentProfile.prompt1_answer}</p>
                  </div>
                )}

                {currentProfile.prompt2_answer && (
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-purple-900 mb-1">
                      {currentProfile.prompt2_question}
                    </p>
                    <p className="text-gray-700">{currentProfile.prompt2_answer}</p>
                  </div>
                )}

                {currentProfile.interests && currentProfile.interests.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentProfile.interests.map((interest: string, idx: number) => (
                        <Badge key={idx} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {currentProfile.hobbies && currentProfile.hobbies.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Hobbies</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentProfile.hobbies.map((hobby: string, idx: number) => (
                        <Badge key={idx} variant="outline">
                          {hobby}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <div className="flex gap-4 mt-6">
              <Button
                onClick={handlePass}
                size="lg"
                variant="outline"
                className="flex-1 h-16 text-lg border-2 hover:bg-gray-100"
              >
                <X className="w-6 h-6 mr-2" />
                Pass
              </Button>
              <Button
                onClick={handleLike}
                size="lg"
                className="flex-1 h-16 text-lg bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
              >
                <Heart className="w-6 h-6 mr-2" />
                Like
              </Button>
            </div>
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Sparkles className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              You've seen everyone!
            </h2>
            <p className="text-gray-600 mb-6">
              Check back later for new profiles, or view your matches.
            </p>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => window.location.href = '/matches'}
            >
              View Matches
            </Button>
          </Card>
        )}
      </div>

      {matchModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-8 text-center bg-white shadow-2xl">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-white fill-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              It's a Match! 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              You and {matchModal.name} liked each other!
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setMatchModal(null)}
              >
                Keep Browsing
              </Button>
              <Button
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                onClick={() => window.location.href = `/chat?userId=${matchModal.id}`}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </Card>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
