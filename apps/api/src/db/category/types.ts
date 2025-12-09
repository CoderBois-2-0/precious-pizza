import { categoryTable } from "./schema";

type TCategoryTable = typeof categoryTable;

type TCategory = typeof categoryTable.$inferSelect;
type TCategoryInsert = Omit<typeof categoryTable.$inferInsert, "id">;

type OmitCategoryID = Omit<TCategory, "id">;
type TCategoryUpdate = Partial<OmitCategoryID>;

export { TCategoryTable, TCategory, TCategoryInsert, TCategoryUpdate };
