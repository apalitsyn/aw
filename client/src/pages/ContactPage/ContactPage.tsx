import {
  Box,
  Typography,
  Paper,
  Link,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TelegramIcon from '@mui/icons-material/Telegram';

const ContactPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ p: 3, py: 7 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom mb={4}>
        Контактная информация
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 4,
          flexWrap: 'wrap',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 3,
            flex: '1 1 300px',
            minWidth: 280,
            width: isMobile ? '100%' : 'auto',
          }}
        >
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOnIcon color="action" />
              <Typography variant="body1" color="text.primary">
                Каширское шоссе, 65А, Москва
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneIcon color="action" />
              <Link href="tel:+74958000095" underline="hover" color="text.primary">
                +7 (495) 800-00-95
              </Link>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon color="action" />
              <Link href="mailto:info@artwheels.ru" underline="hover" color="text.primary">
                artwheelss@gmail.com
              </Link>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon color="action" />
              <Typography variant="body1" color="text.primary">
                Будние: 10:00 – 19:00, Выходные: 10:00 – 18:00
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TelegramIcon color="action" />
              <Link
                href="https://t.me/artwheels"
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                color="text.primary"
              >
                @artwheels
              </Link>
            </Box>
          </Stack>
        </Paper>

        <Box
          sx={{
            flex: '2 1 600px',
            minWidth: 280,
            width: isMobile ? '100%' : 'auto',
            height: 400,
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <iframe
            src="https://yandex.ru/map-widget/v1/?z=12&ol=biz&oid=184882154278"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactPage;
