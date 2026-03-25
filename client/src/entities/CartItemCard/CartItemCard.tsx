import { Card, CardMedia, CardContent, Typography, Box, IconButton, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const prod = process.env.REACT_APP_PROD ? true : false;
const baseUrl = prod ? '' : 'http://localhost:8833';

const buildUrl = (path?: string) => {
  if (!path) return `${baseUrl}/uploads/no_img_wheel.png`;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/')) return `${baseUrl}${path}`;
  return `${baseUrl}/${path}`;
};

const isEmptyObj = (v: any) =>
  !v || typeof v !== 'object' || Array.isArray(v) ? true : Object.keys(v).length === 0;

const pickWheelFromItem = (it: any) => {
  if (!it) return null;
  if (it.wheel && typeof it.wheel === 'object') return it.wheel;
  if (it.wheelId && typeof it.wheelId === 'object') return it.wheelId;
  return null;
};

const resolveWheelSet = (data: any) => {
  const isSet = data?.productType === 'WHEEL_SET' || (data?.kind && data?.items);
  const kind: 'UNIFORM' | 'STAGGERED' | undefined = data?.kind;

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
    (kind === 'UNIFORM' ? uniformWheelFromItems : null) ||
    null;

  const rear =
    (!isEmptyObj(data?.rear) ? data.rear : null) ||
    rearFromItems ||
    (kind === 'UNIFORM' ? uniformWheelFromItems : null) ||
    null;

  const uniformResolved = kind === 'UNIFORM' ? (rear || front || uniformWheelFromItems) : null;

  return { isSet, kind, front, rear, uniformResolved };
};

const SpecLine = ({ label, value }: { label: string; value: any }) => (
  <Typography variant="body2" color="text.secondary">
    {label}: {value == null || value === '' ? '—' : value}
  </Typography>
);

const WheelSideBlock = ({
  title,
  w,
  fallback,
}: {
  title: string;
  w: any;
  fallback: { diameter?: any; pcd?: any; dia?: any; type?: any };
}) => {
  const diameterVal = w?.diameter ?? fallback.diameter;
  const pcdVal = w?.pcd ?? fallback.pcd;
  const diaVal = w?.dia ?? fallback.dia;

  return (
    <Box
      sx={{
        border: '1px solid rgba(0,0,0,0.12)',
        borderRadius: 2,
        p: 1,
      }}
    >
      <Typography variant="caption" fontWeight={800} sx={{ display: 'block', mb: 0.5 }}>
        {title}
      </Typography>

      <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.2 }}>
        {w?.name || '—'}
      </Typography>

      <Box sx={{ mt: 0.75 }}>
        <SpecLine label="Диаметр" value={diameterVal ?? '—'} />
        <SpecLine label="Ширина" value={w?.width ? `W${w.width}` : '—'} />
        <SpecLine label="ET" value={w?.et ? `ET${w.et}` : '—'} />
        <SpecLine label="PCD" value={pcdVal ?? '—'} />
        <SpecLine label="DIA" value={diaVal != null && diaVal !== '' ? `${diaVal} мм` : '—'} />
        <SpecLine
          label="Тип"
          value={(w?.type ?? fallback.type) && (w?.type ?? fallback.type) !== '-' ? (w?.type ?? fallback.type) : 'Литой'}
        />
        {w?.article ? <SpecLine label="Артикул" value={w.article} /> : null}
      </Box>
    </Box>
  );
};

