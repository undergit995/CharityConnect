import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DonorLayout from '../pages/donor/DonorLayout';
import { Box } from '@mui/material';
import AuthLoader from '../commonComponents/AuthLoader';
import CampaignList from '../pages/donor/CampaignLists';

// Lazy load Donor components
const DonorDashboard = lazy(() => import('../pages/donor/DonorDashboard'));
const DonorProfile = lazy(() => import('../pages/donor/DonorProfile'));
const DonationPage = lazy(() => import('../pages/DonationPage'));
// const DonorSaved = lazy(() => import('../pages/donor/DonorSaved'));
// const DonorSettings = lazy(() => import('../pages/donor/DonorSettings'));
// const DonorNotifications = lazy(() => import('../pages/donor/DonorNotifications'));


const DonorRoutes = () => {
  return (
    <Suspense fallback={<AuthLoader />}>
      <Routes>
        <Route element={<DonorLayout />}>
          <Route index element={<Navigate to="/donor/dashboard" replace />} />
          <Route path="dashboard" element={<DonorDashboard />} />
          <Route path="profile" element={<DonorProfile />} />
          <Route path="campaigns" element={<CampaignList />} />
           <Route path="campaigns/:id/donate" element={<DonationPage />} />
          {/*
          <Route path="settings" element={<DonorSettings />} />
          <Route path="notifications" element={<DonorNotifications />} /> */}
          <Route path="*" element={<Navigate to="/donor/dashboard" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default DonorRoutes;