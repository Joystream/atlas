import { FC, useState } from 'react'
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
import { InputAutocomplete } from '@/components/_inputs/InputAutocomplete'
import { Select, SelectItem } from '@/components/_inputs/Select'
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
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<DetailsFormData>()

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
        label="Category for videos"
        description="We need to assign your videos to one of categories below. You can change the category for each video later."
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
            <Select items={categoriesSelectItems} onChange={onChange} value={value} ref={ref} />
          )}
        />
      </FormField>
      <Controller
        name="referrerChannelTitle"
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormField
            optional
            label="Referrer"
            description="Enter the title of the Joystream channel which recommended the program to you."
            error={errors.referrerChannelTitle?.message}
          >
            <InputAutocomplete<GetBasicChannelsQuery, GetBasicChannelsQueryVariables, BasicChannelFieldsFragment>
              documentQuery={GetBasicChannelsDocument}
              queryVariablesFactory={(value) => ({ where: { title_startsWith: value } })}
              perfectMatcher={(res, val) => res.channels.find((channel) => channel.title === val)}
              renderItem={(result) =>
                result.channels.map((channel) => ({
                  ...channel,
                  label: channel.title ?? '',
                }))
              }
              placeholder="Enter channel name"
              selectedItem={value ?? ''}
              onItemSelect={(item) => {
                if (item) {
                  setFoundChannel(item)
                  onChange({ target: { value: item?.title } })
                }
              }}
              nodeEnd={foundChannel && <ResolvedAvatar channel={foundChannel} size="bid" />}
              clearSelection={() => {
                onChange(undefined)
                setFoundChannel(undefined)
              }}
            />
          </FormField>
        )}
      />
    </FormFieldsWrapper>
  )
}

type ResolvedAvatarProps = {
  channel?: BasicChannelFieldsFragment
} & AvatarProps
export const ResolvedAvatar: FC<ResolvedAvatarProps> = ({ channel }) => {
  const { url, isLoadingAsset } = useAsset(channel?.avatarPhoto)
  return <Avatar assetUrl={url} loading={isLoadingAsset} size="bid" />
}
