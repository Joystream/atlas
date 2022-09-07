import { StorageDataObjectFieldsFragment } from '@/api/queries/__generated__/fragments.generated'

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
