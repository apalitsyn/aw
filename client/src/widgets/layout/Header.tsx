import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemText,
  useTheme,
  useMediaQuery,
  ListItemButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useThemeMode } from '../../app/theme';
import { CartButton } from '../components/CartButton';

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { toggle, mode } = useThemeMode();
  const location = useLocation();
  const isCatalogActive = location.pathname.startsWith('/catalog');
  const isCartActive = location.pathname === '/cart';

  const buttonStyle = {
    color: 'text.primary',
    textTransform: 'none',
    fontWeight: 500,
    '&.active': {
      borderBottom: '2px solid #eab62f',
      borderRadius: 0,
    },
  };

  const logoSrc = mode === 'light' ? '/logo_white.svg' : '/logo_black.svg';

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={1}
      sx={{ borderBottom: '4px solid #eab62f' }}
    >
      <Toolbar
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mr: { xs: 2.5, md: 3.5 },
            }}
          >
            <NavLink
              to="/"
              style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            >
              <Box
                component="img"
                src={logoSrc}
                alt="Логотип"
                sx={{
                  height: { xs: 70, md: 80 },
                  transform: 'scale(1.3)',
                  transformOrigin: 'left center',
                  pointerEvents: 'none',
                  display: 'block',
                }}
              />
            </NavLink>
          </Box>

          <IconButton
            onClick={toggle}
            color="inherit"
            sx={{
              ml: { xs: 1.5, md: 2.5 },
            }}
          >
            {mode === 'dark' ? <LightModeIcon /> : <NightlightRoundIcon />}
          </IconButton>
        </Box>

        {isMobile ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton edge="end" onClick={() => setDrawerOpen(true)} color="inherit">
                <MenuIcon />
              </IconButton>
              <CartButton />
            </Box>

            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={() => setDrawerOpen(false)}
              >
                <List>
                  <ListItemButton component={NavLink} to="/">
                    <ListItemText primary="Главная" />
                  </ListItemButton>
                  <ListItemButton component={NavLink} to="/catalog/wheels">
                    <ListItemText primary="Диски" />
                  </ListItemButton>
                  <ListItemButton component={NavLink} to="/catalog/tyres">
                    <ListItemText primary="Шины" />
                  </ListItemButton>
                  <ListItemButton component={NavLink} to="/contacts">
                    <ListItemText primary="Контакты" />
                  </ListItemButton>
                  <ListItemButton component={NavLink} to="/about">
                    <ListItemText primary="О Нас" />
                  </ListItemButton>
                  <ListItemButton component={NavLink} to="/portfolio">
                    <ListItemText primary="Портфолио" />
                  </ListItemButton>
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button component={NavLink} to="/" sx={buttonStyle}>
              Главная
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                  ...buttonStyle,
                  ...(isCatalogActive && {
                    borderBottom: '2px solid #eab62f',
                    borderRadius: 0,
                  }),
                }}
              >
                Каталог
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                MenuListProps={{ dense: true }}
              >
                <MenuItem
                  component={NavLink}
                  to="/catalog/wheels"
                  onClick={() => setAnchorEl(null)}
                >
                  Диски
                </MenuItem>
                <MenuItem
                  component={NavLink}
                  to="/catalog/tyres"
                  onClick={() => setAnchorEl(null)}
                >
                  Шины
                </MenuItem>
              </Menu>
            </Box>

            <Button component={NavLink} to="/contacts" sx={buttonStyle}>
              Контакты
            </Button>
            <Button component={NavLink} to="/about" sx={buttonStyle}>
              О Нас
            </Button>
            <Button component={NavLink} to="/portfolio" sx={buttonStyle}>
              Портфолио
            </Button>

            <Button
              component={NavLink}
              to="/cart"
              sx={{
                ...buttonStyle,
                ...(isCartActive && {
                  borderBottom: '2px solid #eab62f',
                  borderRadius: 0,
                }),
              }}
            >
              <CartButton />
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
