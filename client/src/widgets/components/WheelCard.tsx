import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  CardActionArea,
  useTheme,
  Divider,
} from '@mui/material';
import { cardSx } from './styles/cardStyle';

type AnyProduct = any;

const ProductCard = ({
  data,
  onClick,
}: {
  data: AnyProduct;
  onClick?: () => void;
}) => {
  const theme = useTheme();
  const productType: 'WHEEL' | 'TYRE' | 'WHEEL_SET' =
    data?.productType ||
    (data?.kind && data?.items ? 'WHEEL_SET' : data?.brand ? 'TYRE' : 'WHEEL');

  const isSet = productType === 'WHEEL_SET';
  const isUniformSet = isSet && data?.kind === 'UNIFORM';

  const buildUrl = (path?: string) => {
    if (!path) return undefined;

    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    const prod = !!process.env.REACT_APP_PROD;
    const API_URL = prod ? '' : 'http://localhost:8833';

    if (path.startsWith('/')) return `${API_URL}${path}`;
    return `${API_URL}/${path}`;
  };

  const pickWheelFromItem = (it: any) => {
    if (!it) return null;
    if (it.wheel && typeof it.wheel === 'object') return it.wheel;
    if (it.wheelId && typeof it.wheelId === 'object') return it.wheelId;
    return null;
  };

  const isEmptyObj = (v: any) =>
    !v || typeof v !== 'object' || Array.isArray(v) ? true : Object.keys(v).length === 0;

  const uniformWheelFromItems =
    Array.isArray(data?.items)
      ? pickWheelFromItem(data.items.find((x: any) => x.role == null) || data.items[0])
      : null;

  const frontFromItems = Array.isArray(data?.items)
    ? pickWheelFromItem(data.items.find((x: any) => x.role === 'FRONT'))
    : null;

  const rearFromItems = Array.isArray(data?.items)
    ? pickWheelFromItem(data.items.find((x: any) => x.role === 'REAR'))
    : null;

  const front =
    (!isEmptyObj(data?.front) ? data.front : null) ||
    frontFromItems ||
    (data?.kind === 'UNIFORM' ? uniformWheelFromItems : null) ||
    null;

  const rear =
    (!isEmptyObj(data?.rear) ? data.rear : null) ||
    rearFromItems ||
    (data?.kind === 'UNIFORM' ? uniformWheelFromItems : null) ||
    null;

  const uniformResolved = data?.kind === 'UNIFORM' ? (rear || front || uniformWheelFromItems) : null;

  const rawPath =
    data?.preview ||
    (isSet
      ? front?.preview ||
      (Array.isArray(front?.media) && front.media.length > 0 ? front.media[0] : undefined) ||
      rear?.preview ||
      (Array.isArray(rear?.media) && rear.media.length > 0 ? rear.media[0] : undefined) ||
      (Array.isArray(data?.media) && data.media.length > 0 ? data.media[0] : undefined)
      : Array.isArray(data?.media) && data.media.length > 0
        ? data.media[0]
        : undefined);

  const previewUrl = buildUrl(rawPath) || '/images/no_img_wheel.png';

  const priceText =
    typeof data?.price === 'number' && !Number.isNaN(data.price) && data.price > 0
      ? `${data.price.toLocaleString()} ₽`
      : 'Уточняйте';

  const baseTitle =
    data?.name ||
    (productType === 'WHEEL_SET'
      ? 'Комплект дисков'
      : productType === 'TYRE'
        ? 'Шина'
        : 'Диск');

  const normalizeName = (s: any) => (typeof s === 'string' ? s.trim() : '');

  const frontName = normalizeName(front?.name);
  const rearName = normalizeName(rear?.name);

  const displayTitle =
    isSet && data?.kind === 'STAGGERED'
      ? [rearName, frontName].filter(Boolean).join(' / ') || baseTitle
      : isSet && data?.kind === 'UNIFORM'
        ? rearName || frontName || normalizeName(uniformResolved?.name) || baseTitle
        : baseTitle;

  const diameter = data?.diameter || front?.diameter || rear?.diameter || '—';
  const pcd = data?.pcd || front?.pcd || rear?.pcd || '—';
  const dia = data?.dia || front?.dia || rear?.dia || '—';

  const SpecLine = ({
    label,
    value,
    highlight,
  }: {
    label: string;
    value: any;
    highlight?: boolean;
  }) => {
    const v = value === '' || value == null ? '—' : value;
    const color = highlight ? '#eab62f' : 'text.secondary';

    return (
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          lineHeight: 1.3,
          color,
          fontWeight: highlight ? 600 : 400,
        }}
      >
        {label}: {v}
      </Typography>
    );
  };


  const WheelSideCard = ({ side, w }: { side: 'Перед' | 'Зад'; w: any }) => (
    <Box
      sx={{
        border: `1px solid ${theme.palette.mode === 'dark'
          ? 'rgba(255,255,255,0.12)'
          : 'rgba(0,0,0,0.12)'
          }`,
        borderRadius: 2,
        p: 1,
      }}
    >
      <Typography variant="caption" fontWeight={800} sx={{ display: 'block', mb: 0.5 }}>
        {side}
      </Typography>

      <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.2 }}>
        {w?.name || '—'}
      </Typography>

      <Box sx={{ mt: 0.75 }}>
        <SpecLine label="Ширина" value={w?.width ? `W${w.width}` : '—'} />
        <SpecLine label="ET" value={w?.et ? `ET${w.et}` : '—'} />
        <SpecLine label="PCD" value={w?.pcd || '—'} />
        <SpecLine label="DIA" value={w?.dia ? `${w.dia} мм` : '—'} />
        <SpecLine label="Тип" value={w?.type && w.type !== '-' ? w.type : 'Литой'} />
        <SpecLine
          label="Артикул"
          value={w?.article ? w.article : '-'}
          highlight={!!w?.article}
        />

      </Box>
    </Box>
  );

  const wheelLike = isUniformSet ? uniformResolved : data;

  const wheelLikeWidth = wheelLike?.width || '—';
  const wheelLikeEt = wheelLike?.et || '—';
  const wheelLikeType =
    wheelLike?.type && wheelLike.type !== '-' ? wheelLike.type : 'Литой';
  const wheelLikePcd = wheelLike?.pcd || pcd;
  const wheelLikeDia = wheelLike?.dia || dia;

  return (
    <Card sx={cardSx(theme)}>
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
            alt={displayTitle}
            sx={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
            }}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1, py: 1.5 }}>
          <Box>
            {productType === 'TYRE' ? (
              <>
                <Typography variant="body2" fontWeight={600}>
                  Бренд: {data?.brand || '—'}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  Модель: {data?.model || '—'}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  Размер: {data?.width || '—'}/{data?.height || '—'}/{data?.diameter || '—'}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  Сезон: {data?.season || '—'}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="body2" fontWeight={600}>
                  Диаметр: {diameter}
                </Typography>

                {/* STAGGERED: две колонки. UNIFORM: как обычный диск */}
                {isSet && !isUniformSet ? (
                  <>
                    <Divider sx={{ my: 1 }} />
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 1,
                      }}
                    >
                      <WheelSideCard side="Перед" w={front} />
                      <WheelSideCard side="Зад" w={rear} />
                    </Box>
                  </>
                ) : (
                  <>
                    <Typography variant="body2" fontWeight={600}>
                      Ширина: {wheelLikeWidth}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      ET: {wheelLikeEt}
                    </Typography>

                    <Typography variant="body2" fontWeight={600}>
                      Тип: {wheelLikeType}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      PCD: {wheelLikePcd}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      DIA: {wheelLikeDia !== '—' ? `${wheelLikeDia} мм` : '—'}
                    </Typography>

                    {!!wheelLike?.article && (
                      <Typography variant="body2" fontWeight={600} color="#eab62f">
                        Артикул: {wheelLike.article}
                      </Typography>
                    )}
                  </>
                )}
              </>
            )}
          </Box>

          <Box mt={1}>
            <Typography variant="body2" color="text.secondary">
              {displayTitle}
            </Typography>
          </Box>

          <Box mt={1.5}>
            <Typography variant="h6" fontWeight={700} color="#eab62f">
              Цена: {priceText}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProductCard;
