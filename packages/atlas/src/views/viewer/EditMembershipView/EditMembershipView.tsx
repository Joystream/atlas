import { useApolloClient } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import debouncePromise from 'awesome-debounce-promise'
import React, { useCallback, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { GetMembershipDocument, GetMembershipQuery, GetMembershipQueryVariables } from '@/api/queries'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { MembershipInfo } from '@/components/MembershipInfo'
import { TextArea } from '@/components/_inputs/TextArea'
import { MEMBERSHIP_NAME_PATTERN, URL_PATTERN } from '@/config/regex'
import { useUser } from '@/providers/user'

import { StyledActionBar, StyledTextField, TextFieldsWrapper, Wrapper } from './EditMembershipView.styles'

type Inputs = {
  handle: string
  avatar: string
  about: string
}

export const EditMembershipView: React.FC = () => {
  const { activeAccountId, activeMembership, activeMembershipLoading } = useUser()

  const client = useApolloClient()

  const debouncedAvatarValidation = useRef(
    debouncePromise(
      async (value: string): Promise<string | boolean> =>
        new Promise((resolve) => {
          const image = new Image()
          image.onload = () => {
            resolve(true)
          }
          image.onerror = () => resolve(false)
          image.src = value
          if (!value) {
            resolve(true)
          }
        }),
      500
    )
  )

  const debouncedHandleUniqueValidation = useRef(
    debouncePromise(async (value: string, prevValue?: string) => {
      if (value === prevValue) {
        return true
      }
      const {
        data: { membershipByUniqueInput },
      } = await client.query<GetMembershipQuery, GetMembershipQueryVariables>({
        query: GetMembershipDocument,
        variables: { where: { handle: value } },
      })
      if (membershipByUniqueInput) {
        return false
      } else {
        return true
      }
    }, 500)
  )

  const schema = z.object({
    handle: z
      .string()
      .nonempty({ message: 'Member handle cannot be empty' })
      .min(5, {
        message: 'Member handle must be at least 5 characters',
      })
      .max(40, {
        message: `Member handle cannot be longer than 40 characters`,
      })
      .refine((val) => (val ? MEMBERSHIP_NAME_PATTERN.test(val) : true), {
        message: 'Member handle may contain only lowercase letters, numbers and underscores',
      })
      .refine(
        async (val) => {
          const isValid = await debouncedHandleUniqueValidation.current(val, activeMembership?.handle)
          return isValid
        },
        { message: 'Member handle already in use' }
      ),
    avatar: z
      .string()
      .max(400)
      .refine((val) => (val ? URL_PATTERN.test(val) : true), { message: 'Avatar URL must be a valid url' })
      .refine(
        async (val) => {
          const isValid = await debouncedAvatarValidation.current(val)
          return isValid
        },
        { message: 'Image not found' }
      )
      .optional(),
    about: z.string().max(1000, { message: 'About cannot be longer than 1000 characters' }).optional(),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    mode: 'onChange',
    resolver: zodResolver(schema, { async: true }),
    shouldFocusError: true,
  })

  const resetForm = useCallback(() => {
    reset({
      handle: activeMembership?.handle,
      avatar: activeMembership?.avatarUri || '',
      about: activeMembership?.about || '',
    })
  }, [activeMembership?.about, activeMembership?.avatarUri, activeMembership?.handle, reset])

  useEffect(() => {
    if (!activeMembershipLoading && activeMembership) {
      resetForm()
    }
  }, [activeMembership, activeMembershipLoading, resetForm])

  const handleEditMember = handleSubmit(async () => {
    // TODO
    // handle submiting edited member
  })

  return (
    <form>
      <LimitedWidthContainer>
        <MembershipInfo
          address={activeAccountId}
          avatarUrl={activeMembership?.avatarUri}
          loading={activeMembershipLoading}
          handle={activeMembership?.handle}
        />
        <Wrapper>
          <TextFieldsWrapper>
            <StyledTextField
              label="Avatar URL"
              placeholder="https://example.com/avatar.jpeg"
              {...register('avatar')}
              error={!!errors.avatar}
              helperText={errors.avatar?.message}
            />
            <StyledTextField
              placeholder="johnnysmith"
              label="Member handle"
              {...register('handle')}
              error={!!errors.handle}
              helperText={
                errors.handle?.message || 'Member handle may contain only lowercase letters, numbers and underscores'
              }
            />
            <TextArea
              label="About"
              placeholder="Anything you'd like to share about yourself with the Joystream community"
              maxLength={1000}
              {...register('about')}
              error={!!errors.about}
              helperText={errors.about?.message}
            />
          </TextFieldsWrapper>
        </Wrapper>
      </LimitedWidthContainer>
      <StyledActionBar
        primaryText="Fee: 0 Joy"
        secondaryText="For the time being no fees are required for blockchain transactions. This will change in the future."
        primaryButton={{
          text: 'Publish changes',
          onClick: handleEditMember,
        }}
        secondaryButton={{
          visible: true,
          text: 'Cancel',
          onClick: resetForm,
        }}
      />
    </form>
  )
}
