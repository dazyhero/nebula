ALTER TABLE "downloads" ADD COLUMN "mime_type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "downloads" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "downloads" ADD COLUMN "web_content_link" text NOT NULL;--> statement-breakpoint
ALTER TABLE "downloads" ADD COLUMN "web_view_link" text NOT NULL;