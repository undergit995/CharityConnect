import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CharityLayout from '../pages/charity/CharityLayout';
import AuthLoader from '../commonComponents/AuthLoader';

const CharityDashboard = lazy(() => import('../pages/charity/CharityDashboard'));
const CharityCampaigns = lazy(() => import('../pages/charity/CharityCampaigns'));
const CharityCreateCampaign = lazy(() => import('../pages/charity/CharityCreateCampaign'));
const CharityDonations = lazy(() => import('../pages/charity/CharityDonations'));
const CharityProfile = lazy(() => import('../pages/charity/CharityProfile'));
const CharityCampaignUpdates = lazy(() => import('../pages/charity/CharityCampaignUpdates'));
const CharityVerification = lazy(() => import('../pages/charity/CharityVerification'));
const CharityDocuments = lazy(() => import('../pages/charity/CharityDocuments'));
// const CharityNotifications = lazy(() => import('../pages/charity/CharityNotifications'));

const CharityRoutes = () => {
  return (
    <Suspense fallback={<AuthLoader />}>
      <Routes>
        <Route element={<CharityLayout />}>
          <Route index element={<Navigate to="/charity/dashboard" replace />} />
          <Route path="dashboard" element={<CharityDashboard />} />
          <Route path="campaigns" element={<CharityCampaigns />} />
          <Route path="campaigns/create" element={<CharityCreateCampaign />} />
          <Route path="campaigns/updates" element={<CharityCampaignUpdates />} />
          <Route path="donations" element={<CharityDonations />} />
          <Route path="profile" element={<CharityProfile />} />          
          <Route path="verification" element={<CharityVerification />} />
          <Route path="documents" element={<CharityDocuments />} />
          {/* <Route path="analytics" element={<CharityAnalytics />} />
          <Route path="notifications" element={<CharityNotifications />} /> */}
          <Route path="*" element={<Navigate to="/charity/dashboard" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default CharityRoutes;