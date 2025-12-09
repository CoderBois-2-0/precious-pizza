interface IAPICategory {
  id: string;
  name: string;
}

interface IAPICategoryPost {
  name: string;
}

type TAPICategoryPut = Partial<IAPICategoryPost>;

class CategoryClient {
  readonly #url = `${import.meta.env.VITE_API_URL}/category`;

  async getAll(): Promise<Array<IAPICategory>> {
    const res = await fetch(`${this.#url}`, {
      credentials: 'include',
    });

    if (res.status !== 200) {
      throw new Error('could not fetch categories');
    }

    const categories = await res.json();

    return categories;
  }

  async create(newCategory: IAPICategoryPost): Promise<void> {
    const res = await fetch(`${this.#url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(newCategory),
    });

    if (res.status !== 201) {
      throw new Error('could not fetch categories');
    }
  }

  async update(
    categoryID: IAPICategory['id'],
    categoryUpdate: TAPICategoryPut,
  ): Promise<void> {
    const res = await fetch(`${this.#url}/${categoryID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(categoryUpdate),
    });

    if (res.status !== 200) {
      throw new Error('could not fetch categories');
    }
  }

  async delete(categoryID: IAPICategory['id']): Promise<void> {
    const res = await fetch(`${this.#url}/${categoryID}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (res.status !== 200) {
      throw new Error('could not fetch categories');
    }
  }
}

export default CategoryClient;
export { IAPICategory };
