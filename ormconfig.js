require('dotenv/config')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

const folder = process.env.NODE_ENV === 'production' ? 'dist' : 'src'

module.exports = {
  name: 'default',
  type: 'sqlite',
  database: path.join(__dirname, 'db.sqlite'),
  entities: [path.join(folder, 'infra', 'db', 'typeorm', 'entities', '{*.ts,*.js}')],
  migrations: [path.join(folder, 'infra', 'db', 'typeorm', 'migrations', '{*.ts,*.js}')],
  cli: {
    entitiesDir: path.join(folder, 'infra', 'db', 'typeorm', 'entities'),
    migrationsDir: path.join(folder, 'infra', 'db', 'typeorm', 'migrations'),
  },
}