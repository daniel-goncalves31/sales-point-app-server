import { addAlias } from 'module-alias'
import path from 'path'

const folder = process.env.NODE_ENV === 'production' ? 'dist' : 'src'
addAlias('@', path.join(__dirname, '..', '..', folder))

import { createConnection } from 'typeorm'
import app from './config/app'
import { env } from './config/env'
import { seedUsers } from './helpers/seed-helper'
(() => {
  createConnection()
    .then(async () => {
      await seedUsers()
      app.listen(env.PORT, async () => {
        console.log(`Server is listening in the port: ${env.PORT}`)
      })
    })
    .catch(console.error)
})()
