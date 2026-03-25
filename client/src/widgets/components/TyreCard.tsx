import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  CardActionArea,
  useTheme,
} from '@mui/material';
import { cardSx } from './styles/cardStyle';

const TyreCard = ({
  data,
  onClick,
}: {
  data: any;
  onClick?: () => void;
}) => {
  const theme = useTheme();

  const buildUrl = (path?: string) => {
    if (!path) return undefined;

    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    const prod = !!process.env.REACT_APP_PROD;
    const API_URL = prod ? '' : 'http://localhost:8833';

    if (path.startsWith('/')) {
      return `${API_URL}${path}`;
    }

    return `${API_URL}/${path}`;
  };

  const rawPath =
    data?.preview ||
    (Array.isArray(data?.media) && data.media.length > 0
      ? data.media[0]
      : undefined);

  const previewUrl = buildUrl(rawPath) || '/images/no_img_tyre.png';

  return (
    <Card
      sx={cardSx(theme)}
    >
      <CardActionArea onClick={onClick} sx={{ height: '100%' }}>
        <Box
          sx={{
            backgroundColor:
              theme.palette.mode === 'dark'
                ? theme.palette.background.default
                : '#f5f5f5',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 260,
            padding: 1,
          }}
        >
          <CardMedia
            component="img"
            image={previewUrl}
            alt={data.name}
            sx={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
            }}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1, py: 1.5 }}>
          <Typography variant="body1" fontWeight={600}>
            {data.name}
          </Typography>

          <Box mt={0.5}>
            {data.width && data.height && data.diameter && (
              <Typography variant="body2" color="text.secondary">
                Размер: {data.width}/{data.height}R{data.diameter}
              </Typography>
            )}
            {data.type && (
              <Typography variant="body2" color="text.secondary">
                Тип: {data.type}
              </Typography>
            )}
          </Box>

          <Box mt={1.5}>
            <Typography variant="h6" fontWeight={700} color="#eab62f">
              Цена: {data.price
                ? `${data.price.toLocaleString()} ₽`
                : 'Уточняйте'}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default TyreCard;
