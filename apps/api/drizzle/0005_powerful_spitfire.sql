CREATE TABLE "basket_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"pizza_id" integer NOT NULL,
	"basket_id" varchar(36) NOT NULL,
	"quantity" integer NOT NULL,
	"price" numeric(6, 2) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "baskets" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "pizza_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "baskets" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "quantity" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "basket_items" ADD CONSTRAINT "basket_items_pizza_id_pizzas_id_fk" FOREIGN KEY ("pizza_id") REFERENCES "public"."pizzas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "basket_items" ADD CONSTRAINT "basket_items_basket_id_baskets_id_fk" FOREIGN KEY ("basket_id") REFERENCES "public"."baskets"("id") ON DELETE cascade ON UPDATE no action;