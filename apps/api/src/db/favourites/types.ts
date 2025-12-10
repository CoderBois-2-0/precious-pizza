import { favouritesTable } from "./schema";

type IFavourite = typeof favouritesTable.$inferSelect;

interface IFavouriteWithPizza extends IFavourite {
  pizza: {
    name: string;
  };
}

type IFavouriteQuery = Partial<{
  id: IFavourite["id"];
  userId: IFavourite["userId"];
  pizzaId: IFavourite["pizzaId"];
}>;

type INewFavourite = typeof favouritesTable.$inferInsert;

export { IFavourite, IFavouriteWithPizza, IFavouriteQuery, INewFavourite };
