import { useApolloClient } from '@apollo/client'
import debouncePromise from 'awesome-debounce-promise'
import { FC, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { GetBasicChannelsQuery, GetBasicChannelsQueryVariables } from '@/api/queries/__generated__/channels.generated'
import { BasicChannelFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { GetMembershipsDocument } from '@/api/queries/__generated__/memberships.generated'
import { Avatar, AvatarProps } from '@/components/Avatar'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { Loader } from '@/components/_loaders/Loader'
import { EMAIL_PATTERN } from '@/config/regex'
import { useAsset } from '@/providers/assets/assets.hooks'
import { SentryLogger } from '@/utils/logs'

import { FormFieldsWrapper } from './DetailsFormDialog.styles'

export const DetailsFormDialog: FC = () => {
  const [foundChannel, setFoundChannel] = useState<BasicChannelFieldsFragment | null>()
  const [loading, setLoading] = useState(false)
  const client = useApolloClient()
  const {
    setValue,
    register,
    control,
    formState: { errors },
  } = useForm<{ email: string | undefined; channel: string | undefined }>({ mode: 'onChange' })

  const debounceFetchChannels = useRef(
    debouncePromise(async (value?: string) => {
      if (!value) {
        return
      }
      try {
        const {
          data: { channels },
        } = await client.query<GetBasicChannelsQuery, GetBasicChannelsQueryVariables>({
          query: GetMembershipsDocument,
          variables: { where: { title_eq: value } },
        })
        setFoundChannel(channels.length ? channels[0] : undefined)
      } catch (error) {
        SentryLogger.error('Failed to fetch memberships', 'WhiteListTextField', error)
      } finally {
        setLoading(false)
      }
    }, 500)
  )
  return (
    <FormFieldsWrapper>
      <FormField
        label="Contact email"
        description="We need your email address to send you payment information. No spam or marketing materials."
        error={errors.email?.message}
      >
        <Controller
          control={control}
          name="email"
          rules={{
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
          }}
          render={({ field: { value, onChange } }) => (
            <Input placeholder="Email address" type="email" value={value} onChange={onChange} error={!!errors.email} />
          )}
        />
      </FormField>
      <FormField
        optional
        label="Referrer"
        description="Enter the handle of the Joystream channel which recommended the program to you."
        error={errors.channel?.message}
      >
        <Input
          {...register('channel', {
            validate: {
              required: (value) => {
                if (value && value.length && !foundChannel && !loading) {
                  return 'No member with this handle has been found.'
                }
                return true
              },
            },
            onChange: (event) => {
              const { value } = event.target
              setLoading(true)
              setValue('channel', event.target.value, { shouldTouch: true, shouldDirty: true })
              if (value.length) {
                debounceFetchChannels.current(value)
              } else {
                setLoading(false)
                setFoundChannel(null)
              }
            },
          })}
          nodeEnd={
            foundChannel ? <ResolvedAvatar channel={foundChannel} size="bid" /> : loading && <Loader variant="xsmall" />
          }
          placeholder="Channel handle"
          error={!!errors.channel}
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
