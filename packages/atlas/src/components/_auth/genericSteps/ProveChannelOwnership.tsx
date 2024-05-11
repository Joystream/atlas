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
      <Text variant="h500" as="h3">
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
