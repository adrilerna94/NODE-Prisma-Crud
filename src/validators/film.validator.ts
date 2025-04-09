import Joi from 'joi';

export class FilmValidator {
  // Campos base
  private static readonly id = Joi.string(); // asumimos que lo devolvés como string
  private static readonly title = Joi.string().min(1).max(255);
  private static readonly released_date = Joi.date().iso();
  private static readonly director = Joi.string().min(1).max(255);
  private static readonly genre = Joi.string().allow(null, '');
  private static readonly duration = Joi.number().min(1).allow(null);
  private static readonly rating = Joi.number().min(0).max(10).allow(null);
  private static readonly language = Joi.string().allow(null, '');
  private static readonly country = Joi.string().allow(null, '');
  private static readonly synopsis = Joi.string().allow(null, '');
  private static readonly budget = Joi.number().integer().min(0).allow(null);
  private static readonly box_office = Joi.number().integer().min(0).allow(null);
  private static readonly created_at = Joi.date().iso().allow(null);
  private static readonly updated_at = Joi.date().iso().allow(null);

  private static readonly skip = Joi.number().min(0);
  private static readonly limit = Joi.number().min(1).max(100);

  // Validación de ID
  static readonly filmIdSchema = Joi.object({
    id: FilmValidator.id.required(),
  });

  // Validación de paginación
  static readonly filmPaginationSchema = Joi.object({
    skip: FilmValidator.skip,
    limit: FilmValidator.limit,
  }).with('skip', 'limit');

  // Validación de creación
  static readonly filmCreateSchema = Joi.object({
    title: FilmValidator.title.required(),
    released_date: FilmValidator.released_date.required(),
    director: FilmValidator.director.required(),
    genre: FilmValidator.genre.required(),
    duration: FilmValidator.duration,
    rating: FilmValidator.rating,
    language: FilmValidator.language,
    country: FilmValidator.country,
    synopsis: FilmValidator.synopsis,
    budget: FilmValidator.budget,
    box_office: FilmValidator.box_office,
    created_at: FilmValidator.created_at,
    updated_at: FilmValidator.updated_at,
  });

  // Validación de actualización (todos opcionales)
  static readonly filmUpdateSchema = Joi.object({
    title: FilmValidator.title,
    released_date: FilmValidator.released_date,
    director: FilmValidator.director,
    genre: FilmValidator.genre,
    duration: FilmValidator.duration,
    rating: FilmValidator.rating,
    language: FilmValidator.language,
    country: FilmValidator.country,
    synopsis: FilmValidator.synopsis,
    budget: FilmValidator.budget,
    box_office: FilmValidator.box_office,
    updated_at: FilmValidator.updated_at,
  });
}
