import React from 'react';

/**
 * LoadingScreen - Loading animation with animated logo
 * Can be used as fullScreen overlay or inline within a page
 */
const LoadingScreen = ({ message = 'Loading...', fullScreen = true, overlay = false }) => {
    const containerClasses = overlay
        ? 'absolute inset-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm'
        : fullScreen
            ? 'fixed inset-0 z-50 bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'
            : 'w-full h-full min-h-[400px] bg-white dark:bg-gray-900';

    return (
        <div className={`${containerClasses} flex flex-col items-center justify-center transition-colors`}>
            {/* Animated Logo Container */}
            <div className="relative flex items-center justify-center">
                {/* Pulsing rings - outer */}
                <div className="absolute w-32 h-32 rounded-full border-4 border-blue-300/40 dark:border-blue-600/40 animate-ping" style={{ animationDuration: '1.5s' }}></div>
                <div className="absolute w-28 h-28 rounded-full border-4 border-blue-400/50 dark:border-blue-500/50 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }}></div>
                <div className="absolute w-24 h-24 rounded-full border-4 border-blue-500/60 dark:border-blue-400/60 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.6s' }}></div>

                {/* Logo with prominent pulse */}
                <div className="relative z-10 w-20 h-20 animate-logo-pulse">
                    <img
                        src="/haki%20logo%201.png"
                        alt="Haki Yetu"
                        className="w-full h-full object-contain drop-shadow-lg"
                    />
                </div>
            </div>

            {/* Loading text with animated dots */}
            <div className="mt-8 flex flex-col items-center">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    Haki Yetu
                </h2>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <span>{message}</span>
                    <div className="flex gap-0.5 ml-1">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6 w-48 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 rounded-full animate-loading-bar"></div>
            </div>
        </div>
    );
};

/**
 * LoadingSpinner - Small inline loading spinner
 * Use for buttons and small loading states
 */
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12'
    };

    return (
        <svg
            className={`animate-spin ${sizeClasses[size]} ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
};

/**
 * LogoLoader - Compact logo-based loader for inline use
 */
export const LogoLoader = ({ size = 48, className = '' }) => {
    return (
        <div className={`relative inline-flex items-center justify-center ${className}`}>
            <div
                className="animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"
                style={{ width: size, height: size }}
            />
            <img
                src="/haki%20logo%201.png"
                alt="Loading"
                className="absolute"
                style={{ width: size * 0.6, height: size * 0.6 }}
            />
        </div>
    );
};

export default LoadingScreen;
