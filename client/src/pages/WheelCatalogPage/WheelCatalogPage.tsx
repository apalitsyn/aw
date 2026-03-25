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
import WheelSelectorTabs from '../../features/wheelSelector/ui/WheelSelectorTabs';
import ProductModal from '../../widgets/modals/ProductModal';
import ProductCard from '../../widgets/components/WheelCard';
import { Seo } from '../../app/seo/Seo';

type CatalogItem = any;

const WheelCatalogPage = () => {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();

  const { kind, id } = useParams();
  const isProductRoute = !!id;
  const robots = isProductRoute ? 'noindex,follow' : 'index,follow';

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);

        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          params[key] = value;
        });

        params.page = String(page);
        params.limit = params.limit || '20';

        const res = await api.get('/api/client/wheels', { params });

        setItems(Array.isArray(res.data?.data) ? res.data.data : []);
        console.log(res.data.data)
        setPages(res.data.pages || 1);
      } catch (err) {
        console.error('Ошибка при получении каталога:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [searchParams, page]);

  const openItem = (item: any) => {
    const isSet = item?.productType === 'WHEEL_SET';
    const nextKind = isSet ? 'set' : 'wheel';
    navigate(`/catalog/wheels/${nextKind}/${item._id}${location.search}`, {
      state: { from: `/catalog/wheels${location.search}` },
    });
  };

  const closeModal = () => {
    const state = location.state as { from?: string } | null;
    const backTo = state?.from ?? `/catalog/wheels${location.search}`;
    navigate(backTo);
  };

  return (
    <>
      <Seo
        title="Каталог дисков | ArtWheels"
        description="Подбор и покупка дисков: литые и комплектующие. Каталог с удобными фильтрами и быстрым оформлением."
        pathname={location.pathname}
        search={location.search}
        robots={robots}
      />
      <WheelSelectorTabs />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Каталог дисков
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : items.length === 0 ? (
          <Typography variant="h6" mt={4}>
            Каталог пуст — подходящие позиции не найдены.
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
              {items.map((item: any) => (
                <Box key={item._id}>
                  <ProductCard data={item} onClick={() => openItem(item)} />
                </Box>
              ))}
            </Box>
            {!!id && (
              <ProductModal
                id={id}
                type={kind === 'set' ? 'wheel_set' : 'wheel'}
                onClose={closeModal}
              />
            )}
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
                        '&:hover': { backgroundColor: '#d9a727' },
                      },
                      '&:hover': { backgroundColor: '#f2d179' },
                    }}
                  />
                )}
              />
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default WheelCatalogPage;
