import React, { useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import BlogCard from '../components/blog/BlogCard';

const Blogs = () => {
    // Layout preparation for different post types
    const [activeTab, setActiveTab] = useState('all');

    return (
        <PageWrapper>
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Blogs & Stories</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Read stories, watch reels, and explore the community.
                    </p>
                </div>

                <div className="flex gap-4 mb-6">
                    {['all', 'articles', 'photos', 'videos'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-full font-medium transition-colors ${activeTab === tab
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Placeholder Content Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                        <p>Content for {activeTab} will appear here.</p>
                        <p className="text-sm mt-2">Connect to backend to fetch posts.</p>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default Blogs;
