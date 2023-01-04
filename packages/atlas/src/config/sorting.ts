import {
  CommentOrderByInput,
  OwnedNftOrderByInput,
  VideoOrderByInput,
} from '@/api/queries/__generated__/baseTypes.generated'

export const PLAYLIST_SORT_OPTIONS = [
  {
    name: 'Recently updated',
    value: 0,
  },
  {
    name: 'Oldest updated',
    value: 1,
  },
  {
    name: 'Total time (hight to low)',
    value: 2,
  },
  {
    name: 'Total time (low to high)',
    value: 3,
  },
  {
    name: 'Number of videos (hight to low)',
    value: 4,
  },
  {
    name: 'Number of videos (low to high)',
    value: 5,
  },
]

export const VIDEO_SORT_OPTIONS = [
  { name: 'Newest', value: VideoOrderByInput.CreatedAtDesc },
  { name: 'Oldest', value: VideoOrderByInput.CreatedAtAsc },
]

export const NFT_SORT_OPTIONS = [
  { name: 'Newest', value: OwnedNftOrderByInput.CreatedAtDesc },
  { name: 'Oldest', value: OwnedNftOrderByInput.CreatedAtAsc },
]

export const COMMENTS_SORT_OPTIONS = [
  {
    name: 'Most popular',
    value: [CommentOrderByInput.ReactionsAndRepliesCountDesc, CommentOrderByInput.CreatedAtAsc],
  },
  { name: 'Newest', value: [CommentOrderByInput.CreatedAtDesc] },
  { name: 'Oldest', value: [CommentOrderByInput.CreatedAtAsc] },
]
