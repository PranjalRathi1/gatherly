import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Tent, Users, Compass, PlaySquare } from 'lucide-react'; // Install lucide-react if missing

const AppLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-dark-bg text-white pb-20">
            {/* Main Content Area */}
            <main className="w-full">
                {children}
            </main>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
};

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { id: 'home', icon: Home, label: 'Home', path: '/discover' },
        { id: 'festivals', icon: Tent, label: 'Festivals', path: '/festivals' }, // You might need to create this route
        { id: 'following', icon: Users, label: 'Following', path: '/profile' }, // Using Profile as placeholder
        { id: 'clubs', icon: Compass, label: 'All Clubs', path: '/blogs' },    // Using Blogs as placeholder
        { id: 'moments', icon: PlaySquare, label: 'Moments', path: '/moments' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-dark-nav border-t border-gray-800 px-4 py-2 z-50">
            <div className="flex justify-between items-end max-w-lg mx-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center gap-1 w-full transition-colors ${
                                isActive ? 'text-brand-blue' : 'text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            <div className={`p-1 rounded-full ${isActive ? 'bg-blue-500/10' : ''}`}>
                                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default AppLayout;