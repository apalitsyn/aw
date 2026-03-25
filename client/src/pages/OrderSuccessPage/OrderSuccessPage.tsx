import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const OrderSuccessPage = () => {
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, textAlign: 'center', py: 7 }}>
      <Typography variant="h4" gutterBottom>
        Спасибо за заказ!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Мы свяжемся с вами в ближайшее время для подтверждения.
      </Typography>
      <Button variant="contained" component={Link} to="/" sx={{ mt: 3, backgroundColor: '#eab62f', color: '#000' }}>
        На главную
      </Button>
    </Box>
  );
};

export default OrderSuccessPage;