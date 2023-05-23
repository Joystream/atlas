import BN from 'bn.js'
import { formatDuration, intervalToDuration } from 'date-fns'
import { z } from 'zod'

import { AuctionDatePickerValue } from '@/components/_inputs/AuctionDatePicker'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { pluralizeNoun } from '@/utils/misc'
import { formatDateTime } from '@/utils/time'

import { Listing, NftFormFields } from './NftForm.types'

export const createValidationSchema = (
  data: NftFormFields,
  maxStartDate: Date,
  maxEndDate: Date,
  listingType: Listing,
  minStartingPrice: BN,
  maxStartingPrice: BN
) => {
  const auctionDateType = z
    .union([
      z.object({
        type: z.literal('date'),
        date: z.date(),
      }),
      z.object({
        type: z.literal('duration'),
        durationDays: z.number(),
      }),
    ])
    .nullable()
    .optional()

  const buyNowPrice = z
    .number({
      required_error: 'Buy now price must be provided.',
      invalid_type_error: 'Buy now price must be a number.',
    })
    .min(1, 'Fixed price must be at least 1')

  const minStartingPriceNumber = hapiBnToTokenNumber(minStartingPrice, true)
  const maxStartingPriceNumber = hapiBnToTokenNumber(maxStartingPrice)

  const startingPriceBase = z
    .number({ invalid_type_error: 'Minimum bid must be a number.' })
    .min(minStartingPriceNumber, `Minimum bid must be at least ${minStartingPriceNumber}.`)
    .max(maxStartingPriceNumber, `Minimum bid cannot be higher than ${maxStartingPriceNumber}`)

  return z.object({
    startDate: auctionDateType
      .refine(
        (val) => {
          if (val?.type === 'date') {
            return maxStartDate > val.date
          }
          return true
        },
        { message: `Start date must be before ${formatDateTime(maxStartDate)}.` }
      )
      .refine(
        (val) => {
          if (val?.type === 'date') {
            return new Date() < val.date
          }
          return true
        },
        { message: 'Start date must be in the future.' }
      )
      .refine(
        (val) => {
          const endDate = data.endDate
          if (val?.type === 'date' && endDate?.type === 'date') {
            return endDate.date > val.date
          }
          return true
        },
        { message: 'End date must be after the start date.' }
      ),
    endDate: auctionDateType
      .refine(
        (val) => {
          if (val?.type === 'date') {
            return maxEndDate > val.date
          }
          return true
        },
        { message: `End date must be before ${formatDateTime(maxEndDate)}.` }
      )
      .refine(
        (val) => {
          if (val?.type === 'date') {
            return new Date() < val.date
          }
          return true
        },
        { message: 'End date must be in the future.' }
      )
      .refine(
        (val) => {
          const startDate = data.startDate
          if (val?.type === 'date' && startDate?.type === 'date') {
            return startDate.date < val.date
          }
          return true
        },
        { message: 'End date must be after the start date' }
      ),
    royalty: z.number().nullable().optional(),
    startingPrice:
      data.buyNowPrice && listingType === 'Auction'
        ? startingPriceBase
            .max(Number(data.buyNowPrice) - 1, 'Minimum bid must be lower than the buy now price')
            .optional()
        : startingPriceBase.optional(),
    buyNowPrice:
      listingType === 'Auction'
        ? buyNowPrice.min(1, 'Buy now price must be at least 1.').nullable().optional()
        : buyNowPrice,
    auctionDurationBlocks: z.number().nullable().optional(),
    whitelistedMembers: z
      .array(z.object({ id: z.string() }))
      .refine((val) => val.length === 0 || val.length >= 2, {
        message: 'Whitelist must contain at least two members.',
      })
      .nullable()
      .optional(),
  })
}

export const getTotalDaysAndHours = (startDate: AuctionDatePickerValue, endDate: AuctionDatePickerValue) => {
  const start = (startDate?.type === 'date' && startDate.date) || new Date()

  if (endDate?.type === 'date') {
    const { days, hours } = intervalToDuration({ start: start, end: endDate.date })
    const duration = formatDuration({ hours: hours, days: days }, { format: ['days', 'hours'] })
    return duration ? duration : 'Less than 1 hour'
  }
  if (endDate?.type === 'duration') {
    return pluralizeNoun(endDate.durationDays, 'day')
  }
}
