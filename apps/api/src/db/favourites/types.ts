import { favouritesTable } from "./schema";

type IFavourite = typeof favouritesTable.$inferSelect;

type IFavouriteQuery = Partial<{
  id: IFavourite["id"];
  userId: IFavourite["userId"];
  pizzaId: IFavourite["pizzaId"];
}>;

type INewFavourite = typeof favouritesTable.$inferInsert;

export { IFavourite, IFavouriteQuery, INewFavourite };
