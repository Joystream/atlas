import { ApolloProvider } from '@apollo/client'
import { Meta, StoryFn } from '@storybook/react'

import { createApolloClient } from '@/api'
import { HoldersTable, HoldersTableProps } from '@/components/_crt/HoldersTable/HoldersTable'
import { JoystreamProvider } from '@/providers/joystream/joystream.provider'

export default {
  title: 'crt/HolderTable',
  component: HoldersTable,
  decorators: [
    (Story) => {
      const client = createApolloClient()
      return (
        <JoystreamProvider>
          <ApolloProvider client={client}>
            <Story />
          </ApolloProvider>
        </JoystreamProvider>
      )
    },
  ],
} as Meta<HoldersTableProps>

const Template: StoryFn<HoldersTableProps> = (args) => <HoldersTable {...args} />

export const Default = Template.bind({})
Default.args = {
  data: [
    {
      member: {
        id: '1',
        handle: 'handle1',
      },
      total: 100,
      vested: 111,
      allocation: 50,
      transferable: 10,
    },
    {
      member: {
        id: '2',
        handle: 'handle2',
      },
      total: 122,
      vested: 22,
      allocation: 50,
      transferable: 10,
    },
    {
      member: {
        id: '3',
        handle: 'handle3',
      },
      total: 111,
      vested: 333,
      allocation: 50,
      transferable: 10,
    },
  ],
  isLoading: false,
  currentMemberId: '1',
}
