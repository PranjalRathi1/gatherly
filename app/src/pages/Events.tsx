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
  Globe
} from 'lucide-react';

import SettingsDialog from '@/components/SettingsDialog';
import EventCardSkeleton from '@/components/EventCardSkeleton';
import { useToast } from "@/hooks/use-toast";

const Events = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { toast } = useToast();

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
    <div className="events-page">
      <header className="bg-[#111] border-b border-[#2a2a2a] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-white">Gatherly</h1>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">
              Welcome <strong className="text-white">{user.username}</strong>
            </span>

            <Button
              size="sm"
              className="bg-white text-black hover:bg-gray-200"
              onClick={() => navigate('/events/create')}
            >
              + Create Event
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="bg-white text-black hover:bg-gray-200"
              onClick={() => navigate('/profile')}
            >
              <UserCircle className="w-4 h-4 mr-2" />
              Profile
            </Button>

            <SettingsDialog />

            <Button
              size="sm"
              className="bg-white text-black hover:bg-gray-200"
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

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Join Code Search */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <input
            type="text"
            placeholder="Enter private event code"
            value={joinCodeSearch}
            onChange={(e) => setJoinCodeSearch(e.target.value)}
            className="px-4 py-2 rounded bg-[#1a1a1a] text-white border border-[#2a2a2a]"
          />

          <Button onClick={handleSearchByCode} className="bg-white text-black">
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
              className={`px-4 py-2 rounded-full text-sm font-medium ${categoryFilter === cat
                  ? 'bg-white text-black'
                  : 'bg-[#1a1a1a] text-white border border-[#2a2a2a] hover:bg-[#222]'
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
              <Card
                className={`bg-white shadow-md border border-gray-200 flex flex-col h-full overflow-hidden transition-all duration-300 ${event.visibility === 'public'
                    ? 'hover:shadow-green-200 hover:shadow-2xl'
                    : 'hover:shadow-red-200 hover:shadow-2xl'
                  }`}
              >
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
                    <CardTitle>{event.title}</CardTitle>

                    <span
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${event.visibility === 'public'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {event.visibility === 'public'
                        ? <Globe className="w-3 h-3" />
                        : <Lock className="w-3 h-3" />}
                      {event.visibility}
                    </span>
                  </div>

                  <CardDescription className="line-clamp-2">
                    {event.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
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
                          className="w-full bg-black text-white hover:bg-gray-800"
                          onClick={() =>
                            navigate(`/events/${event._id}/chat`)
                          }
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Open Chat
                        </Button>

                        {isCreator(event) ? (
                          <>
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() =>
                                navigate(`/events/${event._id}/manage`)
                              }
                            >
                              Manage Requests
                            </Button>

                            <Button
                              variant="destructive"
                              className="w-full"
                              onClick={() =>
                                handleDeleteEvent(event._id)
                              }
                            >
                              Delete Event
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() =>
                              handleLeaveEvent(event._id)
                            }
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
                        className="w-full bg-black text-white hover:bg-gray-800"
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