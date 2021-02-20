import { Express, Router } from 'express'
import { readdirSync } from 'fs'

export const setupRoutes = (app: Express): void => {
  const router = Router()

  app.use('/api', router)

  readdirSync(`${__dirname}/../routes`).forEach(folder => {
    readdirSync(`${__dirname}/../routes/${folder}`).forEach(async fileName => {
      if (!fileName.includes('.test')) {
        (await import(`../routes/${folder}/${fileName}`)).default(router)
      }
    })
  })
}
