export type SubtitlesInput = {
  languageIso: string
  type: 'closed-captions' | 'subtitles'
  /**
   * @param file File needs to be provided in .vtt format
   */
  file?: File
  assetId?: string
}
