import styled from '@emotion/styled'
import { mnemonicGenerate } from '@polkadot/util-crypto'
import { useCallback, useEffect, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { AppLogo } from '@/components/AppLogo'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { FormField } from '@/components/_inputs/FormField'
import { TextArea } from '@/components/_inputs/TextArea'
import { useMountEffect } from '@/hooks/useMountEffect'
import { cVar, sizes } from '@/styles'

type SeedGenerationForm = {
  allowDownload: boolean
  mnemonic: string
}

type SeedGenerationProps = {
  onSubmit: (data: SeedGenerationForm) => void
  setActionButtonHandler: (fn: () => void | Promise<void>) => void
  defaultValues?: SeedGenerationForm
}

export const SeedGeneration = ({ setActionButtonHandler, onSubmit, defaultValues }: SeedGenerationProps) => {
  const { control, register, handleSubmit, setValue } = useForm<SeedGenerationForm>({
    shouldFocusError: true,
    defaultValues: {
      allowDownload: true,
      mnemonic: defaultValues?.mnemonic,
    },
  })
  const { mnemonic } = defaultValues ?? {}
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current && !mnemonic) {
      setValue('mnemonic', mnemonicGenerate())
      firstRender.current = false
    }
  }, [mnemonic, setValue])

  const handleGoToNextStep = useCallback(() => {
    handleSubmit((data) => {
      const downloadSeed = () => {
        const blobText = new Blob([data.mnemonic], { type: 'text/plain' })
        const url = URL.createObjectURL(blobText)
        const link = document.createElement('a')
        link.href = url
        link.download = 'mnemonic.txt'
        link.click()

        link.remove()
        URL.revokeObjectURL(url)
      }

      onSubmit(data)
      if (data.allowDownload) {
        downloadSeed()
      }
    })()
  }, [handleSubmit, onSubmit])

  useMountEffect(() => {
    setActionButtonHandler(() => handleGoToNextStep())
  })

  return (
    <FlexBox flow="column" gap={6}>
      <StyledAppLogo variant="short-monochrome" />
      <FlexBox flow="column" gap={2}>
        <Text variant="h500" as="h3">
          Write down your seed
        </Text>
        <Text margin={{ bottom: 2 }} variant="t300" as="span" color="colorText">
          Please write down your password recovery seed and keep it in a safe place. It's the only way to recover your
          password if you forget it.
        </Text>
      </FlexBox>

      <StyledSignUpForm>
        <FormField label="Password recovery seed">
          <StyledTextArea data-ls-disabled {...register('mnemonic')} disabled />
        </FormField>
        <Controller
          control={control}
          name="allowDownload"
          render={({ field: { onChange, value } }) => (
            <Checkbox
              onChange={(val) => onChange(val)}
              value={value}
              label="Download the wallet seed as .txt file"
              caption="Download will start after clicking continue"
            />
          )}
        />
      </StyledSignUpForm>
    </FlexBox>
  )
}

const StyledSignUpForm = styled.form<{ additionalPaddingBottom?: boolean }>`
  display: grid;
  width: 100%;
  gap: ${sizes(6)};
  padding-bottom: ${({ additionalPaddingBottom }) =>
    additionalPaddingBottom ? 'var(--local-size-dialog-padding)' : 0};
`

const StyledTextArea = styled(TextArea)`
  color: ${cVar('colorTextCaution')};
  resize: none;

  :disabled {
    cursor: auto;
    opacity: 1;
  }
`

const StyledAppLogo = styled(AppLogo)`
  height: 36px;
  width: auto;

  path {
    fill: ${cVar('colorTextMuted')};
  }
`
