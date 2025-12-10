import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface BasketContextType {
  isBasketOpen: boolean;
  openBasket: () => void;
  closeBasket: () => void;
  toggleBasket: () => void;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export function BasketProvider({ children }: { children: ReactNode }) {
  const [isBasketOpen, setIsBasketOpen] = useState(false);

  const openBasket = () => setIsBasketOpen(true);
  const closeBasket = () => setIsBasketOpen(false);
  const toggleBasket = () => setIsBasketOpen((prev) => !prev);

  return (
    <BasketContext.Provider
      value={{ isBasketOpen, openBasket, closeBasket, toggleBasket }}
    >
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket() {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error('useBasket must be used within BasketProvider');
  }
  return context;
}
