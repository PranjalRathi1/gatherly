import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsApi } from '@/api/events';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type FormDataType = {
    title: string;
    description: string;
    date: string;
    location: string;
    maxAttendees: number;
    category: 'concert' | 'travel' | 'trekking';
    visibility: 'public' | 'private';
    joinCode: string;
    imageUrl: string;
};

const CreateEvent = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [formData, setFormData] = useState<FormDataType>({
        title: '',
        description: '',
        date: '',
        location: '',
        maxAttendees: 50,
        category: 'concert',
        visibility: 'public',
        joinCode: '',
        imageUrl: ''
    });

    const [loading, setLoading] = useState(false);

    /* =========================================
       🔒 ROLE PROTECTION (NEW ADDITION)
    ========================================== */

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (user.role !== 'creator' && user.role !== 'admin') {
            alert('This feature is restricted to approved creators.');
            navigate('/events');
        }
    }, [user, navigate]);

    /* ========================================= */

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: name === 'maxAttendees' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await eventsApi.createEvent({
                ...formData,
                date: new Date(formData.date).toISOString(),
                joinCode: formData.visibility === 'private' ? formData.joinCode : ''
            });

            navigate('/events');
        } catch (error) {
            console.error('Create event error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen flex justify-center items-center px-4 py-10">
            <Card className="w-full max-w-2xl bg-[#141414] dark:bg-[#0f1115] text-white border border-[#27272a] shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl text-foreground">
                        Create New Event
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">

                        <Input
                            name="title"
                            placeholder="Event Title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />

                        <Textarea
                            name="description"
                            placeholder="Event Description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            type="datetime-local"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            name="location"
                            placeholder="Location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            type="number"
                            name="maxAttendees"
                            value={formData.maxAttendees}
                            onChange={handleChange}
                        />

                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-muted text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                        >
                            <option value="concert">Concert</option>
                            <option value="travel">Travel</option>
                            <option value="trekking">Trekking</option>
                        </select>

                        <select
                            name="visibility"
                            value={formData.visibility}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-muted text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>

                        {formData.visibility === 'private' && (
                            <Input
                                name="joinCode"
                                placeholder="Enter Join Code"
                                value={formData.joinCode}
                                onChange={handleChange}
                                required
                            />
                        )}

                        <Input
                            name="imageUrl"
                            placeholder="Image URL (optional)"
                            value={formData.imageUrl}
                            onChange={handleChange}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Event'}
                        </Button>

                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateEvent;