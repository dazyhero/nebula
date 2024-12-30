import { doublePrecision, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const downloads = pgTable('downloads', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  size: doublePrecision('size').notNull(),
  mimeType: text('mime_type').notNull(),
  name: text('name').notNull(),
  webContentLink: text('web_content_link').notNull(),
  webViewLink: text('web_view_link').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
