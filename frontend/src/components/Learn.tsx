import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { BottomNav } from './BottomNav';
import { BookOpen, MessageCircle, Heart, Calendar, Sparkles, Users, Target, Coffee } from 'lucide-react';

const TIPS_CATEGORIES = [
  {
    id: 'conversation',
    title: 'Starting Conversations',
    icon: MessageCircle,
    color: 'from-blue-500 to-cyan-500',
    tips: [
      {
        title: 'The 3-Question Rule',
        content: 'Ask 3 genuine questions about their interests before talking about yourself. People love talking about their passions!',
        example: '"I saw you\'re into robotics! What project are you working on right now?"'
      },
      {
        title: 'Find Common Ground',
        content: 'Reference shared interests from their profile. STEM students connect over technical topics!',
        example: '"You mentioned machine learning - have you tried the new PyTorch features?"'
      },
      {
        title: 'Avoid Yes/No Questions',
        content: 'Ask open-ended questions that invite storytelling, not just facts.',
        example: 'Instead of "Do you like coding?" ask "What\'s the coolest thing you\'ve built?"'
      },
      {
        title: 'The "Tell Me More" Technique',
        content: 'When they mention something interesting, always follow up with genuine curiosity.',
        example: 'Them: "I built a weather app" → You: "That\'s awesome! What was the hardest part?"'
      }
    ]
  },
  {
    id: 'first-date',
    title: 'First Date Ideas',
    icon: Coffee,
    color: 'from-pink-500 to-rose-500',
    tips: [
      {
        title: 'Coffee & Campus Walk',
        content: 'Low-pressure, easy to leave if awkward, and walking side-by-side reduces eye contact pressure.',
        example: 'Meet at Student Center Café, then walk through campus discussing classes'
      },
      {
        title: 'Study Date',
        content: 'Perfect for STEM students! Work on different things in the library, take breaks to chat.',
        example: '"Want to study together at NAC? We can grab food after!"'
      },
      {
        title: 'Museum or Exhibit',
        content: 'Built-in conversation topics! Science centers are perfect for STEM students.',
        example: 'Natural History Museum, Transit Museum, or MoMA'
      },
      {
        title: 'Campus Events',
        content: 'Club meetings, hackathons, or department seminars - shared interests built in!',
        example: '"There\'s a robotics club demo Friday - want to check it out together?"'
      }
    ]
  },
  {
    id: 'profile',
    title: 'Profile Tips',
    icon: Target,
    color: 'from-purple-500 to-indigo-500',
    tips: [
      {
        title: 'Show, Don\'t Just Tell',
        content: 'Instead of saying "I like coding," describe what you\'re building or learning.',
        example: '"Currently building an app that helps students find study groups based on their schedule"'
      },
      {
        title: 'Balance Technical & Personal',
        content: 'Yes, you\'re a CS major, but also mention hiking, cooking, or your favorite shows!',
        example: 'Mix "debugging code at 2am" with "binge-watching cooking shows for stress relief"'
      },
      {
        title: 'Be Specific',
        content: 'Generic interests = boring. Specific interests = conversation starters!',
        example: 'Instead of "music" → "lo-fi hip hop while coding, K-pop at the gym"'
      },
      {
        title: 'Prompts Are Key',
        content: 'Answer prompts authentically! They\'re the best conversation starters.',
        example: '"I geek out on... optimizing algorithms until they\'re *chef\'s kiss* efficient"'
      }
    ]
  },
  {
    id: 'texting',
    title: 'Messaging Etiquette',
    icon: MessageCircle,
    color: 'from-green-500 to-emerald-500',
    tips: [
      {
        title: 'Response Time Balance',
        content: 'Don\'t overthink it! Respond when you see it, but don\'t expect instant replies.',
        example: 'Waiting exactly 2 hours to reply? Unnecessary. Reply naturally!'
      },
      {
        title: 'Match Their Energy',
        content: 'If they send paragraphs, send paragraphs. Short messages? Keep it concise.',
        example: 'Them: "yeah lol" → You: Don\'t send an essay back'
      },
      {
        title: 'Move to In-Person',
        content: 'After 5-10 messages, suggest meeting! Don\'t pen-pal forever.',
        example: '"This is fun! Want to grab coffee this week and continue the conversation?"'
      },
      {
        title: 'Avoid Interview Mode',
        content: 'Don\'t just ask questions. Share about yourself too!',
        example: 'Mix "What are you working on?" with "I just finished a brutal algorithms assignment"'
      }
    ]
  },
  {
    id: 'social-cues',
    title: 'Reading Social Cues',
    icon: Users,
    color: 'from-orange-500 to-amber-500',
    tips: [
      {
        title: 'They\'re Interested If...',
        content: 'They ask questions back, suggest meeting up, respond quickly, share personal details.',
        example: 'Good signs: "When are you free?" "Tell me more!" "Haha I love that"'
      },
      {
        title: 'They\'re Not Interested If...',
        content: 'One-word replies, long delays, no questions, declining plans without alternatives.',
        example: 'Red flags: "cool" "haha" "k" or "I\'m busy" without rescheduling'
      },
      {
        title: 'Don\'t Overthink Delays',
        content: 'People get busy! One slow response ≠ disinterest. Patterns matter more.',
        example: 'If they usually respond in 1 hour but took 6 hours today → they\'re probably just busy'
      },
      {
        title: 'The Double-Text Rule',
        content: 'One follow-up is fine. Two with no response? Move on gracefully.',
        example: 'First: "Hey! Still interested in that coffee?" Second (after silence): Accept it and move on'
      }
    ]
  },
  {
    id: 'confidence',
    title: 'Building Confidence',
    icon: Sparkles,
    color: 'from-yellow-500 to-orange-500',
    tips: [
      {
        title: 'Rejection Is Data, Not Failure',
        content: 'Think like a STEM student! Each "no" is just data helping you optimize your approach.',
        example: 'Not everyone will match your energy - and that\'s okay! Find someone who does.'
      },
      {
        title: 'Your Passions Are Attractive',
        content: 'Don\'t hide your nerdy side! Enthusiasm about your interests is magnetic.',
        example: 'Talking excitedly about quantum computing? That\'s way more attractive than pretending to be "cool"'
      },
      {
        title: 'Authenticity > Perfection',
        content: 'Being genuinely yourself beats trying to be what you think they want.',
        example: 'Say "I\'m really into board game design" not "I like... normal stuff"'
      },
      {
        title: 'Practice Makes Progress',
        content: 'Social skills are like coding - you get better with practice and debugging!',
        example: 'Each conversation teaches you something. Learn, iterate, improve.'
      }
    ]
  }
];

