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
      memberId: '1',
      total: 100,
      vested: 111,
      allocation: 50,
      transferable: 10,
    },
    {
      memberId: '2',
      total: 122,
      vested: 22,
      allocation: 50,
      transferable: 10,
    },
    {
      memberId: '3',
      total: 111,
      vested: 333,
      allocation: 50,
      transferable: 10,
    },
  ],
  isLoading: false,
  currentMemberId: '1',
}
