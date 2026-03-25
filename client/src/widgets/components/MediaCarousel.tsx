import Slider from 'react-slick';
import { Box, IconButton, useTheme } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useRef, useEffect, useState } from 'react';

const prod = process.env.REACT_APP_PROD ? true : false;
const baseUrl = prod ? '' : 'http://localhost:8833';

const MediaCarousel = ({ media }: { media: string[] }) => {
  const theme = useTheme();
  const sliderRef = useRef<Slider | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Цвета под тему
  const bgColor = theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5';
  const arrowBg = theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)';
  const arrowHoverBg = theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)';
  const arrowColor = theme.palette.mode === 'dark' ? '#fff' : '#000';

  // Кастомные стрелки
  const NextArrow = ({ onClick }: { onClick?: () => void }) => (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        top: '50%',
        right: 10,
        transform: 'translateY(-50%)',
        zIndex: 2,
        backgroundColor: arrowBg,
        '&:hover': { backgroundColor: arrowHoverBg },
      }}
    >
      <ArrowForwardIosIcon sx={{ color: arrowColor }} />
    </IconButton>
  );

  const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        top: '50%',
        left: 10,
        transform: 'translateY(-50%)',
        zIndex: 2,
        backgroundColor: arrowBg,
        '&:hover': { backgroundColor: arrowHoverBg },
      }}
    >
      <ArrowBackIosNewIcon sx={{ color: arrowColor }} />
    </IconButton>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    afterChange: (index: number) => setCurrentIndex(index),
  };

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (video) {
        if (i === currentIndex) {
          video.muted = true;
          video.play().catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [currentIndex]);

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', position: 'relative' }}>
      <Slider ref={sliderRef} {...settings}>
        {media.map((file, index) => {
          const isVideo = file.endsWith('.mp4') || file.endsWith('.webm');
          const isExternal = file.startsWith('http://') || file.startsWith('https://');
          const src = isExternal ? file : `${baseUrl}/${file}`;

          return (
            <Box
              key={index}
              sx={{
                width: '100%',
                height: 300,
                backgroundColor: bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                position: 'relative',
                borderRadius: 2,
              }}
            >
              {isVideo ? (
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  src={src}
                  style={{
                    height: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    margin: '0 auto',
                  }}
                  muted
                  playsInline
                  controls
                />
              ) : (
                <img
                  src={src}
                  alt={`media-${index}`}
                  style={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    margin: '0 auto',
                  }}
                />
              )}
            </Box>
          );
        })}
      </Slider>
    </Box>
  );
};

export default MediaCarousel;
