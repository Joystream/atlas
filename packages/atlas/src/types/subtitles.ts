export type SubtitlesInput = {
  languageIso: string
  type: 'closed-captions' | 'subtitles'
  file?: File
  assetId?: string
}
