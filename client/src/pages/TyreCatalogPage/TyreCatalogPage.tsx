import {
  Box,
  Typography,
  CircularProgress,
  Pagination,
  PaginationItem,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import TyreCard from '../../widgets/components/TyreCard';
import TyreByParams from '../../features/tyerSelector/ui/TyreByParams';
import ProductModal from '../../widgets/modals/ProductModal';
import { Seo } from '../../app/seo/Seo';


const TyreCatalogPage = () => {
  const [tyres, setTyres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const navigate = useNavigate();
  const { id } = useParams();
  const isProductRoute = !!id;
  const robots = isProductRoute ? 'noindex,follow' : 'index,follow';

  useEffect(() => {
    const fetchTyres = async () => {
      try {
        setLoading(true);

        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          params[key] = value;
        });
        params.page = String(page);
        params.prioritizeMy = 'true';

        const res = await api.get('/api/client/tyre', { params });
        setTyres(Array.isArray(res.data?.data) ? res.data.data : []);
        setPages(res.data.pages || 1);
      } catch (err) {
        console.error('Ошибка при получении шин:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTyres();
  }, [searchParams, page]);

  return (
    <>
      <Seo
        title="Каталог шин | ArtWheels"
        description="Каталог шин: подберите подходящий комплект по параметрам и сезонности. Быстро оформим заказ."
        pathname={location.pathname}
        search={location.search}
        robots={robots}
      />
      <TyreByParams />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Каталог шин
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : tyres.length === 0 ? (
          <Typography variant="h6" mt={4}>
            Каталог пуст — подходящие шины не найдены.
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
              {tyres.map((tyre: any) => (
                <Box key={tyre._id}>
                  <TyreCard
                    data={tyre}
                    onClick={() => navigate(`/catalog/tyres/${tyre._id}${location.search}`)}
                  />
                </Box>
              ))}
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
        <ProductModal
          id={id}
          type="tyre"
          onClose={() => {
            const state = location.state as { from?: string } | null;
            const backTo = state?.from ?? `/catalog/tyres${location.search}`;
            navigate(backTo);
          }}
        />
      )}
    </>
  );
};

export default TyreCatalogPage;
