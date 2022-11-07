import styled from '@emotion/styled'
import { FC, useCallback } from 'react'

import { SvgActionCancel } from '@/assets/icons'
import { Text } from '@/components/Text'
import { atlasConfig } from '@/config'
import { sizes } from '@/styles'
import { SubtitlesInput } from '@/types/subtitles'

import { ComboBox } from '../ComboBox'
import { SubtitlesBox } from '../SubtitlesBox'

type AvailableLanguage = SubtitlesInput & {
  disabled: boolean
  isSeparator?: boolean
}

type SubtitlesComboboxProps = {
  subtitlesArray: SubtitlesInput[] | null
  languagesIso: string[]
  popularLanguagesIso: string[]
  onLanguageAdd: (language: SubtitlesInput) => void
  onLanguageDelete: (language: SubtitlesInput) => void
  onSubtitlesAdd: (subtitles: SubtitlesInput) => void
  error?: boolean
  disabled?: boolean
}

export const SubtitlesCombobox: FC<SubtitlesComboboxProps> = ({
  languagesIso,
  popularLanguagesIso,
  subtitlesArray,
  onLanguageAdd,
  onLanguageDelete,
  onSubtitlesAdd,
  error,
  disabled,
}) => {
  const getAvailableSubtitlesLanguages = useCallback(
    (languagesIso: string[]) =>
      languagesIso
        .map((iso) => [
          {
            label: `${atlasConfig.derived.languagesLookup[iso]}`,
            languageIso: iso,
            type: 'subtitles' as const,
            disabled: !!subtitlesArray?.find(
              (subtitles) => subtitles.languageIso === iso && subtitles.type === 'subtitles'
            ),
            isSeparator: false,
          },
          {
            label: `${atlasConfig.derived.languagesLookup[iso]} (CC)`,
            languageIso: iso,
            type: 'closed-captions' as const,
            disabled: !!subtitlesArray?.find(
              (subtitles) => subtitles.languageIso === iso && subtitles.type === 'closed-captions'
            ),
            isSeparator: false,
          },
        ])
        .flat(),
    [subtitlesArray]
  )

  const mappedLanguages = [
    {
      label: 'TOP LANGUAGES',
      type: 'separator' as const,
      languageIso: '',
      value: '',
      isSeparator: true,
      disabled: false,
    },
    ...getAvailableSubtitlesLanguages(popularLanguagesIso),
    {
      label: 'ALL LANGUAGES',
      type: 'separator' as const,
      languageIso: '',
      value: '',
      isSeparator: true,
      disabled: false,
    },
    ...getAvailableSubtitlesLanguages(languagesIso),
  ]

  const notFoundNode = {
    label: 'Language not found',
    nodeStart: <SvgActionCancel />,
  }

  return (
    <Wrapper>
      <ComboBox<AvailableLanguage>
        disabled={disabled}
        error={error}
        placeholder="Add language"
        items={mappedLanguages.map((subtitlesLanguage) =>
          !subtitlesLanguage.isSeparator
            ? {
                ...subtitlesLanguage,
                nodeEnd: subtitlesLanguage.disabled ? (
                  <Text variant="t200" as="span" color="colorTextMuted">
                    Added
                  </Text>
                ) : null,
              }
            : subtitlesLanguage
        )}
        resetOnSelect
        onSelectedItemChange={(item) => {
          if (item?.disabled || !item) {
            return
          }
          onLanguageAdd({ languageIso: item.languageIso, type: item.type })
        }}
        notFoundNode={notFoundNode}
      />
      {subtitlesArray?.map(({ languageIso, file, type, id, asset, isUploadedAsSrt }) => (
        <SubtitlesBox
          key={languageIso + type}
          isUploadedAsSrt={isUploadedAsSrt}
          type={type}
          languageIso={languageIso}
          onRemove={() => {
            onLanguageDelete({ languageIso, type })
          }}
          file={file}
          id={id}
          asset={asset}
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
