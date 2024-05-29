import { useApolloClient } from '@apollo/client'
import { ReactNode, createContext, useCallback, useContext } from 'react'

import {
  GetChannelPaymentEventsDocument,
  GetChannelPaymentEventsQuery,
  GetChannelPaymentEventsQueryVariables,
  GetFullChannelDocument,
  GetFullChannelQuery,
  GetFullChannelQueryVariables,
} from '@/api/queries/__generated__/channels.generated'
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
import { UNCOFIRMED_COMMENT, UNCOFIRMED_REPLY } from '@/hooks/useOptimisticActions'
import { NetworkUtilsContextValue } from '@/providers/networkUtils/networkUtils.type'
import { useUser } from '@/providers/user/user.hooks'

const NetworkUtilsContext = createContext<NetworkUtilsContextValue | undefined>(undefined)
NetworkUtilsContext.displayName = 'NetworkUtilsContext'

export const NetworkUtilsProvider = ({ children }: { children: ReactNode }) => {
  const client = useApolloClient()
  const { memberId: activeMemberId } = useUser()

  const evictUnconfirmedCache = useCallback(
    (keyPart: string) => {
      Object.keys(client.cache.extract()).forEach((key) => {
        if (key.includes(keyPart)) {
          client.cache.evict({ id: key })
        }
      })
    },
    [client.cache]
  )

  /*      Channel        */

  const refetchChannel = useCallback(
    (channelId: string) => {
      return client.query<GetFullChannelQuery, GetFullChannelQueryVariables>({
        query: GetFullChannelDocument,
        variables: {
          id: channelId,
        },
        fetchPolicy: 'network-only',
      })
    },
    [client]
  )

  const refetchChannelPayments = useCallback(
    (channelId: string) => {
      return client.query<GetChannelPaymentEventsQuery, GetChannelPaymentEventsQueryVariables>({
        query: GetChannelPaymentEventsDocument,
        variables: {
          channelId: channelId,
        },
        fetchPolicy: 'network-only',
      })
    },
    [client]
  )

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
          memberId: memberId ?? activeMemberId ?? '',
          videoId: videoId,
        },
        fetchPolicy: 'network-only',
      })
    },
    [activeMemberId, client]
  )

  const refetchReplies = useCallback(
    (parentCommentId: string) => {
      evictUnconfirmedCache(UNCOFIRMED_REPLY)
      return client.query<GetCommentRepliesConnectionQuery, GetCommentRepliesConnectionQueryVariables>({
        query: GetCommentRepliesConnectionDocument,
        variables: {
          parentCommentId,
        },
        fetchPolicy: 'network-only',
      })
    },
    [client, evictUnconfirmedCache]
  )

  const refetchCommentsSection = useCallback(
    (videoId: string, memberId?: string) => {
      evictUnconfirmedCache(UNCOFIRMED_COMMENT)

      return client.query<
        GetUserCommentsAndVideoCommentsConnectionQuery,
        GetUserCommentsAndVideoCommentsConnectionQueryVariables
      >({
        query: GetUserCommentsAndVideoCommentsConnectionDocument,
        variables: {
          memberId: memberId ?? activeMemberId,
          videoId: videoId,
        },
        fetchPolicy: 'network-only',
      })
    },
    [activeMemberId, client, evictUnconfirmedCache]
  )

  const refetchAllCommentsSections = useCallback(async () => {
    await client.refetchQueries({
      updateCache: (cache) => {
        cache.evict({
          fieldName: 'commentsConnection',
        })
      },
    })
  }, [client])

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
        // Channel
        refetchChannel,
        refetchChannelPayments,

        // Videos
        refetchComment,
        refetchCommentsSection,
        refetchAllCommentsSections,
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
