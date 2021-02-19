import { Request, Response, NextFunction } from 'express'
import { env } from '../config/env'

export const cors = (req: Request, res: Response, next: NextFunction): void => {
  const origin = req.headers.origin
  const allowedOrigins = env.ALLOWED_ORIGINS?.split(',')
  if (origin && allowedOrigins!.includes(origin)) {
    res.set('access-control-allow-origin', origin)
  }

  res.set('access-control-allow-headers', 'Content-Type, auth')
  res.set('access-control-allow-methods', 'GET, PUT, POST, DELETE')
  res.set('access-control-allow-credentials', 'true')
  next()
}
