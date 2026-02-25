import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { eventsApi, type Event } from '@/api/events';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import {
  Calendar,
  MapPin,
  Users,
  MessageCircle,
  LogOut,
  UserCircle,
  Lock,
  Globe,
  Sun,
  Moon
} from 'lucide-react';

import SettingsDialog from '@/components/SettingsDialog';
import EventCardSkeleton from '@/components/EventCardSkeleton';
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/useTheme";

const Events = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [joinCodeSearch, setJoinCodeSearch] = useState('');

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await eventsApi.getAllEvents();
      setEvents(data);
    } catch {
      toast({
        title: "Error",
        description: "Could not connect to server",
        variant: "destructive"
      });
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const isAttending = (event: Event) => {
    if (!user) return false;
    return event.attendees.some(
      (a) => String(a._id) === String(user.id)
    );
  };

  const isCreator = (event: Event) => {
    if (!user) return false;
    return String(event.creator._id) === String(user.id);
  };

  const hasRequested = (event: Event) => {
    if (!user) return false;
    return event.joinRequests?.some(
      (id: any) => String(id) === String(user.id)
    );
  };

  const handleJoinEvent = async (event: Event) => {
    setLoadingStates(prev => ({ ...prev, [event._id]: true }));

    try {
      let code: string | undefined;

      if (event.visibility === 'private') {
        code = prompt('Enter join code') || undefined;
        if (!code) {
          setLoadingStates(prev => ({ ...prev, [event._id]: false }));
          return;
        }
      }

      const response = await eventsApi.joinEvent(event._id, code);

      if (response.message?.includes("Awaiting")) {
        toast({
          title: "Request Sent",
          description: "Waiting for creator approval ⏳"
        });
      } else {
        toast({
          title: "Joined Successfully 🎉"
        });
      }

      fetchEvents();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Join failed",
        variant: "destructive"
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [event._id]: false }));
    }
  };

  const handleLeaveEvent = async (eventId: string) => {
    setLoadingStates(prev => ({ ...prev, [`leave-${eventId}`]: true }));
    try {
      await eventsApi.leaveEvent(eventId);
      toast({ title: "Left Event" });
      fetchEvents();
    } catch {
      toast({
        title: "Error",
        description: "Failed to leave event",
        variant: "destructive"
      });
    } finally {
      setLoadingStates(prev => ({
        ...prev,
        [`leave-${eventId}`]: false
      }));
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this event?'
    );
    if (!confirmDelete) return;

    try {
      await eventsApi.deleteEvent(eventId);
      toast({ title: "Event Deleted" });
      fetchEvents();
    } catch {
      toast({
        title: "Error",
        description: "Delete failed",
        variant: "destructive"
      });
    }
  };

  const handleSearchByCode = async () => {
    if (!joinCodeSearch.trim()) return;

    try {
      const event = await eventsApi.getEventByCode(joinCodeSearch.trim());
      setEvents([event]);
      toast({ title: "Private Event Found 🔐" });
    } catch {
      toast({ title: "Invalid Code", variant: "destructive" });
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  const filteredEvents =
    categoryFilter === 'all'
      ? events
      : events.filter(e => e.category === categoryFilter);

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="events-page">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="events-page relative">

      <header className="bg-white dark:bg-[#0b0d12] border-b border-gray-300 dark:border-[#1c1f26] sticky top-0 z-20 shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

          <h1 className="text-2xl font-semibold text-black dark:text-white">
            Gatherly
          </h1>

          <div className="flex items-center gap-3">

            <Button size="icon" variant="outline" onClick={toggleTheme}>
              {theme === "dark"
                ? <Sun className="w-4 h-4" />
                : <Moon className="w-4 h-4" />}
            </Button>

            <span className="text-sm text-gray-600 dark:text-gray-400">
              Welcome <strong className="text-black dark:text-white">{user.username}</strong>
            </span>

            <Button
              size="sm"
              className="bg-black text-white dark:bg-white dark:text-black"
              onClick={() => navigate('/events/create')}
            >
              + Create Event
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/profile')}
            >
              <UserCircle className="w-4 h-4 mr-2" />
              Profile
            </Button>

            <SettingsDialog />

            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>

          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">

        {/* Join Code Search */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <input
            type="text"
            placeholder="Enter private event code"
            value={joinCodeSearch}
            onChange={(e) => setJoinCodeSearch(e.target.value)}
            className="px-4 py-2 rounded bg-white dark:bg-[#1a1a1a] text-black dark:text-white border border-gray-200 dark:border-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-colors duration-200"
          />

          <Button onClick={handleSearchByCode} className="bg-black text-white dark:bg-white dark:text-black">
            Search
          </Button>

          <Button variant="outline" onClick={fetchEvents}>
            Reset
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'concert', 'travel', 'trekking'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${categoryFilter === cat
                ? 'bg-amber-500 dark:bg-amber-400 text-white dark:text-black shadow-sm shadow-amber-300/30'
                : 'bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#2a2a2a] hover:border-amber-400/50 hover:text-amber-600 dark:hover:text-amber-400'
                }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filteredEvents.map(event => (
            <motion.div
              key={event._id}
              whileHover={{ y: -8, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Card className={`bg-[#141414] dark:bg-[#0f1115] relative flex flex-col h-full text-white shadow-lg transition-all duration-300 ${event.visibility === 'public'
                  ? 'border border-transparent hover:border-emerald-600 hover:shadow-[0_0_0_4px_rgba(5,150,105,0.5),0_30px_80px_rgba(5,150,105,0.35)]'
                  : 'border border-transparent hover:border-rose-600 hover:shadow-[0_0_0_4px_rgba(190,18,60,0.5),0_30px_80px_rgba(190,18,60,0.35)]'
                }`}>

                {event.imageUrl && (
                  <div className="overflow-hidden">
                    <motion.img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-40 object-cover"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                )}

                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white">
                      {event.title}
                    </CardTitle>

                    <span
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${event.visibility === 'public'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                    >
                      {event.visibility === 'public'
                        ? <Globe className="w-3 h-3" />
                        : <Lock className="w-3 h-3" />}
                      {event.visibility}
                    </span>
                  </div>

                  <CardDescription className="line-clamp-2 text-gray-300">
                    {event.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-2 text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {event.attendees.length} / {event.maxAttendees}
                    </div>
                  </div>

                  <div className="mt-auto space-y-2">
                    {isAttending(event) ? (
                      <>
                        <Button
                          className="w-full bg-black text-white dark:bg-white dark:text-black"
                          onClick={() => navigate(`/events/${event._id}/chat`)}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Open Chat
                        </Button>

                        {isCreator(event) ? (
                          <>
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => navigate(`/events/${event._id}/manage`)}
                            >
                              Manage Requests
                            </Button>

                            <Button
                              variant="destructive"
                              className="w-full"
                              onClick={() => handleDeleteEvent(event._id)}
                            >
                              Delete Event
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => handleLeaveEvent(event._id)}
                          >
                            Leave Event
                          </Button>
                        )}
                      </>
                    ) : hasRequested(event) ? (
                      <Button disabled className="w-full">
                        Pending Approval ⏳
                      </Button>
                    ) : (
                      <Button
                        className="w-full bg-black text-white dark:bg-white dark:text-black"
                        onClick={() => handleJoinEvent(event)}
                        disabled={
                          loadingStates[event._id] ||
                          event.attendees.length >= event.maxAttendees
                        }
                      >
                        {event.attendees.length >= event.maxAttendees
                          ? "Event Full"
                          : loadingStates[event._id]
                            ? "Joining..."
                            : event.visibility === 'private'
                              ? "Request / Join"
                              : "Join Event"}
                      </Button>
                    )}
                  </div>

                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Events;