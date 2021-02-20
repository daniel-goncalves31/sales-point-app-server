import { Express } from 'express'
import { bodyParser } from '../middlewares/body-parser'
import { contentType } from '../middlewares/content-type'
import { cors } from '../middlewares/cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

export const setupMiddlewares = (app: Express): void => {
  app.use(cookieParser())
  app.use(helmet())
  app.use(bodyParser)
  app.use(contentType)
  app.use(cors)
}
