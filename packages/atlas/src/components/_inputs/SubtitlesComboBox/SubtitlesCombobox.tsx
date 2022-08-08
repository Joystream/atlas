import styled from '@emotion/styled'
import { FC } from 'react'

import { sizes } from '@/styles'

import { ComboBox } from '../ComboBox'
import { SubtitleBox } from '../SubtitleBox'

type Subtitles = {
  language: string
  file?: File
  isClosedCaptions?: boolean
}

type SubtitlesComboboxProps = {
  subtitlesArray: Subtitles[] | null
  availableLanguages: string[]
  onLanguageAdd: (language: string) => void
  onLanguageDelete: (language: string) => void
  onSubtitlesDownload?: () => void
  onMarkAsCC?: (language: string) => void
  onSubtitlesAdd: (subtitles: Subtitles) => void
}

export const SubtitlesCombobox: FC<SubtitlesComboboxProps> = ({
  availableLanguages,
  subtitlesArray,
  onLanguageAdd,
  onSubtitlesDownload,
  onMarkAsCC,
  onLanguageDelete,
  onSubtitlesAdd,
}) => {
  return (
    <Wrapper>
      <ComboBox
        placeholder="Add language"
        items={availableLanguages.map((language) => ({ label: language }))}
        resetOnSelect
        onSelectedItemChange={(item) => {
          if (item) {
            return onLanguageAdd(item?.label)
          }
        }}
      />
      {subtitlesArray?.map(({ language, file, isClosedCaptions }) => (
        <SubtitleBox
          key={language}
          isClosedCaptions={isClosedCaptions}
          language={language}
          onRemove={() => onLanguageDelete(language)}
          onDownload={onSubtitlesDownload}
          onMarkAsCC={() => onMarkAsCC?.(language)}
          file={file}
          onChange={(e) => {
            onSubtitlesAdd({ language, file: e.currentTarget.files?.[0] })
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