export const CartItemCard = ({ item, onRemove }: { item: any; onRemove: () => void }) => {
  const unitPrice = item.price || 0;

  const isTyre = item.type?.toLowerCase?.().includes('легковые') || item.season;

  const { isSet, kind, front, rear, uniformResolved } = resolveWheelSet(item);
  const isWheelSet = !isTyre && isSet;

  const rawPreview =
    item?.preview ||
    front?.preview ||
    (Array.isArray(front?.media) && front.media[0]) ||
    rear?.preview ||
    (Array.isArray(rear?.media) && rear.media[0]) ||
    (Array.isArray(item?.media) && item.media[0]) ||
    'uploads/no_img_wheel.png';

  const imgUrl = buildUrl(rawPreview);

  // display title (как в каталоге)
  const normalizeName = (s: any) => (typeof s === 'string' ? s.trim() : '');
  const frontName = normalizeName(front?.name);
  const rearName = normalizeName(rear?.name);

  const displayTitle =
    isWheelSet && kind === 'STAGGERED'
      ? [rearName, frontName].filter(Boolean).join(' / ') || item.name
      : isWheelSet && kind === 'UNIFORM'
        ? normalizeName(uniformResolved?.name) || item.name
        : item.name;

  const totalForFour = unitPrice * 4;

  const fallbackSpecs = {
    diameter: item?.diameter,
    pcd: item?.pcd,
    dia: item?.dia,
    type: item?.type,
  };

  return (
    <>
      <Card sx={{ display: 'flex', mb: 2, alignItems: 'stretch' }}>
        <CardMedia
          component="img"
          sx={{ width: 100, objectFit: 'contain', background: '#f5f5f5' }}
          image={imgUrl}
          alt={displayTitle}
        />

        <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
          <CardContent sx={{ flex: '1 1 auto', py: 1.5 }}>
            <Typography variant="h6" gutterBottom>
              {displayTitle}
            </Typography>

            {/* TYRE */}
            {isTyre ? (
              <>
                <Typography variant="body2" color="text.secondary">
                  Ширина: {item.width} | Профиль: {item.height}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Диаметр: {item.diameter} | Сезон: {item.season || item.type}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Индекс скорости: {item.speedIndex || '-'} | Индекс нагрузки: {item.loadIndex || '-'}
                </Typography>
              </>
            ) : isWheelSet ? (
              <>
                {/* WHEEL_SET */}
                {kind === 'STAGGERED' ? (
                  <Box sx={{ mt: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                    <WheelSideBlock title="Перед" w={front} fallback={fallbackSpecs} />
                    <WheelSideBlock title="Зад" w={rear} fallback={fallbackSpecs} />
                  </Box>
                ) : (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Диаметр: {uniformResolved?.diameter || item.diameter || '—'} | ET:{' '}
                      {uniformResolved?.et || item.et || '—'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      PCD: {uniformResolved?.pcd || item.pcd || '—'} | DIA:{' '}
                      {uniformResolved?.dia || item.dia || '—'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Тип: {uniformResolved?.type || item.type || '—'}
                    </Typography>
                    {uniformResolved?.article ? (
                      <Typography variant="body2" color="text.secondary">
                        Артикул: {uniformResolved.article}
                      </Typography>
                    ) : null}
                  </>
                )}
              </>
            ) : (
              <>
                {/* WHEEL (обычный диск) */}
                <Typography variant="body2" color="text.secondary">
                  Диаметр: {item.diameter} | ET: {item.et}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  PCD: {item.pcd} | DIA: {item.dia}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Тип: {item.type}
                </Typography>
                {item.article ? (
                  <Typography variant="body2" color="text.secondary">
                    Артикул: {item.article}
                  </Typography>
                ) : null}
              </>
            )}

            {/* Цены */}
            <Box mt={1}>
              {isWheelSet ? (
                <>
                  <Typography variant="subtitle2">Цена за комплект (4 шт.):</Typography>
                  <Typography variant="body1" color="#eab62f" fontWeight={600}>
                    {totalForFour ? `${totalForFour} ₽` : 'Уточняйте'}
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="subtitle2">Цена за 1 шт.:</Typography>
                  <Typography variant="body1" color="#eab62f" fontWeight={600}>
                    {unitPrice ? `${unitPrice} ₽` : 'Уточняйте'}
                  </Typography>

                  <Typography variant="subtitle2" mt={1}>
                    Цена за комплект (4 шт.):
                  </Typography>
                  <Typography variant="body1" color="#eab62f" fontWeight={600}>
                    {totalForFour ? `${totalForFour} ₽` : 'Уточняйте'}
                  </Typography>
                </>
              )}
            </Box>
          </CardContent>

          {/* удалить */}
          <Box sx={{ display: 'flex', alignItems: 'start', pr: 1, pt: 1 }}>
            <IconButton onClick={onRemove} aria-label="Удалить">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </Card>
      <Divider />
    </>
  );
};
