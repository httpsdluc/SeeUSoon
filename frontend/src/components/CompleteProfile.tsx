import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { studentsAPI } from '../services/api';
import { Sparkles, CheckCircle, Loader2, Upload, X, Camera } from 'lucide-react';
import { BottomNav } from './BottomNav';

const PROMPT_OPTIONS = [
  "The way to win me over is...",
  "I'll fall for you if...",
  "My ideal first date is...",
  "I geek out on...",
  "The one thing you should know about me is...",
  "My simple pleasures...",
  "I'm weirdly attracted to...",
  "A life goal of mine...",
  "I'm overly competitive about...",
  "The secret to getting to know me is..."
];

export function CompleteProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    bio: '',
    interests: '',
    hobbies: '',
    favorite_shows: '',
    favorite_movies: '',
    favorite_books: '',
    favorite_music: '',
    prompt1_question: PROMPT_OPTIONS[2],
    prompt1_answer: '',
    prompt2_question: PROMPT_OPTIONS[3],
    prompt2_answer: '',
    profile_photo: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const studentId = localStorage.getItem('studentId');
        if (!studentId) {
          navigate('/login');
          return;
        }

        const response = await studentsAPI.getById(parseInt(studentId));
        const profile = response.data;

        setFormData({
          bio: profile.bio || '',
          interests: profile.interests?.join(', ') || '',
          hobbies: profile.hobbies?.join(', ') || '',
          favorite_shows: profile.favorite_shows || '',
          favorite_movies: profile.favorite_movies || '',
          favorite_books: profile.favorite_books || '',
          favorite_music: profile.favorite_music || '',
          prompt1_question: profile.prompt1_question || PROMPT_OPTIONS[2],
          prompt1_answer: profile.prompt1_answer || '',
          prompt2_question: profile.prompt2_question || PROMPT_OPTIONS[3],
          prompt2_answer: profile.prompt2_answer || '',
          profile_photo: profile.profile_photo || '',
        });

        if (profile.profile_photo) {
          setPhotoPreview(profile.profile_photo);
        }

        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData({
        ...formData,
        profile_photo: base64String
      });
      setPhotoPreview(base64String);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setFormData({
      ...formData,
      profile_photo: ''
    });
    setPhotoPreview(null);
  };

  const calculateCompletion = () => {
    let completed = 0;
    let total = 10;

    if (formData.bio) completed++;
    if (formData.interests) completed++;
    if (formData.hobbies) completed++;
    if (formData.favorite_shows) completed++;
    if (formData.favorite_movies) completed++;
    if (formData.favorite_books) completed++;
    if (formData.favorite_music) completed++;
    if (formData.prompt1_answer) completed++;
    if (formData.prompt2_answer) completed++;
    if (photoPreview) completed++;

    return Math.round((completed / total) * 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const studentId = localStorage.getItem('studentId');
      if (!studentId) {
        navigate('/login');
        return;
      }

      const interestsArray = formData.interests.split(',').map(i => i.trim()).filter(i => i.length > 0);
      const hobbiesArray = formData.hobbies.split(',').map(i => i.trim()).filter(i => i.length > 0);

      const response = await studentsAPI.update(parseInt(studentId), {
        bio: formData.bio,
        interests: interestsArray,
        hobbies: hobbiesArray,
        favorite_shows: formData.favorite_shows,
        favorite_movies: formData.favorite_movies,
        favorite_books: formData.favorite_books,
        favorite_music: formData.favorite_music,
        prompt1_question: formData.prompt1_question,
        prompt1_answer: formData.prompt1_answer,
        prompt2_question: formData.prompt2_question,
        prompt2_answer: formData.prompt2_answer,
        profile_photo: formData.profile_photo,
      });

      localStorage.setItem('student', JSON.stringify(response.data));
      
      alert('Profile updated successfully! 🎉');
      navigate('/home');
    } catch (err: any) {
      console.error('Update error:', err);
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const completion = calculateCompletion();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pb-20">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/home')}>
            ← Back to Home
          </Button>
          <img 
            src="/seeusoon-logo.jpg" 
            alt="SeeUSoon" 
            className="h-10 w-auto object-contain"
          />
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="p-6 md:p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              My Profile
            </h1>
            <p className="text-gray-600">
              View and edit your profile information
            </p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Profile Completion</span>
              <span className="text-sm font-bold text-indigo-600">{completion}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
            {completion === 100 && (
              <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Your profile is complete! 🎉
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="mb-2 block flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Profile Photo {photoPreview && <CheckCircle className="w-4 h-4 text-green-500" />}
              </Label>
              {!photoPreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-2">Upload your profile photo</p>
                  <p className="text-xs text-gray-500 mb-4">PNG, JPG up to 5MB</p>
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Button type="button" size="sm" variant="outline" asChild>
                      <span>Choose Photo</span>
                    </Button>
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Profile preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <label htmlFor="photo-upload" className="absolute bottom-2 right-2">
                    <Button type="button" size="sm" asChild>
                      <span className="cursor-pointer">Change Photo</span>
                    </Button>
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-indigo-900">
                  Answer Prompts (Great conversation starters!)
                </h3>
              </div>
              
              <div>
                <Label htmlFor="prompt1_question" className="mb-2 block text-sm">
                  Prompt 1 {formData.prompt1_answer && <CheckCircle className="w-4 h-4 text-green-500 inline ml-1" />}
                </Label>
                <select
                  id="prompt1_question"
                  name="prompt1_question"
                  value={formData.prompt1_question}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 mb-2 text-sm"
                >
                  {PROMPT_OPTIONS.map((prompt) => (
                    <option key={prompt} value={prompt}>{prompt}</option>
                  ))}
                </select>
                <Input
                  id="prompt1_answer"
                  name="prompt1_answer"
                  type="text"
                  placeholder="Your answer..."
                  value={formData.prompt1_answer}
                  onChange={handleChange}
                  className="text-sm"
                />
              </div>

              <div>
                <Label htmlFor="prompt2_question" className="mb-2 block text-sm">
                  Prompt 2 {formData.prompt2_answer && <CheckCircle className="w-4 h-4 text-green-500 inline ml-1" />}
                </Label>
                <select
                  id="prompt2_question"
                  name="prompt2_question"
                  value={formData.prompt2_question}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 mb-2 text-sm"
                >
                  {PROMPT_OPTIONS.map((prompt) => (
                    <option key={prompt} value={prompt}>{prompt}</option>
                  ))}
                </select>
                <Input
                  id="prompt2_answer"
                  name="prompt2_answer"
                  type="text"
                  placeholder="Your answer..."
                  value={formData.prompt2_answer}
                  onChange={handleChange}
                  className="text-sm"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio" className="mb-2 block">
                Bio {formData.bio && <CheckCircle className="w-4 h-4 text-green-500 inline ml-1" />}
              </Label>
              <textarea
                id="bio"
                name="bio"
                placeholder="Tell everyone about yourself..."
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="interests" className="mb-2 block">
                Interests (comma-separated) {formData.interests && <CheckCircle className="w-4 h-4 text-green-500 inline ml-1" />}
              </Label>
              <Input
                id="interests"
                name="interests"
                type="text"
                placeholder="coding, photography, travel, fitness"
                value={formData.interests}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="hobbies" className="mb-2 block">
                Hobbies (comma-separated) {formData.hobbies && <CheckCircle className="w-4 h-4 text-green-500 inline ml-1" />}
              </Label>
              <Input
                id="hobbies"
                name="hobbies"
                type="text"
                placeholder="guitar, hiking, gaming, reading"
                value={formData.hobbies}
                onChange={handleChange}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="favorite_shows" className="mb-2 block text-sm">
                  Favorite Shows {formData.favorite_shows && <CheckCircle className="w-3 h-3 text-green-500 inline ml-1" />}
                </Label>
                <Input
                  id="favorite_shows"
                  name="favorite_shows"
                  type="text"
                  placeholder="Breaking Bad, The Office"
                  value={formData.favorite_shows}
                  onChange={handleChange}
                  className="text-sm"
                />
              </div>

              <div>
                <Label htmlFor="favorite_movies" className="mb-2 block text-sm">
                  Favorite Movies {formData.favorite_movies && <CheckCircle className="w-3 h-3 text-green-500 inline ml-1" />}
                </Label>
                <Input
                  id="favorite_movies"
                  name="favorite_movies"
                  type="text"
                  placeholder="Inception"
                  value={formData.favorite_movies}
                  onChange={handleChange}
                  className="text-sm"
                />
              </div>

              <div>
                <Label htmlFor="favorite_books" className="mb-2 block text-sm">
                  Favorite Books {formData.favorite_books && <CheckCircle className="w-3 h-3 text-green-500 inline ml-1" />}
                </Label>
                <Input
                  id="favorite_books"
                  name="favorite_books"
                  type="text"
                  placeholder="1984, Harry Potter"
                  value={formData.favorite_books}
                  onChange={handleChange}
                  className="text-sm"
                />
              </div>

              <div>
                <Label htmlFor="favorite_music" className="mb-2 block text-sm">
                  Favorite Music {formData.favorite_music && <CheckCircle className="w-3 h-3 text-green-500 inline ml-1" />}
                </Label>
                <Input
                  id="favorite_music"
                  name="favorite_music"
                  type="text"
                  placeholder="Drake, Taylor Swift"
                  value={formData.favorite_music}
                  onChange={handleChange}
                  className="text-sm"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
}
