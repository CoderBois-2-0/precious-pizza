CREATE TABLE "categories" (
	"id" uuid NOT NULL,
	"name" varchar(40) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pizzas" (
	"id" uuid NOT NULL,
	"name" varchar(40) NOT NULL,
	"description" varchar(200) NOT NULL,
	"price" real NOT NULL,
	"category_id" uuid NOT NULL
);
