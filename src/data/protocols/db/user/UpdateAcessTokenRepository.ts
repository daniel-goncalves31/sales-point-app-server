export interface UpdateAcessTokenRepository {
  updateAccessToken: (userId: string, acessToken: string) => Promise<void>
}
