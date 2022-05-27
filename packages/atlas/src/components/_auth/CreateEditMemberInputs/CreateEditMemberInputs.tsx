import React from 'react'
import { UseFormRegister, UseFormStateReturn, UseFormWatch } from 'react-hook-form'

import { TextArea } from '@/components/_inputs/TextArea'

import { StyledTextField } from './CreateEditMemberInputs.styles'

type Inputs = {
  handle: string | null
  avatar: string | null
  about: string | null
}

type CreateEditMemberFormProps = {
  register: UseFormRegister<Inputs>
  errors: UseFormStateReturn<Inputs>['errors']
  watch: UseFormWatch<Inputs>
}

export const CreateEditMemberInputs: React.FC<CreateEditMemberFormProps> = ({ register, errors, watch }) => {
  return (
    <>
      <StyledTextField
        autoComplete="off"
        label="Avatar URL"
        placeholder="https://example.com/avatar.jpeg"
        {...register('avatar')}
        value={watch('avatar') || ''}
        error={!!errors?.avatar}
        helperText={errors?.avatar?.message}
      />
      <StyledTextField
        autoComplete="off"
        placeholder="johnnysmith"
        label="Member handle"
        {...register('handle')}
        value={watch('handle') || ''}
        error={!!errors?.handle}
        helperText={
          errors?.handle?.message || 'Member handle may contain only lowercase letters, numbers and underscores'
        }
      />
      <TextArea
        label="About"
        placeholder="Anything you'd like to share about yourself with the Joystream community"
        maxLength={1000}
        {...register('about')}
        value={watch('about') || ''}
        error={!!errors?.about}
        helperText={errors?.about?.message}
      />
    </>
  )
}
