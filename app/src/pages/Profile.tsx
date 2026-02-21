import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { profileApi, type Profile as ProfileType } from '@/api/profile';
import { eventsApi } from '@/api/events';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, ArrowLeft, Edit, Trophy, Award } from 'lucide-react';
import VibeBadge from '@/components/VibeBadge';
import { calculateVibeProfile, type VibeProfile } from '@/utils/vibeMatching';
import { checkAchievements, calculateUserStats, type Achievement } from '@/utils/achievements';

const Profile = () => {
    const { userId } = useParams<{ userId?: string }>();
    const navigate = useNavigate();
    const { user: currentUser } = useAuthStore();

    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [vibeProfile, setVibeProfile] = useState<VibeProfile | null>(null);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [editData, setEditData] = useState({ displayName: '', avatar: '' });

    const isOwnProfile = !userId || userId === currentUser?.id;

    useEffect(() => {
        fetchProfile();
    }, [userId]);

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            const data = await profileApi.getProfile(userId);
            setProfile(data);
            setEditData({
                displayName: data.user.displayName || '',
                avatar: data.user.avatar || '',
            });

            const allEvents = await eventsApi.getAllEvents();
            const vibe = calculateVibeProfile(data.user.id, allEvents);
            setVibeProfile(vibe);

            const stats = calculateUserStats(data.user.id, allEvents);
            const userAchievements = checkAchievements(stats);
            setAchievements(userAchievements);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            await profileApi.updateProfile(editData);
            setIsEditing(false);
            fetchProfile();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
        }
    };

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-arctic-deepest via-arctic-deep to-arctic-mid">
                <div className="text-lg text-aurora-cyan font-display">
                    Loading profile... 🐧
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Alert variant="destructive" className="max-w-md">
                    <AlertDescription>
                        {error || 'Profile not found'}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    // SAFE FALLBACKS (important for new users)
    const safeVibeProfile: VibeProfile = vibeProfile ?? {
        primaryVibe: 'explorer',
        vibeScores: {
            party: 0,
            adventure: 0,
            culture: 0,
            social: 0,
            explorer: 0,
        },
        vibePercentages: {
            party: 0,
            adventure: 0,
            culture: 0,
            social: 0,
            explorer: 0,
        },
        totalScore: 0,
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-arctic-deepest via-arctic-deep to-arctic-mid">

            {/* HEADER */}
            <header className="bg-arctic-deep/80 backdrop-blur-xl border-b border-aurora-cyan/20">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/events')}
                        className="text-ice-white"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Events
                    </Button>

                    <h1 className="text-2xl font-display font-bold text-white">
                        Profile
                    </h1>

                    <div className="w-24"></div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-8">

                {/* PROFILE HEADER CARD */}
                <Card className="mb-6 bg-arctic-deep/90 border border-aurora-cyan/30">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">

                                {/* AVATAR */}
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-aurora-cyan to-aurora-purple flex items-center justify-center text-3xl font-bold text-white">
                                    {profile.user.avatar ? (
                                        <img
                                            src={profile.user.avatar}
                                            alt={profile.user.displayName}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        profile.user.displayName?.charAt(0).toUpperCase() ||
                                        profile.user.username.charAt(0).toUpperCase()
                                    )}
                                </div>

                                {/* USER INFO */}
                                <div>
                                    <h2 className="text-2xl font-bold text-white">
                                        {profile.user.displayName || profile.user.username}
                                    </h2>
                                    <p className="text-aurora-cyan font-mono">
                                        @{profile.user.username}
                                    </p>
                                    <p className="text-sm text-gray-300">
                                        {profile.user.email}
                                    </p>
                                </div>
                            </div>

                            {isOwnProfile && (
                                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="text-white">
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit Profile
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-arctic-deep">
                                        <DialogHeader>
                                            <DialogTitle className="text-white">
                                                Edit Profile
                                            </DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div>
                                                <Label className="text-white">
                                                    Display Name
                                                </Label>
                                                <Input
                                                    value={editData.displayName}
                                                    onChange={(e) =>
                                                        setEditData({
                                                            ...editData,
                                                            displayName: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <Label className="text-white">
                                                    Avatar URL
                                                </Label>
                                                <Input
                                                    value={editData.avatar}
                                                    onChange={(e) =>
                                                        setEditData({
                                                            ...editData,
                                                            avatar: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>

                                            <Button onClick={handleUpdateProfile} className="w-full">
                                                Save Changes
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    </CardHeader>
                </Card>

                {/* VIBE SECTION (ALWAYS VISIBLE) */}
                <Card className="mb-6 bg-arctic-deep/90 border border-aurora-purple/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Trophy className="w-5 h-5 text-aurora-purple" />
                            Your Vibe Profile
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        {safeVibeProfile.totalScore === 0 ? (
                            <p className="text-gray-300 text-center py-4">
                                Join events to discover your vibe! 🐧
                            </p>
                        ) : (
                            <>
                                <div className="flex justify-center py-4">
                                    <VibeBadge
                                        vibe={safeVibeProfile.primaryVibe}
                                        size="lg"
                                        showDescription
                                    />
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* ACHIEVEMENTS (ALWAYS VISIBLE) */}
                <Card className="mb-6 bg-arctic-deep/90 border border-aurora-green/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Award className="w-5 h-5 text-aurora-green" />
                            Penguin Achievements
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        {achievements.length === 0 ? (
                            <p className="text-gray-300 text-center py-4">
                                No achievements unlocked yet 🐧
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {achievements.map((achievement) => (
                                    <div
                                        key={achievement.id}
                                        className="p-4 rounded-lg border border-gray-700"
                                    >
                                        <div className="text-3xl mb-2">
                                            {achievement.icon}
                                        </div>
                                        <h4 className="text-white font-semibold">
                                            {achievement.name}
                                        </h4>
                                        <p className="text-sm text-gray-300">
                                            {achievement.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* JOINED EVENTS */}
                <Card className="bg-arctic-deep/90 border border-aurora-green/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Calendar className="w-5 h-5 text-aurora-green" />
                            Joined Events ({profile.joinedEvents.length})
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        {profile.joinedEvents.length === 0 ? (
                            <p className="text-gray-300 text-center py-4">
                                No events joined yet 🐧
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {profile.joinedEvents.slice(0, 5).map((event: any) => (
                                    <div
                                        key={event._id}
                                        className="p-3 rounded-lg bg-arctic-mid/50 cursor-pointer"
                                        onClick={() =>
                                            navigate(`/events/${event._id}/chat`)
                                        }
                                    >
                                        <h3 className="font-semibold text-white">
                                            {event.title}
                                        </h3>
                                        <p className="text-sm text-gray-300">
                                            {formatDate(event.date)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
