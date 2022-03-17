import { addMonths } from 'date-fns'
import React, { useEffect } from 'react'
import {
  Control,
  Controller,
  DeepMap,
  FieldError,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'

import { Pill } from '@/components/Pill'
import { Text } from '@/components/Text'
import { AuctionDatePicker } from '@/components/_inputs/AuctionDatePicker'
import { FormField } from '@/components/_inputs/FormField'
import { TextField } from '@/components/_inputs/TextField'
import { cVar } from '@/styles'
import { pluralizeNoun } from '@/utils/misc'
import { formatNumber } from '@/utils/number'

import { AuctionDatePickerWrapper, DaysSummary, DaysSummaryInfo, Header, StyledFormField } from './SetUp.styles'

import { useNftForm } from '../NftForm.hooks'
import { AuctionDurationTooltipFooter } from '../NftForm.styles'
import { Listing, NftFormData } from '../NftForm.types'
import { getTotalDaysAndHours } from '../NftForm.utils'

type SetUpProps = {
  register: UseFormRegister<NftFormData>
  selectedType: Listing
  setValue: UseFormSetValue<NftFormData>
  activeInputs: string[]
  setActiveInputs: React.Dispatch<React.SetStateAction<string[]>>
  reset: UseFormReset<NftFormData>
  formData: NftFormData
  watch: UseFormWatch<NftFormData>
  control: Control<NftFormData>
  errors: DeepMap<NftFormData, FieldError>
}

const MAX_DATE = addMonths(new Date(), 5) // TODO: value to be discussed

export const SetUp: React.FC<SetUpProps> = ({
  register,
  selectedType,
  setValue,
  activeInputs,
  setActiveInputs,
  reset,
  formData,
  watch,
  control,
}) => {
  const startDate = watch('startDate')
  const endDate = watch('endDate')

  const { getNumberOfBlocks } = useNftForm()

  const numberOfBlocks = getNumberOfBlocks(startDate, endDate) || 0

  const totalDaysAndHours = getTotalDaysAndHours(startDate, endDate)

  useEffect(() => {
    if (!numberOfBlocks) {
      return
    }
    setValue('auctionDurationBlocks', numberOfBlocks as never)
  }, [numberOfBlocks, setValue])

  const toggleActiveInput = (event?: React.ChangeEvent<HTMLInputElement>) => {
    if (!event) {
      return
    }
    const { name } = event.target
    setActiveInputs((prevState) => {
      if (!prevState.includes(name)) {
        return [...prevState, name]
      }
      if (name === 'auctionDuration') {
        setValue('startDate', null)
        setValue('endDate', null)
      } else {
        reset({ ...formData, [name]: undefined })
      }
      return prevState.filter((inputName) => inputName !== name)
    })
  }

  const headerText = {
    'Auction': {
      header: 'Auction',
      caption: 'Choose settings of your listing. All fields are optional.',
    },
    'Fixed price': {
      header: 'Buy now',
      caption: 'No bids will be accepted, only a purchase for fixed price will complete the sale.',
    },
    'Not for sale': {
      header: 'Not for sale',
      caption: 'No bids will be accepted, only a purchase for fixed price will complete the sale.',
    },
  }

  const days = [null, 1, 3, 5, 7] as const

  const expirationDateItems = days.map((value) => ({
    name: value === null ? 'No expiration date' : pluralizeNoun(value, 'day'),
    value:
      value === null
        ? null
        : {
            type: 'duration' as const,
            durationDays: value,
          },
  }))

  return (
    <>
      <Header variant="h500">{selectedType && headerText[selectedType].header}</Header>
      <Text variant="t300" secondary>
        {selectedType && headerText[selectedType].caption}
      </Text>
      <form>
        {selectedType === 'Fixed price' && (
          <StyledFormField title="">
            <TextField {...register('buyNowPrice', { required: true })} type="number" nodeEnd={<Pill label="tJoy" />} />
          </StyledFormField>
        )}
        {selectedType === 'Auction' && (
          <>
            <FormField
              title="Minimum bid"
              switchProps={{
                name: 'startingPrice',
                onChange: toggleActiveInput,
                value: activeInputs.includes('startingPrice'),
              }}
              infoTooltip={{ text: 'Its the starting price of your auction. No lower bids will be accepted' }}
            >
              <TextField
                {...register('startingPrice', { valueAsNumber: true })}
                type="number"
                nodeEnd={<Pill label="tJOY" />}
                disabled={!activeInputs.includes('startingPrice')}
              />
            </FormField>
            <FormField
              title="Fixed price"
              switchProps={{
                name: 'buyNowPrice',
                onChange: toggleActiveInput,
                value: activeInputs.includes('buyNowPrice'),
              }}
              infoTooltip={{
                text: 'Sell your Nft for a predefined price. When this price is reached it automaticly ends auction',
              }}
            >
              <TextField
                {...register('buyNowPrice', { valueAsNumber: true })}
                type="number"
                nodeEnd={<Pill label="tJOY" />}
                disabled={!activeInputs.includes('buyNowPrice')}
              />
            </FormField>
            <FormField
              title="Auction duration"
              switchProps={{
                name: 'auctionDuration',
                onChange: toggleActiveInput,
                value: activeInputs.includes('auctionDuration'),
              }}
              infoTooltip={{
                text: 'You can set the auction expiration date by setting its duration. When active - highest bid wins at the time of auction end.',
              }}
            >
              <AuctionDatePickerWrapper>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <AuctionDatePicker
                      size="regular"
                      label="Starting date"
                      error={!!error}
                      helperText={error?.message}
                      minDate={new Date()}
                      maxDate={(endDate?.type === 'date' && endDate.date) || MAX_DATE}
                      disabled={!activeInputs.includes('auctionDuration')}
                      items={[
                        {
                          value: null,
                          name: 'Right after listing',
                        },
                      ]}
                      onChange={onChange}
                      value={value}
                    />
                  )}
                />
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <AuctionDatePicker
                      size="regular"
                      label="expiration date"
                      error={!!error}
                      helperText={error?.message}
                      minDate={(startDate?.type === 'date' && startDate.date) || new Date()}
                      maxDate={MAX_DATE}
                      disabled={!activeInputs.includes('auctionDuration')}
                      onChange={onChange}
                      items={expirationDateItems}
                      value={value}
                    />
                  )}
                />
              </AuctionDatePickerWrapper>
            </FormField>
            {numberOfBlocks > 0 && (
              <DaysSummary>
                <Text variant="t200-strong" color={cVar('colorTextMuted', true)}>
                  Total:
                </Text>
                &nbsp;
                <Text variant="t200-strong">{totalDaysAndHours}</Text>
                &nbsp;
                <Text variant="t200-strong" secondary>
                  / {formatNumber(numberOfBlocks)} Blocks
                </Text>
                <DaysSummaryInfo
                  text="It’s the time when your auction will become active and buyer will be able to make an offer"
                  placement="top"
                  footer={
                    <AuctionDurationTooltipFooter>
                      <Text variant="t100">
                        {totalDaysAndHours} = {formatNumber(numberOfBlocks)}
                      </Text>
                    </AuctionDurationTooltipFooter>
                  }
                />
              </DaysSummary>
            )}
          </>
        )}
      </form>
    </>
  )
}
