import { useApolloClient } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import debouncePromise from 'awesome-debounce-promise'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import useMeasure from 'react-use-measure'
import * as z from 'zod'

import { GetMembershipDocument, GetMembershipQuery, GetMembershipQueryVariables } from '@/api/queries'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { MembershipInfo } from '@/components/MembershipInfo'
import { TextArea } from '@/components/_inputs/TextArea'
import { MEMBERSHIP_NAME_PATTERN, URL_PATTERN } from '@/config/regex'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactionManager'
import { useUser } from '@/providers/user'

import { StyledActionBar, StyledTextField, TextFieldsWrapper, Wrapper } from './EditMembershipView.styles'

type Inputs = {
  handle: string
  avatar: string | null
  about: string | null
}

export const EditMembershipView: React.FC = () => {
  const { activeAccountId, activeMembership, activeMembershipLoading, refetchActiveMembership } = useUser()
  const [headerState, setHeaderState] = useState<Inputs>({
    handle: '',
    avatar: '',
    about: '',
  })
  const [actionBarRef, actionBarBounds] = useMeasure()
  const { joystream } = useJoystream()
  const handleTransaction = useTransaction()

  const client = useApolloClient()

  const avatarValidation = async (value: string): Promise<string | boolean> =>
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
    })

  const handleUniqueValidation = async (value: string, prevValue?: string) => {
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
  }

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
          const debouncedHandleUniqueValidation = debouncePromise(handleUniqueValidation, 500)
          const isValid = await debouncedHandleUniqueValidation(val, activeMembership?.handle)
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
          const debouncedValidation = debouncePromise(avatarValidation, 500)
          const isValid = await debouncedValidation(val)
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
    control,
    reset,
    formState: { errors, isDirty, isValid, dirtyFields },
  } = useForm<Inputs>({
    mode: 'onChange',
    resolver: zodResolver(schema),
    shouldFocusError: true,
    defaultValues: {
      handle: activeMembership?.handle,
      avatar: activeMembership?.avatarUri,
      about: activeMembership?.about,
    },
  })

  const resetForm = useCallback(() => {
    reset(
      {
        handle: activeMembership?.handle,
        avatar: activeMembership?.avatarUri,
        about: activeMembership?.about,
      },
      {
        keepDirty: false,
      }
    )
    setHeaderState({
      handle: activeMembership?.handle || '',
      avatar: activeMembership?.avatarUri || '',
      about: activeMembership?.about || '',
    })
  }, [activeMembership?.about, activeMembership?.avatarUri, activeMembership?.handle, reset])

  useEffect(() => {
    if (!activeMembershipLoading && activeMembership) {
      resetForm()
    }
  }, [activeMembership, activeMembershipLoading, resetForm])

  const handleEditMember = handleSubmit(async (data) => {
    if (!joystream || !activeMembership) {
      return
    }

    await handleTransaction({
      txFactory: (updateStatus) =>
        joystream.extrinsics.updateMember(
          activeMembership?.id,
          dirtyFields.handle ? data.handle : null,
          dirtyFields.avatar ? data?.avatar : null,
          dirtyFields.about ? data.about : null,
          updateStatus
        ),
      successMessage: {
        title: 'Member successfully updated',
        description: 'Lorem ipsum',
      },
    })
    refetchActiveMembership()
  })

  return (
    <form onSubmit={handleEditMember}>
      <LimitedWidthContainer>
        <MembershipInfo
          address={activeAccountId}
          avatarUrl={headerState.avatar || activeMembership?.avatarUri}
          loading={activeMembershipLoading}
          handle={headerState.handle || activeMembership?.handle}
        />
        <Wrapper actionBarHeight={actionBarBounds.height}>
          <TextFieldsWrapper>
            <Controller
              control={control}
              name="avatar"
              render={({ field: { onChange, value } }) => (
                <StyledTextField
                  label="Avatar URL"
                  placeholder="https://example.com/avatar.jpeg"
                  value={value || ''}
                  onChange={(e) => {
                    setHeaderState((headerState) => ({ ...headerState, avatar: e.target.value }))
                    onChange(e)
                  }}
                  error={!!errors.avatar}
                  helperText={errors.avatar?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="handle"
              render={({ field: { onChange, value } }) => (
                <StyledTextField
                  placeholder="johnnysmith"
                  label="Member handle"
                  {...register('handle')}
                  error={!!errors.handle}
                  onChange={(e) => {
                    setHeaderState((headerState) => ({ ...headerState, handle: e.target.value }))
                    onChange(e)
                  }}
                  value={value || ''}
                  helperText={
                    errors.handle?.message ||
                    'Member handle may contain only lowercase letters, numbers and underscores'
                  }
                />
              )}
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
        <StyledActionBar
          ref={actionBarRef}
          primaryText="Fee: 0 Joy"
          secondaryText="For the time being no fees are required for blockchain transactions. This will change in the future."
          primaryButton={{
            disabled: !isDirty || !isValid,
            text: 'Publish changes',
            type: 'submit',
          }}
          secondaryButton={{
            visible: true,
            text: 'Cancel',
            onClick: resetForm,
          }}
        />
      </LimitedWidthContainer>
    </form>
  )
}
