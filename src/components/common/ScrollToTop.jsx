import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop - Scrolls to the top of the page on route change
 * Place this component inside your Router, but outside of Routes
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Scroll to top on route change
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant' // Use 'instant' to avoid janky smooth scroll during navigation
        });
    }, [pathname]);

    return null; // This component doesn't render anything
};

export default ScrollToTop;
