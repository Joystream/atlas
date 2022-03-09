import React, { useEffect, useState } from 'react'
import { UseFormRegister, UseFormReset, UseFormSetValue } from 'react-hook-form'

import { Pill } from '@/components/Pill'
import { Text } from '@/components/Text'
import { AuctionDatePicker, AuctionDatePickerValue } from '@/components/_inputs/AuctionDatePicker'
import { FormField } from '@/components/_inputs/FormField'
import { SelectItem } from '@/components/_inputs/Select'
import { TextField } from '@/components/_inputs/TextField'
import { cVar } from '@/styles'
import { pluralizeNoun } from '@/utils/misc'

import { AuctionDatePickerWrapper, DaysSummary, DaysSummaryInfo, Header, StyledFormField } from './SetUp.styles'

import { useNftForm } from '../NftForm.hooks'
import { AuctionDurationTooltipFooter } from '../NftForm.styles'
import { AuctionDate, Listing, NftFormData } from '../NftForm.types'

type SetUpProps = {
  register: UseFormRegister<NftFormData>
  selectedType: Listing
  setValue: UseFormSetValue<NftFormData>
  activeInputs: string[]
  setActiveInputs: React.Dispatch<React.SetStateAction<string[]>>
  reset: UseFormReset<NftFormData>
  formData: NftFormData
}

const INITIAL_START_DATE_VALUE = 'Right after listing'

export const SetUp: React.FC<SetUpProps> = ({
  register,
  selectedType,
  setValue,
  activeInputs,
  setActiveInputs,
  reset,
  formData,
}) => {
  const [auctionDate, setAuctionDate] = useState<AuctionDate>({
    startDate: formData.startDate,
    endDate: formData.endDate,
  })

  const { getNumberOfBlocksAndDaysLeft } = useNftForm()

  const setAuctionDuration = (date: Partial<AuctionDate>) => {
    setAuctionDate((prevState) => ({ ...prevState, ...date }))
  }

  const numberOfBlocksAndDaysLeft = getNumberOfBlocksAndDaysLeft(auctionDate.startDate, auctionDate.endDate)

  useEffect(() => {
    setValue('auctionDurationBlocks', numberOfBlocksAndDaysLeft?.blocks as never)
    setValue('startDate', auctionDate.startDate)
    setValue('endDate', auctionDate.endDate)
  }, [auctionDate, numberOfBlocksAndDaysLeft, setValue])

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
        setAuctionDate({ startDate: null, endDate: null })
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

  const days = ['initial', 1, 3, 5, 7] as const

  const expirationDateItems: SelectItem<AuctionDatePickerValue>[] = days.map((value) => ({
    name: value === 'initial' ? 'No expiration date' : pluralizeNoun(value, 'day'),
    value: value,
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
                {...register('startingPrice')}
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
                {...register('buyNowPrice')}
                type="text"
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
                <AuctionDatePicker
                  size="regular"
                  label="Starting date"
                  minDate={new Date()}
                  maxDate={(auctionDate.endDate instanceof Date && auctionDate.endDate) || undefined}
                  disabled={!activeInputs.includes('auctionDuration')}
                  items={[
                    {
                      value: 'initial',
                      name: INITIAL_START_DATE_VALUE,
                    },
                  ]}
                  onChange={(value) => setAuctionDuration({ startDate: value })}
                  value={auctionDate.startDate || 'initial'}
                />
                <AuctionDatePicker
                  size="regular"
                  label="expiration date"
                  minDate={(auctionDate.startDate instanceof Date && auctionDate.startDate) || new Date()}
                  disabled={!activeInputs.includes('auctionDuration')}
                  onChange={(value) => {
                    setAuctionDuration({ endDate: value })
                  }}
                  items={expirationDateItems}
                  value={auctionDate.endDate || 'initial'}
                />
              </AuctionDatePickerWrapper>
            </FormField>
            {numberOfBlocksAndDaysLeft && numberOfBlocksAndDaysLeft.blocks !== 0 && (
              <DaysSummary>
                <Text variant="t200-strong" color={cVar('colorTextMuted', true)}>
                  Total:
                </Text>
                &nbsp;
                <Text variant="t200-strong">{numberOfBlocksAndDaysLeft.daysAndHoursText}</Text>
                &nbsp;
                <Text variant="t200-strong" secondary>
                  / {numberOfBlocksAndDaysLeft.blocks?.toLocaleString('no', { maximumFractionDigits: 1 })} Blocks
                </Text>
                <DaysSummaryInfo
                  text="It’s the time when your auction will become active and buyer will be able to make an offer"
                  placement="top"
                  footer={
                    <AuctionDurationTooltipFooter>
                      <Text variant="t100">
                        {numberOfBlocksAndDaysLeft.daysAndHoursText} = {numberOfBlocksAndDaysLeft.blocks}
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
