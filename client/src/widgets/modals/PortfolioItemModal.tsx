import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import api from '../../api/axios';
import MediaCarousel from '../components/MediaCarousel';
import BestsellerWheelsCarousel from '../components/BestsellerWheelsCarousel';

type CarInfo = {
    brandName?: string;
    modelName?: string;
};

const PortfolioModal = ({
    id,
    carInfo,
    onClose,
}: {
    id: string;
    carInfo?: CarInfo;
    onClose: () => void;
}) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/api/client/portfolio/${id}`);

                if (!Array.isArray(res.data.media)) {
                    res.data.media = [];
                }
                if (res.data.media.length === 0) {
                    res.data.media.push('uploads/no_img_wheel.png');
                }

                setData(res.data);
            } catch (err) {
                console.error('Ошибка при получении портфолио:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (!data || loading) return null;

    const brandName = carInfo?.brandName || '';
    const modelName = carInfo?.modelName || '';

    return (
        <Dialog open onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                {data.title}
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
                            backgroundColor:
                                theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                            borderRadius: 2,
                            p: 1,
                        }}
                    >
                        <MediaCarousel media={data.media} />
                    </Box>

                    <Box sx={{ mt: 2 }}>
                        {(brandName || modelName) && (
                            <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                sx={{ mb: 1, color: '#eab62f' }}
                            >
                                {brandName}
                                {brandName && modelName ? ' ' : ''}
                                {modelName}
                            </Typography>
                        )}

                        {data.description && (
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                {data.description}
                            </Typography>
                        )}
                        <BestsellerWheelsCarousel />

                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default PortfolioModal;
