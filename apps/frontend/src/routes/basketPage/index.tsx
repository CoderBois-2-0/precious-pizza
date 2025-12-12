import { Link, createFileRoute  } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ShoppingBasket, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useBasket } from '@/services/basketService';

type BasketItem = {
  id: number;
  pizzaID: string;
  name: string;
  quantity: number;
  price: number;
};

type BasketResponse = {
  id: string;
  totalPrice: string;
  createdAt: string;
  items: Array<BasketItem>;
};

export const Route = createFileRoute('/basketPage/')({
  component: BasketPage,
});

const BASKET_STORAGE_KEY = 'basketId';


export default function BasketPage() {
  const { isBasketOpen, closeBasket } = useBasket();
  const [basketId, setBasketId] = useState<string | null>(() =>
    localStorage.getItem(BASKET_STORAGE_KEY),
  );
  const queryClient = useQueryClient();

  const basketQuery = useQuery<BasketResponse>({
    queryKey: ['basket', basketId],
    enabled: Boolean(basketId),
    queryFn: async () => {
      const res = await fetch(`/api/basket/full/${basketId}`);
      if (!res.ok) throw new Error('Failed to fetch basket');
      return res.json();
    },
  });

  const createBasketMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/basket', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to create basket');
      return res.json() as Promise<{ id: string }>;
    },
    onSuccess: ({ id }) => {
      setBasketId(id);
      localStorage.setItem(BASKET_STORAGE_KEY, id);
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (itemID: number) => {
      if (!basketId) throw new Error('No basket');
      const res = await fetch(`/api/basket/${basketId}/items/${itemID}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to remove item');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['basket', basketId] });
    },
  });

  // Create basket on first visit if none stored
  useEffect(() => {
    if (!basketId && !createBasketMutation.isPending) {
      createBasketMutation.mutate();
    }

  }, [basketId]);

  // Sync basketId state with localStorage changes (e.g., after checkout)
  useEffect(() => {
    const syncBasket = () => {
      const storedId = localStorage.getItem(BASKET_STORAGE_KEY);
      if (storedId !== basketId) {
        setBasketId(storedId);
      }
    };

    // Listen for custom basketCleared event (same-tab)
    const handleBasketCleared = () => {
      setBasketId(null);
    };

    window.addEventListener('storage', syncBasket);
    window.addEventListener('basketCleared', handleBasketCleared);
    window.addEventListener('focus', syncBasket);

    return () => {
      window.removeEventListener('storage', syncBasket);
      window.removeEventListener('basketCleared', handleBasketCleared);
      window.removeEventListener('focus', syncBasket);
    };
  }, [basketId]);

  const basket = basketQuery.data;
  const isLoading = basketQuery.isLoading || createBasketMutation.isPending;

  const totalPrice = useMemo(() => {
    return (
      basket?.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ) || 0
    );
  }, [basket]);

  return (
    <div
      className={`position-fixed top-0 end-0 vh-100 bg-dark text-white shadow-lg d-flex flex-column p-3 ${
        isBasketOpen ? 'translate-middle-x-0' : 'translate-middle-x-100'
      }`}
      style={{
        width: '20rem',
        transition: 'transform 0.3s ease-in-out',
        transform: isBasketOpen ? 'translateX(0)' : 'translateX(100%)',
        zIndex: 1050,
      }}
    >
      <div className="d-flex justify-content-between align-items-center border-bottom border-secondary pb-2 mb-3">
        <h2 className="h5 mb-0">Your Basket</h2>
        <button
          onClick={closeBasket}
          className="btn btn-dark"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
      </div>

      {/* Basket items */}
      <div className="flex-grow-1 overflow-auto">
        {isLoading && <p className="text-center">Loading basket...</p>}

        {!basketId && !isLoading && (
          <div className="text-center text-muted">
            <ShoppingBasket size={48} className="mb-2 opacity-50" />
            <p>Your basket is empty</p>
            <p className="small">Add pizzas from the menu!</p>
          </div>
        )}

        {basketId && !isLoading && (
          <>
            {!basket || basket.items.length === 0 ? (
              <div className="text-center text-muted">
                <ShoppingBasket size={48} className="mb-2 opacity-50" />
                <p>Your basket is empty</p>
                <p className="small">Add pizzas from the menu!</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {basket.items.map((item) => (
                  <div key={item.id} className="card bg-secondary text-white">
                    <div className="card-body p-2">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="card-subtitle mb-1">{item.name}</h6>
                          <div className="d-flex justify-content-between align-items-center">
                            <small>
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                            </small>
                            <strong className="ms-2">
                              ${(item.price * item.quantity).toFixed(2)}
                            </strong>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItemMutation.mutate(item.id)}
                          className="btn btn-sm btn-danger ms-2"
                          disabled={removeItemMutation.isPending}
                          aria-label="Remove item"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Basket total and checkout */}
      {basketId && basket && basket.items.length > 0 && (
        <div className="border-top border-secondary pt-3 mt-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Total:</h5>
            <h5 className="mb-0 text-primary">${totalPrice.toFixed(2)}</h5>
          </div>
          <Link to="/checkoutPage" className="btn btn-success w-100">
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
}
