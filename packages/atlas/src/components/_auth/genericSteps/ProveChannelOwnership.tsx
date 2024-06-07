import styled from '@emotion/styled'
import { useForm } from 'react-hook-form'

import { AppLogo } from '@/components/AppLogo'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { useMountEffect } from '@/hooks/useMountEffect'
import { cVar } from '@/styles'

type ProveChannelOwnershipProps = {
  onSubmit: (videoUrl: string) => void
  setActionButtonHandler: (fn: () => void | Promise<void>) => void
}
export const ProveChannelOwnership = ({ onSubmit, setActionButtonHandler }: ProveChannelOwnershipProps) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<{ videoUrl: string }>()
  // todo: validation
  // 1. Not a link
  // 2. Video has wrong title - show current title in error
  // 3. Channel that owns the video is already part of the program
  // 4. Other video conditions not met (not specified in the designs)

  useMountEffect(() => {
    setActionButtonHandler(
      handleSubmit((data) => {
        onSubmit(data.videoUrl)
      })
    )
  })

  return (
    <FlexBox flow="column" gap={2}>
      <StyledAppLogo variant="short-monochrome" />
      <Text margin={{ top: 4 }} variant="h500" as="h3">
        Prove channel ownership
      </Text>
      <Text margin={{ bottom: 2 }} variant="t300" as="span" color="colorText">
        Link to unlisted video in your channel titled{' '}
        <Text variant="t300" as="span">
          "Joining Gleev"
        </Text>
        .
      </Text>
      <FormField error={errors.videoUrl?.message}>
        <Input
          {...register('videoUrl', {
            required: 'Please provide video URL.',
          })}
          placeholder="Enter your YouTube video URL"
        />
      </FormField>
    </FlexBox>
  )
}

const StyledAppLogo = styled(AppLogo)`
  height: 36px;
  width: auto;

  path {
    fill: ${cVar('colorTextMuted')};
  }
`
