import { FC, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import {
  GetExtendedBasicChannelsDocument,
  GetExtendedFullChannelsQuery,
  GetExtendedFullChannelsQueryVariables,
} from '@/api/queries/__generated__/channels.generated'
import {
  ExtendedFullChannelFieldsFragment,
  FullChannelFieldsFragment,
} from '@/api/queries/__generated__/fragments.generated'
import { Avatar } from '@/components/Avatar'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { InputAutocomplete } from '@/components/_inputs/InputAutocomplete'
import { atlasConfig } from '@/config'
import { EMAIL_PATTERN } from '@/config/regex'
import { useUser } from '@/providers/user/user.hooks'

import { FormFieldsWrapper } from './YppAuthorizationDetailsFormStep.styles'

export type DetailsFormData = {
  email: string | undefined
  referrerChannelTitle: string | undefined
  referrerChannelId: string | undefined
}

export const YppAuthorizationDetailsFormStep: FC = () => {
  const [foundChannel, setFoundChannel] = useState<FullChannelFieldsFragment | null>()
  const { memberId } = useUser()
  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = useFormContext<DetailsFormData>()

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
      <Controller
        name="referrerChannelTitle"
        control={control}
        rules={{
          validate: (value) => {
            if (value && !foundChannel) {
              return 'No channel with this title has been found.'
            }
            return true
          },
        }}
        render={({ field: { onChange, value } }) => (
          <FormField
            optional
            label="Referrer"
            description={`Enter the title of the ${atlasConfig.general.appName} channel which recommended the program to you.`}
            error={errors.referrerChannelTitle?.message}
          >
            <InputAutocomplete<
              GetExtendedFullChannelsQuery,
              GetExtendedFullChannelsQueryVariables,
              ExtendedFullChannelFieldsFragment
            >
              notFoundLabel="Channel with this title not found, please check spelling and try again."
              documentQuery={GetExtendedBasicChannelsDocument}
              queryVariablesFactory={(value) => ({
                where: {
                  channel: {
                    title_startsWith: value,
                    ownerMember: {
                      id_not_eq: memberId,
                    },
                  },
                },
              })}
              perfectMatcher={(res, val) =>
                res.extendedChannels.find((extendedChannel) => extendedChannel.channel.title === val)
              }
              renderItem={(result) =>
                result.extendedChannels.map((extendedChannel) => ({
                  ...extendedChannel,
                  label: extendedChannel.channel.title ?? '',
                }))
              }
              placeholder="Channel Name"
              value={value ?? ''}
              onChange={onChange}
              onItemSelect={(item) => {
                if (item) {
                  setFoundChannel(item.channel)
                  onChange({ target: { value: item?.channel.title } })
                  setValue('referrerChannelId', item.channel.id)
                }
              }}
              nodeEnd={foundChannel && <Avatar assetUrl={foundChannel.avatarPhoto?.resolvedUrl} size="bid" />}
              clearSelection={() => {
                setFoundChannel(undefined)
              }}
            />
          </FormField>
        )}
      />
    </FormFieldsWrapper>
  )
}
