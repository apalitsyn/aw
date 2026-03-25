import {
    Box,
    Typography,
    CircularProgress,
    Pagination,
    PaginationItem,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import PortfolioCard from '../../widgets/components/PortfolioCard';
import PortfolioModal from '../../widgets/modals/PortfolioItemModal';
import PortfolioFilterByBrand from '../../features/PortfolioFilterByBrand/PortfolioFilterByBrand';

type Brand = { _id: string; name: string; logoUrl?: string | null };
type Model = { _id: string; name: string };

const PortfolioPage = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const [brands, setBrands] = useState<Brand[]>([]);
    const [modelsByBrand, setModelsByBrand] = useState<Record<string, Model[]>>(
        {}
    );

    const location = useLocation();
    const searchParams = useMemo(
        () => new URLSearchParams(location.search),
        [location.search]
    );
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchBrandsAndModels = async () => {
            try {
                const resBrands = await api.get('/api/client/models');
                const brandsData: Brand[] = resBrands.data;
                setBrands(brandsData);

                const modelsMap: Record<string, Model[]> = {};
                await Promise.all(
                    brandsData.map(async b => {
                        try {
                            const resModels = await api.get(`/api/client/models/${b._id}`);
                            modelsMap[b._id] = resModels.data;
                        } catch (err) {
                            console.error('Ошибка при получении моделей бренда', b._id, err);
                            modelsMap[b._id] = [];
                        }
                    })
                );
                setModelsByBrand(modelsMap);
            } catch (err) {
                console.error('Ошибка при загрузке брендов/моделей:', err);
            }
        };

        fetchBrandsAndModels();
    }, []);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);

                const params: Record<string, string> = {};
                searchParams.forEach((value, key) => {
                    params[key] = value;
                });
                params.page = String(page);

                const res = await api.get('/api/client/portfolio', { params });
                setItems(res.data.data);
                setPages(res.data.pages || 1);
            } catch (err) {
                console.error('Ошибка при получении портфолио:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [searchParams, page]);

    const resolveCarInfo = (modelId?: string) => {
        if (!modelId) return { brandName: '', modelName: '' };

        for (const brand of brands) {
            const models = modelsByBrand[brand._id] || [];
            const model = models.find(m => m._id === modelId);
            if (model) {
                return { brandName: brand.name, modelName: model.name };
            }
        }

        return { brandName: '', modelName: '' };
    };

    return (
        <>
            <Box sx={{ p: 3, mt: 2 }}>
                <Typography variant="h4" fontWeight={600} gutterBottom>
                    Наши диски вживую
                </Typography>

                <PortfolioFilterByBrand />

                {loading ? (
                    <CircularProgress />
                ) : items.length === 0 ? (
                    <Typography variant="h6" mt={4}>
                        Работы пока не добавлены.
                    </Typography>
                ) : (
                    <>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(3, 1fr)',
                                    lg: 'repeat(4, 1fr)',
                                },
                                gap: 3,
                            }}
                        >
                            {items.map((item: any) => {
                                const modelId = Array.isArray(item.modelIds) ? item.modelIds[0] : undefined;
                                const carInfo = resolveCarInfo(modelId);

                                return (
                                    <Box key={item._id}>
                                        <PortfolioCard
                                            data={item}
                                            carInfo={carInfo}
                                            onClick={() =>
                                                navigate(`/portfolio/${item._id}${location.search}`, {
                                                    state: { from: `/portfolio${location.search}` },
                                                })
                                            }
                                        />
                                    </Box>
                                );
                            })}
                            {id && (
                                <PortfolioModal
                                    id={id}
                                    carInfo={(() => {
                                        const item = items.find((x: any) => x._id === id);
                                        const modelId = item && Array.isArray(item.modelIds) ? item.modelIds[0] : undefined;
                                        return resolveCarInfo(modelId);
                                    })()}
                                    onClose={() => {
                                        const state = location.state as { from?: string } | null;
                                        const backTo = state?.from ?? `/portfolio${location.search}`;
                                        navigate(backTo);
                                    }}
                                />
                            )}

                        </Box>

                        <Box mt={4} display="flex" justifyContent="center">
                            <Pagination
                                count={pages}
                                page={page}
                                onChange={(_, value) => setPage(value)}
                                color="primary"
                                renderItem={(item) => (
                                    <PaginationItem
                                        {...item}
                                        sx={{
                                            '&.Mui-selected': {
                                                backgroundColor: '#eab62f',
                                                color: '#000',
                                                '&:hover': {
                                                    backgroundColor: '#d9a727',
                                                },
                                            },
                                            '&:hover': {
                                                backgroundColor: '#f2d179',
                                            },
                                        }}
                                    />
                                )}
                            />
                        </Box>
                    </>
                )}
            </Box>

            {id && (
                <PortfolioModal
                    id={id}
                    carInfo={(() => {
                        const item = items.find((x: any) => x._id === id);
                        const modelId = item && Array.isArray(item.modelIds) ? item.modelIds[0] : undefined;
                        return resolveCarInfo(modelId);
                    })()}
                    onClose={() => {
                        const state = location.state as { from?: string } | null;
                        const backTo = state?.from ?? `/portfolio${location.search}`;
                        navigate(backTo);
                    }}
                />
            )}
        </>
    );
};

export default PortfolioPage;
