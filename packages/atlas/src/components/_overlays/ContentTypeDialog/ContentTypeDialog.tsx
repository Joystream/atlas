import { FC } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import discoverView from '@/assets/images/discover-view.webp'
import { Text } from '@/components/Text'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { atlasConfig } from '@/config'

import { CheckboxWrapper, HeaderWrapper, StyledImg } from './ContentTypeDialog.styles'

import { DialogModal } from '../DialogModal'

type ContentTypeDialogProps = {
  onClose: () => void
  isOpen: boolean
  onSubmit: () => void
}

export const ContentTypeDialog: FC<ContentTypeDialogProps> = ({ onClose, isOpen, onSubmit }) => {
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      isSelected: false,
    },
  })
  return (
    <DialogModal
      show={isOpen}
      noContentPadding
      primaryButton={{
        text: 'Continue',
        onClick: () => {
          handleSubmit(() => {
            onSubmit()
          })()
        },
      }}
      secondaryButton={{
        text: 'Cancel',
        onClick: () => {
          reset({ isSelected: false })
          onClose()
        },
      }}
    >
      <StyledImg src={discoverView} alt="Discover subpage" width={480} height={264} />
      <HeaderWrapper>
        <Text variant="h500" as="p" color="colorTextStrong">
          {atlasConfig.general.appName} only supports {atlasConfig.general.appContentFocus} related content
        </Text>
        <Text variant="t200" as="p" color="colorText" margin={{ top: 2 }}>
          Uploading content of any other topic will result in your channel excluded from {atlasConfig.general.appName}{' '}
          by moderators. Joystream Network has multiple Apps connected, so please feel free to check{' '}
          <Link to="https://joystream.org">joystream.org</Link> to find a suitable App for your channel.
        </Text>
      </HeaderWrapper>
      <CheckboxWrapper>
        <Controller
          name="isSelected"
          rules={{
            required: { value: true, message: 'You have to agree to continue' },
          }}
          control={control}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <Checkbox
              caption={error?.message}
              value={value}
              label={`I will upload only ${atlasConfig.general.appContentFocus} related content`}
              onChange={onChange}
              error={!!error?.message}
            />
          )}
        />
      </CheckboxWrapper>
    </DialogModal>
  )
}
