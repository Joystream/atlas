import { ChannelWhereInput } from '@/api/queries'

export const channelFilter: ChannelWhereInput = {
  isCensored_eq: false,
  isPublic_eq: true,
  NOT: [{ id_in: ['3'] }, { avatarPhoto: { id_in: [] } }, { coverPhoto: { id_in: [] } }],
}
