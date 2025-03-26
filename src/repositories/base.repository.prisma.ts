// A generic repository class providing common database operations.
// Can be extended by specific repositories like user.repository.ts.


export interface IRepositoryDelegate<T> {
  findFirst: (args: unknown) => Promise<T | null>;
  findMany: (args: unknown) => Promise<T[]>;
  create: (args: unknown) => Promise<T>;
  update: (args: unknown) => Promise<T>;
  delete: (args: unknown) => Promise<T>;
}

export class BaseRepository<T, Delegate extends IRepositoryDelegate<T>> {
  private readonly delegate;

  constructor(delegate: Delegate) {
    this.delegate = delegate;
  }

  getById(id: number, projection: Record<string, boolean>): Promise<T | null> {
    return this.delegate.findFirst({
      where: { id: id },
      select: projection,
    });
  }

  find(
    filters: Record<string, unknown>,
    projection: Record<string, boolean>,
    pagination?: Record<string, number>,
  ): Promise<T[]> {
    const queryArgs = {
      where: filters,
      select: projection,
      skip: pagination?.skip,
      take: pagination?.limit,
    };

    try {
      return this.delegate.findMany(queryArgs);
    } catch (err) {
      console.error('[BaseRepository] Error in findMany:', {
        filters,
        projection,
        pagination,
        error: err,
      });
      throw err;
    }
  }

}
