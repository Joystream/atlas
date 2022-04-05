import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { BasicMembershipFieldsFragmentDoc } from './fragments.generated'

const defaultOptions = {} as const
export type GetNftNotificationsQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetNftNotificationsQuery = {
  __typename?: 'Query'
  events: Array<
    | { __typename?: 'AnnouncingPeriodStartedEvent'; inBlock: number }
    | { __typename?: 'ApplicationWithdrawnEvent'; inBlock: number }
    | { __typename?: 'AppliedOnOpeningEvent'; inBlock: number }
    | { __typename?: 'AuctionBidCanceledEvent'; inBlock: number }
    | {
        __typename?: 'AuctionBidMadeEvent'
        id: string
        createdAt: Date
        bidAmount: string
        inBlock: number
        member: {
          __typename?: 'Membership'
          id: string
          handle: string
          metadata: {
            __typename?: 'MemberMetadata'
            about?: string | null
            avatar?:
              | {
                  __typename?: 'AvatarObject'
                  avatarObject?: {
                    __typename?: 'StorageDataObject'
                    id: string
                    createdAt: Date
                    size: string
                    isAccepted: boolean
                    ipfsHash: string
                    storageBag: { __typename?: 'StorageBag'; id: string }
                    type:
                      | { __typename: 'DataObjectTypeChannelAvatar' }
                      | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                      | { __typename: 'DataObjectTypeUnknown' }
                      | { __typename: 'DataObjectTypeVideoMedia' }
                      | { __typename: 'DataObjectTypeVideoThumbnail' }
                  } | null
                }
              | { __typename?: 'AvatarUri'; avatarUri: string }
              | null
          }
        }
        video: { __typename?: 'Video'; id: string; title?: string | null }
      }
    | { __typename?: 'AuctionCanceledEvent'; inBlock: number }
    | {
        __typename?: 'BidMadeCompletingAuctionEvent'
        id: string
        createdAt: Date
        inBlock: number
        member: {
          __typename?: 'Membership'
          id: string
          handle: string
          metadata: {
            __typename?: 'MemberMetadata'
            about?: string | null
            avatar?:
              | {
                  __typename?: 'AvatarObject'
                  avatarObject?: {
                    __typename?: 'StorageDataObject'
                    id: string
                    createdAt: Date
                    size: string
                    isAccepted: boolean
                    ipfsHash: string
                    storageBag: { __typename?: 'StorageBag'; id: string }
                    type:
                      | { __typename: 'DataObjectTypeChannelAvatar' }
                      | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                      | { __typename: 'DataObjectTypeUnknown' }
                      | { __typename: 'DataObjectTypeVideoMedia' }
                      | { __typename: 'DataObjectTypeVideoThumbnail' }
                  } | null
                }
              | { __typename?: 'AvatarUri'; avatarUri: string }
              | null
          }
        }
        video: { __typename?: 'Video'; id: string; title?: string | null }
      }
    | { __typename?: 'BountyCanceledEvent'; inBlock: number }
    | { __typename?: 'BountyCreatedEvent'; inBlock: number }
    | { __typename?: 'BountyCreatorCherryWithdrawalEvent'; inBlock: number }
    | { __typename?: 'BountyFundedEvent'; inBlock: number }
    | { __typename?: 'BountyFundingWithdrawalEvent'; inBlock: number }
    | { __typename?: 'BountyMaxFundingReachedEvent'; inBlock: number }
    | { __typename?: 'BountyRemovedEvent'; inBlock: number }
    | { __typename?: 'BountyVetoedEvent'; inBlock: number }
    | { __typename?: 'BudgetBalanceSetEvent'; inBlock: number }
    | { __typename?: 'BudgetIncrementUpdatedEvent'; inBlock: number }
    | { __typename?: 'BudgetRefillEvent'; inBlock: number }
    | { __typename?: 'BudgetRefillPlannedEvent'; inBlock: number }
    | { __typename?: 'BudgetSetEvent'; inBlock: number }
    | { __typename?: 'BudgetSpendingEvent'; inBlock: number }
    | { __typename?: 'BudgetUpdatedEvent'; inBlock: number }
    | { __typename?: 'BuyNowCanceledEvent'; inBlock: number }
    | { __typename?: 'CandidacyNoteSetEvent'; inBlock: number }
    | { __typename?: 'CandidacyStakeReleaseEvent'; inBlock: number }
    | { __typename?: 'CandidacyWithdrawEvent'; inBlock: number }
    | { __typename?: 'CategoryArchivalStatusUpdatedEvent'; inBlock: number }
    | { __typename?: 'CategoryCreatedEvent'; inBlock: number }
    | { __typename?: 'CategoryDeletedEvent'; inBlock: number }
    | { __typename?: 'CategoryMembershipOfModeratorUpdatedEvent'; inBlock: number }
    | { __typename?: 'CategoryStickyThreadUpdateEvent'; inBlock: number }
    | { __typename?: 'CouncilorRewardUpdatedEvent'; inBlock: number }
    | { __typename?: 'EnglishAuctionCompletedEvent'; inBlock: number }
    | { __typename?: 'EnglishAuctionStartedEvent'; inBlock: number }
    | { __typename?: 'InitialInvitationBalanceUpdatedEvent'; inBlock: number }
    | { __typename?: 'InitialInvitationCountUpdatedEvent'; inBlock: number }
    | { __typename?: 'InvitesTransferredEvent'; inBlock: number }
    | { __typename?: 'LeaderInvitationQuotaUpdatedEvent'; inBlock: number }
    | { __typename?: 'LeaderSetEvent'; inBlock: number }
    | { __typename?: 'LeaderUnsetEvent'; inBlock: number }
    | { __typename?: 'MemberAccountsUpdatedEvent'; inBlock: number }
    | { __typename?: 'MemberInvitedEvent'; inBlock: number }
    | { __typename?: 'MemberProfileUpdatedEvent'; inBlock: number }
    | { __typename?: 'MemberVerificationStatusUpdatedEvent'; inBlock: number }
    | { __typename?: 'MembershipBoughtEvent'; inBlock: number }
    | { __typename?: 'MembershipPriceUpdatedEvent'; inBlock: number }
    | { __typename?: 'NewCandidateEvent'; inBlock: number }
    | { __typename?: 'NewCouncilElectedEvent'; inBlock: number }
    | { __typename?: 'NewCouncilNotElectedEvent'; inBlock: number }
    | { __typename?: 'NewMissedRewardLevelReachedEvent'; inBlock: number }
    | {
        __typename?: 'NftBoughtEvent'
        id: string
        createdAt: Date
        inBlock: number
        member: {
          __typename?: 'Membership'
          id: string
          handle: string
          metadata: {
            __typename?: 'MemberMetadata'
            about?: string | null
            avatar?:
              | {
                  __typename?: 'AvatarObject'
                  avatarObject?: {
                    __typename?: 'StorageDataObject'
                    id: string
                    createdAt: Date
                    size: string
                    isAccepted: boolean
                    ipfsHash: string
                    storageBag: { __typename?: 'StorageBag'; id: string }
                    type:
                      | { __typename: 'DataObjectTypeChannelAvatar' }
                      | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                      | { __typename: 'DataObjectTypeUnknown' }
                      | { __typename: 'DataObjectTypeVideoMedia' }
                      | { __typename: 'DataObjectTypeVideoThumbnail' }
                  } | null
                }
              | { __typename?: 'AvatarUri'; avatarUri: string }
              | null
          }
        }
        video: { __typename?: 'Video'; id: string; title?: string | null }
      }
    | { __typename?: 'NftIssuedEvent'; inBlock: number }
    | { __typename?: 'NftSlingedBackToTheOriginalArtistEvent'; inBlock: number }
    | { __typename?: 'NotEnoughCandidatesEvent'; inBlock: number }
    | { __typename?: 'OfferAcceptedEvent'; inBlock: number }
    | { __typename?: 'OfferCanceledEvent'; inBlock: number }
    | { __typename?: 'OfferStartedEvent'; inBlock: number }
    | {
        __typename?: 'OpenAuctionBidAcceptedEvent'
        id: string
        createdAt: Date
        inBlock: number
        video: {
          __typename?: 'Video'
          id: string
          title?: string | null
          nft?: {
            __typename?: 'OwnedNft'
            ownerMember?: {
              __typename?: 'Membership'
              id: string
              handle: string
              metadata: {
                __typename?: 'MemberMetadata'
                about?: string | null
                avatar?:
                  | {
                      __typename?: 'AvatarObject'
                      avatarObject?: {
                        __typename?: 'StorageDataObject'
                        id: string
                        createdAt: Date
                        size: string
                        isAccepted: boolean
                        ipfsHash: string
                        storageBag: { __typename?: 'StorageBag'; id: string }
                        type:
                          | { __typename: 'DataObjectTypeChannelAvatar' }
                          | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                          | { __typename: 'DataObjectTypeUnknown' }
                          | { __typename: 'DataObjectTypeVideoMedia' }
                          | { __typename: 'DataObjectTypeVideoThumbnail' }
                      } | null
                    }
                  | { __typename?: 'AvatarUri'; avatarUri: string }
                  | null
              }
            } | null
          } | null
        }
      }
    | { __typename?: 'OpenAuctionStartedEvent'; inBlock: number }
    | { __typename?: 'OpeningAddedEvent'; inBlock: number }
    | { __typename?: 'OpeningCanceledEvent'; inBlock: number }
    | { __typename?: 'OpeningFilledEvent'; inBlock: number }
    | { __typename?: 'OracleJudgmentSubmittedEvent'; inBlock: number }
    | { __typename?: 'PostAddedEvent'; inBlock: number }
    | { __typename?: 'PostDeletedEvent'; inBlock: number }
    | { __typename?: 'PostModeratedEvent'; inBlock: number }
    | { __typename?: 'PostReactedEvent'; inBlock: number }
    | { __typename?: 'PostTextUpdatedEvent'; inBlock: number }
    | { __typename?: 'ProposalCancelledEvent'; inBlock: number }
    | { __typename?: 'ProposalCreatedEvent'; inBlock: number }
    | { __typename?: 'ProposalDecisionMadeEvent'; inBlock: number }
    | { __typename?: 'ProposalDiscussionPostCreatedEvent'; inBlock: number }
    | { __typename?: 'ProposalDiscussionPostDeletedEvent'; inBlock: number }
    | { __typename?: 'ProposalDiscussionPostUpdatedEvent'; inBlock: number }
    | { __typename?: 'ProposalDiscussionThreadModeChangedEvent'; inBlock: number }
    | { __typename?: 'ProposalExecutedEvent'; inBlock: number }
    | { __typename?: 'ProposalStatusUpdatedEvent'; inBlock: number }
    | { __typename?: 'ProposalVotedEvent'; inBlock: number }
    | { __typename?: 'ReferendumFinishedEvent'; inBlock: number }
    | { __typename?: 'ReferendumStartedEvent'; inBlock: number }
    | { __typename?: 'ReferendumStartedForcefullyEvent'; inBlock: number }
    | { __typename?: 'ReferralCutUpdatedEvent'; inBlock: number }
    | { __typename?: 'RequestFundedEvent'; inBlock: number }
    | { __typename?: 'RevealingStageStartedEvent'; inBlock: number }
    | { __typename?: 'RewardPaidEvent'; inBlock: number }
    | { __typename?: 'RewardPaymentEvent'; inBlock: number }
    | { __typename?: 'StakeDecreasedEvent'; inBlock: number }
    | { __typename?: 'StakeIncreasedEvent'; inBlock: number }
    | { __typename?: 'StakeReleasedEvent'; inBlock: number }
    | { __typename?: 'StakeSlashedEvent'; inBlock: number }
    | { __typename?: 'StakingAccountAddedEvent'; inBlock: number }
    | { __typename?: 'StakingAccountConfirmedEvent'; inBlock: number }
    | { __typename?: 'StakingAccountRemovedEvent'; inBlock: number }
    | { __typename?: 'StatusTextChangedEvent'; inBlock: number }
    | { __typename?: 'TerminatedLeaderEvent'; inBlock: number }
    | { __typename?: 'TerminatedWorkerEvent'; inBlock: number }
    | { __typename?: 'ThreadCreatedEvent'; inBlock: number }
    | { __typename?: 'ThreadDeletedEvent'; inBlock: number }
    | { __typename?: 'ThreadMetadataUpdatedEvent'; inBlock: number }
    | { __typename?: 'ThreadModeratedEvent'; inBlock: number }
    | { __typename?: 'ThreadMovedEvent'; inBlock: number }
    | { __typename?: 'VoteCastEvent'; inBlock: number }
    | { __typename?: 'VoteOnPollEvent'; inBlock: number }
    | { __typename?: 'VoteRevealedEvent'; inBlock: number }
    | { __typename?: 'VotingPeriodStartedEvent'; inBlock: number }
    | { __typename?: 'WorkEntrantFundsWithdrawnEvent'; inBlock: number }
    | { __typename?: 'WorkEntryAnnouncedEvent'; inBlock: number }
    | { __typename?: 'WorkEntrySlashedEvent'; inBlock: number }
    | { __typename?: 'WorkEntryWithdrawnEvent'; inBlock: number }
    | { __typename?: 'WorkSubmittedEvent'; inBlock: number }
    | { __typename?: 'WorkerExitedEvent'; inBlock: number }
    | { __typename?: 'WorkerRewardAccountUpdatedEvent'; inBlock: number }
    | { __typename?: 'WorkerRewardAmountUpdatedEvent'; inBlock: number }
    | { __typename?: 'WorkerRoleAccountUpdatedEvent'; inBlock: number }
    | { __typename?: 'WorkerStartedLeavingEvent'; inBlock: number }
  >
}

