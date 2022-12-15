import { useApolloClient } from '@apollo/client'
import debouncePromise from 'awesome-debounce-promise'
import { FC, useCallback, useMemo, useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import {
  GetBasicChannelsDocument,
  GetBasicChannelsQuery,
  GetBasicChannelsQueryVariables,
} from '@/api/queries/__generated__/channels.generated'
import { BasicChannelFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { Avatar, AvatarProps } from '@/components/Avatar'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { Select, SelectItem } from '@/components/_inputs/Select'
import { Loader } from '@/components/_loaders/Loader'
import { displayCategories } from '@/config/categories'
import { EMAIL_PATTERN } from '@/config/regex'
import { useAsset } from '@/providers/assets/assets.hooks'

import { FormFieldsWrapper } from './YppAuthorizationDetailsFormStep.styles'

export type DetailsFormData = {
  email: string | undefined
  referrerChannelTitle: string | undefined
  referrerChannelId: string | undefined
  videoCategoryId: string | undefined
}

export const YppAuthorizationDetailsFormStep: FC = () => {
  const [foundChannel, setFoundChannel] = useState<BasicChannelFieldsFragment | null>()
  const [isChannelValidating, setIsChannelValidating] = useState(false)
  const client = useApolloClient()
  const {
    trigger,
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<DetailsFormData>()

  const validateChannel = useCallback(
    async (value: string) => {
      const {
        data: { channels },
      } = await client.query<GetBasicChannelsQuery, GetBasicChannelsQueryVariables>({
        query: GetBasicChannelsDocument,
        variables: { where: { title_eq: value } },
      })
      if (!value) {
        return true
      }
      if (channels?.length) {
        setFoundChannel(channels[0])
        setValue('referrerChannelId', channels[0].id)
      } else {
        setFoundChannel(null)
      }
      return !!channels.length
    },
    [client, setValue]
  )

  const titleInputRef = useRef<HTMLInputElement | null>(null)

  const { ref, ...titleRegisterRest } = useMemo(
    () =>
      register('referrerChannelTitle', {
        onChange: debouncePromise(
          async () => {
            await trigger('referrerChannelTitle')
            setIsChannelValidating(false)
          },
          500,
          {
            key() {
              setIsChannelValidating(true)
              return null
            },
          }
        ),
        validate: {
          unique: async (value) => {
            const valid = await validateChannel(value || '')
            return valid || 'No channel with this title has been found.'
          },
        },
      }),
    [register, trigger, validateChannel]
  )

  const categoriesSelectItems: SelectItem[] =
    displayCategories?.map((c) => ({
      name: c.name || 'Unknown category',
      value: c.defaultVideoCategory,
    })) || []

  return (
    <FormFieldsWrapper>
      <FormField
        label="Contact email"
        description="We need your email address to send you payment information. No spam or marketing materials."
        error={errors.email?.message}
      >
        <Input
          placeholder="Email address"
          type="email"
          error={!!errors.email}
          {...register('email', {
            validate: {
              required: (value) => {
                if (!value || !value.length) {
                  return 'Enter contact email.'
                }
              },
              valid: (value) => {
                if (value && !EMAIL_PATTERN.test(value)) {
                  return 'Enter valid email address.'
                }
                return true
              },
            },
          })}
        />
      </FormField>
      <FormField
        disableErrorAnimation={document.activeElement === titleInputRef.current}
        label="Category for videos"
        description="Choose one of the categories to be assigned to the imported videos by default. You can change it for each video later."
        error={errors.videoCategoryId?.message}
      >
        <Controller
          control={control}
          name="videoCategoryId"
          rules={{
            required: {
              value: true,
              message: 'Select a video category.',
            },
          }}
          render={({ field: { value, onChange, ref } }) => (
            <Select
              items={categoriesSelectItems}
              error={!!errors.videoCategoryId}
              onChange={onChange}
              value={value}
              ref={ref}
            />
          )}
        />
      </FormField>
      <FormField
        optional
        disableErrorAnimation={document.activeElement === titleInputRef.current}
        label="Referrer"
        description="Enter the title of the Joystream channel which recommended the program to you."
        error={errors.referrerChannelTitle?.message}
      >
        <Input
          nodeEnd={
            foundChannel ? (
              <ResolvedAvatar channel={foundChannel} size="bid" />
            ) : (
              isChannelValidating && <Loader variant="xsmall" />
            )
          }
          {...titleRegisterRest}
          placeholder="Channel Name"
          error={!!errors.referrerChannelTitle}
          ref={(e) => {
            ref(e)
            titleInputRef.current = e
          }}
        />
      </FormField>
    </FormFieldsWrapper>
  )
}

type ResolvedAvatarProps = {
  channel?: BasicChannelFieldsFragment
} & AvatarProps
const ResolvedAvatar: FC<ResolvedAvatarProps> = ({ channel }) => {
  const { url, isLoadingAsset } = useAsset(channel?.avatarPhoto)
  return <Avatar assetUrl={url} loading={isLoadingAsset} size="bid" />
}
