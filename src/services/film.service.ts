// Implements business logic for film operations.
// Processes requests from the controller and interacts with the repository.

import logger from '../config/logger';
import { FilmRepository } from '../repositories/film.repository.prisma';
import { IFilm } from '../interfaces/film.interface';
import { ICreateFilm } from '../interfaces/createFilm.interface';
import { httpStatus } from '../config/httpStatusCodes';
import { AppError } from '../utils/application.error';

export class FilmService {
  private readonly filmRepository: FilmRepository;
  private readonly defaultProjection: Record<string, boolean>;
  private readonly createProjection: Record <string, boolean>;

  constructor() {
    this.filmRepository = new FilmRepository();
    this.defaultProjection = {
      id: true,
      title: true,
      released_date: true,
      director: true,
      // campos obligatorios
    };
    this.createProjection = {
      id: true,
      title: true,
      released_date: true,
      director: true,
      genre: true,
      duration: true,
      rating: true,
      language: true,
      country: true,
      synopsis: true,
      budget: true,
      box_office: true,
      created_at: true,
      updated_at: true,
    }
  }


  private readonly normalizeFilmData = (data: ICreateFilm): ICreateFilm => {
    const normalizedData = { ...data };

    if (typeof data.title === 'string') {
      normalizedData.title = data.title.trim();
    }

    if (typeof data.director === 'string') {
      normalizedData.director = data.director.trim();
    }

    if (typeof data.genre === 'string') {
      normalizedData.genre = data.genre.trim();
    }

    if (typeof data.language === 'string') {
      normalizedData.language = data.language.trim();
    }

    if (typeof data.country === 'string') {
      normalizedData.country = data.country.trim();
    }

    if (typeof data.synopsis === 'string') {
      normalizedData.synopsis = data.synopsis.trim();
    }

    // No se puede hacer trim ni parsing sobre fechas/bigint/decimales directamente,
    // pero podrías agregar lógica adicional si quisieras normalizar formatos.

    return normalizedData;
  };


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

  getById = async (id: string) => {
    /*
      parseInt empieza desde el primer carácter. Si el primer carácter no es un número válido, el parseo falla inmediatamente y devuelve NaN.
    */
    // const idNumber = parseInt(id); // 144abc valido abc144
    const idNumber = Number(id);
    if (!Number.isInteger(idNumber)) {
      throw new AppError('Invalid ID', 400);
    }
    const film = await this.filmRepository.getById(idNumber, this.createProjection);
    if (!film) {
      throw new AppError('Film not found', 404);
    }
    return film;
  }

  create = async (data: ICreateFilm) => {
    const normalizedData = this.normalizeFilmData(data);

    // Validar existencia por título (ajustá si tu regla de unicidad es diferente)
    const existingFilm = await this.filmRepository.findOne(
      { title: normalizedData.title },
      { id: true }
    );

    if (existingFilm) {
      logger.warn(`Film with title "${normalizedData.title}" already exists`);
      throw new AppError('A film with this title already exists', httpStatus.CONFLICT);
    }

    // Crear la película
    const createdFilm = await this.filmRepository.create(normalizedData, this.createProjection);

    if (!createdFilm) {
      logger.warn('Film creation failed');
      throw new AppError('Film creation failed', httpStatus.INTERNAL_SERVER_ERROR);
    }

    logger.info(`Film created successfully: "${createdFilm.title}"`);
    return createdFilm;
  };

}
