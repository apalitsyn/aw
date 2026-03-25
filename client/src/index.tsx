import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProviders } from './app/providers';
import { router } from './app/router';
import { RouterProvider } from 'react-router-dom';
import { CartProvider } from './shared/hooks/useCart';

import '@fontsource/roboto/400.css';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>  
    <AppProviders>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AppProviders>
  </React.StrictMode>
);