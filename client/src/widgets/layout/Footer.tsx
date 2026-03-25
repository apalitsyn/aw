import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 1.5,
        px: 2,
        backgroundColor: theme =>
          theme.palette.mode === 'light' ? '#f5f5f5' : '#1e1e1e',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50px',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} ArtWheels. Все права защищены.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
