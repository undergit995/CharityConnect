import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DonorLayout from '../pages/donor/DonorLayout';

// import DonorDonations from '../pages/DonorDonations';
// import DonorSaved from '../pages/DonorSaved';
// import DonorProfile from '../pages/DonorProfile';
// import DonorSettings from '../pages/DonorSettings';
// import DonorNotifications from '../pages/DonorNotifications';

const DonorRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DonorLayout />}>
        <Route index element={<Navigate to="/donor" replace />} />
        {/* <Route path="dashboard" element={<DonorDashboard />} /> */}
        {/* <Route path="donations" element={<DonorDonations />} />
        <Route path="saved" element={<DonorSaved />} />
        <Route path="profile" element={<DonorProfile />} />
        <Route path="settings" element={<DonorSettings />} />
        <Route path="notifications" element={<DonorNotifications />} /> */}
      </Route>
      <Route path="*" element={<Navigate to="/donor/dashboard" replace />} />
    </Routes>
  );
};

export default DonorRoutes;