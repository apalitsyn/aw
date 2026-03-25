import { useEffect, useState } from 'react';
import { Fab, Box } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import TelegramIcon from '@mui/icons-material/Telegram';

const FloatingActions = () => {
  const [visible, setVisible] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(true);
      if (timer) clearTimeout(timer);

      const newTimer = setTimeout(() => setVisible(false), 4000);
      setTimer(newTimer);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

  if (!visible) return null;

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          zIndex: 1300,
        }}
      >
        <Fab
          color="primary"
          size="medium"
          href="tel:+74958000095"
          aria-label="Позвонить"
        >
          <PhoneIcon />
        </Fab>
      </Box>

      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1300,
        }}
      >
        <Fab
          color="info"
          size="medium"
          href="https://t.me/artwheels"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram"
        >
          <TelegramIcon />
        </Fab>
      </Box>
    </>
  );
};

export default FloatingActions;
