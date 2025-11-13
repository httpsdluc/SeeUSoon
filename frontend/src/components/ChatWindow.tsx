import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { User, Send, ArrowLeft, Sparkles, Lightbulb } from 'lucide-react';
import { messagesAPI, studentsAPI } from '../services/api';

export function ChatWindow() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const otherUserId = searchParams.get('userId');
  
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStarters, setShowStarters] = useState(false);
  const [conversationStarters, setConversationStarters] = useState<string[]>([]);
  const [loadingStarters, setLoadingStarters] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId || !otherUserId) {
      navigate('/login');
      return;
    }

    setCurrentUserId(parseInt(studentId));

    const fetchData = async () => {
      try {
        // Fetch other user's info
        const userResponse = await studentsAPI.getById(parseInt(otherUserId));
        setOtherUser(userResponse.data);

        // Fetch conversation
        const messagesResponse = await messagesAPI.getConversation(
          parseInt(studentId),
          parseInt(otherUserId)
        );
        setMessages(messagesResponse.data);

        // Mark messages as read
        await messagesAPI.markAsRead(parseInt(studentId), parseInt(otherUserId));

        setLoading(false);
        setTimeout(scrollToBottom, 100);
      } catch (error) {
        console.error('Error loading chat:', error);
        setLoading(false);
      }
    };

    fetchData();

    // Poll for new messages every 3 seconds
    const interval = setInterval(async () => {
      try {
        const messagesResponse = await messagesAPI.getConversation(
          parseInt(studentId),
          parseInt(otherUserId)
        );
        setMessages(messagesResponse.data);
      } catch (error) {
        console.error('Error polling messages:', error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [navigate, otherUserId]);

  const generateConversationStarters = async () => {
    if (!otherUser) return;

    setLoadingStarters(true);
    setShowStarters(true);

    // Create context about the other person
    const context = `
Name: ${otherUser.name}
Major: ${otherUser.major}
Year: ${otherUser.year}
Bio: ${otherUser.bio || 'No bio'}
Interests: ${otherUser.interests?.join(', ') || 'None listed'}
Hobbies: ${otherUser.hobbies?.join(', ') || 'None listed'}
Favorite shows: ${otherUser.favorite_shows || 'None listed'}
Favorite movies: ${otherUser.favorite_movies || 'None listed'}
${otherUser.prompt1_question ? `\n${otherUser.prompt1_question}: ${otherUser.prompt1_answer}` : ''}
${otherUser.prompt2_question ? `\n${otherUser.prompt2_question}: ${otherUser.prompt2_answer}` : ''}
    `.trim();

    const starters = [
      `I saw you're into ${otherUser.interests?.[0] || 'interesting things'}! What got you started with that?`,
      `How's ${otherUser.major} treating you? Any favorite classes this semester?`,
      `${otherUser.prompt1_answer ? `I loved your answer about "${otherUser.prompt1_answer.substring(0, 30)}..." - ` : ''}What's something you're really passionate about right now?`
    ];

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000));

    setConversationStarters(starters);
    setLoadingStarters(false);
  };

  const handleSend = async (e: React.FormEvent, starterText?: string) => {
    e.preventDefault();
    
    const messageToSend = starterText || newMessage.trim();
    if (!messageToSend || !currentUserId || !otherUserId) return;

    try {
      const response = await messagesAPI.send(
        currentUserId,
        parseInt(otherUserId),
        messageToSend
      );

      setMessages([...messages, response.data]);
      setNewMessage('');
      setShowStarters(false);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const lastMessageTime = messages.length > 0 
    ? new Date(messages[messages.length - 1].created_at).getTime()
    : 0;
  const hoursSinceLastMessage = (Date.now() - lastMessageTime) / (1000 * 60 * 60);
  const conversationGoneCold = messages.length > 0 && hoursSinceLastMessage > 24;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/matches')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          {otherUser && (
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center overflow-hidden">
                {otherUser.profile_photo ? (
                  <img
                    src={otherUser.profile_photo}
                    alt={otherUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{otherUser.name}</h2>
                <p className="text-xs text-gray-500">{otherUser.school}</p>
              </div>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={generateConversationStarters}
            className="hidden sm:flex"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Get Ideas
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {/* Cold conversation prompt */}
          {conversationGoneCold && !showStarters && (
            <Card className="p-4 bg-amber-50 border-amber-200">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-amber-900 font-medium mb-2">
                    💬 Conversation gone cold? We can help!
                  </p>
                  <p className="text-xs text-amber-700 mb-3">
                    Get AI-powered conversation starters based on {otherUser?.name}'s profile
                  </p>
                  <Button
                    size="sm"
                    onClick={generateConversationStarters}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    <Lightbulb className="w-4 h-4 mr-1" />
                    Get Conversation Starters
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Conversation starters */}
          {showStarters && (
            <Card className="p-4 bg-indigo-50 border-indigo-200">
              <div className="flex items-start gap-3 mb-3">
                <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-indigo-900 mb-1">
                    💡 Conversation Starters
                  </h3>
                  <p className="text-xs text-indigo-700">
                    Based on {otherUser?.name}'s profile. Click to send!
                  </p>
                </div>
              </div>

              {loadingStarters ? (
                <div className="flex items-center gap-2 text-sm text-indigo-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  Generating ideas...
                </div>
              ) : (
                <div className="space-y-2">
                  {conversationStarters.map((starter, index) => (
                    <button
                      key={index}
                      onClick={(e) => handleSend(e, starter)}
                      className="w-full text-left p-3 bg-white hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors text-sm"
                    >
                      {starter}
                    </button>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowStarters(false)}
                    className="w-full mt-2 text-xs"
                  >
                    Close
                  </Button>
                </div>
              )}
            </Card>
          )}

          {messages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No messages yet. Say hi! 👋</p>
              <Button
                onClick={generateConversationStarters}
                variant="outline"
                size="sm"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Need help starting? Get AI suggestions
              </Button>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md rounded-2xl px-4 py-2 ${
                      isMe
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-900 shadow-sm'
                    }`}
                  >
                    <p className="break-words">{msg.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isMe ? 'text-indigo-200' : 'text-gray-500'
                      }`}
                    >
                      {formatTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={(e) => handleSend(e)} className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={generateConversationStarters}
              className="sm:hidden flex-shrink-0"
            >
              <Lightbulb className="w-5 h-5" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
