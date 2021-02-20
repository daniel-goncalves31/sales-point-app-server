export interface LogoutUseCase {
  logOut(currentUserId: string): Promise<void>
}
