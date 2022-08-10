import styled from '@emotion/styled'
import { FC } from 'react'

import { sizes } from '@/styles'

import { ComboBox } from '../ComboBox'
import { SubtitleBox } from '../SubtitleBox'

type Subtitles = {
  language: string
  file?: File
  type: 'subtitles' | 'closed-captions'
}

type SubtitlesLanguage = {
  language: string
  type: 'subtitles' | 'closed-captions'
  disabled: boolean
}

type SubtitlesComboboxProps = {
  subtitlesArray: Subtitles[] | null
  availableLanguages: SubtitlesLanguage[]
  onLanguageAdd: (language: Subtitles) => void
  onLanguageDelete: (language: Subtitles) => void
  onSubtitlesDownload?: () => void
  onSubtitlesAdd: (subtitles: Subtitles) => void
}

export const SubtitlesCombobox: FC<SubtitlesComboboxProps> = ({
  availableLanguages,
  subtitlesArray,
  onLanguageAdd,
  onSubtitlesDownload,
  onLanguageDelete,
  onSubtitlesAdd,
}) => {
  return (
    <Wrapper>
      <ComboBox<SubtitlesLanguage>
        placeholder="Add language"
        items={availableLanguages.map((subtitlesLanguage) => ({
          ...subtitlesLanguage,
          label: `${subtitlesLanguage.language} ${subtitlesLanguage.type === 'closed-captions' ? '(CC)' : ''}`,
        }))}
        resetOnSelect
        onSelectedItemChange={(item) => {
          if (item?.disabled || !item) {
            return
          }
          onLanguageAdd({ language: item.language, type: item.type })
        }}
      />
      {subtitlesArray?.map(({ language, file, type }) => (
        <SubtitleBox
          key={language + type}
          type={type}
          language={language}
          onRemove={() => onLanguageDelete({ language, type })}
          onDownload={onSubtitlesDownload}
          file={file}
          onChange={(e) => {
            onSubtitlesAdd({ language, file: e.currentTarget.files?.[0], type })
          }}
        />
      ))}
    </Wrapper>
  )
}

export const Wrapper = styled.div`
  display: grid;
  gap: ${sizes(4)};
`
