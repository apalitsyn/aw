import { Box, Container, Typography, Button } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { Seo } from '../../app/seo/Seo';

const NotFoundPage = () => {
  const location = useLocation();
  return (
    <>
      <Seo
        title="404 — Страница не найдена | ArtWheels"
        description="К сожалению, запрошенная страница не найдена."
        pathname={location.pathname}
        search={location.search}
        robots="noindex,follow"
      />
      <Container sx={{ mt: 6, py: 7 }}>
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            404
          </Typography>
          <Typography variant="h5" gutterBottom>
            Страница не найдена
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            К сожалению, страница, которую вы ищете, не существует или была перемещена.
          </Typography>
          <Button variant="contained" component={Link} to="/">
            На главную
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default NotFoundPage;
