import { useApolloClient } from '@apollo/client'
import { ReactNode, createContext, useCallback, useContext } from 'react'

import {
  GetCommentDocument,
  GetCommentEditsDocument,
  GetCommentEditsQuery,
  GetCommentEditsQueryVariables,
  GetCommentQuery,
  GetCommentQueryVariables,
  GetCommentRepliesConnectionDocument,
  GetCommentRepliesConnectionQuery,
  GetCommentRepliesConnectionQueryVariables,
  GetUserCommentsAndVideoCommentsConnectionDocument,
  GetUserCommentsAndVideoCommentsConnectionQuery,
  GetUserCommentsAndVideoCommentsConnectionQueryVariables,
  GetUserCommentsReactionsDocument,
  GetUserCommentsReactionsQuery,
  GetUserCommentsReactionsQueryVariables,
} from '@/api/queries/__generated__/comments.generated'
import {
  GetChannelTokenBalanceDocument,
  GetCreatorTokenHoldersDocument,
  GetCreatorTokenHoldersQuery,
  GetCreatorTokenHoldersQueryVariables,
  GetFullCreatorTokenDocument,
  GetFullCreatorTokenQuery,
  GetFullCreatorTokenQueryVariables,
} from '@/api/queries/__generated__/creatorTokens.generated'
import { GetNftDocument, GetNftQuery, GetNftQueryVariables } from '@/api/queries/__generated__/nfts.generated'
import {
  GetFullVideoDocument,
  GetFullVideoQuery,
  GetFullVideoQueryVariables,
} from '@/api/queries/__generated__/videos.generated'
import { NetworkUtilsContextValue } from '@/providers/networkUtils/networkUtils.type'

const NetworkUtilsContext = createContext<NetworkUtilsContextValue | undefined>(undefined)
NetworkUtilsContext.displayName = 'NetworkUtilsContext'

export const NetworkUtilsProvider = ({ children }: { children: ReactNode }) => {
  const client = useApolloClient()

  /*      Video        */

  const refetchComment = useCallback(
    (id: string) => {
      return client.query<GetCommentQuery, GetCommentQueryVariables>({
        query: GetCommentDocument,
        variables: {
          commentId: id,
        },
        fetchPolicy: 'network-only',
      })
    },
    [client]
  )

  const refetchEdits = useCallback(
    (id: string) => {
      return client.query<GetCommentEditsQuery, GetCommentEditsQueryVariables>({
        query: GetCommentEditsDocument,
        variables: {
          commentId: id,
        },
        fetchPolicy: 'network-only',
      })
    },
    [client]
  )

  const refetchReactions = useCallback(
    (videoId: string, memberId?: string) => {
      return client.query<GetUserCommentsReactionsQuery, GetUserCommentsReactionsQueryVariables>({
        query: GetUserCommentsReactionsDocument,
        variables: {
          memberId: memberId || '',
          videoId: videoId,
        },
        fetchPolicy: 'network-only',
      })
    },
    [client]
  )

  const refetchReplies = useCallback(
    (parentCommentId: string) => {
      return client.query<GetCommentRepliesConnectionQuery, GetCommentRepliesConnectionQueryVariables>({
        query: GetCommentRepliesConnectionDocument,
        variables: {
          parentCommentId,
        },
        fetchPolicy: 'network-only',
      })
    },
    [client]
  )

  const refetchCommentsSection = useCallback(
    (videoId: string, memberId: string) => {
      return client.query<
        GetUserCommentsAndVideoCommentsConnectionQuery,
        GetUserCommentsAndVideoCommentsConnectionQueryVariables
      >({
        query: GetUserCommentsAndVideoCommentsConnectionDocument,
        variables: {
          memberId: memberId,
          videoId: videoId,
        },
        fetchPolicy: 'network-only',
      })
    },
    [client]
  )

  const refetchVideo = useCallback(
    (id: string) =>
      client.query<GetFullVideoQuery, GetFullVideoQueryVariables>({
        query: GetFullVideoDocument,
        variables: {
          id,
        },
        fetchPolicy: 'network-only',
      }),
    [client]
  )

  /*      NFTs        */

  const refetchNftData = useCallback(
    (id: string) =>
      client.query<GetNftQuery, GetNftQueryVariables>({
        query: GetNftDocument,
        variables: {
          id,
        },
        fetchPolicy: 'network-only',
      }),
    [client]
  )

  /*      CRTs        */

  const refetchCreatorTokenData = useCallback(
    (id: string) =>
      client.query<GetFullCreatorTokenQuery, GetFullCreatorTokenQueryVariables>({
        query: GetFullCreatorTokenDocument,
        variables: {
          id,
        },
        fetchPolicy: 'network-only',
      }),
    [client]
  )

  const refetchMemberTokenHolderData = useCallback(
    (memberId?: string, tokenId?: string) =>
      client.query<GetCreatorTokenHoldersQuery, GetCreatorTokenHoldersQueryVariables>({
        query: GetCreatorTokenHoldersDocument,
        variables: {
          where: {
            token: {
              id_eq: tokenId,
            },
            member: {
              id_eq: memberId,
            },
          },
        },
        fetchPolicy: 'network-only',
      }),
    [client]
  )

  const refetchAllMemberTokenHolderQueries = useCallback(async () => {
    await client.refetchQueries({ include: [GetCreatorTokenHoldersDocument] })
  }, [client])

  const refetchAllMemberTokenBalanceData = useCallback(async () => {
    await client.refetchQueries({
      include: [GetChannelTokenBalanceDocument],
    })
  }, [client])

  return (
    <NetworkUtilsContext.Provider
      value={{
        // Videos
        refetchComment,
        refetchCommentsSection,
        refetchEdits,
        refetchReactions,
        refetchReplies,
        refetchVideo,

        // NFTs
        refetchNftData,

        // CRTs
        refetchCreatorTokenData,
        refetchMemberTokenHolderData,
        refetchAllMemberTokenHolderQueries,
        refetchAllMemberTokenBalanceData,
      }}
    >
      {children}
    </NetworkUtilsContext.Provider>
  )
}

export const useNetworkUtilsContext = () => {
  const ctx = useContext(NetworkUtilsContext)
  if (ctx === undefined) {
    throw new Error('useNetworkUtilsContext must be used within a NetworkUtilsProvider')
  }
  return ctx
}
