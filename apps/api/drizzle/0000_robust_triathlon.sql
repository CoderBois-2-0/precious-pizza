CREATE TYPE "public"."user_role" AS ENUM('admin', 'customer');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid NOT NULL,
	"email" varchar(254) NOT NULL,
	"first_name" varchar(40) NOT NULL,
	"last_name" varchar(80) NOT NULL,
	"password" text NOT NULL,
	"role" "user_role" NOT NULL,
	CONSTRAINT "users_id_pk" PRIMARY KEY("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
