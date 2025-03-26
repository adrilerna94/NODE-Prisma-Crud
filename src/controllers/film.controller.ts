// Manages HTTP requests related to films.
// Handles GET requests for retrieving all films.
// Delegates business logic to the film service.

import { type Request, type Response, type NextFunction } from 'express'
import { FilmService } from '../services/film.service'
import { AppError } from '../utils/application.error'
import logger from '../config/logger'
import { httpStatus } from '../config/httpStatusCodes'

export class FilmController {
  private readonly filmService: FilmService

  constructor() {
    this.filmService = new FilmService()
  }

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    logger.debug(`Controller: Received getAll request for films with query: ${JSON.stringify(req.query)}`)
    try {
      const films = await this.filmService.selectAll()
      const response = {
        message: 'Films fetched successfully',
        length: films.length,
        data: films,
      }
      res.send(response)
    } catch (error) {
      logger.debug('Controller: Error fetching films')
      if (!(error instanceof AppError)) {
        error = new AppError('Error fetching films', httpStatus.INTERNAL_SERVER_ERROR, {
          originalError: error,
        })
      }
      next(error)
    }
  }
  getAllWithPagination = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    logger.debug(`FilmController: Received getAllWithPagination request with query: ${JSON.stringify(req.query)}`);

    try {
      const { skip = 0, limit = 0 } = req.query;
      const pagination = {
        skip: parseInt(skip as string, 10),
        limit: parseInt(limit as string, 10)
      };
      const films = await this.filmService.getAll(pagination);
      const response = {
        message: 'Films fetched successfully',
        totalFilms: films.length,
        films
      };
      res.send(response);
    } catch (error) {
      logger.debug('FilmController: Error fetching films');
      if (!(error instanceof AppError)) {
        error = new AppError('Error fetching films', httpStatus.INTERNAL_SERVER_ERROR, {
          originalError: error,
        });
      }
      next(error);
    }
  }
}
