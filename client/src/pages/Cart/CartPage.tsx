import { Box, Typography, Container, Button, FormControlLabel, Checkbox, CircularProgress } from '@mui/material';
import { useCart } from '../../shared/hooks/useCart';
import { CartItemCard } from '../../entities/CartItemCard/CartItemCard';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api/axios';

interface OtherProduct {
  _id: string;
  name: string;
  price: number;
}

const CartPage = () => {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

  // Дополнительные товары
  const [sensors, setSensors] = useState<OtherProduct[]>([]);
  const [loadingSensors, setLoadingSensors] = useState(true);
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);
  const [needBolts, setNeedBolts] = useState(false);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const res = await api.get('/api/client/other-products', {
          params: { search: 'Датчик', limit: 50 },
        });
        setSensors(res.data.data || []);
      } catch (err) {
        console.error('Ошибка при загрузке датчиков:', err);
      } finally {
        setLoadingSensors(false);
      }
    };
    fetchSensors();
  }, []);
  const uniqueSensors = Array.from(
    new Map(sensors.map((item) => [item.name, item])).values()
  );

  // сумма корзины
  const baseTotal = cart.reduce((sum, item) => {
    const price = item.price || 0;
    return sum + price * 4;
  }, 0);

  // сумма выбранных датчиков
  const sensorsTotal = selectedSensors.reduce((sum, id) => {
    const sensor = sensors.find((s) => s._id === id);
    return sum + (sensor?.price || 0) * 4;
  }, 0);

  // цена крепежа (фикс)
  const boltsPrice = needBolts ? 5000 : 0;

  const totalPrice = baseTotal + sensorsTotal + boltsPrice;

  const handleCheckout = () => {
    navigate('/checkout', {
      state: {
        selectedSensors,
        needBolts,
      },
    });
  };

  const toggleSensor = (id: string) => {
    setSelectedSensors((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <Container sx={{ py: 7 }}>
      <Typography variant="h4" gutterBottom>
        Корзина
      </Typography>

      {cart.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>Ваша корзина пуста.</Typography>
      ) : (
        <>
          {/* Товары в корзине */}
          {cart.map((item, index) => (
            <CartItemCard key={index} item={item} onRemove={() => removeFromCart(index)} />
          ))}

          {/* Дополнительные товары */}
          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              Дополнительные товары
            </Typography>

            {/* Блок датчиков */}
            <Box mb={2}>
              <Typography variant="subtitle1" gutterBottom>
                Датчики давления:
              </Typography>
              {loadingSensors ? (
                <CircularProgress size={24} />
              ) : sensors.length === 0 ? (
                <Typography variant="body2">Нет доступных датчиков</Typography>
              ) : (
                uniqueSensors.map((sensor) => (
                  <FormControlLabel
                    key={sensor._id}
                    control={
                      <Checkbox
                        checked={selectedSensors.includes(sensor._id)}
                        onChange={() => toggleSensor(sensor._id)}
                      />
                    }
                    label={`${sensor.name} (+${(sensor.price * 4).toLocaleString()} ₽ за комплект)`}
                  />
                ))
              )}
            </Box>

            {/* Блок крепежа */}
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={needBolts}
                    onChange={(e) => setNeedBolts(e.target.checked)}
                  />
                }
                label={`Потребуется дополнительный крепеж (+5000 ₽ за комплект)`}
              />
            </Box>
          </Box>

          {/* Итог */}
          <Box mt={4} textAlign="right">
            <Typography variant="h6" gutterBottom>
              Финальная сумма:{' '}
              <span style={{ color: '#eab62f' }}>{totalPrice.toLocaleString()} ₽</span>
            </Typography>
            <Button
              variant="contained"
              startIcon={<ShoppingCartCheckoutIcon />}
              onClick={handleCheckout}
              sx={{
                mt: 1,
                backgroundColor: '#eab62f',
                color: 'black',
                '&:hover': { backgroundColor: '#d19f2f' },
              }}
            >
              Оформить заказ
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default CartPage;
