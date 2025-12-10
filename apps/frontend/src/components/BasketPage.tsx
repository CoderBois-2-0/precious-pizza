import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
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
  items: BasketItem[];
};

const BASKET_STORAGE_KEY = 'basketId';

export default function BasketPage() {
  const { isBasketOpen, closeBasket } = useBasket();
  const [basketId, setBasketId] = useState<string | null>(() =>
    localStorage.getItem(BASKET_STORAGE_KEY),
  );
  const [form, setForm] = useState({ pizzaID: '', quantity: 1, price: 0 });
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

  const addItemMutation = useMutation({
    mutationFn: async (input: {
      pizzaID: string;
      quantity: number;
      price: number;
    }) => {
      if (!basketId) throw new Error('No basket');
      const res = await fetch(`/api/basket/${basketId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error('Failed to add item');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['basket', basketId] });
      setForm({ pizzaID: '', quantity: 1, price: 0 });
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
    if (!basketId) {
      createBasketMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const basket = basketQuery.data;
  const isLoading = basketQuery.isLoading || createBasketMutation.isPending;

  const hasItems = useMemo(() => (basket?.items?.length ?? 0) > 0, [basket]);

  if (isLoading) return <div>Loading...</div>;
  if (!basketId || !basket) return <div>Could not load basket.</div>;

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

      <div className="mb-3">
        <small className="text-secondary">Basket ID: {basketId}</small>
      </div>

      <form
        className="mb-3 d-flex flex-column gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          addItemMutation.mutate({
            pizzaID: form.pizzaID,
            quantity: Number(form.quantity),
            price: Number(form.price),
          });
        }}
      >
        <input
          className="form-control"
          placeholder="Pizza ID (uuid)"
          value={form.pizzaID}
          onChange={(e) => setForm((f) => ({ ...f, pizzaID: e.target.value }))}
          required
        />
        <input
          className="form-control"
          type="number"
          min={1}
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) =>
            setForm((f) => ({ ...f, quantity: Number(e.target.value) }))
          }
          required
        />
        <input
          className="form-control"
          type="number"
          step="0.01"
          min={0}
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm((f) => ({ ...f, price: Number(e.target.value) }))
          }
          required
        />
        <button
          className="btn btn-light text-black"
          type="submit"
          disabled={addItemMutation.isPending}
        >
          {addItemMutation.isPending ? 'Adding…' : 'Add item'}
        </button>
      </form>

      <div className="flex-grow-1 overflow-auto">
        {!hasItems ? (
          <p>Your basket is empty.</p>
        ) : (
          basket.items.map((item) => (
            <div
              key={item.id}
              className="d-flex justify-content-between align-items-center mb-2 p-2 bg-secondary rounded"
            >
              <div>
                <strong>{item.name}</strong>
                <div>Qty: {item.quantity}</div>
                <div>Price: {item.price} DKK</div>
              </div>
              <button
                className="btn btn-danger"
                onClick={() => removeItemMutation.mutate(item.id)}
                disabled={removeItemMutation.isPending}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      <div className="border-top border-secondary pt-2 mt-3">
        <h4>Total: {basket.totalPrice} DKK</h4>
        <Link to="/pizzaPage" className="btn btn-light w-100 mt-2 text-black">
          <ShoppingBasket /> Checkout
        </Link>
      </div>
    </div>
  );
}
