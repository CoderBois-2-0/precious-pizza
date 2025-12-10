import { createFileRoute } from '@tanstack/react-router';
import type { IAPIPizza } from '@/apiClients/pizzaClient';
import { usePizzas } from '@/dataHooks/pizzaData';
import { useCategories } from '@/dataHooks/categoryData';

export const Route = createFileRoute('/pizzaPage/')({
  component: RouteComponent,
});

function RouteComponent() {
  const categories = useCategories();

  return <div>Hello "/pizzaPage/"!</div>;
}

interface ICategoryProps {
  categoryID: string;
}

const Category = ({ categoryID }: ICategoryProps) => {
  const pizzas = usePizzas(categoryID);

  return;
};

interface IPizzaProps {
  pizza: IAPIPizza;
}

const Pizza = ({ pizza }: IPizzaProps) => {
  return (
    <div className="card w-100">
      <div className="card-body">
        <div className="d-flex column-gap-2">
          <h5 className="card-title">{pizza.name}</h5>
        </div>

        <p>{pizza.description}</p>

        <div className="d-flex justify-content-between column-gap-2 align-items-end">
          <button className="btn btn-accent">Add to favourites</button>
        </div>
      </div>
    </div>
  );
};
