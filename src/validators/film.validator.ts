// Defines Joi schemas for validating film-related requests.
// Ensures that incoming query params for GET all are valid.

import Joi from 'joi'

export class FilmValidator {
  private static readonly skip = Joi.number().min(0)
  private static readonly limit = Joi.number().min(1).max(100)

  static readonly filmPaginationSchema = Joi.object({
    skip: FilmValidator.skip,
    limit: FilmValidator.limit,
  }).with('skip', 'limit')
}
