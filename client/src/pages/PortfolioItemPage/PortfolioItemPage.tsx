import {
    Box,
    Dialog,
    DialogContent,
    IconButton,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import api from '../../api/axios';

interface Props {
    id: string;
    onClose: () => void;
}

const PortfolioItemPage = ({ id, onClose }: Props) => {
    const [item, setItem] = useState<any | null>(null);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await api.get(`/api/client/portfolio/${id}`);
                setItem(res.data);
            } catch (err) {
                console.error('Ошибка загрузки записи портфолио:', err);
            }
        };

        fetchItem();
    }, [id]);

    const prod = process.env.REACT_APP_PROD ? true : false;
    const baseUrl = prod ? '' : 'http://localhost:8833';

    const media: string[] = item?.media || [];
    const mainImg = item?.preview || media[0];

    const getSrc = (p: string) =>
        p.startsWith('http') ? p : `${baseUrl}/${p}`;

    return (
        <Dialog open onClose={onClose} maxWidth="xl" fullWidth>
            <DialogContent sx={{ position: 'relative', p: 3 }}>
                <IconButton
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>

                {!item ? (
                    <Typography>Загрузка…</Typography>
                ) : (
                    <Box>
                        {mainImg && (
                            <Box
                                sx={{
                                    width: '100%',
                                    maxHeight: 400,
                                    mb: 2,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                }}
                            >
                                <img
                                    src={getSrc(mainImg)}
                                    alt={item.title}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain',
                                    }}
                                />
                            </Box>
                        )}

                        <Typography variant="h5" fontWeight={700} gutterBottom>
                            {item.title}
                        </Typography>

                        {item.description && (
                            <Typography variant="body1" mb={2}>
                                {item.description}
                            </Typography>
                        )}

                        {media.length > 1 && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    flexWrap: 'wrap',
                                    mt: 2,
                                }}
                            >
                                {media.map((m: string) => (
                                    <Box
                                        key={m}
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: 1,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <img
                                            src={getSrc(m)}
                                            alt=""
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default PortfolioItemPage;
