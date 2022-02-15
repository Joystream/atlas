import { useApolloClient } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import debouncePromise from 'awesome-debounce-promise'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { GetMembershipDocument, GetMembershipQuery, GetMembershipQueryVariables } from '@/api/queries'
import { MEMBERSHIP_NAME_PATTERN, URL_PATTERN } from '@/config/regex'
import { imageUrlValidation } from '@/utils/asset'

type Inputs = {
  handle: string | null
  avatar: string | null
  about: string | null
}

type UseCreateEditMemberFormArgs = {
  prevHandle?: string
}

export const useCreateEditMemberForm = ({ prevHandle }: UseCreateEditMemberFormArgs) => {
  const client = useApolloClient()

  const debouncedAvatarValidation = useRef(debouncePromise(imageUrlValidation, 500))
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
      return !membershipByUniqueInput
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
      .refine((val) => debouncedHandleUniqueValidation.current(val, prevHandle), {
        message: 'Member handle already in use',
      }),
    avatar: z
      .string()
      .max(400)
      .refine((val) => (val ? URL_PATTERN.test(val) : true), { message: 'Avatar URL must be a valid url' })
      .refine(
        (val) => {
          if (!val) return true
          return debouncedAvatarValidation.current(val)
        },
        { message: 'Image not found' }
      )
      .nullable(),
    about: z.string().max(1000, { message: 'About cannot be longer than 1000 characters' }).nullable(),
  })

  const {
    register,
    handleSubmit,
    setFocus,
    getValues,
    reset,
    watch,
    formState: { errors, isDirty, isValid, dirtyFields, isValidating },
  } = useForm<Inputs>({
    mode: 'onChange',
    resolver: zodResolver(schema),
    shouldFocusError: true,
  })

  return {
    register,
    handleSubmit,
    getValues,
    reset,
    watch,
    setFocus,
    errors,
    isDirty,
    isValid,
    isValidating,
    dirtyFields,
  }
}
