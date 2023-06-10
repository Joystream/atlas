import { ImageInputFile } from '@/components/_inputs/MultiFileSelect'

export enum SignUpSteps {
  CreateMember,
  SignUpSeed,
  SignUpEmail,
  SignUpPassword,
  Creating,
  Success,
}

export type MemberFormData = {
  handle: string
  avatar?: ImageInputFile
  captchaToken?: string
}

export type AccountFormData = {
  email: string
  password: string
  mnemonic: string
  confirmedTerms: boolean
  confirmedCopy: boolean
}

export type SignUpFormData = MemberFormData & AccountFormData
