CREATE TABLE "downloads" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_path" text NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"size" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
