import { VideoOrderByInput } from '@/api/queries'

export const SORT_OPTIONS = [
  { name: 'Newest first', value: VideoOrderByInput.CreatedAtDesc },
  { name: 'Oldest first', value: VideoOrderByInput.CreatedAtAsc },
]
