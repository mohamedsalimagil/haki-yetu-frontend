import { useEffect, useRef, useState } from 'react';

/**
 * Hook for scroll-reveal animations using Intersection Observer
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Visibility threshold (0-1), default 0.1
 * @param {string} options.rootMargin - Margin around the root, default "0px 0px -50px 0px"
 * @returns {Object} { ref, isRevealed }
 */
export const useScrollReveal = (options = {}) => {
    const [isRevealed, setIsRevealed] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsRevealed(true);
                    observer.unobserve(element); // Only animate once
                }
            },
            {
                threshold: options.threshold || 0.1,
                rootMargin: options.rootMargin || '0px 0px -50px 0px',
            }
        );

        observer.observe(element);

        return () => {
            if (element) observer.unobserve(element);
        };
    }, [options.threshold, options.rootMargin]);

    return { ref, isRevealed };
};

/**
 * Hook for page enter animation
 * Triggers animation when component mounts
 */
export const usePageTransition = () => {
    const [isEntered, setIsEntered] = useState(false);

    useEffect(() => {
        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            setIsEntered(true);
        }, 50);

        return () => clearTimeout(timer);
    }, []);

    return isEntered;
};

/**
 * Component wrapper for scroll reveal animation
 */
export const ScrollReveal = ({
    children,
    className = '',
    animation = 'scroll-reveal',
    threshold = 0.1
}) => {
    const { ref, isRevealed } = useScrollReveal({ threshold });

    return (
        <div
            ref={ref}
            className={`${animation} ${isRevealed ? 'revealed' : ''} ${className}`}
        >
            {children}
        </div>
    );
};

/**
 * Page wrapper component for smooth page transitions
 */
export const PageTransition = ({ children, className = '' }) => {
    const isEntered = usePageTransition();

    return (
        <div
            className={`${isEntered ? 'page-enter' : 'opacity-0'} ${className}`}
        >
            {children}
        </div>
    );
};

export default { useScrollReveal, usePageTransition, ScrollReveal, PageTransition };