export const GetNftNotificationsDocument = gql`
  query GetNftNotifications {
    events(
      orderBy: [createdAt_DESC]
      where: {
        type_in: [AuctionBidMadeEvent, NftBoughtEvent, BidMadeCompletingAuctionEvent, OpenAuctionBidAcceptedEvent]
      }
    ) {
      inBlock
      ... on AuctionBidMadeEvent {
        id
        createdAt
        member {
          ...BasicMembershipFields
        }
        video {
          id
          title
        }
        bidAmount
      }
      ... on NftBoughtEvent {
        id
        createdAt
        member {
          ...BasicMembershipFields
        }
        video {
          id
          title
        }
      }
      ... on BidMadeCompletingAuctionEvent {
        id
        createdAt
        member {
          ...BasicMembershipFields
        }
        video {
          id
          title
        }
      }
      ... on OpenAuctionBidAcceptedEvent {
        id
        createdAt
        video {
          id
          title
          nft {
            ownerMember {
              ...BasicMembershipFields
            }
          }
        }
      }
    }
  }
  ${BasicMembershipFieldsFragmentDoc}
`

/**
 * __useGetNftNotificationsQuery__
 *
 * To run a query within a React component, call `useGetNftNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNftNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNftNotificationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetNftNotificationsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetNftNotificationsQuery, GetNftNotificationsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetNftNotificationsQuery, GetNftNotificationsQueryVariables>(
    GetNftNotificationsDocument,
    options
  )
}
export function useGetNftNotificationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetNftNotificationsQuery, GetNftNotificationsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetNftNotificationsQuery, GetNftNotificationsQueryVariables>(
    GetNftNotificationsDocument,
    options
  )
}
export type GetNftNotificationsQueryHookResult = ReturnType<typeof useGetNftNotificationsQuery>
export type GetNftNotificationsLazyQueryHookResult = ReturnType<typeof useGetNftNotificationsLazyQuery>
export type GetNftNotificationsQueryResult = Apollo.QueryResult<
  GetNftNotificationsQuery,
  GetNftNotificationsQueryVariables
>
