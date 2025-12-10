import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import type { FormEventHandler } from 'react';
import { useCategories } from '@/dataHooks/categoryData';
import { useCreatePizza } from '@/dataHooks/pizzaData';

interface ICreatePizzaSearchParams {
  categoryID?: string;
}

export const Route = createFileRoute('/admin/pizzas/create')({
  component: RouteComponent,
  validateSearch: (search): ICreatePizzaSearchParams => {
    return {
      categoryID: search.categoryName as ICreatePizzaSearchParams['categoryID'],
    };
  },
});

function RouteComponent() {
  return (
    <div className="container">
      <PizzaForm></PizzaForm>
    </div>
  );
}

const PizzaForm = () => {
  const navigator = useNavigate();
  const categoryQuery = useCategories();
  const pizzaMutator = useCreatePizza();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [categoryID, setCategoryID] = useState('');
  const [isDraft, setIsDraft] = useState(false);

  useEffect(() => {
    const firstCategory = categoryQuery.data?.at(0);
    if (!firstCategory) {
      return;
    }

    setCategoryID(firstCategory.id);
  }, [categoryQuery.isLoading]);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    pizzaMutator.mutate(
      {
        name,
        description,
        price,
        isDraft,
        categoryID,
      },
      {
        onError: (err) => console.log(err),
        onSuccess: () =>
          navigator({
            to: '/admin/categories/$categoryID',
            params: { categoryID: categoryID },
          }),
      },
    );
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5>Create pizza</h5>

        <form
          id="create-pizza-form"
          className="d-flex flex-column row-gap-2"
          onSubmit={submit}
        >
          <div className="input-group">
            <span className="input-group-text">Name</span>
            <input
              id="name"
              type="text"
              className="form-control"
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="input-group">
            <span className="input-group-text">Description</span>
            <textarea
              id="descripton"
              className="form-control"
              onChange={(event) => setDescription(event.target.value)}
            ></textarea>
          </div>

          <div className="input-group">
            <span className="input-group-text">Price</span>
            <input
              id="price"
              type="number"
              step="0.1"
              min="0"
              value={price}
              className="form-control"
              onChange={(event) => setPrice(Number(event.target.value))}
            />
          </div>

          <h6>Category</h6>
          {categoryQuery.isLoading && <p>Loading Categories</p>}
          {categoryQuery.isSuccess && (
            <select
              className="form-select"
              aria-label="Select category"
              onChange={(event) => setCategoryID(event.target.value)}
            >
              {categoryQuery.data.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}

          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id="checkDefault"
              defaultChecked={isDraft}
              onChange={(event) => setIsDraft(event.target.checked)}
            />

            <label className="form-check-label" htmlFor="checkDefault">
              Is draft?
            </label>
          </div>
        </form>

        <div className="d-flex justify-content-end">
          <button
            form="create-pizza-form"
            type="submit"
            className="btn btn-primary"
          >
            Create Pizza
          </button>
        </div>
      </div>
    </div>
  );
};
