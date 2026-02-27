import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsApi, type Event } from '@/api/events';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';

const ManageEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchEvent = async () => {
        const data = await eventsApi.getEventById(id!);
        setEvent(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchEvent();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-foreground text-lg">Loading...</p>
        </div>
    );

    if (!event) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-foreground">Event not found</p>
        </div>
    );

    if (event.creator.id !== user?.id) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-foreground">Not authorized</p>
            </div>
        );
    }

    const handleApprove = async (userId: string) => {
        await eventsApi.approveRequest(event.id, userId);
        fetchEvent();
    };

    const handleReject = async (userId: string) => {
        await eventsApi.rejectRequest(event.id, userId);
        fetchEvent();
    };

    return (
        <div className="min-h-screen px-4 py-10">
            <div className="max-w-3xl mx-auto">

                {/* Header card */}
                <div className="mb-8 p-6 rounded-xl bg-[#141414] dark:bg-[#0f1115] border border-[#27272a] shadow-sm">
                    <h1 className="text-2xl font-bold text-foreground mb-1">
                        Manage Requests
                    </h1>
                    <p className="text-muted-foreground text-sm">{event.title}</p>
                </div>

                {/* Pending requests */}
                <div className="p-6 rounded-xl bg-[#141414] dark:bg-[#0f1115] border border-[#27272a] shadow-sm">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Pending Requests ({event.joinRequests?.length || 0})
                    </h2>

                    {(event.joinRequests?.length === 0 || !event.joinRequests) && (
                        <p className="text-muted-foreground text-sm py-4 text-center">
                            No pending join requests.
                        </p>
                    )}

                    <div className="space-y-3">
                        {event.joinRequests?.map((reqUser: any) => (
                            <div
                                key={reqUser._id}
                                className="flex justify-between items-center p-4 rounded-lg border border-[#27272a] bg-[#1c1c1f] dark:bg-[#0f1115]"
                            >
                                <span className="font-medium text-foreground">
                                    {reqUser.username}
                                </span>

                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => handleApprove(reqUser._id)}
                                    >
                                        Approve
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleReject(reqUser._id)}
                                    >
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <Button
                    className="mt-6"
                    variant="outline"
                    onClick={() => navigate('/events')}
                >
                    ← Back to Events
                </Button>
            </div>
        </div>
    );
};

export default ManageEvent;