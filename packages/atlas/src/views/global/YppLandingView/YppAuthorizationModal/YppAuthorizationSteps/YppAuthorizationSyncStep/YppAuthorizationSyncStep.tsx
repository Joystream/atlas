import { Controller, useFormContext } from 'react-hook-form'

import { SvgAlertsWarning24 } from '@/assets/icons'
import { FormField } from '@/components/_inputs/FormField'
import { OptionCardGroupRadio } from '@/components/_inputs/OptionCardGroup'
import { Select, SelectItem } from '@/components/_inputs/Select'
import { displayCategories } from '@/config/categories'

import { FormWrapper, StyledBanner } from './YppAuthorizationSyncStep.styles'

export type YppSyncStepData = {
  shouldBeIngested?: boolean
  videoCategoryId?: string
}

const categoriesSelectItems: SelectItem[] =
  displayCategories?.map((c) => ({
    name: c.name || 'Unknown category',
    value: c.defaultVideoCategory,
  })) || []

export const YppAuthorizationSyncStep = () => {
  const {
    watch,
    control,
    formState: { errors },
  } = useFormContext<YppSyncStepData>()
  const isSyncActive = watch('shouldBeIngested')

  return (
    <FormWrapper>
      <Controller
        control={control}
        name="shouldBeIngested"
        render={({ field: { onChange, value } }) => (
          <OptionCardGroupRadio
            selectedValue={value}
            onChange={(value) => onChange(value)}
            direction="vertical"
            options={[
              {
                label: 'Import my YouTube videos',
                caption: 'Imports your past and future videos',
                value: true,
              },
              {
                label: "Don't import my YouTube videos",
                caption: "Won't import any of your videos",
                value: false,
              },
            ]}
          />
        )}
      />
      {isSyncActive ? (
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
      ) : (
        <StyledBanner
          title="Only auto-synced videos are rewarded"
          description="Manually uploaded videos are not qualifying for programme rewards. To get rewards for content upload consider switching to syncing Youtube videos."
          icon={<SvgAlertsWarning24 />}
        />
      )}
    </FormWrapper>
  )
}
