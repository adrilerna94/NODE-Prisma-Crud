import request from 'supertest';
import { app } from '../../app';
import { ICreateFilm } from '../../interfaces/createFilm.interface';
import { httpStatus } from '../../config/httpStatusCodes';
import { createConnection, closeConnection, prisma } from "../../config/db.prisma";

beforeAll(async () => {
  await createConnection(); // crear conexión antes de todos los tests
});

async function deleteFilmMockData(...films: string []) {
  await prisma.film.deleteMany({
    where: {
      title: {
        in: [...films]
      }
    }
  });
}

const filmTitles: string [] = [];

//  Grupo de tests para la API films
describe('📹 TEST API FILMS' , () => {

  //  Grupo de tests para el endpoint POST
  describe ('POST /api/v1/films' , () => {

    // 🆕 Test que prueba la creación de una película
    it('should create a valid film', async () => {
      //  Creamos una película válida
      const newFilm: ICreateFilm = {
        title: 'TestFilm',
        released_date: new Date(),
        director: 'Adri2Papi',
        genre: 'Good-Vibes',
      };

      // 🧪 Enviamos la petición POST al servidor
      const res = await request(app)
        .post('/api/v1/films')
        .send(newFilm)
        .expect(httpStatus.CREATED); // Esperamos un 201

      //  Validamos que la respuesta contenga los campos esperados en el controller (create())
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.title).toBe('TestFilm');
      expect(res.body.data.director).toBe('Adri2Papi');
      expect(res.body.data.genre).toBe('Good-Vibes');
      expect(res.body.message).toBe('film created successfully');

      filmTitles.push(newFilm.title);

    });
    // ⚠️ Este test intenta fallar por campos requeridos faltantes,
    it('should fail if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/v1/films') // 🛠️ corregido endpoint
        .send({ director: 'Someone ' }) // Faltan campos requeridos
        .expect(httpStatus.BAD_REQUEST); // Esperamos 400

      // 🔍 Validamos que se devuelva un mensaje de error si no tiene los campos requeridos
      expect(res.body.msg).toEqual(expect.arrayContaining([expect.stringContaining('required')]));
  });

// Grupo de tests que prueba endpoint para obtener una película por ID
describe('GET /api/v1/films/:id', () => {
  it('should return film if exists', async () => {
    const film = await prisma.film.create({
      data: {
        title: 'TestMatrix',
        released_date: new Date('1999-03-31'),
        director: 'Wachowskis',
        genre: 'Sci-Fi',
      },
    });
    const res = await request(app)
      .get(`/api/v1/films/${film.id}`)
      .expect(200);

    expect(res.body).toHaveProperty('data.title', 'TestMatrix'); // FIXED
    expect(new Date(res.body.data.released_date)).toEqual(new Date('1999-03-31'));

    filmTitles.push(film.title);
  });

  it('should return 400 if ID format is invalid', async () => {
    const res = await request(app)
      .get('/api/v1/films/144invalid-id')
      .expect(400); // invalid Id

    expect(res.body.error).toBe('Invalid ID');
  });
  
  it('should return 404 if Film is not found', async () => {
    const res = await request(app)
      .get('/api/v1/films/40000')
      .expect(404);

    expect(res.body.error).toBe('Film not found');
  });
});

  // Grupo de tests para paginación
  describe('GET /api/v1/films?skip=1&limit=2', () => {
    const films = {
      data: [
        { title: 'Film 1', released_date: new Date(), director: 'Dir 1', genre: 'Drama' },
        { title: 'Film 2', released_date: new Date(), director: 'Dir 2', genre: 'Action' },
        { title: 'Film 3', released_date: new Date(), director: 'Dir 3', genre: 'Comedy' },
        { title: 'Film 4', released_date: new Date(), director: 'Dir 4', genre: 'Sci-Fi' },
        { title: 'Film 5', released_date: new Date(), director: 'Dir 5', genre: 'Adventure' },
      ],
    };

    beforeEach(async () => await prisma.film.createMany({ data: films.data }));

    it('should return a paginated list of films', async () => {
      const res = await request(app)
        .get('/api/v1/films?skip=1&limit=2')
        .expect(200);

      expect(Array.isArray(res.body.films)).toBe(true);
      expect(res.body.totalFilms).toBeLessThanOrEqual(2);
    });

    it('should return an empty array if pagination is out of range', async () => {
      const res = await request(app)
        .get('/api/v1/films?skip=99&limit=10')
        .expect(200);

      expect(res.body.films).toEqual([]);
    });

    const filterFilmTitles = films.data.map((element) => element.title);
    filmTitles.push(...filterFilmTitles);
  });
  });

  // acciones después de pasar todos los tests
  afterAll(async () => {
  console.log(`[TEST] Deleting Test films ${filmTitles}`);
  await deleteFilmMockData(...filmTitles);
  await closeConnection();
  });
});
