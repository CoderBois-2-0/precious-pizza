import { createFileRoute } from '@tanstack/react-router';
import type { IAPIPizza } from '@/apiClients/pizzaClient';
import type { IAPICategory } from '@/apiClients/categoryClient';
import { usePizzas } from '@/dataHooks/pizzaData';
import { useCategories } from '@/dataHooks/categoryData';
import { useCreateFavourite } from '@/dataHooks/favouriteData';

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
  const createPizzaMutation = useCreateFavourite();

  const createPizza = (pizzaID: string) => {
    createPizzaMutation.mutate({ pizzaID });
  };

  return (
    <div className="card w-100">
      <div className="card-body">
        <div className="d-flex column-gap-2">
          <h5 className="card-title">{pizza.name}</h5>
        </div>

        <p>{pizza.description}</p>

        <div className="d-flex justify-content-end column-gap-2 align-items-end">
          <button
            onClick={() => createPizza(pizza.id)}
            className="btn btn-secondary"
          >
            Add to favourites
          </button>
        </div>
      </div>
    </div>
  );
};
