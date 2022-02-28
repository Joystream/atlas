import { addDays, differenceInMilliseconds } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { UseFormRegister, UseFormReset, UseFormSetValue } from 'react-hook-form'

import { Pill } from '@/components/Pill'
import { Text } from '@/components/Text'
import { AuctionDatePicker } from '@/components/_inputs/AuctionDatePicker'
import { FormField } from '@/components/_inputs/FormField'
import { TextField } from '@/components/_inputs/TextField'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { cVar } from '@/styles'

import { AuctionDatePickerWrapper, DaysSummary, DaysSummaryInfo, Header, StyledFormField } from './SetUp.styles'

import { useNftForm } from '../NftForm.hooks'
import { AuctionDurationTooltipFooter } from '../NftForm.styles'
import { RoyaltiesTooltipFooter } from '../RoyaltiesTooltipFooter'
import { AuctionDate, Listing, NftFormData } from '../types'

type SetUpProps = {
  register: UseFormRegister<NftFormData>
  selectedType: Listing
  setValue: UseFormSetValue<NftFormData>
  activeInputs: string[]
  setActiveInputs: React.Dispatch<React.SetStateAction<string[]>>
  reset: UseFormReset<NftFormData>
  formData: NftFormData
}

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
    startDate: formData.startDate || null,
    endDate: formData.endDate || null,
  })
  const { convertDurationToBlocks } = useBlockTimeEstimation()
  const { getTotalDaysAndHoursText } = useNftForm()

  const setAuctionDuration = (date: { startDate?: Date | string | null; endDate?: Date | string | null }) => {
    setAuctionDate((prevState) => ({ ...prevState, ...date }))
  }
  const startDate = auctionDate.startDate as Date
  const endDate = auctionDate.endDate as Date
  const validDate = auctionDate.startDate instanceof Date && auctionDate.endDate instanceof Date

  const numberOfBlocks = validDate ? convertDurationToBlocks(differenceInMilliseconds(endDate, startDate)) : null

  useEffect(() => {
    if (numberOfBlocks) {
      setValue('auctionDurationBlocks', numberOfBlocks as never)
      setValue('startDate', auctionDate.startDate)
      setValue('endDate', auctionDate.endDate)
    }
  }, [auctionDate, numberOfBlocks, setValue])

  const daysAndHours = validDate && getTotalDaysAndHoursText(startDate, endDate)

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
        {selectedType === 'Not for sale' && (
          <StyledFormField
            title="Royalties"
            switchProps={{
              name: 'royalty',
              onChange: toggleActiveInput,
              value: activeInputs.includes('royalty'),
            }}
            infoTooltip={{
              text: 'By setting royalties you will be entitled to a percentage share in revenue from any future secondary market sale. So if someone sells your work you will get paid.',
              footer: <RoyaltiesTooltipFooter />,
            }}
          >
            <TextField
              {...register('royalty')}
              type="number"
              nodeEnd={<Pill label="%" />}
              disabled={!activeInputs.includes('royalty')}
            />
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
              <TextField type="text" nodeEnd={<Pill label="tJOY" />} disabled={!activeInputs.includes('buyNowPrice')} />
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
                  disabled={!activeInputs.includes('auctionDuration')}
                  items={[
                    {
                      value: new Date(),
                      name: 'Right after listing',
                    },
                  ]}
                  onChange={(value) => setAuctionDuration({ startDate: value })}
                  value={auctionDate.startDate}
                />
                <AuctionDatePicker
                  size="regular"
                  label="expiration date"
                  minDate={new Date()}
                  disabled={!activeInputs.includes('auctionDuration') || !auctionDate.startDate}
                  onChange={(value) => setAuctionDuration({ endDate: value })}
                  items={[
                    {
                      value: auctionDate.startDate && addDays(new Date(auctionDate.startDate), 1),
                      name: '1 day',
                    },
                    {
                      value: auctionDate.startDate && addDays(new Date(auctionDate.startDate), 3),
                      name: '3 days',
                    },
                    {
                      value: auctionDate.startDate && addDays(new Date(auctionDate.startDate), 5),
                      name: '5 days',
                    },
                    {
                      value: auctionDate.startDate && addDays(new Date(auctionDate.startDate), 7),
                      name: '7 days',
                    },
                  ]}
                  value={auctionDate.endDate}
                />
              </AuctionDatePickerWrapper>
            </FormField>
            {auctionDate.startDate instanceof Date && auctionDate.endDate instanceof Date && (
              <DaysSummary>
                <Text variant="t200-strong" color={cVar('colorTextMuted', true)}>
                  Total:
                </Text>
                &nbsp;
                <Text variant="t200-strong">{daysAndHours}</Text>
                &nbsp;
                <Text variant="t200-strong" secondary>
                  / {numberOfBlocks?.toLocaleString('no', { maximumFractionDigits: 1 })} Blocks
                </Text>
                <DaysSummaryInfo
                  text="It’s the time when your auction will become active and buyer will be able to make an offer"
                  placement="top"
                  footer={
                    <AuctionDurationTooltipFooter>
                      <Text variant="t100">
                        {daysAndHours} = {numberOfBlocks}
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
