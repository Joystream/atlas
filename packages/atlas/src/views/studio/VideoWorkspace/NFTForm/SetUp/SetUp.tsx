import { addDays, differenceInMilliseconds } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { UseFormRegister, UseFormSetValue } from 'react-hook-form'

import { Pill } from '@/components/Pill'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgActionChevronB, SvgActionChevronT } from '@/components/_icons'
import { AuctionDatePicker } from '@/components/_inputs/AuctionDatePicker'
import { FormField } from '@/components/_inputs/FormField'
import { TextField } from '@/components/_inputs/TextField'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { cVar } from '@/styles'
import { AuctionDurationTooltipFooter } from '@/views/studio/VideoWorkspace/NFTForm/AcceptTerms/AcceptTerms.styles'

import {
  AuctionDatePickerWrapper,
  DaysSummary,
  DaysSummaryInfo,
  Divider,
  Header,
  MoreSettingsDescription,
  MoreSettingsSection,
  StyledFormField,
} from './SetUp.styles'

import { useNFTForm } from '../NFTForm.hooks'
import { RoyaltiesTooltipFooter } from '../RoyaltiesTooltipFooter'
import { AuctionDate, Listing, NFTFormData } from '../types'

type SetUpProps = {
  register: UseFormRegister<NFTFormData>
  selectedType: Listing
  setValue: UseFormSetValue<NFTFormData>
}

export const SetUp: React.FC<SetUpProps> = ({ register, selectedType, setValue }) => {
  const [activeInputs, setActiveInputs] = useState<string[]>([])
  const [moreSettingsVisible, setMoreSettingsVisible] = useState(false)
  const [auctionDate, setAuctionDate] = useState<AuctionDate>({ startDate: null, endDate: null })
  const { convertDurationToBlocks } = useBlockTimeEstimation()
  const { getTotalDaysAndHoursText } = useNFTForm()

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
      return prevState.filter((inputName) => inputName !== name)
    })
  }

  const getHeaderText = () => {
    if (selectedType === 'Auction') {
      return (
        <>
          <Header variant="h500">Auction</Header>
          <Text variant="t300" secondary>
            Choose settings of your listing. All fields are optional.
          </Text>
        </>
      )
    }
    if (selectedType === 'Fixed price') {
      return (
        <>
          <Header variant="h500">Buy now</Header>
          <Text variant="t300" secondary>
            No bids will be accepted, only a purchase for fixed price will complete the sale.
          </Text>
        </>
      )
    }
    return (
      <>
        <Header variant="h500">Not for sale</Header>
        <Text variant="t300" secondary>
          Choose settings of your listing. All fields are optional.
        </Text>
      </>
    )
  }

  return (
    <>
      {getHeaderText()}
      <form>
        {selectedType === 'Fixed price' && (
          <StyledFormField title="">
            <TextField {...register('buyNowPrice')} type="number" nodeEnd={<Pill label="tJoy" />} />
          </StyledFormField>
        )}
        {selectedType === 'Not for sale' && (
          <StyledFormField
            title="Royalties"
            switchProps={{ name: 'royaltyActive', onChange: toggleActiveInput }}
            infoTooltip={{
              text: 'By setting royalties you will be entitled to a percentage share in revenue from any future secondary market sale. So if someone sells your work you will get paid.',
              footer: <RoyaltiesTooltipFooter />,
            }}
          >
            <TextField
              {...register('royalty')}
              type="number"
              nodeEnd={<Pill label="%" />}
              disabled={!activeInputs.includes('royaltyActive')}
            />
          </StyledFormField>
        )}
        {selectedType === 'Auction' && (
          <>
            <StyledFormField
              title="Min step bid"
              switchProps={{ name: 'minimalBidStepActive', onChange: toggleActiveInput }}
              infoTooltip={{ text: 'Its the starting price of your auction. No lower bids will be accepted' }}
            >
              <TextField
                {...register('minimalBidStep')}
                type="number"
                nodeEnd={<Pill label="tJOY" />}
                disabled={!activeInputs.includes('minimalBidStepActive')}
              />
            </StyledFormField>
            <FormField
              title="Minimum bid"
              switchProps={{ name: 'startingPriceActive', onChange: toggleActiveInput }}
              infoTooltip={{ text: 'Its the starting price of your auction. No lower bids will be accepted' }}
            >
              <TextField
                {...register('startingPrice')}
                type="number"
                nodeEnd={<Pill label="tJOY" />}
                disabled={!activeInputs.includes('startingPriceActive')}
              />
            </FormField>
            <FormField
              title="Fixed price"
              switchProps={{ name: 'buyNowPriceActive', onChange: toggleActiveInput }}
              infoTooltip={{
                text: 'Sell your NFT for a predefined price. When this price is reached it automaticly ends auction',
              }}
            >
              <TextField
                {...register('buyNowPrice')}
                type="text"
                nodeEnd={<Pill label="tJOY" />}
                disabled={!activeInputs.includes('buyNowPriceActive')}
              />
            </FormField>
            <Divider />
            <Button
              size="large"
              iconPlacement="right"
              textOnly
              icon={moreSettingsVisible ? <SvgActionChevronT /> : <SvgActionChevronB />}
              onClick={() => setMoreSettingsVisible(!moreSettingsVisible)}
            >
              Show {moreSettingsVisible ? 'less' : 'more'} settings
            </Button>
            {!moreSettingsVisible && (
              <MoreSettingsDescription variant="t200" secondary>
                Auction duration
              </MoreSettingsDescription>
            )}
            <MoreSettingsSection expanded={moreSettingsVisible}>
              <FormField
                title="Auction duration"
                switchProps={{ name: 'auctionDuration', onChange: toggleActiveInput }}
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
            </MoreSettingsSection>
          </>
        )}
      </form>
    </>
  )
}
