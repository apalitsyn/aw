import { Tabs, Tab, Box, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useState } from 'react';
import ByBrand from './ByBrand';
import ByParams from './ByParams';

const WheelSelectorTabs = () => {
  const [tab, setTab] = useState(0);
  const theme = useTheme();

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };
  const backgroundImages = {
    light: [
      '/background/wheel_selector/light-brand-1.jpg',
      '/background/wheel_selector/light-brand-1.jpg',
    ],
    dark: [
      '/background/wheel_selector/dark-brand-1.jpg',
      '/background/wheel_selector/dark-brand-1.jpg',
    ],
  };

  const mode = theme.palette.mode === 'dark' ? 'dark' : 'light';
  const currentBg = backgroundImages[mode][tab];

  return (
    <Box sx={{ mt: 4, width: '100%' }}>
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'transparent',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            py: 2,
            px: 3,
            borderBottom: '1px solid',
            borderColor: 'transparent',
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography variant="h5" fontWeight={600} align="center">
            Подобрать диски
          </Typography>
        </Box>
        <Tabs
          value={tab}
          onChange={handleChange}
          variant="fullWidth"
          textColor="inherit"
          TabIndicatorProps={{
            style: {
              backgroundColor: '#eab62f',
              height: 3,
            },
          }}
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Tab label="По марке авто" />
          <Tab label="По параметрам" />
        </Tabs>

        <Box
          sx={{
            p: 3,
            backgroundImage: `url(${currentBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transition: 'background-image 0.3s ease',
          }}
        >
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor:
                mode === 'dark'
                  ? alpha(theme.palette.background.default, 0.85)
                  : alpha('#ffffff', 0.9),                      
            }}
          >
            {tab === 0 && <ByBrand />}
            {tab === 1 && <ByParams />}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default WheelSelectorTabs;
