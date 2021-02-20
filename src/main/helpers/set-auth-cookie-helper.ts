import { Response } from 'express'

export const setAuthCookie = (res: Response, token: string): void => {
  res.cookie('d794$7dsa99_dsadsa978lbipe$sdspp', token, {
    maxAge: 1000 * 60 * 30, // expires in 30 minutes
    httpOnly: true,
    sameSite: 'none',
    secure: true
  })
}
