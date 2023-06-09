import styled from '@emotion/styled'
import BN from 'bn.js'
import { FC, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Fee } from '@/components/Fee'
import { FormField } from '@/components/_inputs/FormField'
import { TokenInput } from '@/components/_inputs/TokenInput'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { tokenNumberToHapiBn } from '@/joystream-lib/utils'
import { useFee } from '@/providers/joystream/joystream.hooks'
import { sizes } from '@/styles'

type ChangePriceDialogProps = {
  onModalClose: () => void
  isOpen: boolean
  currentPrice: number
  onChangePrice: (id: string, price: BN) => void
  nftId: string | null
  memberId: string | null
}

export const ChangePriceDialog: FC<ChangePriceDialogProps> = ({
  onModalClose,
  isOpen,
  currentPrice,
  onChangePrice,
  nftId,
  memberId,
}) => {
  const {
    reset,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<{ price: number }>({
    defaultValues: {
      price: currentPrice,
    },
  })
  const amountBn = tokenNumberToHapiBn(watch('price') || 0)
  const { fullFee, loading: feeLoading } = useFee(
    'changeNftPriceTx',
    isOpen && memberId && nftId ? [memberId, nftId, amountBn.toString()] : undefined
  )

  useEffect(() => {
    reset({ price: currentPrice })
  }, [currentPrice, reset])

  useEffect(() => {
    if (!isOpen) {
      reset({ price: currentPrice })
    }
  }, [currentPrice, isOpen, reset])

  const handleSubmitPriceChange = () => {
    handleSubmit((data) => {
      if (!nftId) {
        return
      }
      onChangePrice(nftId, tokenNumberToHapiBn(data.price))
    })()
  }

  return (
    <DialogModal
      title="Change price"
      show={isOpen}
      primaryButton={{
        text: 'Change price',
        onClick: handleSubmitPriceChange,
      }}
      secondaryButton={{
        text: 'Cancel',
        onClick: onModalClose,
      }}
      onExitClick={onModalClose}
      additionalActionsNode={<Fee amount={fullFee} loading={feeLoading} variant="h200" />}
    >
      <>
        <Controller
          control={control}
          name="price"
          rules={{
            validate: {
              valid: (val) => {
                if (!val) {
                  return 'Provide a price.'
                }
                if (val === currentPrice) {
                  return 'Provide new price.'
                }
              },
            },
          }}
          render={({ field: { onChange, value } }) => (
            <FormField error={errors.price?.message}>
              <StyledTokenInput value={value} onChange={(value) => onChange(value)} />
            </FormField>
          )}
        />
      </>
    </DialogModal>
  )
}

export const StyledTokenInput = styled(TokenInput)`
  margin-top: ${sizes(6)};
`
