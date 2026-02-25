import React from 'react';

const Input = ({
    label,
    placeholder,
    error,
    disabled = false,
    icon,
    id,
    className = '',
    ...props
}) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseStyles = 'w-full px-4 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const normalStyles = 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-400';

    const errorStyles = 'border-red-500 bg-red-50 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-900/20 dark:text-red-100 dark:placeholder-red-400';

    const iconPadding = icon ? 'pl-10' : '';

    const inputClasses = `${baseStyles} ${error ? errorStyles : normalStyles} ${iconPadding} ${className}`;

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                        {icon}
                    </div>
                )}

                <input
                    id={inputId}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={inputClasses}
                    {...props}
                />
            </div>

            {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
