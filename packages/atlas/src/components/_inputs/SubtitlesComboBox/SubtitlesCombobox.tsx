import styled from '@emotion/styled'
import { FC, useState } from 'react'

import { Text } from '@/components/Text'
import { sizes } from '@/styles'

import { ComboBox } from '../ComboBox'
import { SubtitleBox } from '../SubtitleBox'

type Subtitles = {
  language: string
  file?: File
  type: 'subtitles' | 'closed-captions'
}

type AvailableLanguage = Subtitles & {
  disabled: boolean
}

type SubtitlesComboboxProps = {
  subtitlesArray: Subtitles[] | null
  languages: string[]
  onLanguageAdd: (language: Subtitles) => void
  onLanguageDelete: (language: Subtitles) => void
  onSubtitlesDownload?: () => void
  onSubtitlesAdd: (subtitles: Subtitles) => void
}

export const SubtitlesCombobox: FC<SubtitlesComboboxProps> = ({
  languages,
  subtitlesArray,
  onLanguageAdd,
  onSubtitlesDownload,
  onLanguageDelete,
  onSubtitlesAdd,
}) => {
  const [availableLanguages, setAvailableLanguages] = useState<AvailableLanguage[]>(
    languages
      .map((language) => [
        { language, type: 'subtitles' as const, disabled: false },
        { language, type: 'closed-captions' as const, disabled: false },
      ])
      .flat(1)
  )

  const toggleLanguage = (subtitles: Subtitles, disabled: boolean) => {
    setAvailableLanguages((availableLanguages) =>
      availableLanguages.map((availableLanguage) => {
        if (availableLanguage.language === subtitles.language && availableLanguage.type === subtitles.type) {
          return {
            ...availableLanguage,
            disabled,
          }
        }
        return availableLanguage
      })
    )
  }
  return (
    <Wrapper>
      <ComboBox<AvailableLanguage>
        placeholder="Add language"
        items={availableLanguages.map((subtitlesLanguage) => ({
          ...subtitlesLanguage,
          label: `${subtitlesLanguage.language} ${subtitlesLanguage.type === 'closed-captions' ? '(CC)' : ''}`,
          nodeEnd: subtitlesLanguage.disabled ? (
            <Text variant="t200" as="span" color="colorTextMuted">
              Added
            </Text>
          ) : null,
        }))}
        resetOnSelect
        onSelectedItemChange={(item) => {
          if (item?.disabled || !item) {
            return
          }
          toggleLanguage(item, true)
          onLanguageAdd({ language: item.language, type: item.type })
        }}
      />
      {subtitlesArray?.map(({ language, file, type }) => (
        <SubtitleBox
          key={language + type}
          type={type}
          language={language}
          onRemove={() => {
            toggleLanguage({ language, type }, false)
            return onLanguageDelete({ language, type })
          }}
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
