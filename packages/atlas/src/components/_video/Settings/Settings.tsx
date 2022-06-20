import { FC, useState } from 'react'

import { Text } from '@/components/Text'
import { SvgActionCheck, SvgActionChevronL, SvgActionChevronR } from '@/components/_icons'

import {
  GridWrapper,
  SettingsHeader,
  SettingsListItemWrapper,
  SettingsUnorderedList,
  SettingsWrapper,
} from './Settings.styles'

type SettingsListItemProps = {
  label: string
  value: string | number
  // for options
  isValueHidden?: boolean
  checked?: boolean
  toggleable?: boolean
  onSettingClick?: (setting: { value: string | number; label: string }) => void
}

export type SettingsProps = {
  settings: Setting[]
}

export type Setting = {
  options: SettingsListItemProps[]
} & SettingsListItemProps

export const Settings: FC<SettingsProps> = ({ settings }) => {
  const [openedOption, setOpenedOption] = useState<string | null>('')

  const ss: Setting[] = settings.map((s) => ({
    ...s,
    onSettingClick: ({ label }) => setOpenedOption(label),
  }))

  const selectedOptions = settings?.find((s) => s.label === openedOption)

  const options = selectedOptions
    ? (selectedOptions.options.map((opt) => ({
        ...opt,
        onSettingClick: (setting) => {
          opt?.onSettingClick?.(setting)
          setOpenedOption(null)
        },
      })) as SettingsListItemProps[])
    : []

  return (
    <>
      {openedOption === null ? (
        <SettingList title="Settings" settings={ss} />
      ) : (
        <SettingList
          title={openedOption}
          isValueHidden
          isOption
          onHeaderClick={() => setOpenedOption(null)}
          settings={options}
        />
      )}
    </>
  )
}

type SettingsListProps = {
  title: string
  settings?: SettingsListItemProps[]
  onHeaderClick?: () => void
  isOption?: boolean
  isValueHidden?: boolean
}

export const SettingList: FC<SettingsListProps> = ({
  settings,
  title,
  onHeaderClick,
  isOption = false,
  isValueHidden,
}) => {
  return (
    <SettingsWrapper>
      <SettingsHeader onClick={onHeaderClick}>
        {isOption && <SvgActionChevronL />}
        <Text variant="h100" secondary>
          {title}
        </Text>
      </SettingsHeader>
      <SettingsUnorderedList>
        {settings?.map((setting, idx) => (
          <SettingsListItem isValueHidden={isValueHidden} key={idx} {...setting} />
        ))}
      </SettingsUnorderedList>
    </SettingsWrapper>
  )
}

const SettingsListItem: FC<SettingsListItemProps> = ({
  label,
  value,
  checked,
  toggleable,
  onSettingClick,
  isValueHidden = false,
}) => {
  return (
    <SettingsListItemWrapper onClick={() => onSettingClick?.({ value, label })}>
      <GridWrapper>
        {checked && !toggleable && <SvgActionCheck />}
        <Text variant="t200">{label}</Text>
      </GridWrapper>
      {!isValueHidden && (
        <GridWrapper>
          <Text variant="t100" secondary>
            {value}
          </Text>
          {!toggleable && <SvgActionChevronR />}
        </GridWrapper>
      )}
    </SettingsListItemWrapper>
  )
}
