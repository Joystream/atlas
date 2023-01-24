import {
  CommentOrderByInput,
  EventOrderByInput,
  OwnedNftOrderByInput,
  VideoOrderByInput,
} from '@/api/queries/__generated__/baseTypes.generated'

export const VIDEO_SORT_OPTIONS = [
  { name: 'Newest', value: VideoOrderByInput.CreatedAtDesc },
  { name: 'Oldest', value: VideoOrderByInput.CreatedAtAsc },
]

export const NFT_SORT_OPTIONS = [
  { name: 'Newest', value: OwnedNftOrderByInput.CreatedAtDesc },
  { name: 'Oldest', value: OwnedNftOrderByInput.CreatedAtAsc },
]
export const NFT_SORT_ACTIVITY_OPTIONS = [
  { name: 'Newest', value: EventOrderByInput.TimestampDesc },
  { name: 'Oldest', value: EventOrderByInput.TimestampAsc },
]

export const COMMENTS_SORT_OPTIONS = [
  {
    name: 'Most popular',
    value: [CommentOrderByInput.ReactionsAndRepliesCountDesc, CommentOrderByInput.CreatedAtAsc],
  },
  { name: 'Newest', value: [CommentOrderByInput.CreatedAtDesc] },
  { name: 'Oldest', value: [CommentOrderByInput.CreatedAtAsc] },
]
