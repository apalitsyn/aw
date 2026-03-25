import { Box, FormControl, InputLabel, MenuItem, Select, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import BrandIcon from '../../../widgets/components/BrandIcon';

type Fitment = 'all' | 'uniform' | 'staggered';

const ByBrand = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [brands, setBrands] = useState<{ _id: string; name: string; logoUrl?: string | null }[]>([]);
    const [models, setModels] = useState<{ _id: string; name: string }[]>([]);

    const [brandId, setSelectedBrandId] = useState('');
    const [selectedModelId, setSelectedModelId] = useState('');

    const [diameterOptions, setDiameterOptions] = useState<string[]>([]);
    const [diameter, setDiameter] = useState('');

    const [typeOptions, setTypeOptions] = useState<string[]>([]);
    const [type, setType] = useState('');

    const [fitment, setFitment] = useState<Fitment>('all');

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await api.get(`/api/client/models`);
                setBrands(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error('Ошибка при получении брендов:', err);
            }
        };
        fetchBrands();
    }, []);

    useEffect(() => {
        if (!brandId) {
            setModels([]);
            return;
        }

        const fetchModels = async () => {
            try {
                const res = await api.get(`/api/client/models/${brandId}`);
                setModels(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error('Ошибка при получении моделей:', err);
            }
        };

        fetchModels();
    }, [brandId]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);

        const nextBrandId = params.get('brandId') || '';
        const nextModelId = params.get('modelId') || '';
        const nextDiameter = params.get('diameter') || '';
        const nextType = params.get('type') || '';
        const nextFitment = (params.get('fitment') as Fitment) || 'all';

        setSelectedBrandId(nextBrandId);
        setSelectedModelId(nextModelId);
        setDiameter(nextDiameter);
        setType(nextType);
        setFitment(nextFitment);
    }, [location.search]);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const qs = selectedModelId ? `?modelId=${selectedModelId}` : '';
                const res = await api.get(`/api/client/filters${qs}`);

                const nextDiameters = (res.data.diameter || [])
                    .filter((v: string | null | undefined): v is string => !!v)
                    .sort((a: string, b: string) => Number(b) - Number(a));

                const nextTypes = (res.data.type || [])
                    .filter((v: string | null | undefined): v is string => !!v)
                    .sort((a: string, b: string) => b.localeCompare(a));

                setDiameterOptions(nextDiameters);
                setTypeOptions(nextTypes);

                if (diameter && !nextDiameters.includes(diameter)) setDiameter('');
                if (type && !nextTypes.includes(type)) setType('');
            } catch (err) {
                console.error('Ошибка при получении фильтров:', err);
            }
        };

        fetchFilters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedModelId]);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (brandId) params.append('brandId', brandId);
        if (selectedModelId) params.append('modelId', selectedModelId);
        if (diameter) params.append('diameter', diameter);
        if (type) params.append('type', type);
        if (fitment !== 'all') params.append('fitment', fitment);

        navigate(`/catalog/wheels?${params.toString()}`);
    };

    const handleReset = () => {
        setSelectedBrandId('');
        setSelectedModelId('');
        setDiameter('');
        setType('');
        setFitment('all');
        navigate(location.pathname);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4, flexWrap: 'wrap' }}>
            <Box
                sx={{
                    flex: 1,
                    minWidth: 300,
                    height: '100%',
                    display: 'grid',
                    gridTemplateRows: 'auto auto auto auto auto 1fr auto',
                    gap: 2,
                }}
            >
                <FormControl
                    fullWidth
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#eab62f' },
                            '&:hover fieldset': { borderColor: '#d9a926' },
                            '&.Mui-focused fieldset': { borderColor: '#eab62f' },
                        },
                    }}
                >
                    <InputLabel>Марка</InputLabel>
                    <Select
                        value={brandId}
                        label="Марка"
                        onChange={e => {
                            const nextBrandId = e.target.value;
                            setSelectedBrandId(nextBrandId);
                            setSelectedModelId('');
                            setDiameter('');
                            setType('');
                        }}
                        renderValue={selected => {
                            if (!selected) return '';
                            const brand = brands.find(b => b._id === selected);
                            if (!brand) return '';

                            return (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 1.5,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: theme =>
                                                theme.palette.mode === 'dark'
                                                    ? 'rgba(255,255,255,0.9)'
                                                    : 'rgba(0,0,0,0.04)',
                                        }}
                                    >
                                        <BrandIcon logoUrl={brand.logoUrl} size={28} />
                                    </Box>
                                    {brand.name}
                                </Box>
                            );
                        }}
                    >
                        {brands.map(b => (
                            <MenuItem key={b._id} value={b._id}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 1.5,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: theme =>
                                                theme.palette.mode === 'dark'
                                                    ? 'rgba(255,255,255,0.9)'
                                                    : 'rgba(0,0,0,0.04)',
                                        }}
                                    >
                                        <BrandIcon logoUrl={b.logoUrl} size={28} />
                                    </Box>
                                    {b.name}
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl
                    fullWidth
                    disabled={!brandId}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#eab62f' },
                            '&:hover fieldset': { borderColor: '#d9a926' },
                            '&.Mui-focused fieldset': { borderColor: '#eab62f' },
                        },
                    }}
                >
                    <InputLabel>Модель</InputLabel>
                    <Select
                        value={selectedModelId}
                        label="Модель"
                        onChange={e => {
                            setSelectedModelId(e.target.value);
                            setDiameter('');
                            setType('');
                        }}
                    >
                        {models.map(m => (
                            <MenuItem key={m._id} value={m._id}>
                                {m.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl
                    disabled={!brandId && !selectedModelId}
                    fullWidth
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#eab62f' },
                            '&:hover fieldset': { borderColor: '#d9a926' },
                            '&.Mui-focused fieldset': { borderColor: '#eab62f' },
                        },
                    }}
                >
                    <InputLabel>Диаметр</InputLabel>
                    <Select value={diameter} onChange={e => setDiameter(e.target.value)} label="Диаметр">
                        {diameterOptions.map(val => (
                            <MenuItem key={val} value={val}>
                                {val}"
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl
                    disabled={!brandId && !selectedModelId}
                    fullWidth
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#eab62f' },
                            '&:hover fieldset': { borderColor: '#d9a926' },
                            '&.Mui-focused fieldset': { borderColor: '#eab62f' },
                        },
                    }}
                >
                    <InputLabel>Тип диска</InputLabel>
                    <Select value={type} onChange={e => setType(e.target.value)} label="Тип диска">
                        {typeOptions.map(val => (
                            <MenuItem key={val} value={val}>
                                {val}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl
                    fullWidth
                    disabled={!brandId || !selectedModelId}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#eab62f' },
                            '&:hover fieldset': { borderColor: '#d9a926' },
                            '&.Mui-focused fieldset': { borderColor: '#eab62f' },
                        },
                    }}
                >
                    <InputLabel>Комплектация</InputLabel>
                    <Select
                        value={fitment}
                        label="Комплектация"
                        onChange={e => setFitment(e.target.value as Fitment)}
                    >
                        <MenuItem value="all">Все</MenuItem>
                        <MenuItem value="uniform">Одноширокие</MenuItem>
                        <MenuItem value="staggered">Разноширокие</MenuItem>
                    </Select>
                </FormControl>


                <Box sx={{ mt: 3, pb: 3, display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        color="warning"
                        sx={{
                            backgroundColor: '#eab62f',
                            color: '#000',
                            '&:hover': { backgroundColor: '#d9a727' },
                        }}
                        disabled={!brandId || !selectedModelId}
                        onClick={handleSearch}
                        fullWidth
                    >
                        Подобрать диски
                    </Button>

                    <Button
                        fullWidth
                        variant="outlined"
                        color="inherit"
                        disabled={!brandId && !selectedModelId && !diameter && !type && fitment === 'all'}
                        onClick={handleReset}
                    >
                        Сбросить
                    </Button>
                </Box>

                <Box />
            </Box>
        </Box>
    );
};

export default ByBrand;
