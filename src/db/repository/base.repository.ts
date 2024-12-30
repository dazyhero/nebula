export interface BaseRepository<T> {
  create(data: T): Promise<T>;
  findAll(limit: number, offset: number): Promise<T[]>;
}
