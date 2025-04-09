import { PrismaClient, Prisma, Film } from '@prisma/client';
import { BaseRepository, IRepositoryDelegate } from './base.repository.prisma';
import { AppError } from '../utils/application.error';
import { IFilm } from '../interfaces/film.interface';
import { ICreateFilm } from '../interfaces/createFilm.interface';

const prisma = new PrismaClient();

export class FilmRepository {
  private readonly baseRepository: BaseRepository<Film, ICreateFilm,IRepositoryDelegate<Film>>;

  constructor() {
    this.baseRepository = new BaseRepository(prisma.film as unknown as IRepositoryDelegate<Film>);
  }

  private readonly transformId = (film: Film | null): IFilm | null => {
    if (!film) return null;
    const { id, ...rest } = film;
    return { ...rest, id: id.toString() };
  };

  findOne = async (
    filters: Record<string, unknown>,
    projection: Record<string, boolean> = {}
  ): Promise<IFilm | null> => {
    const results = await this.baseRepository.find(filters, projection, { skip: 0, limit: 1 });
    return this.transformId(results[0] || null);
  };

  getById = async (id: string, projection: Record<string, boolean>): Promise<IFilm | null> => {
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) {
      throw new AppError('Invalid ID', 400);
    }
    return this.transformId(await this.baseRepository.getById(idNumber, projection));
  };

  create = async (data: ICreateFilm, projection: Record<string, boolean>) : Promise<IFilm | null> => {
    const createFilm = await this.baseRepository.create(data, projection);
    return this.transformId(createFilm);
  }

  // SELECT CON PAGINACIÓN Y FILTERS
  find = async (
    filters: Record<string, unknown> = {},
    projection: Record<string, boolean> = {},
    pagination: { skip: number; limit: number } = { skip: 0, limit: 0 },
  ): Promise<(IFilm | null)[]> => {
    const result = await this.baseRepository.find(filters, projection, pagination);
    return result.map((film) => this.transformId(film));
  };

  // SELECT ALL SIN PAGINACIÓN
  selectAll = async (): Promise<IFilm[]> => {
    const result = await this.baseRepository.find({}, { id: true, title: true, director: true, released_date: true });
    return result.map((film) => this.transformId(film)) as IFilm[];
  };
}
