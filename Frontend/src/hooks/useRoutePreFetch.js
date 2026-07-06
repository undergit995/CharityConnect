import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ROUTES } from './routes';

export const useRoutePrefetch = () => {
  const location = useLocation();

  useEffect(() => {
    // Prefetch routes based on user behavior
    const prefetchRoutes = () => {
      const currentPath = location.pathname;
      
      // Prefetch dashboard routes when on auth pages
      if (currentPath.includes('/auth')) {
        import('./pages/Dashboard');
        import('./pages/Profile');
      }
      
      // Prefetch campaign details when on campaigns list
      if (currentPath === ROUTES.CAMPAIGNS) {
        import('./pages/CampaignDetails');
      }
      
      // Prefetch donation pages when on campaign details
      if (currentPath.includes('/campaigns/') && !currentPath.includes('/donate')) {
        import('./pages/DonationPage');
      }
      
      // Prefetch charity dashboard when viewing charity profile
      if (currentPath.includes('/charity/')) {
        import('./pages/CharityDashboard');
      }
    };

    // Add event listeners for mouse hover on navigation links
    const handleLinkHover = (e) => {
      const link = e.target.closest('a');
      if (link && link.href) {
        const url = new URL(link.href);
        const path = url.pathname;
        
        // Prefetch based on link destination
        if (path.includes('/campaigns/')) {
          import('./pages/CampaignDetails');
        }
        if (path.includes('/dashboard')) {
          import('./pages/Dashboard');
        }
        if (path.includes('/profile')) {
          import('./pages/Profile');
        }
      }
    };

    // Prefetch on idle time
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        prefetchRoutes();
      });
    } else {
      setTimeout(prefetchRoutes, 1000);
    }

    document.addEventListener('mouseover', handleLinkHover);

    return () => {
      document.removeEventListener('mouseover', handleLinkHover);
    };
  }, [location]);
};