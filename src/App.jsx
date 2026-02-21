import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import AppLayout from './components/layout/AppLayout';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Discover from './pages/Discover';
import EventDetail from './pages/EventDetail';
import Chat from './pages/Chat';
import Moments from './pages/Moments';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Create from './pages/Create';
import Festivals from './pages/Festivals';
import Concerts from './pages/Concerts';
import Travel from './pages/Travel';


// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuthStore();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Routes (Wrapped in Layout) */}
                <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Routes>
                                    <Route path="events" element={<Discover />} />
                                    <Route path="discover" element={<Navigate to="/events" replace />} /> {/* Redirect old route */}
                                    <Route path="concerts" element={<Concerts />} />
                                    <Route path="travel" element={<Travel />} />
                                    <Route path="blogs" element={<Blogs />} />

                                    <Route path="event/:id" element={<EventDetail />} />
                                    <Route path="chat/:eventId" element={<Chat />} />

                                    {/* Keep existing routes if they don't conflict */}
                                    <Route path="moments" element={<Moments />} />
                                    <Route path="blog/:id" element={<BlogDetail />} />
                                    <Route path="notifications" element={<Notifications />} />
                                    <Route path="profile" element={<Profile />} />
                                    <Route path="create" element={<Create />} />
                                    <Route path="festivals" element={<Festivals />} />

                                    {/* Default redirect to events */}
                                    <Route path="*" element={<Navigate to="/events" replace />} />
                                </Routes>
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;