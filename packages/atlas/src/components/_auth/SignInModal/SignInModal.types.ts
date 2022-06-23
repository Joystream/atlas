export const SIGN_IN_MODAL_STEPS = ['wallet', 'account', 'terms', 'membership', 'creating'] as const

export type MemberFormData = {
  handle: string
  avatarUrl?: string
}
