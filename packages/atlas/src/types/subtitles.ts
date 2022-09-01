import { StorageDataObjectFieldsFragment } from '@/api/queries'

export type SubtitlesInput = {
  languageIso: string
  type: 'closed-captions' | 'subtitles'
  /**
   * @param file File needs to be provided in .vtt format
   */
  file?: File
  id?: string
  asset?: StorageDataObjectFieldsFragment | null
  url?: string
}
