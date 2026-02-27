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
import authApi from '@/api/auth';

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

    // ✅ FIXED
    const isOwnProfile = !userId || userId === currentUser?.id;

    useEffect(() => {
        fetchProfile();
    }, [userId]);

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            setError('');

            const data = await profileApi.getProfile(userId);

            if (!data || !data.user) {
                throw new Error("Invalid profile response");
            }

            setProfile(data);

            setEditData({
                displayName: data.user.displayName || '',
                avatar: data.user.avatar || '',
            });

            const allEvents = await eventsApi.getAllEvents();

            // ✅ FIXED
            const vibe = calculateVibeProfile(data.user.id, allEvents);
            setVibeProfile(vibe);

            const stats = calculateUserStats(data.user.id, allEvents);
            const userAchievements = checkAchievements(stats);
            setAchievements(userAchievements);

        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to load profile');
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg text-black dark:text-white">
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

    const safeVibeProfile: VibeProfile = vibeProfile ?? {
        primaryVibe: 'explorer',
        vibeScores: { party: 0, adventure: 0, culture: 0, social: 0, explorer: 0 },
        vibePercentages: { party: 0, adventure: 0, culture: 0, social: 0, explorer: 0 },
        totalScore: 0,
    };
    return (
        <div className="min-h-screen transition-colors duration-500">

            {/* HEADER */}
            <header className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border-b border-gray-200 dark:border-zinc-700">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/events')}
                        className="text-black dark:text-white"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Events
                    </Button>

                    <h1 className="text-2xl font-bold text-black dark:text-white">
                        Profile
                    </h1>

                    <div className="w-24"></div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

                {/* PROFILE CARD */}
                <Card className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur border border-gray-200 dark:border-zinc-700 shadow-sm">
                    <CardHeader>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">

                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white">
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

                                <div>
                                    <h2 className="text-2xl font-bold text-black dark:text-white flex items-center gap-2">
                                        {profile.user.displayName || profile.user.username}

                                        {/* ROLE BADGE */}
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium
                            ${currentUser?.role === 'admin'
                                                ? 'bg-red-500/20 text-red-600'
                                                : currentUser?.role === 'creator'
                                                    ? 'bg-purple-500/20 text-purple-600'
                                                    : 'bg-gray-500/20 text-gray-600'
                                            }`}
                                        >
                                            {currentUser?.role?.toUpperCase()}
                                        </span>
                                    </h2>

                                    <p className="text-gray-600 dark:text-gray-400 font-mono">
                                        @{profile.user.username}
                                    </p>

                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {profile.user.email}
                                    </p>
                                </div>
                            </div>

                            {isOwnProfile && (
                                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit Profile
                                        </Button>
                                    </DialogTrigger>

                                    <DialogContent className="bg-white dark:bg-zinc-900">
                                        <DialogHeader>
                                            <DialogTitle className="text-black dark:text-white">
                                                Edit Profile
                                            </DialogTitle>
                                        </DialogHeader>

                                        <div className="space-y-4">
                                            <div>
                                                <Label className="text-black dark:text-white">
                                                    Display Name
                                                </Label>
                                                <Input
                                                    value={editData.displayName}
                                                    onChange={(e) =>
                                                        setEditData({ ...editData, displayName: e.target.value })
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <Label className="text-black dark:text-white">
                                                    Avatar URL
                                                </Label>
                                                <Input
                                                    value={editData.avatar}
                                                    onChange={(e) =>
                                                        setEditData({ ...editData, avatar: e.target.value })
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

                    {/* 🔥 CREATOR ACCESS SECTION */}
                    {isOwnProfile && currentUser?.role === 'user' && (
                        <CardContent className="border-t border-gray-200 dark:border-zinc-700 pt-4">
                            {currentUser.creatorRequestStatus === 'pending' ? (
                                <p className="text-yellow-600 font-medium">
                                    ⏳ Creator request pending approval
                                </p>
                            ) : currentUser.creatorRequestStatus === 'rejected' ? (
                                <p className="text-red-500 font-medium">
                                    ❌ Your previous request was rejected
                                </p>
                            ) : (
                                <Button
                                    onClick={async () => {
                                        try {
                                            await authApi.requestCreatorAccess();
                                            alert("Creator request submitted successfully!");
                                        } catch {
                                            alert("Failed to submit request");
                                        }
                                    }}
                                >
                                    Request Creator Access
                                </Button>
                            )}
                        </CardContent>
                    )}
                </Card>

                {/* VIBE */}
                <Card className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur border border-gray-200 dark:border-zinc-700 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                            <Trophy className="w-5 h-5 text-purple-500" />
                            Your Vibe Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {safeVibeProfile.totalScore === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                                Join events to discover your vibe! 🐧
                            </p>
                        ) : (
                            <div className="flex justify-center py-4">
                                <VibeBadge
                                    vibe={safeVibeProfile.primaryVibe}
                                    size="lg"
                                    showDescription
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* ACHIEVEMENTS */}
                <Card className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur border border-gray-200 dark:border-zinc-700 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                            <Award className="w-5 h-5 text-green-500" />
                            Penguin Achievements
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {achievements.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                                No achievements unlocked yet 🐧
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {achievements.map((achievement) => (
                                    <div
                                        key={achievement.id}
                                        className="p-4 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white/60 dark:bg-zinc-800/60"
                                    >
                                        <div className="text-3xl mb-2">
                                            {achievement.icon}
                                        </div>
                                        <h4 className="text-black dark:text-white font-semibold">
                                            {achievement.name}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {achievement.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* JOINED EVENTS */}
                <Card className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur border border-gray-200 dark:border-zinc-700 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                            <Calendar className="w-5 h-5 text-indigo-500" />
                            Joined Events ({profile.joinedEvents.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {profile.joinedEvents.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                                No events joined yet 🐧
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {profile.joinedEvents.slice(0, 5).map((event: any) => (
                                    <div
                                        key={event._id}
                                        className="p-3 rounded-lg bg-gray-100/70 dark:bg-zinc-800/60 cursor-pointer hover:scale-[1.02] transition"
                                        onClick={() =>
                                            navigate(`/events/${event._id}/chat`)
                                        }
                                    >
                                        <h3 className="font-semibold text-black dark:text-white">
                                            {event.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
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