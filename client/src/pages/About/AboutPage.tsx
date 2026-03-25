import { Box, Container, Typography } from '@mui/material';
import HomeReviewsAndMap from '../../widgets/components/HomeReviewsAndMap';

const AboutPage = () => {
  return (
    <Container sx={{ mt: 4, py: 7 }}>
      <Box sx={{ maxWidth: 800, mx: 'auto', textAlign: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          О компании ArtWheels
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          ArtWheels — это интернет-магазин, специализирующийся на продаже высококачественных автомобильных дисков и шин. Мы помогаем подобрать идеальные колёса под ваш автомобиль, обеспечивая безопасность, комфорт и стиль.
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          В нашем ассортименте — широкий выбор дисков (литых, кованных) и шин от ведущих брендов. Мы работаем напрямую с поставщиками и предлагаем только сертифицированную продукцию.
        </Typography>

        <Typography variant="body1">
          Наша цель — сделать процесс выбора и покупки максимально удобным, прозрачным и быстрым. Благодарим вас за доверие к ArtWheels!
        </Typography>
      </Box>
      {/* <HomeReviewsAndMap /> */}
    </Container>
  );
};

export default AboutPage;
