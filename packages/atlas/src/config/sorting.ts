import {
  CommentOrderByInput,
  OwnedNftOrderByInput,
  VideoOrderByInput,
} from '@/api/queries/__generated__/baseTypes.generated'

export const VIDEO_SORT_OPTIONS = [
  { name: 'Newest', value: VideoOrderByInput.IdDesc },
  { name: 'Oldest', value: VideoOrderByInput.IdAsc },
]

export const NFT_SORT_OPTIONS = [
  { name: 'Newest', value: OwnedNftOrderByInput.IdDesc },
  { name: 'Oldest', value: OwnedNftOrderByInput.IdAsc },
]

export const COMMENTS_SORT_OPTIONS = [
  {
    name: 'Most popular',
    value: [CommentOrderByInput.ReactionsAndRepliesCountDesc, CommentOrderByInput.IdDesc],
  },
  { name: 'Newest', value: [CommentOrderByInput.IdDesc] },
  { name: 'Oldest', value: [CommentOrderByInput.IdAsc] },
]
