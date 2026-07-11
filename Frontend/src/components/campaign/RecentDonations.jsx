import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from '@mui/material';
import { VolunteerActivism as DonateIcon } from '@mui/icons-material';
import { useTheme } from '../../hooks/useTheme';
import { formatDistanceToNow } from 'date-fns';

const RecentDonations = ({ donations }) => {
  const { isDark } = useTheme();
const donationsList = Array.isArray(donations) && Array.isArray(donations) 
    ? donations
    : [];
  if (!donations || donationsList.length <= 0) {
    return (
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Recent Donations
        </Typography>
        <Typography variant="body2" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0', textAlign: 'center', py: 2 }}>
          No donations yet. Be the first!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
        Recent Donations
      </Typography>
      <List dense>
        {donationsList.slice(0, 5).map((donation, index) => (
          <React.Fragment key={index}>
            <ListItem sx={{ px: 0 }}>
              <ListItemAvatar>
                <Avatar sx={{ width: 32, height: 32, backgroundColor: 'rgba(46, 204, 113, 0.15)', color: '#2ecc71' }}>
                  <DonateIcon sx={{ fontSize: 16 }} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                    {donation.isAnonymous ? 'Anonymous' : donation.donorName || 'Guest'}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                    ${donation.amount} • {formatDistanceToNow(new Date(donation.date), { addSuffix: true })}
                  </Typography>
                }
              />
            </ListItem>
            {index < Math.min(donations.length, 5) - 1 && (
              <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default RecentDonations;