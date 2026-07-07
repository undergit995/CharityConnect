import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CharityLayout from '../pages/charity/CharityLayout';

// import CharityDashboard from '../pages/CharityDashboard';
// import CharityCampaigns from '../pages/CharityCampaigns';
// import CharityCreateCampaign from '../pages/CharityCreateCampaign';
// import CharityEditCampaign from '../pages/CharityEditCampaign';
// import CharityDonations from '../pages/CharityDonations';
// import CharityAnalytics from '../pages/CharityAnalytics';
// import CharityProfile from '../pages/CharityProfile';
// import CharitySettings from '../pages/CharitySettings';
// import CharityNotifications from '../pages/CharityNotifications';

const CharityRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CharityLayout />}>
        <Route index element={<Navigate to="/charity" replace />} />
        {/* <Route path="dashboard" element={<CharityDashboard />} /> */}
        {/* <Route path="campaigns" element={<CharityCampaigns />} />
        <Route path="campaigns/create" element={<CharityCreateCampaign />} />
        <Route path="campaigns/:id/edit" element={<CharityEditCampaign />} />
        <Route path="donations" element={<CharityDonations />} />
        <Route path="analytics" element={<CharityAnalytics />} />
        <Route path="profile" element={<CharityProfile />} />
        <Route path="settings" element={<CharitySettings />} />
        <Route path="notifications" element={<CharityNotifications />} /> */}
      </Route>
      <Route path="*" element={<Navigate to="/charity/dashboard" replace />} />
    </Routes>
  );
};

export default CharityRoutes;