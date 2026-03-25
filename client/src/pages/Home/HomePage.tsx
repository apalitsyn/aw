import WheelSelectorTabs from '../../features/wheelSelector/ui/WheelSelectorTabs';
import TyreByParams from '../../features/tyerSelector/ui/TyreByParams'; 
import HeroCarousel from '../../widgets/components/HeroCarousel';
import BestsellerWheelsCarousel from '../..//widgets/components/BestsellerWheelsCarousel';
import BestsellerTyresCarousel from '../../widgets/components/BestsellerTyresCarousel';
import { Box } from '@mui/material';
import PortfolioCarousel from '../../widgets/components/PortfolioCarousel';
import HomeReviewsAndMap from "../../widgets/components/HomeReviewsAndMap";

const HomePage = () => (
    <Box sx={{ pt: { xs: '70px', md: '80px' } }}>
      <HeroCarousel />
      <WheelSelectorTabs />
      <TyreByParams />
      <BestsellerWheelsCarousel />
      <BestsellerTyresCarousel />
      <PortfolioCarousel />
      <HomeReviewsAndMap />
    </Box>
  );
  export default HomePage;
  