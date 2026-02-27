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
        try {
            const data = await eventsApi.getEventById(id!);
            setEvent(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvent();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!event) {
        return <div className="min-h-screen flex items-center justify-center">Event not found</div>;
    }

    if (!event.creator || event.creator.id !== user?.id) {
        return <div className="min-h-screen flex items-center justify-center">Not authorized</div>;
    }

    const safeJoinRequests =
        event.joinRequests?.filter((reqUser: any) => reqUser && reqUser._id) || [];

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

                <h1 className="text-2xl font-bold mb-6">Manage Requests</h1>

                {safeJoinRequests.length === 0 ? (
                    <p className="text-center">No pending join requests.</p>
                ) : (
                    <div className="space-y-3">
                        {safeJoinRequests.map((reqUser: any) => (
                            <div
                                key={reqUser._id}
                                className="flex justify-between items-center p-4 rounded-lg border"
                            >
                                <span>{reqUser.username}</span>
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={() => handleApprove(reqUser._id)}>
                                        Approve
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleReject(reqUser._id)}>
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Button className="mt-6" variant="outline" onClick={() => navigate('/events')}>
                    ← Back
                </Button>
            </div>
        </div>
    );
};

export default ManageEvent;