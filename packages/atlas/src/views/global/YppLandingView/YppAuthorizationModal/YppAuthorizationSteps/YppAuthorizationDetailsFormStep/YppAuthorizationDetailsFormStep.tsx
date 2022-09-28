import { useApolloClient } from '@apollo/client'
import debouncePromise from 'awesome-debounce-promise'
import { FC, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import {
  GetBasicChannelsConnectionDocument,
  GetBasicChannelsConnectionQuery,
  GetBasicChannelsConnectionQueryVariables,
} from '@/api/queries/__generated__/channels.generated'
import { BasicChannelFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { Avatar, AvatarProps } from '@/components/Avatar'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { Loader } from '@/components/_loaders/Loader'
import { EMAIL_PATTERN } from '@/config/regex'
import { useAsset } from '@/providers/assets/assets.hooks'
import { SentryLogger } from '@/utils/logs'

import { FormFieldsWrapper } from './YppAuthorizationDetailsFormStep.styles'

export const YppAuthorizationDetailsFormStep: FC = () => {
  const [foundChannel, setFoundChannel] = useState<BasicChannelFieldsFragment | null>()
  const [loading, setLoading] = useState(false)
  const client = useApolloClient()
  const {
    setValue,
    control,
    formState: { errors },
  } = useForm<{ email: string | undefined; channel: string | undefined }>()

  // TODO: make sure it's working properly when implementing in app
  const debounceFetchChannels = useRef(
    debouncePromise(async (value?: string) => {
      if (!value || !value.length) {
        return
      }
      try {
        const {
          data: { channelsConnection },
        } = await client.query<GetBasicChannelsConnectionQuery, GetBasicChannelsConnectionQueryVariables>({
          query: GetBasicChannelsConnectionDocument,
          variables: { where: { title_contains: value } },
        })
        setFoundChannel(channelsConnection.edges.length ? channelsConnection.edges[0].node : undefined)
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
        <Controller
          control={control}
          name="channel"
          rules={{
            // TODO: add validation when implementing, for now it would be impossible to walidate it
            validate: {},
          }}
          render={({ field: { value, onChange } }) => (
            <Input
              nodeEnd={
                foundChannel ? (
                  <ResolvedAvatar channel={foundChannel} size="bid" />
                ) : (
                  loading && <Loader variant="xsmall" />
                )
              }
              onChange={(event) => {
                const { value } = event.target
                setLoading(true)
                setValue('channel', event.target.value, { shouldTouch: true, shouldDirty: true })
                debounceFetchChannels.current(value)
                if (!value.length) {
                  setLoading(false)
                  setFoundChannel(null)
                }
                onChange()
              }}
              value={value}
              placeholder="Channel handle"
              error={!!errors.channel}
            />
          )}
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
