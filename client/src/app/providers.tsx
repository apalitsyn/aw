import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeAppProvider } from './theme';
import { HelmetProvider } from 'react-helmet-async';

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <ThemeAppProvider>{children}</ThemeAppProvider>
      </HelmetProvider>
    </Provider>
  );
};

