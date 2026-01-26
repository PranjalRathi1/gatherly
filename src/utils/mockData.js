export const mockClubs = [
    {
        id: 1,
        name: 'Delhi Music Collective',
        category: 'Music Club',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
        rating: 4.7,
        memberCount: 236,
        upcomingEvent: {
            title: 'Where music meets mental reset - Soul Soothing Jamming',
            image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800'
        }
    },
    {
        id: 2,
        name: 'Misfits Lounge',
        category: 'Social Club',
        image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=400',
        rating: 4.8,
        memberCount: 189,
        upcomingEvent: {
            title: 'NY Meetup-fest by Misfits: 2026 is here!',
            image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800'
        }
    },
    {
        id: 3,
        name: 'Adventure Seekers',
        category: 'Travel Club',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        rating: 4.9,
        memberCount: 342,
        upcomingEvent: {
            title: 'Weekend Trek to Triund - Himachal Pradesh',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
        }
    },
    {
        id: 4,
        name: 'Tech Innovators',
        category: 'Technology',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
        rating: 4.6,
        memberCount: 428,
        upcomingEvent: {
            title: 'AI & ML Workshop - Build Your First Model',
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800'
        }
    },
    {
        id: 5,
        name: 'Fitness Warriors',
        category: 'Fitness',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
        rating: 4.5,
        memberCount: 512,
        upcomingEvent: {
            title: 'Morning Yoga & Meditation Session',
            image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800'
        }
    }
];

export const mockEvents = [
    {
        id: 1,
        title: 'Weekend Basketball Tournament',
        description: 'Join us for an exciting basketball tournament this weekend!',
        date: '2026-01-25',
        time: '10:00 AM',
        location: 'Central Sports Arena, Downtown',
        category: 'Basketball',
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
        isHost: false,
        participants: 24,
        clubId: 5
    },
    {
        id: 2,
        title: 'Morning Yoga Session',
        description: 'Start your day with a peaceful yoga session in the park.',
        date: '2026-01-26',
        time: '07:00 AM',
        location: 'Green Park, North Side',
        category: 'Yoga',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
        isHost: false,
        participants: 15,
        clubId: 5
    },
    {
        id: 3,
        title: 'Tech Meetup: AI & ML',
        description: 'Discuss the latest trends in AI and Machine Learning with fellow enthusiasts.',
        date: '2026-01-27',
        time: '06:00 PM',
        location: 'Innovation Hub, Tech Park',
        category: 'Technology',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
        isHost: false,
        participants: 45,
        clubId: 4
    },
    {
        id: 4,
        title: 'Evening Football Match',
        description: 'Friendly football match. All skill levels welcome!',
        date: '2026-01-28',
        time: '05:00 PM',
        location: 'City Stadium',
        category: 'Football',
        image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
        isHost: false,
        participants: 22,
        clubId: 5
    }
];

export const mockBlogs = [
    {
        id: 1,
        title: 'How Community Events Build Lasting Friendships',
        excerpt: 'Discover how participating in local events can help you form meaningful connections that last a lifetime.',
        author: 'Sarah Johnson',
        date: 'Jan 20, 2026',
        image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
        category: 'Community',
        content: 'Full blog content here...'
    },
    {
        id: 2,
        title: '10 Tips for Organizing Successful Events',
        excerpt: 'Learn the secrets to planning and executing events that people will remember and talk about.',
        author: 'Mike Chen',
        date: 'Jan 18, 2026',
        image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
        category: 'Tips',
        content: 'Full blog content here...'
    },
    {
        id: 3,
        title: 'The Rise of Virtual Communities',
        excerpt: 'Exploring how online platforms are transforming the way we connect and build communities.',
        author: 'Emily Davis',
        date: 'Jan 15, 2026',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
        category: 'Technology',
        content: 'Full blog content here...'
    }
];

export const mockMoments = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
        caption: 'Amazing game today! 🏀',
        author: 'Alex Turner',
        likes: 42,
        isLiked: false,
        timestamp: '2 hours ago',
        eventId: 1,
        clubName: 'Fitness Warriors'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
        caption: 'Perfect morning for yoga ☀️',
        author: 'Lisa Wong',
        likes: 28,
        isLiked: true,
        timestamp: '5 hours ago',
        eventId: 2,
        clubName: 'Fitness Warriors'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
        caption: 'Soul soothing jamming session 🎵',
        author: 'Shubham V',
        likes: 64,
        isLiked: false,
        timestamp: '1 day ago',
        eventId: null,
        clubName: 'Delhi Music Collective'
    }
];

export const mockNotifications = [
    {
        id: 1,
        type: 'event_join',
        title: 'New participant joined',
        message: 'Sarah joined "Weekend Basketball Tournament"',
        timestamp: '10 minutes ago',
        read: false
    },
    {
        id: 2,
        type: 'event_reminder',
        title: 'Event starting soon',
        message: 'Morning Yoga Session starts in 1 hour',
        timestamp: '1 hour ago',
        read: false
    },
    {
        id: 3,
        type: 'chat_message',
        title: 'New message',
        message: 'You have a new message in Tech Meetup chat',
        timestamp: '3 hours ago',
        read: true
    }
];
