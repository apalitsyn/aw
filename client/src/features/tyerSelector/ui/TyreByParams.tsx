import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../../api/axios';

const TyreByParams = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const [diameterOptions, setDiameterOptions] = useState<string[]>([]);
  const [widthOptions, setWidthOptions] = useState<string[]>([]);
  const [heightOptions, setHeightOptions] = useState<string[]>([]);
  const [typeOptions, setTypeOptions] = useState<string[]>([]);
  const [brandOptions, setBrandOptions] = useState<string[]>([]);

  const [diameter, setDiameter] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [type, setType] = useState('');
  const [brand, setBrand] = useState('');

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await api.get('/api/client/tyre-filters');
        setDiameterOptions(res.data.diameter || []);
        setWidthOptions(res.data.width || []);
        setTypeOptions(res.data.type || []);
        setBrandOptions(res.data.brand || []);
        setHeightOptions(res.data.height || []);
      } catch (err) {
        console.error('Ошибка при загрузке фильтров шин:', err);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    setDiameter(params.get('diametr') || '');
    setWidth(params.get('width') || '');
    setHeight(params.get('height') || '');
    setType(params.get('type') || '');
    setBrand(params.get('brand') || '');
  }, [location.search]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (diameter) params.append('diametr', diameter);
    if (width) params.append('width', width);
    if (height) params.append('height', height);
    if (type) params.append('type', type);
    if (brand) params.append('brand', brand);

    navigate(`/catalog/tyres?${params.toString()}`);
  };

  const handleReset = () => {
    setDiameter('');
    setWidth('');
    setHeight('');
    setType('');
    setBrand('');
    navigate(location.pathname);
  };

  const backgroundImages = {
    light: '/background/tyre_selector/light.jpg',
    dark: '/background/tyre_selector/dark.jpg',
  };

  const mode = theme.palette.mode === 'dark' ? 'dark' : 'light';
  const currentBg = backgroundImages[mode];

  return (
    <Box sx={{ mt: 4, width: '100%' }}>
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            py: 2,
            px: 3,
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography
            variant="h5"
            fontWeight={600}
            align="center"
            sx={{ mb: 0 }}
          >
            Подобрать шины
          </Typography>
        </Box>

        <Box
          sx={{
            p: 3,
            backgroundImage: `url(${currentBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transition: 'background-image 0.3s ease',
          }}
        >
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor:
                mode === 'dark'
                  ? alpha(theme.palette.background.default, 0.85)
                  : alpha('#ffffff', 0.9),
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
              }}
            >
              <FormControl fullWidth sx={inputStyle}>
                <InputLabel>Диаметр</InputLabel>
                <Select
                  value={diameter}
                  onChange={e => setDiameter(e.target.value)}
                  label="Диаметр"
                >
                  {diameterOptions.map(val => (
                    <MenuItem key={val} value={val}>
                      {val}"
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={inputStyle}>
                <InputLabel>Ширина</InputLabel>
                <Select
                  value={width}
                  onChange={e => setWidth(e.target.value)}
                  label="Ширина"
                >
                  {widthOptions.map(val => (
                    <MenuItem key={val} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={inputStyle}>
                <InputLabel>Высота</InputLabel>
                <Select
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                  label="Высота"
                >
                  {heightOptions.map(val => (
                    <MenuItem key={val} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={inputStyle}>
                <InputLabel>Сезон</InputLabel>
                <Select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  label="Сезон"
                >
                  {typeOptions.map(val => (
                    <MenuItem key={val} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={inputStyle}>
                <InputLabel>Бренд</InputLabel>
                <Select
                  value={brand}
                  onChange={e => setBrand(e.target.value)}
                  label="Бренд"
                >
                  {brandOptions.map(val => (
                    <MenuItem key={val} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                color="warning"
                sx={{
                  backgroundColor: '#eab62f',
                  color: '#000',
                  '&:hover': { backgroundColor: '#d9a727' },
                }}
                onClick={handleSearch}
              >
                Подобрать шины
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="inherit"
                onClick={handleReset}
                disabled={
                  !diameter && !width && !height && !type && !brand
                }
              >
                Сбросить
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TyreByParams;

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#eab62f',
    },
    '&:hover fieldset': {
      borderColor: '#d9a926',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#eab62f',
    },
  },
};
