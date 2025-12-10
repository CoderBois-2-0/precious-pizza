// import { getDB, TDB } from "..";
// import { eq, and } from "drizzle-orm";
// import { basketItemTable } from "../basketItem/schema";
// import { pizzaTable } from "../pizza/schema";
// import { IBasketItemInsert, IBasketItemQuery } from "../basketItem/types";
// import { IFullBasket } from "./types";
// import { basketTable } from "./schema";

// class BasketHandler {
//   #client: TDB;

//   constructor(dbUrl: string) {
//     const db = getDB(dbUrl);
//     this.#client = db;
//   }

//   // Create the basket
//   async createBasket(): Promise<string> {

//     const rows = await this.#client.insert(basketTable).values({
//       totalPrice: "0.00",
//     }).returning({id: basketTable.id});

//     return rows.at(0)!.id // add if !rows.at(0) --> error
//   }

//   // Add one pizza to basket
//   async addPizzaToBasket(input: IBasketItemInsert) {
//     const { basketID, pizzaID, quantity, price } = input;

//     await this.#client.insert(basketItemTable).values({
//       basketID,
//       pizzaID,
//       quantity,
//       price,
//     });
//   }

//   async removePizzaFromBasket(basketID: string, pizzaInBasketID: number) {
//     await this.#client.delete(basketItemTable).where(and(eq(basketItemTable.id, pizzaInBasketID), eq(basketItemTable.basketID, basketID)));
//   }

//   // get basket items with pizza info
//   async getBasketItems(basketID: string): Promise<IBasketItemQuery[]> {
//     const rows = await this.#client
//       .select({
//         id: basketItemTable.id,
//         pizzaID: basketItemTable.pizzaID,
//         name: pizzaTable.name,
//         quantity: basketItemTable.quantity,
//         price: basketItemTable.price,
//       })
//       .from(basketItemTable)
//       .leftJoin(pizzaTable, eq(basketItemTable.pizzaID, pizzaTable.id))
//       .where(eq(basketItemTable.basketID, basketID));

//     return rows.map((row) => ({
//       id: row.id,
//       pizzaID: row.pizzaID,
//       name: row.name ?? "Unknown Pizza",
//       quantity: row.quantity,
//       price: Number(row.price),
//     }));
//   }

//   // get full basket with total price
//   async getFullBasket(basketID: string): Promise<IFullBasket> {
//     // Load basket metadata
//     const [basketMeta] = await this.#client.select({ createdAt: basketTable.createdAt }).from(basketTable).where(eq(basketTable.id, basketID));

//     if (!basketMeta) {
//       throw new Error("Basket not found");
//     }

//     // Load items with pizza info
//     const items = await this.getBasketItems(basketID);

//     //  Calculate total price dynamically
//     const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

//     return {
//       id: basketID,
//       totalPrice: totalPrice.toFixed(2),
//       createdAt: basketMeta.createdAt,
//       items,
//     };
//   }
// }
// //   async getBasketItems(basketID: string): Promise<IBasketItemQuery[]> {
// //     const rows = await this.#client
// //       .select({
// //         id: basketItemTable.id,
// //         pizzaID: basketItemTable.pizzaID,
// //         name: pizzaTable.name,
// //         quantity: basketItemTable.quantity,
// //         price: basketItemTable.price,
// //       })
// //       .from(basketItemTable)
// //       .leftJoin(pizzaTable, eq(basketItemTable.pizzaID, pizzaTable.id))
// //       .where(eq(basketItemTable.basketID, basketID));

// //     return rows.map((row) => ({
// //       id: row.id,
// //       pizzaID: row.pizzaID,
// //       name: row.name ?? "Unknown Pizza",
// //       quantity: row.quantity,
// //       price: Number(row.price),
// //     }));
// //   }

// //   async getFullBasket(basketID: string): Promise<IfullBasket> {
// //     // 0. Load basket meta (createdAt is required by IfullBasket)
// //     const [basketMeta] = await this.#client.select({ createdAt: basketTable.createdAt }).from(basketTable).where(eq(basketTable.id, basketID));

// //     if (!basketMeta) {
// //       throw new Error("Basket not found");
// //     }

// //     // 1. Load all items with pizza names
// //     const rows = await this.#client
// //       .select({
// //         id: basketItemTable.id,
// //         pizzaID: basketItemTable.pizzaID,
// //         name: pizzaTable.name,
// //         quantity: basketItemTable.quantity,
// //         price: basketItemTable.price,
// //       })
// //       .from(basketItemTable)
// //       .leftJoin(pizzaTable, eq(basketItemTable.pizzaID, pizzaTable.id))
// //       .where(eq(basketItemTable.basketID, basketID));

// //     // 2. Convert output
// //     const items: IBasketItemQuery[] = rows.map((row) => ({
// //       id: row.id,
// //       pizzaID: row.pizzaID,
// //       name: row.name ?? "Unknown Pizza",
// //       quantity: row.quantity,
// //       price: Number(row.price),
// //     }));

// //     // 3. Calculate total price
// //     const totalPrice = items.reduce((sum, item) => {
// //       return sum + item.price * item.quantity;
// //     }, 0);

// //     // 4. Return nicely formatted
// //     return {
// //       id: basketID,
// //       totalPrice: String(totalPrice),
// //       createdAt: basketMeta.createdAt,
// //       items,
// //     };
// //   }
// // }

// export { BasketHandler };
