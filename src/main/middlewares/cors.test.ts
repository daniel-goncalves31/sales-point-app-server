import app from '../config/app'
import request from 'supertest'

describe('CORS Middleware', () => {
  test('should enable CORS', async () => {
    app.get('/any_route', (_, res) => {
      res.send('')
    })

    await request(app)
      .get('/any_route')
      .expect('access-control-allow-headers', 'Content-Type, auth')
      .expect('access-control-allow-methods', 'GET, PUT, POST, DELETE')
      .expect('access-control-allow-credentials', 'true')
  })
})
