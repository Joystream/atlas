import { CommentOrderByInput, VideoOrderByInput } from '@/api/queries'

export const VIDEO_SORT_OPTIONS = [
  { name: 'Newest first', value: VideoOrderByInput.CreatedAtDesc },
  { name: 'Oldest first', value: VideoOrderByInput.CreatedAtAsc },
]

export const NFT_SORT_OPTIONS = [
  { name: 'Newest first', value: 'createdAt_DESC' as const },
  { name: 'Oldest first', value: 'createdAt_ASC' as const },
]

export const COMMENTS_SORT_OPTIONS = [
  { name: 'Most popular', value: CommentOrderByInput.ReactionsCountDesc },
  { name: 'Newest', value: CommentOrderByInput.CreatedAtDesc },
  { name: 'Oldest', value: CommentOrderByInput.CreatedAtAsc },
]
