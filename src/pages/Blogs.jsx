import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import BlogCard from '../components/blog/BlogCard';
import { mockBlogs } from '../utils/mockData';

const Blogs = () => {
    return (
        <PageWrapper>
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Blogs</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Read stories and insights from our community
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockBlogs.map((blog) => (
                        <BlogCard key={blog.id} {...blog} />
                    ))}
                </div>
            </div>
        </PageWrapper>
    );
};

export default Blogs;
