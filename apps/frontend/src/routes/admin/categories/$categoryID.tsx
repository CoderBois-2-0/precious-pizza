import { Link, createFileRoute } from '@tanstack/react-router';
import { Eye, EyeOff } from 'lucide-react';
import type { IAPIPizza } from '@/apiClients/pizzaClient';
import { useDeletePizza, usePizzas } from '@/dataHooks/pizzaData';

export const Route = createFileRoute('/admin/categories/$categoryID')({
  component: RouteComponent,
});

function RouteComponent() {
  const { categoryID } = Route.useParams();
  const pizzaQuery = usePizzas(categoryID);

  return (
    <div className="container">
      <Link to="/admin/pizzas/create" search={{ categoryID }}>
        Create Pizza
      </Link>

      {pizzaQuery.isSuccess && (
        <div className="d-flex flex-column row-gap-2">
          {pizzaQuery.data.map((pizza) => (
            <PizzaCard pizza={pizza}></PizzaCard>
          ))}
        </div>
      )}
    </div>
  );
}

interface IPizzaCardProps {
  pizza: IAPIPizza;
}

const PizzaCard = ({ pizza }: IPizzaCardProps) => {
  const pizzaDelete = useDeletePizza();

  function deletePizza() {
    pizzaDelete.mutate(pizza.id);
  }

  return (
    <div className="card w-100">
      <div className="card-body">
        <div className="d-flex column-gap-2">
          <h5 className="card-title">{pizza.name}</h5>

          {pizza.isDraft ? (
            <EyeOff color="#e01b24"></EyeOff>
          ) : (
            <Eye color="#33d17a"></Eye>
          )}
        </div>

        <p>{pizza.description}</p>

        <div className="d-flex justify-content-between column-gap-2 align-items-end">
          <Link to="/admin/pizzas/$pizzaID" params={{ pizzaID: pizza.id }}>
            Edit
          </Link>

          <button onClick={deletePizza} className="btn btn-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
