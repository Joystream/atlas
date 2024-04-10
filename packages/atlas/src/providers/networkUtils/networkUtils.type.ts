import { ApolloQueryResult } from '@apollo/client'

import { GetChannelPaymentEventsQuery, GetFullChannelQuery } from '@/api/queries/__generated__/channels.generated'
import {
  GetCommentEditsQuery,
  GetCommentQuery,
  GetCommentRepliesConnectionQuery,
  GetUserCommentsAndVideoCommentsConnectionQuery,
  GetUserCommentsReactionsQuery,
} from '@/api/queries/__generated__/comments.generated'
import {
  GetCreatorTokenHoldersQuery,
  GetFullCreatorTokenQuery,
} from '@/api/queries/__generated__/creatorTokens.generated'
import { GetNftQuery } from '@/api/queries/__generated__/nfts.generated'
import { GetFullVideoQuery } from '@/api/queries/__generated__/videos.generated'

export type NetworkUtilsContextValue = {
  // Channel
  refetchChannel: (channelId: string) => Promise<ApolloQueryResult<GetFullChannelQuery>>
  refetchChannelPayments: (channelId: string) => Promise<ApolloQueryResult<GetChannelPaymentEventsQuery>>
  // Video
  refetchComment: (id: string) => Promise<ApolloQueryResult<GetCommentQuery>>
  refetchEdits: (id: string) => Promise<ApolloQueryResult<GetCommentEditsQuery>>
  refetchReactions: (videoId: string) => Promise<ApolloQueryResult<GetUserCommentsReactionsQuery>>
  refetchReplies: (parentCommentId: string) => Promise<ApolloQueryResult<GetCommentRepliesConnectionQuery>>
  refetchCommentsSection: (
    videoId: string,
    memberId?: string
  ) => Promise<ApolloQueryResult<GetUserCommentsAndVideoCommentsConnectionQuery>>
  refetchAllCommentsSections: () => Promise<void>
  refetchVideo: (id: string) => Promise<ApolloQueryResult<GetFullVideoQuery>>

  // Ntfs
  refetchNftData: (id: string) => Promise<ApolloQueryResult<GetNftQuery>>

  // CRTs
  refetchCreatorTokenData: (id: string) => Promise<ApolloQueryResult<GetFullCreatorTokenQuery>>
  refetchMemberTokenHolderData: (
    memberId?: string,
    tokenId?: string
  ) => Promise<ApolloQueryResult<GetCreatorTokenHoldersQuery>>
  refetchAllMemberTokenHolderQueries: () => Promise<void>
  refetchAllMemberTokenBalanceData: () => Promise<void>
}

// Login handler types
export enum LogInErrors {
  ArtifactsAlreadySaved = 'ArtifactsAlreadySaved',
  ArtifactsNotFound = 'ArtifactsNotFound',
  NoAccountFound = 'NoAccountFound',
  InvalidPayload = 'InvalidPayload',
  UnknownError = 'UnknownError',
  SignatureCancelled = 'SignatureCancelled',
}

export type AuthModals = 'logIn' | 'externalLogIn' | 'signUp' | 'createChannel' | 'forgotPassword'
