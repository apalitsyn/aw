import React from 'react';
import { Box } from '@mui/material';
import api from '../../api/axios';

interface BrandIconProps {
  logoUrl?: string | null;
  size?: number;
}

const BrandIcon: React.FC<BrandIconProps> = ({ logoUrl, size = 24 }) => {
  if (!logoUrl) return null;

  const baseURL = api.defaults.baseURL || '';

  const src = logoUrl.startsWith('http')
    ? logoUrl
    : `${baseURL.replace(/\/$/, '')}${logoUrl}`;

  return (
    <Box
      component="img"
      src={src}
      alt="brand logo"
      sx={{
        width: size,
        height: size,
        objectFit: 'contain',
        display: 'inline-block',
      }}
    />
  );
};

export default BrandIcon;
