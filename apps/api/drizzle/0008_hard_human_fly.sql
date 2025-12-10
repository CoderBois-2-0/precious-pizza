CREATE TABLE "favourites" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"pizza_id" uuid NOT NULL
);
