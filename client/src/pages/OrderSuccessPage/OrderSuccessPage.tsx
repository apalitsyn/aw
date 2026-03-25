import { Box, Typography, Button } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { Seo } from '../../app/seo/Seo';

const OrderSuccessPage = () => {
  const location = useLocation();
  return (
    <>
      <Seo
        title="Спасибо за заказ | ArtWheels"
        description="Спасибо за ваш заказ! Мы свяжемся с вами в ближайшее время для подтверждения."
        pathname={location.pathname}
        search={location.search}
        robots="noindex,follow"
      />
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, textAlign: 'center', py: 7 }}>
        <Typography variant="h4" gutterBottom>
          Спасибо за заказ!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Мы свяжемся с вами в ближайшее время для подтверждения.
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/"
          sx={{ mt: 3, backgroundColor: '#eab62f', color: '#000' }}
        >
          На главную
        </Button>
      </Box>
    </>
  );
};

export default OrderSuccessPage;