// Implements business logic for film operations.
// Processes requests from the controller and interacts with the repository.

import logger from '../config/logger';
import { FilmRepository } from '../repositories/film.repository.prisma';
import { IFilm } from '../interfaces/film.interface';

export class FilmService {
  private readonly filmRepository: FilmRepository;
  private readonly defaultProjection: Record<string, boolean>;

  constructor() {
    this.filmRepository = new FilmRepository();
    this.defaultProjection = {
      id: true,
      title: true,
      released_date: true,
      director: true,
      // campos obligatorios
    };
  }

  // sin paginación (mostrados hasta 100 registros sin paginar)
  selectAll = async (): Promise<IFilm[]> => {
    logger.debug('Fetching all films with default projection');
    // const films = await this.filmRepository.find({}, this.defaultProjection);
    const pagination = {skip: 0 , limit: 100};
    const films = await this.filmRepository.find({}, this.defaultProjection, pagination);
    logger.info(`Retrieved ${films.length} films`);
    return films.filter((f): f is IFilm => f !== null); // Por si acaso alguno viene null
  };

  // con paginación
  getAll = (pagination: { skip: number; limit: number }): Promise<(IFilm | null)[]> => {
    const MAX_LIMIT = 100;
    if (pagination.limit === 0 || pagination.limit > MAX_LIMIT) {
      pagination.limit = MAX_LIMIT;
      logger.debug('Pagination limit adjusted to MAX_LIMIT', { pagination });
    }
    const filters = {};
    const projection = { ...this.defaultProjection };
    logger.debug(
      `Fetching all films with filters: ${JSON.stringify(filters)} and pagination: ${JSON.stringify(pagination)}`,
    );
    return this.filmRepository.find(filters, projection, pagination);
  };
}
