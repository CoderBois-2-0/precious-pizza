CREATE TABLE "favourites" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"pizza_id" varchar(36) NOT NULL
);
