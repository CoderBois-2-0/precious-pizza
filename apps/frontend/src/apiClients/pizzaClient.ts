interface IAPIPizza {
  id: string;
  name: string;
  description: string;
  price: number;
  isDraft: boolean;
  categoryID: string;
}

interface IAPIPizzaPost {
  name: string;
  description: string;
  price: number;
  isDraft: boolean;
  categoryID: string;
}

type TAPIPizzaPut = IAPIPizzaPost;

class PizzaClient {
  readonly #url = `${import.meta.env.VITE_API_URL}/pizza`;

  async getAll(categoryID: string): Promise<Array<IAPIPizza>> {
    const res = await fetch(`${this.#url}?categoryID=${categoryID}`, {
      credentials: 'include',
    });

    if (res.status !== 200) {
      throw new Error('could not fetch pizzas');
    }

    const pizzas = await res.json();

    return pizzas;
  }

  async create(newPizza: IAPIPizzaPost): Promise<void> {
    const res = await fetch(`${this.#url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(newPizza),
    });

    if (res.status !== 201) {
      throw new Error('could not fetch pizzas');
    }
  }

  async update(updatePizza: TAPIPizzaPut): Promise<void> {
    const res = await fetch(`${this.#url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updatePizza),
    });

    if (res.status !== 200) {
      throw new Error('could not fetch pizzas');
    }
  }

  async delete(pizzaID: IAPIPizza['id']): Promise<void> {
    const res = await fetch(`${this.#url}/${pizzaID}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status !== 201) {
      throw new Error('could not fetch pizzas');
    }
  }
}

export default PizzaClient;
export type { IAPIPizza, IAPIPizzaPost };
