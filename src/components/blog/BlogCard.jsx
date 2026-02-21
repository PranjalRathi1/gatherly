import React from 'react';
import { useNavigate } from 'react-router-dom';

const BlogCard = ({ id, title, excerpt, author, date, image, category }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/blog/${id}`)}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
            {image && (
                <div className="h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                </div>
            )}
            <div className="p-5">
                {category && (
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded-full mb-3">
                        {category}
                    </span>
                )}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{author}</span>
                    <span>{date}</span>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
