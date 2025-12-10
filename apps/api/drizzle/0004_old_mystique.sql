CREATE TYPE "public"."pizza_categories" AS ENUM('Italian', 'Mexican', 'Special', 'Folded');--> statement-breakpoint
CREATE TYPE "public"."delivery_option" AS ENUM('Pickup', 'Delivery');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('Pending', 'Cancelled', 'Successful');--> statement-breakpoint
CREATE TABLE "baskets" (
	"id" uuid PRIMARY KEY NOT NULL,
	"total_price" numeric(6, 2),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "basket_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"pizza_id" uuid NOT NULL,
	"basket_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"price" numeric(6, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "favourites" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"pizza_id" varchar(36) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"basket_id" uuid NOT NULL,
	"total_price" numeric(8, 2) NOT NULL,
	"delivery_option" "delivery_option" NOT NULL,
	"street" varchar(100),
	"number" varchar(20),
	"postal_code" varchar(20),
	"town" varchar(50),
	"door_floor" varchar(50),
	"customer_note" varchar(500),
	"status" "order_status" DEFAULT 'Pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" varchar(36) NOT NULL,
	"pizza_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"price" numeric(6, 2) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pizzas" RENAME COLUMN "is_draft" TO "is_visible";--> statement-breakpoint
ALTER TABLE "pizzas" ALTER COLUMN "name" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "pizzas" ALTER COLUMN "description" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "pizzas" ALTER COLUMN "price" SET DATA TYPE numeric(6, 2);--> statement-breakpoint
ALTER TABLE "pizzas" ADD COLUMN "image_url" varchar(200);--> statement-breakpoint
ALTER TABLE "basket_items" ADD CONSTRAINT "basket_items_pizza_id_pizzas_id_fk" FOREIGN KEY ("pizza_id") REFERENCES "public"."pizzas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "basket_items" ADD CONSTRAINT "basket_items_basket_id_baskets_id_fk" FOREIGN KEY ("basket_id") REFERENCES "public"."baskets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_basket_id_baskets_id_fk" FOREIGN KEY ("basket_id") REFERENCES "public"."baskets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_pizza_id_pizzas_id_fk" FOREIGN KEY ("pizza_id") REFERENCES "public"."pizzas"("id") ON DELETE cascade ON UPDATE no action;