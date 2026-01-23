# Gatherly - Community Events Platform

A complete community-driven event platform where events become long-term communities.

## Features

- **Authentication**: Login/Signup with JWT-based auth
- **Events**: Create, discover, join/leave events
- **Event-Based Communities**: Private group chat per event (unlocks after joining)
- **Moments**: Upload and share photos/videos with like functionality
- **Blogs**: Read event-related blogs and community stories
- **Notifications**: Real-time notification system with read/unread states
- **Recommendations**: Rule-based event recommendations

## Tech Stack

- React (Vite)
- JavaScript
- Tailwind CSS
- React Router
- Axios
- Zustand (State Management)
- Socket.io Client
- Framer Motion

## Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── layout/          # Layout components
│   ├── event/           # Event-related components
│   ├── chat/            # Chat components
│   ├── media/           # Media/Moments components
│   └── blog/            # Blog components
├── pages/               # Page components
├── store/               # Zustand stores
├── services/            # API services
├── hooks/               # Custom hooks
└── utils/               # Utility functions
```

## Pages

- `/login` - Login page
- `/signup` - Signup page
- `/discover` - Discover events
- `/event/:id` - Event details
- `/chat/:eventId` - Event chat
- `/moments` - Media feed
- `/blogs` - Blog list
- `/blog/:id` - Blog detail
- `/notifications` - Notifications
- `/profile` - User profile
- `/create` - Create event

## Design Features

- Mobile-first responsive design
- Dark mode by default
- Soft gradients and rounded corners
- Subtle shadows and animations
- Clean typography with Inter font
- WhatsApp-style chat UI

## State Management

- **authStore**: User authentication state
- **eventStore**: Events and joined events
- **chatStore**: Chat messages per event
- **notificationStore**: Notifications with read/unread states

## Notes

- Backend API is mocked for demonstration
- Socket.io is configured but uses mock data
- All data is temporary and resets on refresh
- JWT tokens are stored in localStorage
