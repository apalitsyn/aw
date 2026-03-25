import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, useTheme, useMediaQuery } from '@mui/material';
import TelegramIcon from '@mui/icons-material/Telegram';
import { useSwipeable } from 'react-swipeable';

interface Slide {
  id: string;
  imageMobile: string;
  imageDesktop: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  url: string;
  isTelegram?: boolean;
}

const slides: Slide[] = [
  {
    id: 'slide-1',
    imageMobile: '/banners/banner-tg-mobile.png',
    imageDesktop: '/banners/banner-tg-desktop.png',
    buttonText: 'ArtWheelsRussia',
    url: 'https://t.me/ArtWheelsRussia',
    isTelegram: true,
  },
  {
    id: 'slide-2',
    imageMobile: '/banners/banner-wheel-mobile.png',
    imageDesktop: '/banners/banner-wheel-desktop.png',
    buttonText: 'Смотрите каталог!',
    url: '/catalog/wheels',
  },
  {
    id: 'slide-3',
    imageMobile: '/banners/banner-tyre-mobile.jpg',
    imageDesktop: '/banners/banner-tyre-desktop.png',
    buttonText: 'Каталог шин',
    url: '/catalog/tyres',
  },
  {
    id: 'slide-4',
    imageMobile: '/banners/banner-portfolio-mobile.jpg',
    imageDesktop: '/banners/banner-portfolio-desktop.png',
    buttonText: 'Наша галерея работ',
    url: '/portfolio',
  },
];

const AUTO_PLAY_INTERVAL = 7000;

const HeroCarousel = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isXLUp = useMediaQuery(theme.breakpoints.up('xl'));

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIndex(prev => (prev + 1) % slides.length);
    }, AUTO_PLAY_INTERVAL);

    return () => window.clearInterval(id);
  }, []);

  const activeSlide = slides[activeIndex];

  const handleClick = () => {
    const url = activeSlide.url.trim();
    const isExternal =
      /^https?:\/\//i.test(url) ||
      url.startsWith('tg://') ||
      url.startsWith('vk://') ||
      url.startsWith('mailto:') ||
      url.startsWith('tel:');

    if (isExternal) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    navigate(url);
  };

  const getImageSrc = (slide: Slide) =>
    isMobile ? slide.imageMobile : slide.imageDesktop;

  const fullBleed = useMemo(() => !isXLUp, [isXLUp]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () =>
      setActiveIndex(prev => (prev + 1) % slides.length),
    onSwipedRight: () =>
      setActiveIndex(prev =>
        prev === 0 ? slides.length - 1 : prev - 1
      ),
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  return (
    <Box
      {...swipeHandlers}
      sx={{
        ...(fullBleed && {
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          width: '100vw',
        }),
        position: 'relative',
        overflow: 'hidden',
        mb: 3,
        mt: '-60px',
        bgcolor: 'common.black',
        touchAction: 'pan-y',
      }}
    >
      {slides.map((slide, index) => (
        <Box
          key={slide.id}
          sx={{
            position: index === activeIndex ? 'relative' : 'absolute',
            inset: 0,
            opacity: index === activeIndex ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            pointerEvents: index === activeIndex ? 'auto' : 'none',
          }}
        >
          <Box
            component="img"
            src={getImageSrc(slide)}
            alt={`banner-${index}`}
            sx={{
              width: '100%',
              height: 'auto',
              display: 'block',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
            draggable={false}
          />

          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0) 100%)',
            }}
          />

          <Button
            variant="contained"
            onClick={handleClick}
            startIcon={
              slide.isTelegram ? (
                <TelegramIcon sx={{ fontSize: { xs: 20, sm: 22, md: 24 } }} />
              ) : undefined
            }
            sx={{
              position: 'absolute',
              right: { xs: 16, sm: 24, md: 40 },
              bottom: { xs: 16, sm: 24, md: 40 },
              backgroundColor: '#eab62f',
              color: '#000',
              borderRadius: 999,
              textTransform: 'none',
              px: { xs: 2.5, sm: 3.5, md: 4.5 },
              py: { xs: 1.2, sm: 1.6, md: 2 },
              fontSize: { xs: '0.9rem', sm: '1.05rem', md: '1.15rem' },
              fontWeight: 600,
              boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
              '&:hover': {
                backgroundColor: '#d9a727',
                boxShadow: '0 14px 30px rgba(0,0,0,0.35)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            {slide.buttonText}
          </Button>
        </Box>
      ))}

      <Box
        sx={{
          position: 'absolute',
          bottom: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
          zIndex: 2,
        }}
      >
        {slides.map((_, index) => (
          <Box
            key={index}
            onClick={() => setActiveIndex(index)}
            sx={{
              width: index === activeIndex ? 18 : 10,
              height: 10,
              borderRadius: 999,
              cursor: 'pointer',
              bgcolor:
                index === activeIndex
                  ? 'primary.main'
                  : 'rgba(255,255,255,0.6)',
              transition: 'all 0.25s ease',
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default HeroCarousel;
