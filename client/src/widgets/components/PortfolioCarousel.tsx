import {
    Box,
    Typography,
    IconButton,
    CircularProgress,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';

import api from '../../api/axios';
import PortfolioCard from '../../widgets/components/PortfolioCard';

const AUTO_SLIDE_INTERVAL = 7_000;
const PAGE_SIZE = 20;

const PortfolioCarousel = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const [lastInteraction, setLastInteraction] = useState<number>(Date.now());

    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('sm'));
    const isMd = useMediaQuery(theme.breakpoints.down('md'));
    const isLg = useMediaQuery(theme.breakpoints.down('lg'));

    const itemsPerView = useMemo(() => {
        if (isXs) return 1;
        if (isMd) return 2;
        if (isLg) return 3;
        return 4;
    }, [isXs, isMd, isLg]);

    const location = useLocation();
    const navigate = useNavigate();

    const fetchPage = async (pageToLoad: number, append = false) => {
        try {
            if (append) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            const res = await api.get('/api/client/portfolio', {
                params: {
                    page: pageToLoad,
                    limit: PAGE_SIZE,
                },
            });

            const newData = res.data.data || [];
            const totalPages = res.data.pages || 1;

            setPages(totalPages);
            setPage(pageToLoad);

            setItems(prev => (append ? [...prev, ...newData] : newData));

            if (!append) {
                setActiveIndex(0);
            }
        } catch (err) {
            console.error('[PortfolioCarousel] Ошибка при получении портфолио:', err);
        } finally {
            if (append) {
                setLoadingMore(false);
            } else {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchPage(1, false);
    }, []);

    const maxIndex = Math.max(0, items.length - itemsPerView);

    const goPrev = () => {
        setActiveIndex(prev => (prev - 1 < 0 ? maxIndex : prev - 1));
    };

    const goNext = useCallback(() => {
        setActiveIndex(prev => (prev + 1 > maxIndex ? 0 : prev + 1));
    }, [maxIndex]);

    const handlePrevClick = () => {
        setLastInteraction(Date.now());
        goPrev();
    };

    const handleNextClick = () => {
        setLastInteraction(Date.now());
        goNext();
    };

    useEffect(() => {
        if (!items.length) return;

        const intervalId = window.setInterval(() => {
            goNext();
        }, AUTO_SLIDE_INTERVAL);

        return () => window.clearInterval(intervalId);
    }, [items.length, itemsPerView, maxIndex, lastInteraction, goNext]);

    useEffect(() => {
        if (!items.length) return;
        if (page >= pages) return;
        if (loadingMore) return;

        const nearEnd = activeIndex + itemsPerView * 2 >= items.length;

        if (nearEnd) {
            fetchPage(page + 1, true);
        }
    }, [activeIndex, itemsPerView, items.length, page, pages, loadingMore]);

    const handlers = useSwipeable(
        isXs
            ? {
                onSwipedLeft: () => handleNextClick(),
                onSwipedRight: () => handlePrevClick(),
                preventScrollOnSwipe: true,
                trackTouch: true,
                trackMouse: false,
            }
            : {},
    );

    const getTranslateX = () =>
        `translateX(-${(100 / itemsPerView) * activeIndex}%)`;

    if (loading) {
        return (
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!items.length) return null;

    return (
        <Box sx={{ p: 3, overflow: 'hidden' }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    gap: 2,
                }}
            >
                <Typography variant="h5" fontWeight={600} sx={{ flexGrow: 1 }}>
                    Наша галерея работ
                </Typography>

                <IconButton
                    onClick={handlePrevClick}
                    disabled={items.length <= itemsPerView}
                >
                    <ChevronLeftIcon />
                </IconButton>
                <IconButton
                    onClick={handleNextClick}
                    disabled={items.length <= itemsPerView}
                >
                    <ChevronRightIcon />
                </IconButton>
            </Box>

            <Box
                {...handlers}
                sx={{
                    display: 'flex',
                    transition: 'transform 0.6s ease-in-out',
                    transform: getTranslateX(),
                    touchAction: 'pan-y',
                }}
            >
                {items.map(item => (
                    <Box
                        key={item._id}
                        sx={{
                            flex: `0 0 ${100 / itemsPerView}%`,
                            boxSizing: 'border-box',
                            px: 1,
                        }}
                    >
                        <PortfolioCard
                            data={item}
                            onClick={() =>
                                navigate(`/portfolio/${item._id}${location.search}`, {
                                    state: { from: location.pathname + location.search },
                                })
                            }
                        />
                    </Box>
                ))}
            </Box>

            {loadingMore && (
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size={20} />
                </Box>
            )}
        </Box>
    );
};

export default PortfolioCarousel;
