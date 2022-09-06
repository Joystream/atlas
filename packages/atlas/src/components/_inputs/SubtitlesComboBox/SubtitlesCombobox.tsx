import styled from '@emotion/styled'
import { FC, useMemo } from 'react'

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
  onSubtitlesAdd: (subtitles: SubtitlesInput) => void
  error?: boolean
  disabled?: boolean
}

export const SubtitlesCombobox: FC<SubtitlesComboboxProps> = ({
  languagesIso,
  subtitlesArray,
  onLanguageAdd,
  onLanguageDelete,
  onSubtitlesAdd,
  error,
  disabled,
}) => {
  const availableSubtitlesLanguages = useMemo(() => {
    return languagesIso
      .map((iso) => [
        {
          displayName: LANGUAGES_LOOKUP[iso],
          languageIso: iso,
          type: 'subtitles' as const,
          disabled: !!subtitlesArray?.find(
            (subtitles) => subtitles.languageIso === iso && subtitles.type === 'subtitles'
          ),
        },
        {
          displayName: LANGUAGES_LOOKUP[iso],
          languageIso: iso,
          type: 'closed-captions' as const,
          disabled: !!subtitlesArray?.find(
            (subtitles) => subtitles.languageIso === iso && subtitles.type === 'closed-captions'
          ),
        },
      ])
      .flat()
  }, [languagesIso, subtitlesArray])

  return (
    <Wrapper>
      <ComboBox<AvailableLanguage>
        disabled={disabled}
        error={error}
        placeholder="Add language"
        items={availableSubtitlesLanguages.map((subtitlesLanguage) => ({
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
          onLanguageAdd({ languageIso: item.languageIso, type: item.type })
        }}
      />
      {subtitlesArray?.map(({ languageIso, file, type, id, url }) => (
        <SubtitlesBox
          key={languageIso + type}
          type={type}
          languageIso={LANGUAGES_LOOKUP[languageIso]}
          onRemove={() => {
            onLanguageDelete({ languageIso, type })
          }}
          file={file}
          url={url}
          id={id}
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
