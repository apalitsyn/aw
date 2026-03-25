import { createBrowserRouter } from 'react-router-dom';
import Layout from '../widgets/layout/Layout';
import HomePage from '../pages/Home/HomePage';
import CartPage from '../pages/Cart/CartPage';
import NotFoundPage from '../pages/NotFound/NotFoundPage';
import AboutPage from '../pages/About/AboutPage';
import WheelCatalogPage from '../pages/WheelCatalogPage/WheelCatalogPage';
import ContactPage from '../pages/ContactPage/ContactPage';
import TyreCatalogPage from '../pages/TyreCatalogPage/TyreCatalogPage';
import CheckoutPage from '../pages/CheckoutPage/CheckoutPage';
import OrderSuccessPage from '../pages/OrderSuccessPage/OrderSuccessPage';
import PortfolioPage from '../pages/Portfolio/PortfolioPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'catalog/wheels', element: <WheelCatalogPage /> },
      { path: 'catalog/tyres', element: <TyreCatalogPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: '*', element: <NotFoundPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/contacts', element: <ContactPage /> },
      { path: 'catalog/wheels/:id', element: <WheelCatalogPage /> },
      { path: 'catalog/tyres/:id', element: <TyreCatalogPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: '/order-success', element: <OrderSuccessPage /> },
      { path: '/portfolio', element: <PortfolioPage /> },
      { path: '/portfolio/:id', element: <PortfolioPage /> },
      { path: 'catalog/wheels/:kind/:id', element: <WheelCatalogPage /> },
    ],
  },
]);
