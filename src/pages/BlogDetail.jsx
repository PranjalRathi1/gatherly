import React from 'react';
import { useParams } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import { mockBlogs } from '../utils/mockData';

const BlogDetail = () => {
    const { id } = useParams();
    const blog = mockBlogs.find(b => b.id === parseInt(id));

    if (!blog) {
        return (
            <PageWrapper>
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Blog not found</h2>
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <article className="max-w-4xl mx-auto px-4 py-6">
                {blog.image && (
                    <div className="h-64 md:h-96 rounded-2xl overflow-hidden mb-6">
                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
                    <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                        {blog.category}
                    </span>

                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {blog.title}
                    </h1>

                    <div className="flex items-center text-gray-600 dark:text-gray-400 mb-6">
                        <span className="font-semibold">{blog.author}</span>
                        <span className="mx-2">•</span>
                        <span>{blog.date}</span>
                    </div>

                    <div className="prose dark:prose-invert max-w-none">
                        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                            {blog.excerpt}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                            {blog.content || 'Full blog content would go here. This is a detailed article about the topic with multiple paragraphs, insights, and valuable information for readers.'}
                        </p>
                    </div>
                </div>
            </article>
        </PageWrapper>
    );
};

export default BlogDetail;
