import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { studentsAPI } from '../services/api';
import { Sparkles, Mail, Lock, User, BookOpen, Calendar, School, Upload, X } from 'lucide-react';

// Prompt options for users to choose from
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

export function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: '',
    email: '',
    password: '',
    school: '',
    major: '',
    year: 1,
    gender: '',
    sexual_orientation: '',
    date_of_birth: '',
    
    // Step 2: Interests, Hobbies & Prompts
    interests: '',
    hobbies: '',
    favorite_shows: '',
    favorite_movies: '',
    favorite_books: '',
    favorite_music: '',
    prompt1_question: PROMPT_OPTIONS[0],
    prompt1_answer: '',
    prompt2_question: PROMPT_OPTIONS[1],
    prompt2_answer: '',
    
    // Step 3: About You & Photo
    bio: '',
    profile_photo: ''
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const validateEmail = (email: string) => {
    if (!email.endsWith('.edu')) {
      return 'Please use your .edu email address';
    }
    return null;
  };

  const validateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 18) {
      return 'You must be 18 or older to use SeeUSoon';
    }
    return null;
  };

  const handleNext = () => {
    if (step === 1) {
      const emailError = validateEmail(formData.email);
      if (emailError) {
        setError(emailError);
        return;
      }
      
      const ageError = validateAge(formData.date_of_birth);
      if (ageError) {
        setError(ageError);
        return;
      }
      
      if (!formData.name || !formData.email || !formData.password || !formData.school || !formData.major || !formData.gender || !formData.sexual_orientation || !formData.date_of_birth) {
        setError('Please fill in all required fields');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      setError('');
      setStep(2);
    } else if (step === 2) {
      setError('');
      setStep(3);
    }
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const interestsArray = formData.interests.split(',').map(i => i.trim()).filter(i => i.length > 0);
      const hobbiesArray = formData.hobbies.split(',').map(i => i.trim()).filter(i => i.length > 0);

      const response = await studentsAPI.create({
        ...formData,
        interests: interestsArray,
        hobbies: hobbiesArray,
        looking_for: 'dating'
      });

      localStorage.setItem('student', JSON.stringify(response.data));
      localStorage.setItem('studentId', response.data.id);
      
      alert('Account created successfully! 🎉');
      navigate('/home');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create account. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6 md:p-8 my-8">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Join SeeUSoon</h1>
          <p className="text-gray-600">Step {step} of 3</p>
        </div>

        <div className="mb-6">
          <div className="flex gap-2">
            <div className={`h-2 flex-1 rounded ${step >= 1 ? 'bg-gradient-to-r from-pink-500 to-red-500' : 'bg-gray-200'}`}></div>
            <div className={`h-2 flex-1 rounded ${step >= 2 ? 'bg-gradient-to-r from-pink-500 to-red-500' : 'bg-gray-200'}`}></div>
            <div className={`h-2 flex-1 rounded ${step >= 3 ? 'bg-gradient-to-r from-pink-500 to-red-500' : 'bg-gray-200'}`}></div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4" />
                    .edu Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@school.edu"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4" />
                  Password *
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>

              <div>
                <Label htmlFor="date_of_birth" className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  Date of Birth * (Must be 18+)
                </Label>
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <Label htmlFor="school" className="flex items-center gap-2 mb-2">
                  <School className="w-4 h-4" />
                  School/University *
                </Label>
                <Input
                  id="school"
                  name="school"
                  type="text"
                  placeholder="City College of New York"
                  value={formData.school}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="major" className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4" />
                    Major *
                  </Label>
                  <Input
                    id="major"
                    name="major"
                    type="text"
                    placeholder="Computer Science"
                    value={formData.major}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="year" className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" />
                    Year *
                  </Label>
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  >
                    <option value={1}>Freshman</option>
                    <option value={2}>Sophomore</option>
                    <option value={3}>Junior</option>
                    <option value={4}>Senior</option>
                    <option value={5}>Graduate</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="sexual_orientation">Sexual Orientation *</Label>
                  <select
                    id="sexual_orientation"
                    name="sexual_orientation"
                    value={formData.sexual_orientation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select</option>
                    <option value="Straight">Straight</option>
                    <option value="Gay">Gay</option>
                    <option value="Lesbian">Lesbian</option>
                    <option value="Bisexual">Bisexual</option>
                    <option value="Pansexual">Pansexual</option>
                    <option value="Asexual">Asexual</option>
                    <option value="Queer">Queer</option>
                    <option value="Questioning">Questioning</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white py-3 mt-4"
              >
                Next: Tell Us About Yourself →
              </Button>
            </div>
          )}

          {/* STEP 2: Interests, Hobbies, Favorites & Prompts */}
          {step === 2 && (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              <h2 className="text-xl font-semibold mb-2 sticky top-0 bg-white pb-2">Show Your Personality</h2>
              <p className="text-sm text-gray-600 mb-4">Help others get to know you better!</p>

              {/* Prompts Section */}
              <div className="bg-pink-50 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold text-pink-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Answer 2 Prompts
                </h3>
                
                {/* Prompt 1 */}
                <div>
                  <Label htmlFor="prompt1_question" className="mb-2 block text-sm">
                    Prompt 1
                  </Label>
                  <select
                    id="prompt1_question"
                    name="prompt1_question"
                    value={formData.prompt1_question}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 mb-2 text-sm"
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

                {/* Prompt 2 */}
                <div>
                  <Label htmlFor="prompt2_question" className="mb-2 block text-sm">
                    Prompt 2
                  </Label>
                  <select
                    id="prompt2_question"
                    name="prompt2_question"
                    value={formData.prompt2_question}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 mb-2 text-sm"
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

              {/* Interests & Hobbies */}
              <div>
                <Label htmlFor="interests" className="mb-2 block">
                  Interests (comma-separated)
                </Label>
                <Input
                  id="interests"
                  name="interests"
                  type="text"
                  placeholder="coding, photography, travel"
                  value={formData.interests}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="hobbies" className="mb-2 block">
                  Hobbies (comma-separated)
                </Label>
                <Input
                  id="hobbies"
                  name="hobbies"
                  type="text"
                  placeholder="guitar, hiking, gaming"
                  value={formData.hobbies}
                  onChange={handleChange}
                />
              </div>

              {/* Favorites */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="favorite_shows" className="mb-2 block text-sm">
                    Favorite Shows
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
                    Favorite Movies
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
                    Favorite Books
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
                    Favorite Music
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

              <div className="flex gap-3 mt-6 sticky bottom-0 bg-white pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  ← Back
                </Button>
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white"
                >
                  Next: Photo & Bio →
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Bio & Photo (Removed "Looking For") */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Finish Your Profile</h2>

              {/* Photo Upload */}
              <div>
                <Label className="mb-2 block">Profile Photo *</Label>
                {!photoPreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-400 transition-colors">
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
                  </div>
                )}
              </div>

              {/* Bio */}
              <div>
                <Label htmlFor="bio" className="mb-2 block">
                  Bio
                </Label>
                <textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent min-h-[100px]"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  ← Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white"
                  disabled={loading || !photoPreview}
                >
                  {loading ? 'Creating Account...' : 'Create Account 🎉'}
                </Button>
              </div>
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-pink-600 hover:text-pink-700 font-medium"
            >
              Log in
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
