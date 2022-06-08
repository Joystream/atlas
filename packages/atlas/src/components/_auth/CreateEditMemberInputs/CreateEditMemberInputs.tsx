import React from 'react'
import { DeepMap, FieldError, UseFormRegister, UseFormWatch } from 'react-hook-form'

import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { TextArea } from '@/components/_inputs/TextArea'

import { Wrapper } from './CreateEditMemberInputs.styles'

type Inputs = {
  handle: string | null
  avatar: string | null
  about: string | null
}

type CreateEditMemberFormProps = {
  register: UseFormRegister<Inputs>
  errors: DeepMap<Inputs, FieldError>
  watch: UseFormWatch<Inputs>
  isModal?: boolean
}

export const CreateEditMemberInputs: React.FC<CreateEditMemberFormProps> = ({ register, errors, watch, isModal }) => {
  return (
    <Wrapper isModal={isModal}>
      <FormField label="Avatar URL" error={errors.avatar?.message}>
        <Input
          autoComplete="off"
          error={!!errors.avatar}
          placeholder="https://example.com/avatar.jpeg"
          {...register('avatar')}
          value={watch('avatar') || ''}
        />
      </FormField>
      <FormField
        label="Member handle"
        description="Member handle may contain only lowercase letters, numbers and underscores"
        error={errors.handle?.message}
      >
        <Input
          autoComplete="off"
          placeholder="johnnysmith"
          {...register('handle')}
          value={watch('handle') || ''}
          error={!!errors.handle}
        />
      </FormField>
      <FormField label="About" error={errors.about?.message}>
        <TextArea
          placeholder="Anything you'd like to share about yourself with the Joystream community"
          maxLength={1000}
          {...register('about')}
          value={watch('about') || ''}
          error={!!errors.about}
        />
      </FormField>
    </Wrapper>
  )
}
