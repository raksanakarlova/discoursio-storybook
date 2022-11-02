export type AuthModalMode = 'login' | 'register' | 'confirm-email' | 'forgot-password'

export type AuthModalSearchParams = {
  mode: AuthModalMode
}