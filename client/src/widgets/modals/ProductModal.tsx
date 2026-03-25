import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    Box,
    Button,
    Snackbar,
    Alert,
    Chip,
    Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';
import MediaCarousel from '../components/MediaCarousel';
import { useCart } from '../../shared/hooks/useCart';

type ProductModalType = 'wheel' | 'wheel_set' | 'tyre';

const ProductModal = ({
    id,
    type,
    onClose,
}: {
    id: string;
    type: ProductModalType;
    onClose: () => void;
}) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const { addToCart } = useCart();
    const theme = useTheme();
    const endpoint = useMemo(() => {
        if (type === 'wheel') return `/api/client/wheels/${id}`;
        if (type === 'wheel_set') return `/api/client/wheel-sets/${id}`;
        return `/api/client/tyres/${id}`;
    }, [id, type]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const res = await api.get(endpoint);
                const next = res.data;

                if (!Array.isArray(next.media)) next.media = [];
                if (next.media.length === 0) next.media.push('uploads/no_img_wheel.png');

                setData(next);
            } catch (err) {
                console.error(`Ошибка при получении ${type}:`, err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint, type]);

    const handleBuy = () => {
        if (!data) return;

        const productType =
            type === 'wheel_set' ? 'WHEEL_SET' : type === 'tyre' ? 'TYRE' : 'WHEEL';

        const normalizedPrice =
            productType === 'WHEEL_SET'
                ? (typeof data?.price === 'number' && !Number.isNaN(data.price) && data.price > 0
                    ? Math.ceil(data.price / 4)
                    : 0)
                : (typeof data?.price === 'number' && !Number.isNaN(data.price)
                    ? data.price
                    : 0);

        addToCart({ ...data, productType, price: normalizedPrice });
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    if (!data) return null;

    const isWheelSet = type === 'wheel_set';
    const isUniformSet = isWheelSet && data?.kind === 'UNIFORM';

    const title =
        type === 'wheel_set'
            ? data?.name || 'Комплект дисков'
            : data?.name || 'Товар';

    const setKindLabel =
        data?.kind === 'STAGGERED'
            ? 'Разноширокий'
            : data?.kind === 'UNIFORM'
                ? 'Одноширокий'
                : '';

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

    const wheelLike = isUniformSet ? (rear || front || uniformWheelFromItems) : data;

    const pcd = data?.pcd || front?.pcd || rear?.pcd || '-';
    const diameter = data?.diameter || front?.diameter || rear?.diameter || '-';
    const dia = data?.dia || front?.dia || rear?.dia || '-';
    const wType = data?.type || front?.type || rear?.type || 'Литой';

    const price =
        data?.price
            ? data?.kind
                ? Math.ceil(data.price / 4)
                : data.price
            : 'Уточняйте';

    const SpecLine = ({ label, value }: { label: string; value: any }) => (
        <Typography variant="body2" sx={{ lineHeight: 1.3 }}>
            <Box component="span" sx={{ fontWeight: 700 }}>
                {label}:{' '}
            </Box>
            {value ?? '-'}
        </Typography>
    );

    const WheelInfoBlock = ({ caption, w }: { caption: string; w: any }) => {
        const localPcd = w?.pcd || pcd || '-';
        const localDia = w?.dia || dia || '-';
        const localDiameter = w?.diameter || diameter || '-';
        const localType =
            w?.type && w.type !== '-' ? w.type : wType && wType !== '-' ? wType : 'Литой';

        return (
            <Box
                sx={{
                    border: `1px solid ${theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.12)'
                            : 'rgba(0,0,0,0.12)'
                        }`,
                    borderRadius: 2,
                    p: 1.25,
                }}
            >
                <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 0.5 }}>
                    {caption}
                </Typography>

                <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>
                    {w?.name || '-'}
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.75 }}>
                    <SpecLine label="PCD" value={localPcd} />
                    <SpecLine label="Диаметр" value={localDiameter} />
                    <SpecLine label="Ширина" value={w?.width || '-'} />
                    <SpecLine label="ET" value={w?.et || '-'} />
                    <SpecLine label="DIA" value={localDia} />
                    <SpecLine label="Тип" value={localType} />
                    <SpecLine label="Артикул" value={w.article} />
                </Box>
            </Box>
        );
    };

    return (
        <>
            <Dialog open onClose={onClose} fullWidth maxWidth="md">
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 5 }}>
                        <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
                            {title}
                        </Typography>

                        {type === 'wheel_set' && (
                            <>
                                <Chip size="small" label="Комплект" />
                                {setKindLabel && <Chip size="small" label={setKindLabel} />}
                            </>
                        )}
                    </Box>

                    <IconButton
                        onClick={onClose}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box
                            sx={{
                                backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                                borderRadius: 2,
                                p: 1,
                            }}
                        >
                            <MediaCarousel media={data.media} />
                        </Box>

                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                                Характеристики:
                            </Typography>

                            <Box sx={{ mt: 1 }}>
                                {type === 'wheel' && (
                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: 1,
                                        }}
                                    >
                                        <SpecLine label="PCD" value={data.pcd || '-'} />
                                        <SpecLine label="Диаметр" value={data.diameter || '-'} />
                                        <SpecLine label="Ширина" value={data.width || '-'} />
                                        <SpecLine label="ET" value={data.et || '-'} />
                                        <SpecLine label="DIA" value={data.dia || '-'} />
                                        <SpecLine label="Тип" value={data.type || 'Литой'} />

                                        {data.article ? <SpecLine label="Артикул" value={data.article} /> : null}

                                        <Box sx={{ gridColumn: '1 / -1' }}>
                                            <SpecLine label="Описание" value={data.description || '-'} />
                                        </Box>
                                    </Box>
                                )}

                                {type === 'wheel_set' && (
                                    <>
                                        {/* ✅ UNIFORM — как обычный диск (без FRONT/REAR) */}
                                        {isUniformSet ? (
                                            <Box
                                                sx={{
                                                    display: 'grid',
                                                    gridTemplateColumns: '1fr 1fr',
                                                    gap: 1,
                                                }}
                                            >
                                                <SpecLine label="PCD" value={wheelLike?.pcd || pcd || '-'} />
                                                <SpecLine label="Диаметр" value={wheelLike?.diameter || diameter || '-'} />
                                                <SpecLine label="Ширина" value={wheelLike?.width || '-'} />
                                                <SpecLine label="ET" value={wheelLike?.et || '-'} />
                                                <SpecLine label="DIA" value={wheelLike?.dia || dia || '-'} />
                                                <SpecLine
                                                    label="Тип"
                                                    value={
                                                        wheelLike?.type && wheelLike.type !== '-'
                                                            ? wheelLike.type
                                                            : 'Литой'
                                                    }
                                                />

                                                {wheelLike?.article ? <SpecLine label="Артикул" value={wheelLike.article} /> : null}

                                                {data.description ? (
                                                    <Box sx={{ gridColumn: '1 / -1' }}>
                                                        <SpecLine label="Описание" value={data.description} />
                                                    </Box>
                                                ) : null}
                                            </Box>
                                        ) : (
                                            <>
                                                {/* ✅ STAGGERED — два блока: Перед / Зад (полная инфа) */}
                                                <Divider sx={{ my: 1 }} />

                                                <Box
                                                    sx={{
                                                        display: 'grid',
                                                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                                        gap: 1,
                                                    }}
                                                >
                                                    <WheelInfoBlock caption="Перед" w={front} />
                                                    <WheelInfoBlock caption="Зад" w={rear} />
                                                </Box>

                                                {data.description ? (
                                                    <Box sx={{ mt: 1 }}>
                                                        <SpecLine label="Описание" value={data.description} />
                                                    </Box>
                                                ) : null}
                                            </>
                                        )}
                                    </>
                                )}

                                {type === 'tyre' && (
                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: 1,
                                        }}
                                    >
                                        <SpecLine label="Бренд" value={data.brand || '-'} />
                                        <SpecLine label="Модель" value={data.model || '-'} />
                                        <SpecLine label="Ширина" value={data.width || '-'} />
                                        <SpecLine label="Высота" value={data.height || '-'} />
                                        <SpecLine label="Диаметр" value={data.diameter || '-'} />
                                        <SpecLine label="Сезон" value={data.season || '-'} />
                                        <SpecLine label="Индекс нагрузки" value={data.loadIndex || '-'} />
                                        <SpecLine label="Индекс скорости" value={data.speedIndex || '-'} />
                                        <SpecLine label="RunFlat" value={data.runflat ? 'Да' : 'Нет'} />
                                        <SpecLine label="Шипы" value={data.thorn ? 'Да' : 'Нет'} />
                                    </Box>
                                )}

                                <Typography fontWeight={800} sx={{ mt: 1.5 }}>
                                    Цена: {price !== 'Уточняйте' ? `${price} ₽` : price}
                                </Typography>
                            </Box>

                            <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                    mt: 3,
                                    backgroundColor: '#eab62f',
                                    color: '#000',
                                    fontWeight: 600,
                                    '&:hover': { backgroundColor: '#d9a727' },
                                }}
                                onClick={handleBuy}
                                disabled={loading}
                            >
                                Купить
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    Товар добавлен в корзину!
                </Alert>
            </Snackbar>
        </>
    );
};

export default ProductModal;
