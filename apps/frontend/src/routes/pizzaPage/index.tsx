import { createFileRoute } from '@tanstack/react-router';
import type { IAPIPizza } from '@/apiClients/pizzaClient';
import type { IAPICategory } from '@/apiClients/categoryClient';
import { usePizzas } from '@/dataHooks/pizzaData';
import { useCategories } from '@/dataHooks/categoryData';
import { useCreateFavourite } from '@/dataHooks/favouriteData';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useBasket } from '@/services/basketService';

const BASKET_STORAGE_KEY = 'basketId';

export const Route = createFileRoute('/pizzaPage/')({
  component: RouteComponent,
});

function RouteComponent() {
  const categories = useCategories();

  return (
    <div className="container">
      {categories.isSuccess &&
        categories.data.map((category) => (
          <Category key={category.id} category={category}></Category>
        ))}
    </div>
  );
}

interface ICategoryProps {
  category: IAPICategory;
}

const Category = ({ category }: ICategoryProps) => {
  const pizzas = usePizzas(category.id);

  return (
    <div>
      <h1>{category.name}</h1>
      <hr></hr>

      <div className="d-flex flex-column row-gap-2">
        {pizzas.isSuccess &&
          pizzas.data.map((pizza) => (
            <Pizza key={pizza.id} pizza={pizza}></Pizza>
          ))}
      </div>
    </div>
  );
};

interface IPizzaProps {
  pizza: IAPIPizza;
}

const Pizza = ({ pizza }: IPizzaProps) => {
  const createFavouriteMutation = useCreateFavourite();
  const { openBasket } = useBasket();
  const [quantity, setQuantity] = useState(1);
  const queryClient = useQueryClient();
  const [basketId, setBasketId] = useState<string | null>(() =>
    localStorage.getItem(BASKET_STORAGE_KEY),
  );

  // Sync basketId with localStorage (e.g., after checkout clears it)
  useEffect(() => {
    const storedId = localStorage.getItem(BASKET_STORAGE_KEY);
    if (storedId !== basketId) {
      setBasketId(storedId);
    }
  }, [basketId]);

  const addToBasketMutation = useMutation({
    mutationFn: async (input: {
      pizzaID: string;
      quantity: number;
      price: number;
    }) => {
      let currentBasketId = basketId;

      // Create basket if it doesn't exist
      if (!currentBasketId) {
        const res = await fetch('/api/basket', { method: 'POST' });
        if (!res.ok) throw new Error('Failed to create basket');
        const data = (await res.json()) as { id: string };
        currentBasketId = data.id;
        setBasketId(currentBasketId);
        localStorage.setItem(BASKET_STORAGE_KEY, currentBasketId);
      }

      // Add item to basket
      const res = await fetch(`/api/basket/${currentBasketId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error('Failed to add item');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['basket', basketId] });
      openBasket(); // Open the basket sidebar
    },
  });

  const addToFavourites = () => {
    createFavouriteMutation.mutate({ pizzaID: pizza.id });
  };

  const addToBasket = () => {
    addToBasketMutation.mutate({
      pizzaID: pizza.id,
      quantity: quantity,
      price:
        typeof pizza.price === 'string' ? parseFloat(pizza.price) : pizza.price,
    });
  };

  const displayPrice =
    typeof pizza.price === 'string' ? parseFloat(pizza.price) : pizza.price;

  return (
    <div className="card w-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="card-title">{pizza.name}</h5>
            <p className="card-text">{pizza.description}</p>
          </div>
          <div className="text-end">
            <h5 className="text-primary">${displayPrice.toFixed(2)}</h5>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="d-flex align-items-center gap-2">
            <label htmlFor={`quantity-${pizza.id}`} className="form-label mb-0">
              Quantity:
            </label>
            <input
              id={`quantity-${pizza.id}`}
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="form-control"
              style={{ width: '70px' }}
            />
          </div>
          <div className="d-flex gap-2">
            <button
              onClick={addToFavourites}
              className="btn btn-outline-secondary"
              disabled={createFavouriteMutation.isPending}
            >
              ♥ Favourite
            </button>
            <button
              onClick={addToBasket}
              className="btn btn-primary"
              disabled={addToBasketMutation.isPending}
            >
              🛒 Add to Basket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
