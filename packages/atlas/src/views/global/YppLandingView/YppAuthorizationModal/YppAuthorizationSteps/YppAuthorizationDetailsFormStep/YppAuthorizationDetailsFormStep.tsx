import { FC, useCallback, useEffect, useState } from 'react'
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
import { InputAutocomplete } from '@/components/_inputs/InputAutocomplete'
import { Select, SelectItem } from '@/components/_inputs/Select'
import { atlasConfig } from '@/config'
import { displayCategories } from '@/config/categories'
import { useUser } from '@/providers/user/user.hooks'
import { useYppStore } from '@/providers/ypp/ypp.store'

import { FormFieldsWrapper } from './YppAuthorizationDetailsFormStep.styles'

export type DetailsFormData = {
  referrerChannelTitle: string | undefined
  referrerChannelId: string | undefined
  videoCategoryId?: string
}

const categoriesSelectItems: SelectItem[] =
  displayCategories?.map((c) => ({
    name: c.name || 'Unknown category',
    value: c.defaultVideoCategory,
  })) || []

export const YppAuthorizationDetailsFormStep: FC = () => {
  const [foundChannel, setFoundChannel] = useState<FullChannelFieldsFragment | null>()
  const { memberId } = useUser()
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext<DetailsFormData>()

  const referrerId = useYppStore((state) => state.referrerId)

  useEffect(() => {
    if (referrerId) {
      setValue('referrerChannelId', referrerId)
    }
  }, [referrerId, setValue])

  const queryVariablesFactory = useCallback(
    (value: string) => ({
      where: {
        channel: {
          title_startsWith: value,
          ownerMember: {
            id_not_eq: memberId,
          },
        },
      },
    }),
    [memberId]
  )

  return (
    <FormFieldsWrapper>
      <FormField
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
            <Select items={categoriesSelectItems} onChange={onChange} value={value} ref={ref} />
          )}
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
              queryVariablesFactory={queryVariablesFactory}
              perfectMatcher={(res, val) => {
                const initialResults = res.extendedChannels.filter(
                  (extendedChannel) => extendedChannel.channel.title === val
                )
                if (initialResults.length === 1 || !referrerId) {
                  return initialResults[0]
                }

                return (
                  initialResults.find((extendedChannel) => extendedChannel.channel.id === referrerId) ??
                  initialResults[0]
                )
              }}
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
              nodeEnd={foundChannel && <Avatar assetUrls={foundChannel.avatarPhoto?.resolvedUrls} size={24} />}
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
