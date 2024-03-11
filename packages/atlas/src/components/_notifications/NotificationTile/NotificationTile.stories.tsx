import { MockedProvider } from '@apollo/client/testing'
import { Meta, StoryFn } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import { GetMembershipsAvatarDocument } from '@/api/queries/__generated__/memberships.generated'
import { AuthContext } from '@/providers/auth/auth.provider'
import { AuthContextValue } from '@/providers/auth/auth.types'
import { NotificationRecord } from '@/providers/notifications/notifications.types'
import { UserContext } from '@/providers/user/user.provider'
import { Membership, UserContextValue } from '@/providers/user/user.types'

import { NotificationProps, NotificationTile } from './NotificationTile'

export default {
  title: 'Other/NotificationTile',
  component: NotificationTile,
  argTypes: {
    onSelect: { table: { disable: true } },
    id: { table: { disable: true } },
    selected: { table: { disable: true } },
    date: { control: { type: 'date' } },
    type: { options: ['CreatorReceivesAuctionBid'], control: { type: 'radio' } }, // TODO add more options
  },
  args: {
    read: false,
    type: 'CreatorReceivesAuctionBid',
    amount: 32000,
    memberHandle: 'member',
    memberAvatarUrl: 'https://placedog.net/400/400?random&1',
    videoTitle: 'Video title',
    loading: false,
    variant: 'default',
  },
  decorators: [
    (Story) => (
      <>
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      </>
    ),
  ],
} as Meta<NotificationProps>

const AuthCtxValue: AuthContextValue = {
  handleLogin: () => Promise.resolve('alice'),
  isWalletUser: true,
  isAuthenticating: false,
  loggedAddress: '01234',
  refetchCurrentUser: (() => Promise.resolve({})) as AuthContextValue['refetchCurrentUser'],
  handleLogout: () => Promise.resolve(undefined),
  isLoggedIn: true,
  encodedSeed: null,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Template: StoryFn<any> = (args) => {
  const notification: NotificationRecord = {
    id: 'id',
    type: args.type,
    date: new Date(Date.now() - 10000000),
    read: args.read,
    amount: args.amount,
    price: args.amount,
    bidderHandle: args.memberHandle,
    memberHandle: args.memberHandle,
    videoId: 'video',
    videoTitle: args.videoTitle,
  }

  const member = { metadata: { avatar: { __typename: 'AvatarUri', avatarUri: args.memberAvatarUrl } } } as Membership

  const UserCtxValue: UserContextValue = {
    memberships: [member],
    membershipsLoading: false,
    activeMembership: member,
    activeChannel: null, // as Membership['channels'][number]
    setActiveChannel: () => undefined,
    refetchUserMemberships: {} as UserContextValue['refetchUserMemberships'],
    memberId: '0',
    accountId: '0',
    channelId: '0',
    memberChannels: [],
  }

  const mocks = [
    {
      request: {
        query: GetMembershipsAvatarDocument,
        variables: { where: { handle_eq: args.memberHandle }, limit: 1 },
      },
      result: { data: { memberships: [member] } },
    },
  ]

  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      <UserContext.Provider value={UserCtxValue}>
        <AuthContext.Provider value={AuthCtxValue}>
          <NotificationTile {...args} notification={notification} />
        </AuthContext.Provider>
      </UserContext.Provider>
    </MockedProvider>
  )
}

export const Default = Template.bind({})
