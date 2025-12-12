import { createContext, useContext, useState, useMemo } from 'react';
import type { ReactNode } from 'react';

interface BasketContextType {
  isBasketOpen: boolean;
  openBasket: () => void;
  closeBasket: () => void;
  toggleBasket: () => void;
}

interface BasketProviderProps {
  readonly children: ReactNode;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export function BasketProvider({ children }: BasketProviderProps) {
  const [isBasketOpen, setIsBasketOpen] = useState(false);

  const openBasket = () => setIsBasketOpen(true);
  const closeBasket = () => setIsBasketOpen(false);
  const toggleBasket = () => setIsBasketOpen((prev) => !prev);

  const value = useMemo(
    () => ({ isBasketOpen, openBasket, closeBasket, toggleBasket }),
    [isBasketOpen],
  );

  return (
    <BasketContext.Provider value={value}>{children}</BasketContext.Provider>
  );
}

export function useBasket() {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error('useBasket must be used within BasketProvider');
  }
  return context;
}
