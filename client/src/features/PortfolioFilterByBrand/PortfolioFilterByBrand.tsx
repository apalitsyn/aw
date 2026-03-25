import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Button,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import BrandIcon from '../../widgets/components/BrandIcon';

type Brand = { _id: string; name: string; logoUrl?: string | null };
type Model = { _id: string; name: string };

const PortfolioFilterByBrand = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [brands, setBrands] = useState<Brand[]>([]);
    const [models, setModels] = useState<Model[]>([]);

    const [brandId, setBrandId] = useState('');
    const [modelId, setModelId] = useState('');

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await api.get('/api/client/models');
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
        const urlBrandId = params.get('brandId') || '';
        const urlModelId = params.get('modelId') || '';

        setBrandId(urlBrandId);
        setModelId(urlModelId);
    }, [location.search]);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (brandId) params.append('brandId', brandId);
        if (modelId) params.append('modelId', modelId);
        navigate(`/portfolio?${params.toString()}`);
    };

    const handleReset = () => {
        setBrandId('');
        setModelId('');
        navigate('/portfolio');
    };

    return (
        <Box
            sx={{
                mb: 3,
                p: 3,
                borderRadius: 2,
                border: '1px solid #eab62f',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                alignItems: { xs: 'stretch', sm: 'flex-end' },
            }}
        >
            <FormControl
                fullWidth
                sx={{
                    maxWidth: 280,
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
                }}
            >
                <InputLabel>Марка</InputLabel>
                <Select
                    value={brandId}
                    label="Марка"
                    onChange={e => {
                        setBrandId(e.target.value);
                        setModelId('');
                    }}
                    renderValue={selected => {
                        if (!selected) return '';
                        const brand = brands.find(b => b._id === selected);
                        if (!brand) return '';
                        return (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <BrandIcon logoUrl={brand.logoUrl} size={24} />
                                {brand.name}
                            </Box>
                        );
                    }}
                >
                    {brands.map(b => (
                        <MenuItem key={b._id} value={b._id}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <BrandIcon logoUrl={b.logoUrl} size={24} />
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
                    maxWidth: 280,
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
                }}
            >
                <InputLabel>Модель</InputLabel>
                <Select
                    value={modelId}
                    label="Модель"
                    onChange={e => setModelId(e.target.value)}
                >
                    {models.map(m => (
                        <MenuItem key={m._id} value={m._id}>
                            {m.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    flex: 1,
                    alignItems: 'stretch',
                }}
            >
                <Button
                    variant="contained"
                    sx={{
                        flex: 1,
                        height: '56px',
                        backgroundColor: '#eab62f',
                        color: '#000',
                        '&:hover': { backgroundColor: '#d9a727' },
                    }}
                    disabled={!brandId || !modelId}
                    onClick={handleSearch}
                >
                    Показать работы
                </Button>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleReset}
                    disabled={!brandId && !modelId}
                    sx={{
                        height: '56px',
                    }}
                >
                    Сбросить
                </Button>
            </Box>
        </Box>
    );
};

export default PortfolioFilterByBrand;
