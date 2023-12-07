import { Datum } from '@nivo/line'
import { z } from 'zod'

import { IssuanceStepForm } from '@/components/_crt/CreateTokenDrawer/CreateTokenDrawer.types'

export const assuranceOptions = [
  {
    label: 'Secure',
    caption:
      '6 months cliff & 1 year vesting. You won’t receive any tokens now. You will receive 50% of tokens after 6 months of cliff.',
    value: 'secure',
  },
  {
    label: 'Safe (Default)',
    caption: 'No cliff & 6 months vesting. You will receive 50% of tokens now.',
    value: 'safe',
  },
  {
    label: 'Risky',
    caption: 'No cliff & No vesting. You receive all tokens now.',
    value: 'risky',
  },
  {
    label: 'Custom',
    caption: 'Set your own custom cliff, vesting and first payout.',
    value: 'custom',
  },
]

export const vestingOptions = [
  {
    value: '0',
    name: 'No vesting',
  },
  {
    value: '1',
    name: '1 month',
  },
  {
    value: '3',
    name: '3 months',
  },
  {
    value: '6',
    name: '6 months',
  },
]

export const cliffOptions = [
  {
    value: '0',
    name: 'No cliff',
  },
  {
    value: '1',
    name: '1 month',
  },
  {
    value: '3',
    name: '3 months',
  },
  {
    value: '6',
    name: '6 months',
  },
]

export const createTokenIssuanceSchema = (tokenName: string) =>
  z
    .object({
      creatorIssueAmount: z
        .number({
          required_error: `Can’t issue less than 1000 $${tokenName} to create a new token.`,
        })
        .min(1000, `Can’t issue less than 1000 $${tokenName} to create a new token.`),
      assuranceType: z.enum(['safe', 'risky', 'secure', 'custom']),
      cliff: z.enum(['0', '1', '3', '6']).nullable(),
      vesting: z.enum(['0', '1', '3', '6']).nullable(),
      firstPayout: z
        .number()
        .positive('Payout cannot be a negative number.')
        .max(100, 'Payout cannot exceed 100%.')
        .optional(),
    })
    .refine(
      (data) => {
        if (['1', '3', '6'].includes(data.vesting ?? '')) {
          return !!data.firstPayout
        }
        return true
      },
      {
        path: ['firstPayout'],
        message: 'Provide first payout value.',
      }
    )
    .refine(
      (data) => {
        if (data.assuranceType === 'custom') {
          return !!data.cliff
        }
        return true
      },
      {
        path: ['cliff'],
        message: 'Select cliff for your token.',
      }
    )
    .refine(
      (data) => {
        if (data.assuranceType === 'custom') {
          return !!data.vesting
        }
        return true
      },
      {
        path: ['vesting'],
        message: 'Select vesting for your token.',
      }
    )

export const generateChartData = (cliffTime: number, vestingTime: number, firstPayout = 0) => {
  firstPayout = Math.max(0, firstPayout)
  if (!cliffTime && !vestingTime) {
    return [
      {
        x: '',
        y: '100%',
      },
      {
        x: 'Now',
        y: '100%',
      },
    ]
  }
  const data: Datum[] = []
  for (let i = 1; i <= cliffTime; i++) {
    if (!cliffTime) break
    if (!data.length) {
      data.push({
        x: 'Now',
        y: '0%',
      })
    }
    data.push({
      x: `${i}M`,
      y: '0%',
    })
  }

  if (firstPayout || !vestingTime) {
    const lastDatum = data[data.length - 1]
    if (lastDatum) {
      data.push({
        x: lastDatum.x,
        y: `${vestingTime ? firstPayout : 100}%`,
      })
    } else {
      data.push({
        x: 'Now',
        y: `${vestingTime ? firstPayout : 100}%`,
      })
    }
  }

  for (let i = cliffTime + 1; i <= cliffTime + vestingTime; i++) {
    const partToVest = 100 - firstPayout
    const vestingPerTick = partToVest / vestingTime
    if (!data.length) {
      data.push({
        x: 'Now',
        y: '0%',
      })
    }
    data.push({
      x: `${i}M`,
      y: `${vestingPerTick * (i - cliffTime) + firstPayout}%`,
    })
  }
  return data
}

export const getDataBasedOnType = (type: IssuanceStepForm['assuranceType']): [number, number, number] | null => {
  switch (type) {
    case 'secure':
      return [6, 12, 50]
    case 'safe':
      return [0, 6, 50]
    case 'risky':
      return [0, 0, 100]
    case 'custom':
      return null
  }
}
