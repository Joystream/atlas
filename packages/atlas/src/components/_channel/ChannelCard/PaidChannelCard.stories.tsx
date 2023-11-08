/* eslint-disable @typescript-eslint/no-explicit-any */
import { Meta, StoryObj } from '@storybook/react'
import BN from 'bn.js'
import { FC } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { Grid } from '@/components/Grid'
import { OperatorsContext } from '@/providers/assets/assets.provider'
import { JoystreamContext } from '@/providers/joystream/joystream.provider'

import { PaidChannelCardProps, PaidChannelCard as PaidChannelCard_ } from './PaidChannelCard'

type Args = Omit<DeepPartial<PaidChannelCardProps>, 'amount'> & { amount: number }
const Component = PaidChannelCard_ as FC<DeepPartial<PaidChannelCardProps>>

export default {
  title: 'channel/ChannelCard/PaidChannelCard',
  component: PaidChannelCard_ as unknown as FC<Args>,

  args: {
    loading: false,
    amount: 123_456,
    channel: {
      title: 'my channel',
      id: '3',
      cumulativeRewardPaid: 123_456,
      avatarPhoto: { id: '1' },
    },
  },

  render: (args) => {
    const amount = (args.channel?.cumulativeRewardPaid as number) ?? 0
    const channel = args.channel && {
      ...args.channel,
      cumulativeRewardPaid: new BN(`${Math.trunc(amount)}${(amount % 1).toFixed(10).substring(2)}`),
    }
    return (
      <Grid>
        <Component {...args} channel={channel} />
        <Component {...args} channel={channel} />
        <Component {...args} channel={channel} />
      </Grid>
    )
  },

  decorators: [
    (Story) => (
      <BrowserRouter>
        <JoystreamContext.Provider value={{ tokenPrice: 0.5 } as any}>
          <OperatorsContext.Provider value={{} as any}>
            <Story />
          </OperatorsContext.Provider>
        </JoystreamContext.Provider>
      </BrowserRouter>
    ),
  ],
} as Meta<Args>

export const PaidChannelCard: StoryObj<Args> = {}
