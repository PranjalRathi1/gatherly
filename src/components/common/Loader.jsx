import React from 'react';

const Loader = ({ size = 'md', fullScreen = false }) => {
    const sizes = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16'
    };

    const loader = (
        <div className="flex items-center justify-center">
            <div className={`${sizes[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                {loader}
            </div>
        );
    }

    return loader;
};

export default Loader;
