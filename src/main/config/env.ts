import 'dotenv/config'

export const env = {
  PORT: process.env.PORT || 3333,
  JWT_SECRET: process.env.JWT_SECRET || 'super_secret_secret',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  AUTH_HEADER: process.env.AUTH_HEADER
}
