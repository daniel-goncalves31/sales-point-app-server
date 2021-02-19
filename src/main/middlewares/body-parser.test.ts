import app from '../config/app'
import request from 'supertest'

describe('Body Parser Middleware', () => {
  test('should parse the body as json', async () => {
    app.post('/any_route', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/any_route')
      .send({ test: 'test' })
      .expect({ test: 'test' })
  })
})
