import { Badge, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../../shared/hooks/useCart';
import { useNavigate } from 'react-router-dom';

export const CartButton = () => {
    const { cart } = useCart();
    const navigate = useNavigate();

    const buttonStyle = {
        color: 'text.primary',
        textTransform: 'none',
        fontWeight: 500,
        '&.active': {
            borderBottom: '2px solid #eab62f',
            borderRadius: 0,
        }
    };

    return (
        <IconButton onClick={() => navigate('/cart')} color="inherit" sx={buttonStyle}>
            <Badge badgeContent={cart.length} color="secondary">
                <ShoppingCartIcon />
            </Badge>
        </IconButton>
    );
};
