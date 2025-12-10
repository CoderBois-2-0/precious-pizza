interface IAPIFavourite {
  id: string;
  userID: string;
  pizzaID: string;
  pizza: {
    name: string;
  };
}

type IAPIFavouritePost = Pick<IAPIFavourite, 'pizzaID'>;

class FavouriteClient {
  readonly #url = `${import.meta.env.VITE_API_URL}/favourite`;

  async getAll(): Promise<Array<IAPIFavourite>> {
    const res = await fetch(`${this.#url}`, {
      credentials: 'include',
    });

    if (res.status !== 200) {
      throw new Error('could not fetch categories');
    }

    const favourites = await res.json();

    return favourites;
  }

  async create(newFavourite: IAPIFavouritePost): Promise<void> {
    const res = await fetch(`${this.#url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(newFavourite),
    });

    if (res.status !== 201) {
      throw new Error('could not create favourite');
    }
  }

  async delete(favouriteID: IAPIFavourite['id']): Promise<void> {
    const res = await fetch(`${this.#url}/${favouriteID}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (res.status !== 200) {
      throw new Error('could not delete favourite');
    }
  }
}

export default FavouriteClient;
export type { IAPIFavourite };
