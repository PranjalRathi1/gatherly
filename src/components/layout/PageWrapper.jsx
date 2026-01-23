import React from 'react';
import Header from './Header';
import BottomNavigation from './BottomNavigation';

const PageWrapper = ({ children, showHeader = true, showBottomNav = true }) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {showHeader && <Header />}
            <main className={`${showBottomNav ? 'pb-20 md:pb-0' : ''}`}>
                {children}
            </main>
            {showBottomNav && <BottomNavigation />}
        </div>
    );
};

export default PageWrapper;
