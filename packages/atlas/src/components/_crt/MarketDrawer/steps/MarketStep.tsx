import { FC, useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { SvgActionPlay } from '@/assets/icons'
import { ActionDialogButtonProps } from '@/components/ActionBar'
import { FlexBox } from '@/components/FlexBox'
import { NumberFormat } from '@/components/NumberFormat'
import { ColumnBox } from '@/components/ProgressWidget/ProgressWidget.styles'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { CrtMarketForm } from '@/components/_crt/MarketDrawer/MarketDrawer.types'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { FormField } from '@/components/_inputs/FormField'
import { TextArea } from '@/components/_inputs/TextArea'
import { TokenInput } from '@/components/_inputs/TokenInput'
import { atlasConfig } from '@/config'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useJoystream } from '@/providers/joystream'

type MarketStepProps = {
  setPrimaryButtonProps: (props: ActionDialogButtonProps) => void
  setSecondaryButtonProps: (props: ActionDialogButtonProps) => void
  tokenName: string
  formDefaultValue: CrtMarketForm
  onClose: () => void
  onNextStep: (props: CrtMarketForm) => void
  handlePriceChange: (val: number) => void
}

const DEFAULT_MIN_PRICE = 0.01

export const MarketStep: FC<MarketStepProps> = ({
  tokenName,
  setPrimaryButtonProps,
  onNextStep,
  formDefaultValue,
  setSecondaryButtonProps,
  onClose,
  handlePriceChange,
}) => {
  const { tokenPrice } = useJoystream()
  const {
    control,
    handleSubmit,
    resetField,
    watch,
    formState: { isDirty, errors },
  } = useForm<CrtMarketForm>({
    defaultValues: formDefaultValue,
  })

  const priceWatch = watch('price')

  useEffect(() => {
    handlePriceChange(priceWatch)
  }, [handlePriceChange, priceWatch])

  const [openDialog, closeDialog] = useConfirmationModal({
    type: 'warning',
    title: 'Discard changes?',
    description:
      'You have unsaved changes which are going to be lost if you close this window. Are you sure you want to continue?',
    primaryButton: {
      variant: 'warning',
      text: 'Confirm and discard',
      onClick: () => {
        closeDialog()
        onClose()
      },
    },
    secondaryButton: {
      text: 'Cancel',
      onClick: () => closeDialog(),
    },
  })

  const isChecked = watch('isChecked')
  const price = watch('price')

  const tokenInUsd = (price || 0) * (tokenPrice || 0)

  const handleGoToNextStep = useCallback(() => {
    handleSubmit((data) => {
      onNextStep(data)
    })()
  }, [handleSubmit, onNextStep])

  useEffect(() => {
    setPrimaryButtonProps({
      text: 'Next',
      onClick: () => {
        handleGoToNextStep()
      },
    })
    setSecondaryButtonProps({
      text: 'Cancel',
      onClick: () => (isDirty ? onClose() : openDialog()),
    })
  }, [handleGoToNextStep, isDirty, onClose, openDialog, setPrimaryButtonProps, setSecondaryButtonProps])

  return (
    <ColumnBox gap={2}>
      <FlexBox alignItems="center">
        <Text variant="h500" as="span" margin={{ right: 4 }}>
          Market
        </Text>
        <TextButton as="span" icon={<SvgActionPlay />} iconPlacement="left" color="colorTextPrimary">
          Learn more
        </TextButton>
      </FlexBox>
      <Text variant="t300" color="colorText" as="p" margin={{ bottom: 4 }}>
        Automated market maker (AMM) will increase ${tokenName} price after each purchase and decrease its price when
        someone sells it to the AMM.
      </Text>
      <FormField
        label="Starting price for token"
        description={
          <div>
            You cannot set price lower than <NumberFormat value={DEFAULT_MIN_PRICE} as="span" withToken />
          </div>
        }
        error={errors.price?.message}
      >
        <Controller
          control={control}
          render={({ field: { value: price, onChange: setPrice } }) => (
            <TokenInput
              error={!!errors.price}
              value={price}
              onChange={setPrice}
              nodeEnd={
                <Text variant="t300" as="p" color="colorTextMuted">
                  ${tokenInUsd.toFixed(price < 1 ? 5 : 2)}
                </Text>
              }
            />
          )}
          rules={{
            validate: {
              price: (value) => {
                if (!value) {
                  return 'Enter starting token price'
                }
                return true
              },
              minPrice: (value) => {
                if (value < DEFAULT_MIN_PRICE) {
                  return `Price cannot be lower than ${DEFAULT_MIN_PRICE} ${atlasConfig.joystream.tokenTicker}`
                }
                return true
              },
            },
          }}
          name="price"
        />
      </FormField>

      <FormField
        label="Terms and conditions"
        description="Change default rules if you want to add some additional terms."
        error={errors.tnc?.message}
      >
        <Controller
          control={control}
          render={({ field: { value: isChecked, onChange } }) => (
            <Checkbox
              value={isChecked}
              label="Keep the default terms & conditions"
              onChange={(checked) => {
                if (checked) {
                  resetField('tnc')
                }
                onChange(checked)
              }}
            />
          )}
          name="isChecked"
        />
        <Controller
          control={control}
          rules={{
            validate: {
              value: (value) => {
                if (!value) {
                  return 'You need to fill in the terms and conditions to proceed'
                }
                return true
              },
            },
          }}
          render={({ field: { value: tnc, onChange } }) => (
            <TextArea rows={7} value={tnc} disabled={isChecked} onChange={onChange} />
          )}
          name="tnc"
        />
      </FormField>
    </ColumnBox>
  )
}
