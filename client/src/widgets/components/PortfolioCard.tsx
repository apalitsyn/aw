import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    useTheme,
} from '@mui/material';
import { cardSx } from './styles/cardStyle';

type CarInfo = {
    brandName?: string;
    modelName?: string;
};

const PortfolioCard = ({
    data,
    carInfo,
    onClick,
}: {
    data: any;
    carInfo?: CarInfo;
    onClick?: () => void;
}) => {
    const theme = useTheme();
    const prod = process.env.REACT_APP_PROD ? true : false;
    const baseUrl = prod ? '' : 'http://localhost:8833';

    const image = data.preview
        ? data.preview.startsWith('http')
            ? data.preview
            : `${baseUrl}/${data.preview}`
        : '/images/no_img_portfolio.png';

    const description =
        typeof data.description === 'string'
            ? data.description.length > 120
                ? `${data.description.slice(0, 120)}…`
                : data.description
            : '';

    const brandName = carInfo?.brandName || '';
    const modelName = carInfo?.modelName || '';

    return (
        <Card
            onClick={onClick}
            sx={cardSx(theme)}
        >
            <Box
                sx={{
                    backgroundColor:
                        theme.palette.mode === 'dark'
                            ? theme.palette.background.default
                            : '#f5f5f5',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 220,
                    paddingTop: 1,
                }}
            >
                <CardMedia
                    component="img"
                    image={image}
                    alt={data.title}
                    sx={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                        objectFit: 'contain',
                        objectPosition: 'center',
                    }}
                />
            </Box>

            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    {data.title}
                </Typography>

                {(brandName || modelName) && (
                    <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{ mb: 1, color: '#eab62f' }}
                    >
                        {brandName}
                        {brandName && modelName ? ' ' : ''}
                        {modelName}
                    </Typography>
                )}

                {description && (
                    <Typography variant="body2" color="text.secondary">
                        {description}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default PortfolioCard;
