import { FC } from 'react'

import { ComboBox } from '@/components/_inputs/ComboBox'
import { atlasConfig } from '@/config'

type VideoLanguageComboboxProps = {
  value: string | null
  error?: boolean
  onSelectedItemChange: (value?: string) => void
}

export const VideoLanguageCombobox: FC<VideoLanguageComboboxProps> = ({ value, error, onSelectedItemChange }) => {
  const allLanguages = atlasConfig.derived.languagesSelectValues.map((language) => ({
    label: language.name,
    value: language.value,
  }))
  const popularLanguages = atlasConfig.derived.popularLanguagesSelectValues.map((language) => ({
    label: language.name,
    value: language.value,
  }))
  const mappedLanguages = [
    { label: 'TOP LANGUAGES', value: '', separator: true },
    ...popularLanguages,
    { label: 'ALL LANGUAGES', value: '', separator: true },
    ...allLanguages,
  ]

  return (
    <ComboBox
      items={mappedLanguages}
      onSelectedItemChange={(item) => onSelectedItemChange(item?.value)}
      value={atlasConfig.derived.languagesLookup[value || '']}
      error={error}
    />
  )
}
