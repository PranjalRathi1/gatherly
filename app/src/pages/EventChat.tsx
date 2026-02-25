import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { eventsApi, type Event } from '@/api/events';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Send, Users } from 'lucide-react';

interface ChatMessage {
  id: string;
  senderId?: string;
  message: string;
  username: string;
  timestamp: string;
}

const EventChat = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [event, setEvent] = useState<Event | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      try {
        const data = await eventsApi.getEventById(eventId);
        setEvent(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load event');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  // Setup Socket.io connection
  useEffect(() => {
    if (!eventId || !user) return;

    const socketUrl =
      import.meta.env.VITE_API_URL?.replace('/api', '') ||
      'http://localhost:5002';

    const socket = io(socketUrl, {
      auth: { token }
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join-event', {
        eventId,
        username: user.username
      });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('previous-messages', (previousMessages: ChatMessage[]) => {
      setMessages(previousMessages);
    });

    socket.on('new-message', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('user-joined', (notification: ChatMessage) => {
      setMessages((prev) => [...prev, notification]);
    });

    socket.on('user-left', (notification: ChatMessage) => {
      setMessages((prev) => [...prev, notification]);
    });

    socket.on(
      'user-typing',
      ({ username, isTyping }: { username: string; isTyping: boolean }) => {
        setTypingUsers((prev) => {
          if (isTyping) {
            return prev.includes(username) ? prev : [...prev, username];
          } else {
            return prev.filter((u) => u !== username);
          }
        });
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [eventId, user, token]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !socketRef.current || !eventId || !user)
      return;

    socketRef.current.emit('send-message', {
      eventId,
      message: newMessage.trim(),
      username: user.username
    });

    setNewMessage('');

    socketRef.current.emit('typing', {
      eventId,
      username: user.username,
      isTyping: false
    });
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (socketRef.current && eventId && user) {
      socketRef.current.emit('typing', {
        eventId,
        username: user.username,
        isTyping: e.target.value.length > 0
      });
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="chat-page flex items-center justify-center min-h-screen">
        <div className="text-black dark:text-white text-lg">
          Loading chat...
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="chat-page flex items-center justify-center p-4 min-h-screen">
        <Alert className="bg-white dark:bg-[#111] border-gray-200 dark:border-[#2a2a2a] text-black dark:text-white max-w-md">
          <AlertDescription>
            {error || 'Event not found'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="chat-page flex flex-col min-h-screen relative overflow-hidden">

      {/* Header */}
      <header className="bg-white dark:bg-[#0b0d12] border-b border-gray-300 dark:border-[#1c1f26] px-6 py-4 flex justify-between items-center sticky top-0 z-20 shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-black dark:text-white"
            onClick={() => navigate('/events')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <h1 className="text-xl font-semibold text-black dark:text-white">
            {event.title}
          </h1>
        </div>

        <div className="flex items-center gap-4 text-black dark:text-white text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {event.attendees.length}
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-500'
                }`}
            />
            {isConnected ? 'Live' : 'Offline'}
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="relative flex-1 overflow-y-auto px-6 py-6">

        {/* SVG Pattern Background — kept subtle so D2 gradient shows through */}
        <div
          className="
              absolute inset-0
              bg-repeat
              bg-[length:500px_500px]
              opacity-[0.035]
              dark:opacity-[0.055]
              pointer-events-none
              z-0
              bg-[url('/chat-pattern-light.svg')]
              dark:bg-[url('/chat-pattern-dark.svg')]
          "
        />

        <div className="relative z-10 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMyMessage =
                msg.senderId === user?.id ||
                msg.username === user?.username;

              const isSystemMessage = msg.username === 'System';

              if (isSystemMessage) {
                return (
                  <motion.div
                    key={msg.id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center"
                  >
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#1a1a1a] px-3 py-1 rounded-full">
                      {msg.message} - {formatTime(msg.timestamp)}
                    </span>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={msg.id || index}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'
                    }`}
                >
                  <div className="max-w-[70%]">
                    <div
                      className={`px-4 py-3 ${isMyMessage
                        ? 'bg-black text-white dark:bg-white dark:text-black rounded-2xl rounded-br-md shadow-sm'
                        : 'bg-white dark:bg-[#1a1a1a] text-black dark:text-white border border-gray-200 dark:border-[#2a2a2a] rounded-2xl rounded-bl-md'
                        }`}
                    >
                      <div className="text-xs font-semibold mb-1">
                        {msg.username}
                      </div>
                      <div className="break-words">{msg.message}</div>
                    </div>

                    <div
                      className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${isMyMessage ? 'text-right' : 'text-left'
                        }`}
                    >
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="px-6 pb-2 text-sm text-gray-500 dark:text-gray-400">
          {typingUsers[0]} is typing...
        </div>
      )}

      {/* Input */}
      <div className="sticky bottom-0 bg-white dark:bg-[#0b0d12] border-t border-gray-300 dark:border-[#1c1f26] p-4 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_25px_rgba(0,0,0,0.5)]">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] text-black dark:text-white"
            disabled={!isConnected}
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || !isConnected}
            className="px-6 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EventChat;