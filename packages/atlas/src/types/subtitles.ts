export type SubtitleInput = {
  languageIso: string
  type: 'closed-captions' | 'subtitles'
  file?: File
  assetId?: string
}
