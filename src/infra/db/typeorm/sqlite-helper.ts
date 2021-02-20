import { createConnection, getConnection } from 'typeorm'

import path from 'path'

export const setupSqliteConnection = async () => {
  await createConnection({
    name: 'default',
    type: 'sqlite',
    database: path.join(__dirname, 'test_db.sqlite'),
    dropSchema: true,
    synchronize: true,
    entities: [path.join(__dirname, 'entities', '*.ts')],
    migrations: [path.join(__dirname, 'migrations', '*.ts')],
    cli: {
      entitiesDir: path.join(__dirname, 'entities'),
      migrationsDir: path.join(__dirname, 'migrations')
    }
  }).catch((e) => console.error(e))
}

export const closeSqliteConnection = async () => {
  await getConnection().close()
}
