import { useApolloClient } from '@apollo/client'
import debouncePromise from 'awesome-debounce-promise'
import { FC, useCallback, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'

import { GetMembershipDocument, GetMembershipQuery, GetMembershipQueryVariables } from '@/api/queries'
import { Avatar } from '@/components/Avatar'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { MEMBERSHIP_NAME_PATTERN, URL_PATTERN } from '@/config/regex'
import { imageUrlValidation } from '@/utils/asset'

import { SignInModalStepTemplate } from './SignInModalStepTemplate'
import { StyledForm } from './SignInSteps.styles'
import { SignInStepProps } from './SignInSteps.types'

import { MemberFormData } from '../SignInModal.types'

type SignInModalMembershipStepProps = SignInStepProps & {
  createMember: (data: MemberFormData) => void
}

export const SignInModalMembershipStep: FC<SignInModalMembershipStepProps> = ({
  setPrimaryButtonProps,
  createMember,
  hasNavigatedBack,
}) => {
  const {
    register,
    watch,
    handleSubmit: createSubmitHandler,
    formState: { errors, isValidating, isSubmitting },
  } = useForm<MemberFormData>({ mode: 'onBlur' })

  const client = useApolloClient()

  const debouncedHandleUniqueValidation = useRef(
    debouncePromise(async (value: string, prevValue?: string) => {
      if (prevValue != null && value === prevValue) {
        return true
      }
      const {
        data: { membershipByUniqueInput },
      } = await client.query<GetMembershipQuery, GetMembershipQueryVariables>({
        query: GetMembershipDocument,
        variables: { where: { handle: value } },
      })

      return !membershipByUniqueInput
    }, 500)
  )
  const debouncedAvatarValidation = useRef(debouncePromise(imageUrlValidation, 500))

  const requestFormSubmit = useCallback(() => {
    createSubmitHandler(createMember)()
  }, [createMember, createSubmitHandler])

  // send updates to SignInModal on state of primary button
  useEffect(() => {
    setPrimaryButtonProps({
      text: isSubmitting ? 'Please wait...' : 'Create membership',
      disabled: isSubmitting,
      onClick: requestFormSubmit,
    })
  }, [isSubmitting, requestFormSubmit, setPrimaryButtonProps])

  const avatarFieldValue = watch('avatarUrl')

  return (
    <SignInModalStepTemplate
      title="Create Joystream membership"
      subtitle="Tell us more about yourself."
      hasNavigatedBack={hasNavigatedBack}
    >
      <StyledForm onSubmit={createSubmitHandler(createMember)}>
        <FormField
          label="Member handle"
          description="Member handle may contain only lowercase letters, numbers and underscores."
          error={errors.handle?.message}
        >
          <Input
            {...register('handle', {
              validate: {
                valid: (value) =>
                  !value ? true : MEMBERSHIP_NAME_PATTERN.test(value) || 'Enter a valid member handle.',
                unique: async (value) => {
                  const valid = await debouncedHandleUniqueValidation.current(value)
                  return valid || 'This member handle is already in use.'
                },
              },
              required: { value: true, message: 'Member handle is required.' },
              minLength: { value: 5, message: 'Member handle must be at least 5 characters long.' },
            })}
            placeholder="johnnysmith"
            error={!!errors.handle}
            processing={isValidating || isSubmitting}
            autoComplete="off"
          />
        </FormField>
        <FormField
          label="Avatar URL"
          description="You can host your avatar image on external services such as imgbb.com, imgur.com, flickr.com, imgbox.com, and others."
          optional
          error={errors.avatarUrl?.message}
        >
          <Input
            {...register('avatarUrl', {
              validate: {
                validUrl: (value) => (!value ? true : URL_PATTERN.test(value) || 'Enter a valid URL.'),
                validImage: async (value) => {
                  const valid = !value || (await debouncedAvatarValidation.current(value))
                  return valid || 'Image not found.'
                },
              },
            })}
            placeholder="https://example.com/avatar.jpeg"
            error={!!errors.avatarUrl}
            nodeEnd={avatarFieldValue ? <Avatar assetUrl={avatarFieldValue} size="bid" /> : null}
            autoComplete="off"
          />
        </FormField>
      </StyledForm>
    </SignInModalStepTemplate>
  )
}
