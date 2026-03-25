import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
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
  );
};

export default NotFoundPage;
