// Defines the routes for film-related operations.
// Maps HTTP methods and endpoints to the corresponding controller methods.

import { Router } from 'express'
import { FilmController } from '../controllers/film.controller'
import { FilmValidator } from '../validators/film.validator'
import { validate, ValidationSource } from '../middlewares/validate.middleware'

const filmController = new FilmController()
export const filmRouter = Router()

// GET /films - Retrieve all films with optional pagination
filmRouter.get('/notpaginate', validate(FilmValidator.filmPaginationSchema, ValidationSource.QUERY),filmController.getAll);
filmRouter.get('/', validate(FilmValidator.filmPaginationSchema, ValidationSource.QUERY),filmController.getAllWithPagination);

