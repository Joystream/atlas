import { NetworkStatus } from '@apollo/client'
import { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useComment, useUserCommentsReactions } from '@/api/hooks/comments'
import { useCommentSectionComments } from '@/api/hooks/useCommentSectionComments'
import { CommentOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { FullVideoFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { EmptyFallback } from '@/components/EmptyFallback'
import { Text } from '@/components/Text'
import { Comment } from '@/components/_comments/Comment'
import { CommentInput } from '@/components/_comments/CommentInput'
import { Select } from '@/components/_inputs/Select'
import { QUERY_PARAMS } from '@/config/routes'
import { COMMENTS_SORT_OPTIONS } from '@/config/sorting'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useReactionTransactions } from '@/hooks/useReactionTransactions'
import { useRouterQuery } from '@/hooks/useRouterQuery'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { useFee } from '@/providers/joystream'
import { useUser } from '@/providers/user/user.hooks'
import { createPlaceholderData } from '@/utils/data'
import { InfiniteLoadingOffsets } from '@/utils/loading.contants'

import { CommentThread } from './CommentThread'
import { CommentsSectionHeader, CommentsSectionWrapper, CommentsStyledSection } from './VideoView.styles'

type CommentsSectionProps = {
  disabled?: boolean
  video?: FullVideoFieldsFragment | null
  videoLoading: boolean
  videoAuthorId?: string
  onCommentInputFocus?: (arg: boolean) => void
}

const SCROLL_TO_COMMENT_TIMEOUT = 300
const INITIAL_COMMENTS = 10

export const CommentsSection: FC<CommentsSectionProps> = ({ disabled, video, videoLoading, onCommentInputFocus }) => {
  const [commentInputText, setCommentInputText] = useState('')
  const [commentInputIsProcessing, setCommentInputIsProcessing] = useState(false)
  const [highlightedCommentId, setHighlightedCommentId] = useState<string | null>(null)
  const [sortCommentsBy, setSortCommentsBy] = useState(COMMENTS_SORT_OPTIONS[0].value)
  const [commentInputActive, setCommentInputActive] = useState(false)
  const commentIdQueryParam = useRouterQuery(QUERY_PARAMS.COMMENT_ID)
  const mdMatch = useMediaMatch('md')
  const isConsideredMobile = !mdMatch
  const { id: videoId } = useParams()
  const { memberId, activeMembership, isLoggedIn } = useUser()
  const { isLoadingAsset: isMemberAvatarLoading, urls: memberAvatarUrls } = getMemberAvatar(activeMembership)
  const { trackCommentAdded } = useSegmentAnalytics()

  const { fullFee: fee, loading: feeLoading } = useFee(
    'createVideoCommentTx',
    memberId && video?.id && commentInputActive ? [memberId, video?.id, commentInputText || '', null] : undefined
  )

  const queryVariables = useMemo(
    () => ({
      memberId,
      videoId,
      orderBy: sortCommentsBy,
    }),
    [memberId, sortCommentsBy, videoId]
  )
  const commentsSectionHeaderRef = useRef<HTMLDivElement>(null)
  const commentSectionWrapperRef = useRef<HTMLDivElement>(null)
  const { comments, loading, fetchMore, pageInfo, networkStatus } = useCommentSectionComments(
    { ...queryVariables, first: isConsideredMobile ? INITIAL_COMMENTS : 1 },
    { skip: disabled || !videoId, notifyOnNetworkStatusChange: false }
  )
  const { userReactions } = useUserCommentsReactions(videoId, memberId)
  const { addComment } = useReactionTransactions()

  const { comment: commentFromUrl, loading: commentFromUrlLoading } = useComment(
    { commentId: commentIdQueryParam || '' },
    {
      skip: !commentIdQueryParam,
    }
  )
  const { comment: parentCommentFromUrl, loading: parentCommentFromUrlLoading } = useComment(
    { commentId: commentFromUrl?.parentComment?.id || '' },
    {
      skip: !commentFromUrl || !commentFromUrl.parentComment?.id,
    }
  )

  const commentsLoading = loading || commentFromUrlLoading || parentCommentFromUrlLoading || videoLoading
  const isFetchingMore = networkStatus === NetworkStatus.fetchMore

  const scrollToCommentInput = (smooth?: boolean) => {
    commentsSectionHeaderRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
  }

  const handleSorting = (value?: CommentOrderByInput[] | null) => {
    if (value) {
      setSortCommentsBy(value)
    }
  }

  const handleComment = async (parentCommentId?: string) => {
    if (!videoId || !commentInputText) {
      return
    }
    setCommentInputIsProcessing(true)
    await addComment({
      videoId,
      commentBody: commentInputText,
      parentCommentId,
      videoTitle: video?.title,
      optimisticOpts: {
        onTxSign: (newCommentId) => {
          setCommentInputIsProcessing(false)
          setCommentInputText('')
          setHighlightedCommentId(newCommentId || null)
        },
      },
    })

    trackCommentAdded(commentInputText, video?.id ?? 'no data')
  }

  const placeholderItems = commentsLoading ? createPlaceholderData(4) : []

  useEffect(() => {
    if (!commentIdQueryParam || !commentSectionWrapperRef.current) {
      return
    }
    const scrollTimeout = setTimeout(() => {
      scrollToCommentInput(true)
      setHighlightedCommentId(commentIdQueryParam)
    }, SCROLL_TO_COMMENT_TIMEOUT)

    return () => {
      clearTimeout(scrollTimeout)
    }
  }, [commentIdQueryParam])

  useEffect(
    function resetHighlightedComment() {
      if (!highlightedCommentId || commentsLoading) {
        return
      }
      const timeout = setTimeout(() => {
        setHighlightedCommentId(null)
      }, 3000)

      return () => clearTimeout(timeout)
    },
    [commentsLoading, highlightedCommentId, setHighlightedCommentId]
  )

  const displayedCommentFromUrl = commentFromUrl?.parentComment?.id ? parentCommentFromUrl : commentFromUrl

  // remove comment taken from url from regular array of comments
  const filteredComments = comments?.filter((comment) => comment.id !== displayedCommentFromUrl?.id) || []

  const mappedPlaceholders = placeholderItems.map((_, idx) => <Comment key={idx} />)

  if (disabled) {
    return (
      <CommentsSectionWrapper>
        <EmptyFallback title="Comments are disabled" subtitle="Author has disabled comments for this video" />
      </CommentsSectionWrapper>
    )
  }

  return (
    <CommentsSectionWrapper>
      <CommentsSectionHeader ref={commentsSectionHeaderRef}>
        <Text as="p" variant="h400">
          {loading || !video?.commentsCount ? 'Comments' : `${video.commentsCount} comments`}
        </Text>
        <Select
          size="medium"
          inlineLabel={mdMatch ? 'Sort by' : ''}
          value={sortCommentsBy}
          items={COMMENTS_SORT_OPTIONS}
          onChange={handleSorting}
          disabled={loading}
        />
      </CommentsSectionHeader>
      <CommentInput
        memberAvatarUrls={memberAvatarUrls}
        isMemberAvatarLoading={isLoggedIn ? isMemberAvatarLoading : false}
        processing={commentInputIsProcessing}
        readOnly={!memberId}
        memberHandle={activeMembership?.handle}
        value={commentInputText}
        fee={fee}
        feeLoading={feeLoading}
        hasInitialValueChanged={!!commentInputText}
        onComment={() => handleComment()}
        onChange={(e) => setCommentInputText(e.target.value)}
        onCommentInputActive={(value) => {
          onCommentInputFocus?.(value)
          setCommentInputActive(value)
        }}
      />
      {comments && !comments.length && !commentsLoading && (
        <EmptyFallback title="Be the first to comment" subtitle="Nobody has left a comment under this video yet." />
      )}
      {comments?.length ? (
        <CommentsStyledSection
          contentProps={{
            type: 'grid',
            grid: {
              xxs: {
                columns: 1,
              },
            },
            children: (
              <>
                {displayedCommentFromUrl && (
                  <CommentThread
                    commentId={displayedCommentFromUrl.id}
                    video={video}
                    hasAnyReplies={displayedCommentFromUrl.repliesCount > 0}
                    userReactionsLookup={userReactions}
                    highlightedCommentId={highlightedCommentId}
                    setHighlightedCommentId={setHighlightedCommentId}
                    linkedReplyId={parentCommentFromUrl ? commentFromUrl?.id : null}
                    repliesCount={displayedCommentFromUrl.repliesCount}
                  />
                )}
                {commentsLoading && !isFetchingMore
                  ? mappedPlaceholders
                  : filteredComments
                      ?.map((comment) => (
                        <CommentThread
                          key={comment.id}
                          commentId={comment.id}
                          video={video}
                          hasAnyReplies={comment.repliesCount > 0}
                          repliesCount={comment.repliesCount}
                          userReactionsLookup={userReactions}
                          highlightedCommentId={highlightedCommentId}
                          setHighlightedCommentId={setHighlightedCommentId}
                        />
                      ))
                      .concat(isFetchingMore && commentsLoading ? mappedPlaceholders : [])}
              </>
            ) as unknown as ReactElement[],
          }}
          footerProps={
            isConsideredMobile
              ? {
                  label: 'Load more comments',
                  handleLoadMore: async () => {
                    if (!loading) {
                      await fetchMore({ variables: { ...queryVariables, first: (comments?.length ?? 0) + 10 } })
                    }
                    return
                  },
                  type: 'link',
                }
              : {
                  reachedEnd: !pageInfo?.hasNextPage,
                  fetchMore: async () => {
                    if (!loading) {
                      await fetchMore({ variables: { ...queryVariables, first: (comments?.length ?? 0) + 10 } })
                    }
                    return
                  },
                  type: 'infinite',
                  loadingTriggerOffset: InfiniteLoadingOffsets.VideoTile,
                }
          }
        />
      ) : null}
    </CommentsSectionWrapper>
  )
}
