import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop - Scrolls to the top of the page on route change
 * Place this component inside your Router, but outside of Routes
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    // Use layoutEffect for synchronous scrolling before paint
    useLayoutEffect(() => {
        // Multiple methods to ensure scroll works
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        // Also scroll the main content area if it exists
        const mainContent = document.querySelector('main') || document.getElementById('root');
        if (mainContent) {
            mainContent.scrollTop = 0;
        }
    }, [pathname]);

    return null;
};

export default ScrollToTop;
