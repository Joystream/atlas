import { ApolloQueryResult } from '@apollo/client'

import {
  GetCommentEditsQuery,
  GetCommentQuery,
  GetCommentRepliesConnectionQuery,
  GetUserCommentsAndVideoCommentsConnectionQuery,
  GetUserCommentsReactionsQuery,
} from '@/api/queries/__generated__/comments.generated'
import { GetFullCreatorTokenQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { GetNftQuery } from '@/api/queries/__generated__/nfts.generated'
import { GetFullVideoQuery } from '@/api/queries/__generated__/videos.generated'

export type NetworkUtilsContextValue = {
  // Video
  refetchComment: (id: string) => Promise<ApolloQueryResult<GetCommentQuery>>
  refetchEdits: (id: string) => Promise<ApolloQueryResult<GetCommentEditsQuery>>
  refetchReactions: (videoId: string) => Promise<ApolloQueryResult<GetUserCommentsReactionsQuery>>
  refetchReplies: (parentCommentId: string) => Promise<ApolloQueryResult<GetCommentRepliesConnectionQuery>>
  refetchCommentsSection: (
    videoId: string,
    memberId: string
  ) => Promise<ApolloQueryResult<GetUserCommentsAndVideoCommentsConnectionQuery>>
  refetchVideo: (id: string) => Promise<ApolloQueryResult<GetFullVideoQuery>>

  // Ntfs
  refetchNftData: (id: string) => Promise<ApolloQueryResult<GetNftQuery>>

  // CRTs
  refetchCreatorTokenData: (id: string) => Promise<ApolloQueryResult<GetFullCreatorTokenQuery>>
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
