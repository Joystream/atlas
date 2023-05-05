import { ChangeEvent, Dispatch, FC, FormEvent, SetStateAction, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { AuctionDatePicker } from '@/components/_inputs/AuctionDatePicker'
import { FormField } from '@/components/_inputs/FormField'
import { MemberComboBox } from '@/components/_inputs/MemberComboBox'
import { TokenInput } from '@/components/_inputs/TokenInput'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { pluralizeNoun } from '@/utils/misc'

import {
  AuctionDatePickerWrapper,
  DaysSummary,
  DaysSummaryInfo,
  StyledForm,
  StyledFormField,
  StyledOptionCardGroupRadio,
} from './SetUp.styles'

import { useNftFormUtils } from '../NftForm.hooks'
import { Listing, NftFormFields } from '../NftForm.types'
import { getTotalDaysAndHours } from '../NftForm.utils'

type SetUpProps = {
  maxStartDate: Date
  maxEndDate: Date
  selectedType: Listing
  activeInputs: string[]
  setActiveInputs: Dispatch<SetStateAction<string[]>>
  handleGoForward: () => void
}

export const SetUp: FC<SetUpProps> = ({
  selectedType,
  activeInputs,
  setActiveInputs,
  maxEndDate,
  maxStartDate,
  handleGoForward,
}) => {
  const {
    setValue,
    getValues,
    watch,
    reset,
    trigger,
    control,
    formState: { errors },
  } = useFormContext<NftFormFields>()

  const mdMatch = useMediaMatch('md')
  const startDate = watch('startDate')
  const endDate = watch('endDate')

  const { getNumberOfBlocks, chainState } = useNftFormUtils()

  const rawNumberOfBlocks = getNumberOfBlocks(startDate, endDate) || 0
  const numberOfBlocks = Math.max(rawNumberOfBlocks, 0)

  const totalDaysAndHours = getTotalDaysAndHours(startDate, endDate)
  const isEnglishAuction = watch('type') === 'english'

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

  const toggleActiveInput = (event?: ChangeEvent<HTMLInputElement>) => {
    if (!event) {
      return
    }
    const { name } = event.target
    setActiveInputs((prevState) => {
      if (!prevState.includes(name)) {
        if (name === 'buyNowPrice') {
          const startingPrice = getValues('startingPrice')
          setValue('buyNowPrice', startingPrice ? startingPrice + 1 : 2)
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
        setValue('startingPrice', hapiBnToTokenNumber(chainState.nftMinStartingPrice))
      } else {
        reset({ ...getValues(), [name]: undefined })
      }
      return prevState.filter((inputName) => inputName !== name)
    })
  }

  const headerText = {
    'Auction': {
      header: 'Auction',
      caption: 'Pick a timed or open auction. Optionally set up a buy now price.',
    },
    'Fixed price': {
      header: 'Fixed price',
      caption: 'Set up the price for your NFT. It can be changed later. Cancel anytime.',
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    handleGoForward()
  }

  return (
    <>
      <Text as="h1" variant="h500" margin={{ bottom: 4 }}>
        {selectedType && headerText[selectedType].header}
      </Text>
      <Text as="p" variant="t300" color="colorText">
        {selectedType && headerText[selectedType].caption}
      </Text>
      <StyledForm onSubmit={handleSubmit}>
        {selectedType === 'Fixed price' && (
          <StyledFormField label="" error={errors.buyNowPrice?.message}>
            <Controller
              control={control}
              name="buyNowPrice"
              render={({ field: { value, onChange, onBlur } }) => (
                <TokenInput value={value} onChange={onChange} onBlur={onBlur} error={!!errors.buyNowPrice} />
              )}
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
                <StyledOptionCardGroupRadio
                  selectedValue={value}
                  onChange={onChange}
                  direction={mdMatch ? 'horizontal' : 'vertical'}
                  options={[
                    {
                      label: 'Open auction',
                      caption: 'Pick the winning bid or cancel anytime',
                      value: 'open',
                    },
                    {
                      label: 'Timed auction',
                      caption: 'Highest bidder wins, cannot be cancelled once started',
                      value: 'english',
                    },
                  ]}
                />
              )}
            />
            <div>
              <AuctionDatePickerWrapper columns={isEnglishAuction ? 2 : 1}>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <FormField
                      error={error?.message}
                      // TODO shake animation on date picker is very glitchy, for now just disable it
                      disableErrorAnimation
                      label="Starts"
                    >
                      <AuctionDatePicker
                        error={!!error}
                        minDate={new Date()}
                        maxDate={endDate?.type === 'date' && endDate.date < maxStartDate ? endDate.date : maxStartDate}
                        items={[
                          {
                            value: null,
                            name: 'Now',
                          },
                        ]}
                        onChange={(value) => {
                          onChange(value)
                          trigger('startDate')
                        }}
                        value={value}
                      />
                    </FormField>
                  )}
                />
                {isEnglishAuction && (
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <FormField
                        error={error?.message}
                        label="Ends"
                        // TODO shake animation on date picker is very glitchy, for now just disable it
                        disableErrorAnimation
                      >
                        <AuctionDatePicker
                          error={!!error}
                          minDate={(startDate?.type === 'date' && startDate.date) || new Date()}
                          maxDate={maxEndDate}
                          onChange={(value) => {
                            onChange(value)
                            trigger('endDate')
                          }}
                          items={expirationDateItems}
                          value={
                            value || {
                              type: 'duration',
                              durationDays: 1,
                            }
                          }
                        />
                      </FormField>
                    )}
                  />
                )}
              </AuctionDatePickerWrapper>
              {numberOfBlocks > 0 && (
                <DaysSummary>
                  <Text as="span" variant="t100" color="colorTextMuted">
                    Total:
                  </Text>
                  &nbsp;
                  <Text as="span" variant="t100">
                    {totalDaysAndHours}
                  </Text>
                  &nbsp;
                  <Text as="span" variant="t100" color="colorText">
                    / <NumberFormat as="span" color="colorText" value={numberOfBlocks} /> blocks
                  </Text>
                  <DaysSummaryInfo
                    text="On blockchain, duration is expressed in number of blocks"
                    placement="top"
                    multiline
                  />
                </DaysSummary>
              )}
            </div>
            <FormField
              label="Minimum bid"
              error={errors.startingPrice?.message}
              description="Only bids higher than this value will be accepted."
              switchProps={
                chainState.nftMinStartingPrice.isZero()
                  ? {
                      name: 'startingPrice',
                      onChange: toggleActiveInput,
                      value: activeInputs.includes('startingPrice'),
                    }
                  : undefined
              }
            >
              <Controller
                control={control}
                name="startingPrice"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TokenInput
                    value={value}
                    onChange={onChange}
                    disabled={!activeInputs.includes('startingPrice')}
                    error={!!errors.startingPrice}
                    onBlur={onBlur}
                  />
                )}
              />
            </FormField>
            <FormField
              label="Buy now price"
              description="Bid matching this value will automatically end your auction."
              error={errors.buyNowPrice?.message}
              switchProps={{
                name: 'buyNowPrice',
                onChange: toggleActiveInput,
                value: activeInputs.includes('buyNowPrice'),
              }}
            >
              <Controller
                control={control}
                name="buyNowPrice"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TokenInput
                    value={value}
                    onChange={onChange}
                    placeholder="—"
                    disabled={!activeInputs.includes('buyNowPrice')}
                    error={!!errors.buyNowPrice}
                    onBlur={onBlur}
                  />
                )}
              />
            </FormField>
            <Controller
              name="whitelistedMembers"
              control={control}
              render={({ field: { onChange, value: existingMembers, onBlur }, fieldState: { error } }) => {
                return (
                  <FormField
                    label="Whitelist"
                    description="Only members included in the whitelist will be able to bid on your auction(provide at least two members)."
                    switchProps={{
                      name: 'whitelistedMembers',
                      onChange: toggleActiveInput,
                      value: activeInputs.includes('whitelistedMembers'),
                    }}
                    error={error?.message}
                  >
                    <MemberComboBox
                      disabled={!activeInputs.includes('whitelistedMembers')}
                      selectedMembers={existingMembers || []}
                      error={!!error}
                      onSelectMember={(member) => {
                        onChange([member, ...(existingMembers ? existingMembers : [])])
                      }}
                      onRemoveMember={(memberId) => {
                        onChange(existingMembers?.filter((existingMember) => existingMember.id !== memberId))
                      }}
                      onBlur={onBlur}
                    />
                  </FormField>
                )
              }}
            />
          </>
        )}
      </StyledForm>
    </>
  )
}
