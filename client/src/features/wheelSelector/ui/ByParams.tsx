import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useEffect, useState } from 'react';
import api from '../../../api/axios';
import { useLocation, useNavigate } from 'react-router-dom';

type Fitment = 'all' | 'uniform' | 'staggered';

const ByParams = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [diameterOptions, setDiameterOptions] = useState<string[]>([]);
  const [widthOptions, setWidthOptions] = useState<string[]>([]);
  const [typeOptions, setTypeOptions] = useState<string[]>([]);
  const [pcdOptions, setPcdOptions] = useState<string[]>([]);
  const [diaOptions, setDiaOptions] = useState<string[]>([]);
  const [etOptions, setEtOptions] = useState<string[]>([]);

  const [diameter, setDiameter] = useState('');
  const [width, setWidth] = useState('');
  const [type, setType] = useState('');
  const [pcd, setPcd] = useState('');
  const [dia, setDia] = useState('');
  const [et, setEt] = useState('');

  const [fitment, setFitment] = useState<Fitment>('all');

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await api.get('/api/client/filters');
        setDiameterOptions(
          (res.data.diameter || [])
            .filter((v: string | null | undefined): v is string => !!v)
            .sort((a: string, b: string) => Number(b) - Number(a))
        );

        setWidthOptions(
          (res.data.width || [])
            .filter((v: string | null | undefined): v is string => !!v)
            .sort((a: string, b: string) => Number(b) - Number(a))
        );

        setDiaOptions(
          (res.data.dia || [])
            .filter((v: string | null | undefined): v is string => !!v)
            .sort((a: string, b: string) => Number(b) - Number(a))
        );

        setEtOptions(
          (res.data.et || [])
            .filter((v: string | null | undefined): v is string => !!v)
            .sort((a: string, b: string) => Number(b) - Number(a))
        );

        setPcdOptions(
          (res.data.pcd || [])
            .filter((v: string | null | undefined): v is string => !!v)
            .sort((a: string, b: string) => b.localeCompare(a))
        );

        setTypeOptions(
          (res.data.type || [])
            .filter((v: string | null | undefined): v is string => !!v)
            .sort((a: string, b: string) => b.localeCompare(a))
        );
      } catch (err) {
        console.error('Ошибка при загрузке фильтров:', err);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    setDiameter(params.get('diameter') || '');
    setWidth(params.get('width') || '');
    setPcd(params.get('pcd') || '');
    setType(params.get('type') || '');
    setDia(params.get('dia') || '');
    setEt(params.get('et') || '');
    setFitment((params.get('fitment') as Fitment) || 'all');
  }, [location.search]);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (diameter) params.append('diameter', diameter);
    if (width) params.append('width', width);
    if (type) params.append('type', type);
    if (pcd) params.append('pcd', pcd);
    if (dia) params.append('dia', dia);
    if (et) params.append('et', et);
    if (fitment !== 'all') params.append('fitment', fitment);

    navigate(`/catalog/wheels?${params.toString()}`);
  };

  const handleReset = () => {
    setDiameter('');
    setWidth('');
    setType('');
    setPcd('');
    setDia('');
    setEt('');
    setFitment('all');
    navigate(location.pathname);
  };

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
          mt: 4,
        }}
      >
        <FormControl fullWidth sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#eab62f' },
            '&:hover fieldset': { borderColor: '#d9a926' },
            '&.Mui-focused fieldset': { borderColor: '#eab62f' },
          },
        }}>
          <InputLabel>Диаметр диска</InputLabel>
          <Select value={diameter} label="Диаметр диска" onChange={e => setDiameter(e.target.value)}>
            {diameterOptions.map(val => (
              <MenuItem key={val} value={val}>
                {val}"
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#eab62f' },
            '&:hover fieldset': { borderColor: '#d9a926' },
            '&.Mui-focused fieldset': { borderColor: '#eab62f' },
          },
        }}>
          <InputLabel>Ширина обода</InputLabel>
          <Select value={width} label="Ширина обода" onChange={e => setWidth(e.target.value)}>
            {widthOptions.map(val => (
              <MenuItem key={val} value={val}>
                {val}"
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#eab62f' },
            '&:hover fieldset': { borderColor: '#d9a926' },
            '&.Mui-focused fieldset': { borderColor: '#eab62f' },
          },
        }}>
          <InputLabel>Тип диска</InputLabel>
          <Select value={type} label="Тип диска" onChange={e => setType(e.target.value)}>
            {typeOptions.map(val => (
              <MenuItem key={val} value={val}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#eab62f' },
            '&:hover fieldset': { borderColor: '#d9a926' },
            '&.Mui-focused fieldset': { borderColor: '#eab62f' },
          },
        }}>
          <InputLabel>PCD</InputLabel>
          <Select value={pcd} label="PCD" onChange={e => setPcd(e.target.value)}>
            {pcdOptions.map(val => (
              <MenuItem key={val} value={val}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#eab62f' },
            '&:hover fieldset': { borderColor: '#d9a926' },
            '&.Mui-focused fieldset': { borderColor: '#eab62f' },
          },
        }}>
          <InputLabel>DIA</InputLabel>
          <Select value={dia} label="DIA" onChange={e => setDia(e.target.value)}>
            {diaOptions.map(val => (
              <MenuItem key={val} value={val}>
                {val} мм
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#eab62f' },
            '&:hover fieldset': { borderColor: '#d9a926' },
            '&.Mui-focused fieldset': { borderColor: '#eab62f' },
          },
        }}>
          <InputLabel>ET</InputLabel>
          <Select value={et} label="ET" onChange={e => setEt(e.target.value)}>
            {etOptions.map(val => (
              <MenuItem key={val} value={val}>
                ET{val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mt: 3, pb: 3, display: 'flex', gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="warning"
          sx={{ backgroundColor: '#eab62f', color: '#000', '&:hover': { backgroundColor: '#d9a727' } }}
          onClick={handleSearch}
        >
          Подобрать диски
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          onClick={handleReset}
          disabled={
            !!!diameter && !!!width && !!!type && !!!pcd && !!!dia && !!!et && fitment === 'all'
          }
        >
          Сбросить
        </Button>
      </Box>
    </>
  );
};

export default ByParams;
