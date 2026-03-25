import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeAppProvider } from './theme';

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <ThemeAppProvider>{children}</ThemeAppProvider>
    </Provider>
  );
};

