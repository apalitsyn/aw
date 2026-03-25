import { Container, Toolbar } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import FloatingActions from '../../features/floatingActions/FloatingActions';
import { OrganizationJsonLd } from '../../app/seo/OrganizationJsonLd';

const Layout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <OrganizationJsonLd />
      <Header />

      <Toolbar />

      <main style={{ flexGrow: 1 }}>
        <Container maxWidth="xl">
          <Outlet />
          <FloatingActions />
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;

