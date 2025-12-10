ALTER TABLE "categories" ADD CONSTRAINT "categories_id_pk" PRIMARY KEY("id");--> statement-breakpoint
ALTER TABLE "pizzas" ADD CONSTRAINT "pizzas_id_pk" PRIMARY KEY("id");--> statement-breakpoint
ALTER TABLE "pizzas" ADD COLUMN "is_draft" boolean DEFAULT false NOT NULL;