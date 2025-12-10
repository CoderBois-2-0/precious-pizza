import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';

const BASKET_STORAGE_KEY = 'basketId';

interface BasketItem {
  id: number;
  pizzaID: string;
  name: string;
  quantity: number;
  price: number | string;
}

interface BasketResponse {
  id: string;
  items: BasketItem[];
  createdAt: string;
}

export const Route = createFileRoute('/checkoutPage/')({
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [basketId] = useState<string | null>(() =>
    localStorage.getItem(BASKET_STORAGE_KEY),
  );
  const [delivery, setDelivery] = useState<'Pickup' | 'Delivery'>('Pickup');
  const [customerNote, setCustomerNote] = useState('');
  const [address, setAddress] = useState({
    street: '',
    number: '',
    postalCode: '',
    town: '',
    doorFloor: '',
  });
  const [error, setError] = useState<string | null>(null);

  const basketQuery = useQuery<BasketResponse>({
    queryKey: ['basket', basketId],
    enabled: Boolean(basketId),
    queryFn: async () => {
      const res = await fetch(`/api/basket/full/${basketId}`);
      if (!res.ok) throw new Error('Failed to load basket');
      return res.json();
    },
  });

  const totalPrice = useMemo(() => {
    const items = basketQuery.data?.items ?? [];
    return items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );
  }, [basketQuery.data]);

  const createOrder = useMutation({
    mutationFn: async () => {
      if (!basketId) throw new Error('No basket');

      if (customerNote.length > 500) {
        throw new Error('Comment must be 500 characters or less');
      }
      if (/[<>]/.test(customerNote)) {
        throw new Error('Comment cannot contain < or >');
      }

      const payload: Record<string, unknown> = {
        basketID: basketId,
        delivery,
        customerNote: customerNote.trim() || undefined,
      };

      if (delivery === 'Delivery') {
        payload.deliveryAddress = {
          street: address.street,
          number: address.number,
          postalCode: address.postalCode,
          town: address.town,
          doorFloor: address.doorFloor || undefined,
        };
      }

      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Could not place order');
      }

      return res.json() as Promise<{ id: string }>; // order id
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      navigate({ to: '/pizzaPage' });
    },
    onError: (err: unknown) => {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Could not place order');
      }
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    createOrder.mutate();
  };

  if (!basketId) {
    return (
      <div className="container mt-4">No basket found. Add pizzas first.</div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-3">Checkout</h1>

      {basketQuery.isLoading && <p>Loading basket...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {basketQuery.data && (
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Order Details</h5>
                <div className="mb-3">
                  <label className="form-label">Delivery Option</label>
                  <select
                    className="form-select"
                    value={delivery}
                    onChange={(e) =>
                      setDelivery(e.target.value as 'Pickup' | 'Delivery')
                    }
                  >
                    <option value="Pickup">Pickup</option>
                    <option value="Delivery">Delivery</option>
                  </select>
                </div>

                {delivery === 'Delivery' && (
                  <div className="d-flex flex-column gap-2">
                    <input
                      className="form-control"
                      placeholder="Street"
                      value={address.street}
                      onChange={(e) =>
                        setAddress({ ...address, street: e.target.value })
                      }
                      required
                    />
                    <input
                      className="form-control"
                      placeholder="Number"
                      value={address.number}
                      onChange={(e) =>
                        setAddress({ ...address, number: e.target.value })
                      }
                      required
                    />
                    <input
                      className="form-control"
                      placeholder="Postal code"
                      value={address.postalCode}
                      onChange={(e) =>
                        setAddress({ ...address, postalCode: e.target.value })
                      }
                      required
                    />
                    <input
                      className="form-control"
                      placeholder="Town"
                      value={address.town}
                      onChange={(e) =>
                        setAddress({ ...address, town: e.target.value })
                      }
                      required
                    />
                    <input
                      className="form-control"
                      placeholder="Door/Floor (optional)"
                      value={address.doorFloor}
                      onChange={(e) =>
                        setAddress({ ...address, doorFloor: e.target.value })
                      }
                    />
                  </div>
                )}

                <div className="mt-3">
                  <label className="form-label">
                    Comment (optional, max 500)
                  </label>
                  <textarea
                    className="form-control"
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    maxLength={500}
                  />
                  <small className="text-muted">No &lt; or &gt; allowed.</small>
                </div>

                <button
                  className="btn btn-primary mt-3"
                  onClick={onSubmit}
                  disabled={createOrder.isPending}
                >
                  {createOrder.isPending ? 'Placing order…' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Basket Summary</h5>
                <ul className="list-group list-group-flush">
                  {basketQuery.data.items.map((item) => {
                    const price = Number(item.price);
                    return (
                      <li
                        key={item.id}
                        className="list-group-item d-flex justify-content-between"
                      >
                        <div>
                          <strong>{item.name}</strong>
                          <div className="small text-muted">
                            Qty {item.quantity}
                          </div>
                        </div>
                        <div>${(price * item.quantity).toFixed(2)}</div>
                      </li>
                    );
                  })}
                </ul>
                <div className="d-flex justify-content-between mt-3">
                  <strong>Total</strong>
                  <strong>${totalPrice.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
