import React from 'react';
import Button from './Button';

const EmptyState = ({ icon, title, message, actionText, onAction }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            {icon && (
                <div className="text-gray-400 dark:text-gray-600 mb-4">
                    {icon}
                </div>
            )}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
                {message}
            </p>
            {actionText && onAction && (
                <Button onClick={onAction} variant="primary">
                    {actionText}
                </Button>
            )}
        </div>
    );
};

export default EmptyState;
