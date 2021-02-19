import app from '../config/app'
import request from 'supertest'

describe('Content Type Middleware', () => {
  test('should return default content-type as json', async () => {
    app.get('/any_route', (_, res) => {
      res.send('')
    })
    await request(app)
      .get('/any_route')
      .expect('content-type', /json/)
  })
})
