import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  MenuItem,
  Autocomplete,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import { useCart } from '../../shared/hooks/useCart';
import { Seo } from '../../app/seo/Seo';

interface OtherProduct {
  _id: string;
  name: string;
  price: number;
}

type PaymentMethod = 'CARD' | 'SBP' | 'CASH';

const yellowFieldStyle = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: '#eab62f' },
    '&:hover fieldset': { borderColor: '#d9a727' },
    '&.Mui-focused fieldset': { borderColor: '#eab62f' },
  },
};

const OrderForm = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CARD');

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    isDeliveryValid: '',
    address: '',
  });

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const token = process.env.REACT_APP_DADATA_API_TOKEN;

  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const robots = 'noindex,follow';

  const { selectedSensors = [], needBolts = false } = (location.state as any) || {};

  const [sensors, setSensors] = useState<OtherProduct[]>([]);
  const [loadingSensors, setLoadingSensors] = useState(true);

  useEffect(() => {
    const fetchSensors = async () => {
      if (selectedSensors.length === 0) {
        setLoadingSensors(false);
        return;
      }
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
  }, [selectedSensors]);

  const validate = () => {
    const newErrors = {
      name: values.name.trim() ? '' : 'Введите имя',
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ? '' : 'Неверный email',
      phone: /^\+?\d{10,15}$/.test(values.phone) ? '' : 'Неверный номер',
      isDeliveryValid: deliveryMethod ? '' : 'Выберете способ доставки',
      address: deliveryMethod !== 'pickup' && !values.address.trim() ? 'Введите адрес' : '',
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const baseTotal = useMemo(
    () => cart.reduce((sum, item) => sum + (item.price || 0) * 4, 0),
    [cart]
  );

  const deliveryPrice = deliveryMethod === 'courier' ? 1000 : 0;


  const sensorsTotal = useMemo(() => {
    return selectedSensors.reduce((sum: number, id: string) => {
      const sensor = sensors.find((s) => s._id === id);
      return sum + (sensor?.price || 0) * 4;
    }, 0);
  }, [selectedSensors, sensors]);

  const boltsPrice = needBolts ? 5000 : 0;
  const totalPrice = baseTotal + sensorsTotal + boltsPrice + deliveryPrice;

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      ...values,
      deliveryMethod,
      items: cart,
      selectedSensors,
      needBolts,
      total: totalPrice,
      paymentMethod, // CARD | SBP | CASH
    };

    try {
      const res = await api.post('/api/client/order', payload);

      if (paymentMethod === 'CARD') {
        if (res.data?.paymentUrl) {
          window.location.href = res.data.paymentUrl;
          return;
        }
        alert('Не удалось создать ссылку на оплату. Попробуйте позже.');
        return;
      }

      if (paymentMethod === 'SBP') {
        const qrSvg = res.data?.qrSvg || null;
        const qrPayload = res.data?.qrPayload || null;
        const orderId = res.data?.id || null;

        if (!qrSvg && !qrPayload) {
          alert('Не удалось получить QR-код. Попробуйте позже.');
          return;
        }

        navigate('/pay/qr', { state: { qrSvg, qrPayload, orderId } });
        return;
      }

      clearCart();
      navigate('/order-success');
    } catch (err) {
      console.error('Ошибка при отправке заказа:', err);
      alert('Ошибка при отправке заказа. Попробуйте позже.');
    }
  };

  const handleChange =
    (field: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleAddressChange = async (query: string) => {
    setValues((prev) => ({ ...prev, address: query }));
    if (!query) return;

    setLoading(true);
    try {
      const res = await axios.post(
        'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
        { query },
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const s = res.data.suggestions.map((x: any) => x.value);
      setSuggestions(s);
    } catch (err) {
      console.error('Ошибка при получении адресов:', err);
    } finally {
      setLoading(false);
    }
  };

  const showAddressField = deliveryMethod && deliveryMethod !== 'pickup';

  return (
    <>
      <Seo
        title="Оформление заказа | ArtWheels"
        description="Оформите заказ в ArtWheels: выберите доставку и оплату, заполните данные и перейдите к оплате."
        pathname={location.pathname}
        search={location.search}
        robots={robots}
      />
      <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, py: 7 }}>
        <Typography variant="h5" gutterBottom>
          Оформление заказа
        </Typography>

      <TextField
        label="Имя"
        fullWidth
        margin="normal"
        value={values.name}
        onChange={handleChange('name')}
        error={!!errors.name}
        helperText={errors.name}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          ),
        }}
        sx={yellowFieldStyle}
      />

      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={values.email}
        onChange={handleChange('email')}
        error={!!errors.email}
        helperText={errors.email}
        sx={yellowFieldStyle}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Телефон"
        fullWidth
        margin="normal"
        value={values.phone}
        onChange={handleChange('phone')}
        error={!!errors.phone}
        helperText={errors.phone}
        placeholder="+79991234567"
        sx={yellowFieldStyle}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PhoneIcon />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        select
        label="Способ доставки"
        fullWidth
        margin="normal"
        value={deliveryMethod}
        helperText={errors.isDeliveryValid}
        error={!!errors.isDeliveryValid}
        onChange={(e) => setDeliveryMethod(e.target.value)}
        sx={yellowFieldStyle}
      >
        <MenuItem value="pickup">Самовывоз</MenuItem>
        <MenuItem value="courier">Курьер</MenuItem>
      </TextField>

      {showAddressField && (
        <Autocomplete
          freeSolo
          loading={loading}
          options={suggestions}
          inputValue={values.address}
          onInputChange={(_, value) => handleAddressChange(value)}
          onChange={(_, value) => setValues((prev) => ({ ...prev, address: value || '' }))}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Адрес доставки"
              margin="normal"
              fullWidth
              error={!!errors.address}
              helperText={errors.address}
              sx={yellowFieldStyle}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      )}

      <Box mt={2}>
        <FormControl>
          <FormLabel>Способ оплаты</FormLabel>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
          >
            <FormControlLabel value="CARD" control={<Radio />} label="Картой онлайн" />
            <FormControlLabel value="CASH" control={<Radio />} label="Оплата при получении / перевод" />
          </RadioGroup>
        </FormControl>
      </Box>

      <Button
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        sx={{
          mt: 3,
          backgroundColor: '#eab62f',
          color: '#000',
          '&:hover': { backgroundColor: '#d9a727' },
        }}
      >
        {paymentMethod === 'CARD'
          ? 'Перейти к оплате'
          : paymentMethod === 'SBP'
            ? 'Показать QR-код'
            : 'Оформить заказ'}
      </Button>

      {/* --- блок товаров --- */}
      <Box mt={4}>
        <Typography variant="h6">Товары в заказе:</Typography>

        {cart.map((item, i) => (
          <Typography key={i} variant="body2">
            — {item.name} ({(item.price || 0) * 4} ₽)
          </Typography>
        ))}

        {!loadingSensors &&
          selectedSensors.map((id: string) => {
            const sensor = sensors.find((s) => s._id === id);
            return (
              sensor && (
                <Typography key={sensor._id} variant="body2">
                  — {sensor.name} (комплект {sensor.price * 4} ₽)
                </Typography>
              )
            );
          })}

        {needBolts && (
          <Typography variant="body2">
            — Дополнительный крепеж (5000 ₽)
          </Typography>
        )}

        {deliveryMethod === 'courier' && (
          <Typography variant="body2">
            — Доставка (1000 ₽)
          </Typography>
        )}

        <Typography variant="subtitle1" mt={2}>
          Итого:{' '}
          <strong style={{ color: '#eab62f' }}>
            {totalPrice.toLocaleString()} ₽
          </strong>
        </Typography>
      </Box>

      </Box>
    </>
  );
};

export default OrderForm;
