import React from 'react';
import { Chip } from '@mui/material';
import {
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Block as BlockIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Verified as VerifiedIcon,
  Drafts as DraftIcon,
  Error as ErrorIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Upload as UploadIcon,
  HelpOutlineOutlined as HelpOutlineIcon,
  MonetizationOn as MonetizationOnIcon,
  Replay as ReplayIcon,
} from '@mui/icons-material';

const statusConfig = {
  // General
  pending: { label: 'Pending', color: '#f39c12', icon: <HourglassEmptyIcon /> },
  approved: { label: 'Approved', color: '#2ecc71', icon: <CheckCircleIcon /> },
  active: { label: 'Active', color: '#2ecc71', icon: <PlayArrowIcon /> },
  rejected: { label: 'Rejected', color: '#e74c3c', icon: <CancelIcon /> },
  suspended: { label: 'Suspended', color: '#e74c3c', icon: <BlockIcon /> },
  
  // Charity specific
  verified: { label: 'Verified', color: '#3498db', icon: <VerifiedIcon /> },

  // Campaign specific
  draft: { label: 'Draft', color: '#95a5a6', icon: <DraftIcon /> },
  paused: { label: 'Paused', color: '#3498db', icon: <PauseIcon /> },
  completed: { label: 'Completed', color: '#9b59b6', icon: <CheckCircleIcon /> },
  cancelled: { label: 'Cancelled', color: '#e74c3c', icon: <CancelIcon /> },
  
  // Donation specific
  failed: { label: 'Failed', color: '#e74c3c', icon: <ErrorIcon /> },
  refunded: { label: 'Refunded', color: '#95a5a6', icon: <ReplayIcon /> },

  // Verification specific
  submitted: { label: 'Submitted', color: '#3498db', icon: <UploadIcon /> },
  'needs-info': { label: 'Needs Info', color: '#e67e22', icon: <ErrorIcon /> },

  // Default
  default: { label: 'Unknown', color: '#7f8c8d', icon: <HelpOutlineIcon /> },
};

/**
 * A reusable component to display a status chip with consistent styling.
 *
 * @param {object} props
 * @param {string} props.status - The status string (e.g., 'pending', 'active').
 * @param {string} [props.size='small'] - The size of the chip.
 * @param {boolean} [props.showIcon=true] - Whether to show the icon.
 * @returns {React.ReactElement} The StatusChip component.
 */
const StatusChip = ({ status, size = 'small', showIcon = true }) => {
  const config = statusConfig[status?.toLowerCase()] || statusConfig.default;

  return (
    <Chip
      icon={showIcon ? config.icon : undefined}
      label={config.label}
      size={size}
      sx={{
        backgroundColor: `${config.color}20`, // 20 is for ~12% opacity
        color: config.color,
        fontWeight: 600,
        '& .MuiChip-icon': {
          color: config.color,
          fontSize: '1.1rem',
          marginLeft: '8px',
          marginRight: '-4px',
        },
      }}
    />
  );
};

/**
 * A specific status chip for charity status which has more complex logic.
 *
 * @param {object} props
 * @param {object} props.charity - The charity object.
 * @returns {React.ReactElement} The CharityStatusChip component.
 */
export const CharityStatusChip = ({ charity }) => {
  let status = 'active'; // Default to active if approved

  if (!charity.isApproved) {
    status = 'pending';
  } else if (charity.charityDetails?.verified) {
    status = 'verified';
  } else if (!charity.isActive) {
    status = 'suspended';
  }

  // If it's approved but not verified or suspended, it's just 'approved'
  if (charity.isApproved && status === 'active') {
      status = 'approved';
  }

  return <StatusChip status={status} />;
};

export default StatusChip;