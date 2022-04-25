import React, { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { Pill } from '@/components/Pill'
import { Text } from '@/components/Text'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { AuctionDatePicker } from '@/components/_inputs/AuctionDatePicker'
import { FormField } from '@/components/_inputs/FormField'
import { MemberComboBox } from '@/components/_inputs/MemberComboBox'
import { OptionCardRadio } from '@/components/_inputs/OptionCard'
import { TextField } from '@/components/_inputs/TextField'
import { useTokenPrice } from '@/providers/joystream'
import { cVar } from '@/styles'
import { pluralizeNoun } from '@/utils/misc'
import { formatNumber } from '@/utils/number'

import {
  AuctionDatePickerWrapper,
  DaysSummary,
  DaysSummaryInfo,
  Header,
  OptionCardRadioWrapper,
  StyledFormField,
} from './SetUp.styles'

import { useNftFormUtils } from '../NftForm.hooks'
import { AuctionDurationTooltipFooter } from '../NftForm.styles'
import { Listing, NftFormFields } from '../NftForm.types'
import { getTotalDaysAndHours } from '../NftForm.utils'

type SetUpProps = {
  maxStartDate: Date
  maxEndDate: Date
  selectedType: Listing
  activeInputs: string[]
  setActiveInputs: React.Dispatch<React.SetStateAction<string[]>>
}

export const SetUp: React.FC<SetUpProps> = ({
  selectedType,
  activeInputs,
  setActiveInputs,
  maxEndDate,
  maxStartDate,
}) => {
  const {
    register,
    setValue,
    getValues,
    watch,
    reset,
    trigger,
    control,
    formState: { errors },
  } = useFormContext<NftFormFields>()

  const startDate = watch('startDate')
  const endDate = watch('endDate')

  const { getNumberOfBlocks, chainState } = useNftFormUtils()
  const { convertToUSD } = useTokenPrice()

  const numberOfBlocks = getNumberOfBlocks(startDate, endDate) || 0

  const totalDaysAndHours = getTotalDaysAndHours(startDate, endDate)
  const isEnglishAuction = watch('type') === 'english'
  const buyNowPrice = watch('buyNowPrice')
  const startingPrice = watch('startingPrice')

  useEffect(() => {
    setTimeout(() => {
      setValue(
        'endDate',
        isEnglishAuction
          ? getValues('endDate') || {
              type: 'duration',
              durationDays: 1,
            }
          : null
      )
    }, 0)
  }, [getValues, isEnglishAuction, setValue])

  useEffect(() => {
    setValue('auctionDurationBlocks', numberOfBlocks || undefined)
  }, [numberOfBlocks, setValue])

  const toggleActiveInput = (event?: React.ChangeEvent<HTMLInputElement>) => {
    if (!event) {
      return
    }
    const { name } = event.target
    setActiveInputs((prevState) => {
      if (!prevState.includes(name)) {
        if (name === 'buyNowPrice') {
          setValue('buyNowPrice', 2)
          trigger() // trigger form validation to make sure starting price is valid
        }
        return [...prevState, name]
      }
      if (name === 'whitelistedMembers') {
        setValue('whitelistedMembers', [])
      }
      if (name === 'auctionDuration') {
        setValue('startDate', null)
        setValue('endDate', null)
      } else if (name === 'startingPrice') {
        setValue('startingPrice', chainState.nftMinStartingPrice || undefined)
      } else {
        reset({ ...getValues(), [name]: undefined })
      }
      return prevState.filter((inputName) => inputName !== name)
    })
  }

  const headerText = {
    'Auction': {
      header: 'Auction',
      caption: 'All fields are optional. If minimum bid is not specified collectors can make any offer.',
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

  const days = [1, 3, 5, 7] as const

  const expirationDateItems = days.map((value) => ({
    name: pluralizeNoun(value, 'day'),
    value: {
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
            <TextField
              {...register('buyNowPrice', { valueAsNumber: true })}
              type="number"
              nodeStart={<JoyTokenIcon variant="gray" size={24} />}
              nodeEnd={!!buyNowPrice && <Pill variant="overlay" label={`${convertToUSD(buyNowPrice)}`} />}
              error={!!errors.buyNowPrice}
              helperText={errors.buyNowPrice?.message}
            />
          </StyledFormField>
        )}
        {selectedType === 'Auction' && (
          <>
            <Controller
              name="type"
              control={control}
              defaultValue="open"
              render={({ field: { value, onChange } }) => (
                <OptionCardRadioWrapper>
                  <OptionCardRadio
                    value="open"
                    label="Open auction"
                    helperText="Cancel anytime & pick the winning bid"
                    onChange={() => onChange('open')}
                    selectedValue={value}
                  />
                  <OptionCardRadio
                    value="english"
                    label="Timed auction"
                    helperText="Cannot be canceled & highest bidder wins"
                    onChange={() => onChange('english')}
                    selectedValue={value}
                  />
                </OptionCardRadioWrapper>
              )}
            />
            <AuctionDatePickerWrapper columns={isEnglishAuction ? 2 : 1}>
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
                    maxDate={endDate?.type === 'date' && endDate.date < maxStartDate ? endDate.date : maxStartDate}
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
              {isEnglishAuction && (
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
                      maxDate={maxEndDate}
                      onChange={onChange}
                      items={expirationDateItems}
                      value={
                        value || {
                          type: 'duration',
                          durationDays: 1,
                        }
                      }
                    />
                  )}
                />
              )}
            </AuctionDatePickerWrapper>
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
                  customContent={
                    <AuctionDurationTooltipFooter>
                      <Text variant="t100">
                        {totalDaysAndHours} = {formatNumber(numberOfBlocks)}
                      </Text>
                    </AuctionDurationTooltipFooter>
                  }
                />
              </DaysSummary>
            )}
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
                defaultValue={chainState.nftMinStartingPrice?.toString()}
                nodeStart={<JoyTokenIcon variant="gray" size={24} />}
                nodeEnd={!!startingPrice && <Pill variant="overlay" label={`${convertToUSD(startingPrice)}`} />}
                disabled={!activeInputs.includes('startingPrice')}
                error={!!errors.startingPrice}
                helperText={errors.startingPrice?.message}
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
                placeholder="—"
                type="number"
                nodeStart={<JoyTokenIcon variant="gray" size={24} />}
                nodeEnd={!!buyNowPrice && <Pill variant="overlay" label={`${convertToUSD(buyNowPrice)}`} />}
                disabled={!activeInputs.includes('buyNowPrice')}
                error={!!errors.buyNowPrice}
                helperText={errors.buyNowPrice?.message}
                onBlur={() => trigger()} // trigger form validation to make sure starting price is valid
              />
            </FormField>
            <FormField
              title="Whitelist"
              switchProps={{
                name: 'whitelistedMembers',
                onChange: toggleActiveInput,
                value: activeInputs.includes('whitelistedMembers'),
              }}
              infoTooltip={{
                text: 'Only people on your whitelist will be able to bid/buy this particular NFT.',
              }}
            >
              <Controller
                name="whitelistedMembers"
                control={control}
                render={({ field: { onChange, value: existingMembers }, fieldState: { error } }) => {
                  return (
                    <MemberComboBox
                      disabled={!activeInputs.includes('whitelistedMembers')}
                      selectedMembers={existingMembers || []}
                      error={!!error}
                      helperText={error?.message}
                      onSelectMember={(member) => onChange([member, ...(existingMembers ? existingMembers : [])])}
                      onRemoveMember={(memberId) =>
                        onChange(existingMembers?.filter((existingMember) => existingMember.id !== memberId))
                      }
                    />
                  )
                }}
              />
            </FormField>
          </>
        )}
      </form>
    </>
  )
}