export function Learn() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(TIPS_CATEGORIES[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pb-20">
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/home')}>
            ← Back
          </Button>
          <img 
            src="/seeusoon-logo.jpg" 
            alt="SeeUSoon" 
            className="h-10 w-auto object-contain"
          />
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Dating 101 for STEM Students
          </h1>
          <p className="text-gray-600 text-lg">
            Social skills are like code - you can learn, practice, and improve! 🚀
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {TIPS_CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory.id === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50 shadow-md scale-105'
                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                }`}
              >
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center mx-auto mb-2`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className={`text-xs font-medium text-center ${
                  isSelected ? 'text-indigo-900' : 'text-gray-700'
                }`}>
                  {category.title}
                </p>
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          {selectedCategory.tips.map((tip, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${selectedCategory.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-bold">{index + 1}</span>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-gray-700 mb-3">
                    {tip.content}
                  </p>
                  <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-indigo-500">
                    <p className="text-sm font-medium text-gray-600 mb-1">Example:</p>
                    <p className="text-sm text-gray-700 italic">
                      {tip.example}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-8 p-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 text-center">
          <Sparkles className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Ready to Practice?
          </h3>
          <p className="text-gray-600 mb-6">
            Put these tips into action! Start conversations with your matches.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => navigate('/home')}
            >
              Browse Profiles
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/matches')}
            >
              Message Matches
            </Button>
          </div>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
}
