import styled from '@emotion/styled'
import { FC, useState } from 'react'

import { Text } from '@/components/Text'
import { LANGUAGES_LOOKUP } from '@/config/languages'
import { sizes } from '@/styles'
import { SubtitlesInput } from '@/types/subtitles'

import { ComboBox } from '../ComboBox'
import { SubtitlesBox } from '../SubtitlesBox'

type AvailableLanguage = SubtitlesInput & {
  disabled: boolean
  displayName: string
}

type SubtitlesComboboxProps = {
  subtitlesArray: SubtitlesInput[] | null
  languagesIso: string[]
  onLanguageAdd: (language: SubtitlesInput) => void
  onLanguageDelete: (language: SubtitlesInput) => void
  onSubtitlesDownload?: () => void
  onSubtitlesAdd: (subtitles: SubtitlesInput) => void
}

export const SubtitlesCombobox: FC<SubtitlesComboboxProps> = ({
  languagesIso,
  subtitlesArray,
  onLanguageAdd,
  onSubtitlesDownload,
  onLanguageDelete,
  onSubtitlesAdd,
}) => {
  const [availableLanguages, setAvailableLanguages] = useState<AvailableLanguage[]>(
    languagesIso
      .map((iso) => [
        { displayName: LANGUAGES_LOOKUP[iso], languageIso: iso, type: 'subtitles' as const, disabled: false },
        { displayName: LANGUAGES_LOOKUP[iso], languageIso: iso, type: 'closed-captions' as const, disabled: false },
      ])
      .flat()
  )

  const toggleLanguage = (subtitles: SubtitlesInput, disabled: boolean) => {
    setAvailableLanguages((availableLanguages) =>
      availableLanguages.map((availableLanguage) => {
        if (availableLanguage.languageIso === subtitles.languageIso && availableLanguage.type === subtitles.type) {
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
          label: `${subtitlesLanguage.displayName} ${subtitlesLanguage.type === 'closed-captions' ? '(CC)' : ''}`,
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
          onLanguageAdd({ languageIso: item.languageIso, type: item.type })
        }}
      />
      {subtitlesArray?.map(({ languageIso, file, type, assetId }) => (
        <SubtitlesBox
          key={languageIso + type}
          type={type}
          languageIso={LANGUAGES_LOOKUP[languageIso]}
          onRemove={() => {
            toggleLanguage({ languageIso, type }, false)
            onLanguageDelete({ languageIso, type })
          }}
          onDownload={onSubtitlesDownload}
          file={file}
          assetId={assetId}
          onChange={(e) => {
            onSubtitlesAdd({ languageIso, file: e.currentTarget.files?.[0], type })
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
