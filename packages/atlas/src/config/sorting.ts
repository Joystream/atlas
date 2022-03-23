import { OwnedNftOrderByInput, VideoOrderByInput } from '@/api/queries'

export const VIDEO_SORT_OPTIONS = [
  { name: 'Newest first', value: VideoOrderByInput.CreatedAtDesc },
  { name: 'Oldest first', value: VideoOrderByInput.CreatedAtAsc },
]

export const NFT_SORT_OPTIONS = [
  { name: 'Newest first', value: OwnedNftOrderByInput.CreatedAtDesc },
  { name: 'Oldest first', value: OwnedNftOrderByInput.CreatedAtAsc },
]
