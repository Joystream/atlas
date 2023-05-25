import { ImageInputFile } from '@/components/_inputs/MultiFileSelect'

export enum SignUpSteps {
  SignUpEmail,
  SignUpPassword,
  SignUpSeed,
  CreateMember,
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
  seed: string
}

export type NewUserFormData = MemberFormData & AccountFormData
