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

    if (loading) return <div className="p-8">Loading...</div>;

    if (!event) return <div>Event not found</div>;

    if (event.creator._id !== user?.id) {
        return <div className="p-8">Not authorized</div>;
    }

    const handleApprove = async (userId: string) => {
        await eventsApi.approveRequest(event._id, userId);
        fetchEvent();
    };

    const handleReject = async (userId: string) => {
        await eventsApi.rejectRequest(event._id, userId);
        fetchEvent();
    };

    return (
        <div className="max-w-3xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">
                Manage: {event.title}
            </h1>

            <h2 className="text-lg font-semibold mb-4">
                Pending Requests ({event.joinRequests?.length || 0})
            </h2>

            {event.joinRequests && event.joinRequests.length === 0 && (
                <p>No pending requests.</p>
            )}

            <div className="space-y-4">
                {event.joinRequests?.map((reqUser: any) => (
                    <div
                        key={reqUser._id}
                        className="flex justify-between items-center p-4 border rounded-lg"
                    >
                        <span>{reqUser.username}</span>

                        <div className="flex gap-2">
                            <Button
                                onClick={() => handleApprove(reqUser._id)}
                            >
                                Approve
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => handleReject(reqUser._id)}
                            >
                                Reject
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <Button
                className="mt-8"
                variant="outline"
                onClick={() => navigate('/events')}
            >
                Back
            </Button>
        </div>
    );
};

export default ManageEvent;