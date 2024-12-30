import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import * as schema from '../schema/downloads';
import { downloads } from '../schema/downloads';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { inArray } from 'drizzle-orm';

export type Downloads = typeof downloads.$inferSelect;
export type DownloadsCreate = typeof downloads.$inferInsert;

@Injectable()
export class DownloadsRepository implements BaseRepository<Downloads> {
  constructor(@Inject('DRIZZLE') private readonly db: NodePgDatabase<typeof schema>) {}

  async create(data: DownloadsCreate): Promise<Downloads> {
    const [result] = await this.db.insert(downloads).values(data).returning();
    return result;
  }

  async bulkCreate(data: DownloadsCreate[]): Promise<Downloads[]> {
    const results = await this.db.insert(downloads).values(data).returning();
    return results;
  }

  findByUrls(urls: string[]): Promise<Downloads[]> {
    return this.db.select().from(downloads).where(inArray(downloads.url, urls));
  }

  findAll(limit: number, offset: number): Promise<Downloads[]> {
    return this.db.select().from(downloads).limit(limit).offset(offset);
  }
}
