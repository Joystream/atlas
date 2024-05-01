import { Datum } from '@nivo/line'
import { z } from 'zod'

import { IssuanceStepForm } from '@/components/_crt/CreateTokenDrawer/CreateTokenDrawer.types'

export const assuranceOptions = [
  {
    label: 'Default',
    caption: 'You will receive 25% of issued tokens now and the rest will unlock gradually over 2 years.',
    value: 'safe',
  },
  {
    label: 'Risky',
    caption: 'You receive all tokens as unlocked right away.',
    value: 'risky',
  },
  {
    label: 'Custom',
    caption: 'Set custom locked period, vesting and first payout.',
    value: 'custom',
  },
]

export const vestingOptions = [
  {
    value: '0',
    name: 'No vesting',
  },
  {
    value: '6',
    name: '6 months',
  },
  {
    value: '12',
    name: '12 months',
  },
  {
    value: '24',
    name: '24 months',
  },
  {
    value: '48',
    name: '48 months',
  },
]

export const cliffOptions = [
  {
    value: '0',
    name: 'No locked period',
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
          required_error: `Please provide the amount of $${tokenName} you want to issue.`,
        })
        .min(3_000, `Can’t issue less than 3 000 $${tokenName}.`)
        .max(100_000, `Can’t issue more than 100 000 $${tokenName}.`),
      assuranceType: z.enum(['safe', 'risky', 'secure', 'custom']),
      cliff: z.string().nullable(),
      vesting: z.string().nullable(),
      firstPayout: z
        .number()
        .min(0, 'Payout cannot be a negative number.')
        .max(100, 'Payout cannot exceed 100%.')
        .optional(),
    })
    .refine(
      (data) => {
        if (data.vesting) {
          return data.firstPayout !== undefined
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
        message: 'Select locked period for your token.',
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
    case 'safe':
      return [0, 24, 25]
    case 'risky':
      return [0, 0, 100]
    case 'custom':
      return null
  }
}
