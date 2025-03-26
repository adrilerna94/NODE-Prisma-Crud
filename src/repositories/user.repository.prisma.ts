// Handles direct data operations related to users.
// This layer interacts with the database or a data source to perform CRUD operations.

import { Prisma, PrismaClient, User } from '@prisma/client';
import { BaseRepository, IRepositoryDelegate } from './base.repository.prisma';
import { AppError } from '../utils/application.error';
import { IUser } from '../interfaces/user.interface';

const prisma = new PrismaClient();

export class UserRepository {
  private readonly baseRepository: BaseRepository<User, Prisma.UserCreateInput, IRepositoryDelegate<User>>;

  constructor() {
    this.baseRepository = new BaseRepository(prisma.user as unknown as IRepositoryDelegate<User>);
  }

  private readonly transformId = (user: User | null): IUser | null => {
    if (!user) {
      return null;
    }
    const { id, ...rest } = user;
    return { ...rest, id: id.toString() };
  };

  getById = async (id: string, projection: Record<string, boolean>): Promise<IUser | null> => {
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) {
      throw new AppError('Invalid ID', 400);
    }
    return this.transformId(await this.baseRepository.getById(idNumber, projection));
  };

  find = async (
    filters: Record<string, unknown> = {},
    projection: Record<string, boolean> = {},
    pagination: { skip: number; limit: number } = { skip: 0, limit: 0 },
  ): Promise<(IUser | null)[]> => {
    return (await this.baseRepository.find(filters, projection, pagination)).map((user) => this.transformId(user));
  };
}
