import { FC } from 'react'

import { Text } from '@/components/Text'
import { SvgActionChevronL, SvgActionChevronR } from '@/components/_icons'

import {
  GridWrapper,
  SettingsHeader,
  SettingsListItemButton,
  SettingsListItemWrapper,
  SettingsUnorderedList,
  SettingsWrapper,
  StyledSvgActionCheck,
} from './Settings.styles'

export type SettingValue = string | number | boolean

type SettingsListItemProps = {
  label: string
  value: SettingValue
  isOption?: boolean
  checked?: boolean
  toggleable?: boolean
  onSettingClick?: (setting: { value: SettingValue; label: string }) => void
}

export type SettingsProps = {
  settings: Setting[]
  openedOption: string | null
  onOpenedOption: (option: string | null) => void
}

export type Setting = {
  options: SettingsListItemProps[]
} & SettingsListItemProps

export const Settings: FC<SettingsProps> = ({ settings, openedOption, onOpenedOption }) => {
  const baseMenu: Setting[] = settings.map((setting) => ({
    ...setting,
    onSettingClick: ({ label }) => onOpenedOption(label),
  }))

  const selectedOptions = settings?.find((s) => s.label === openedOption)

  const options = selectedOptions
    ? (selectedOptions.options.map((opt) => ({
        ...opt,
        onSettingClick: (setting) => {
          opt?.onSettingClick?.(setting)
          onOpenedOption(null)
        },
      })) as SettingsListItemProps[])
    : []

  return (
    <>
      {openedOption === null ? (
        <SettingList title="Settings" settings={baseMenu} />
      ) : (
        <SettingList title={openedOption} isOption onHeaderClick={() => onOpenedOption(null)} settings={options} />
      )}
    </>
  )
}

type SettingsListProps = {
  title: string
  settings?: SettingsListItemProps[]
  onHeaderClick?: () => void
  isOption?: boolean
}

export const SettingList: FC<SettingsListProps> = ({ settings, title, onHeaderClick, isOption = false }) => {
  return (
    <SettingsWrapper>
      <SettingsHeader
        as={isOption ? 'button' : 'header'}
        isClickable={isOption}
        onClick={(event) => {
          event.stopPropagation()
          onHeaderClick?.()
        }}
      >
        {isOption && <SvgActionChevronL />}
        <Text variant="h100" color="colorText" as="span">
          {title}
        </Text>
      </SettingsHeader>
      <SettingsUnorderedList>
        {settings?.map((setting, idx) => (
          <SettingsListItem isOption={isOption} key={idx} {...setting} />
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
  isOption = false,
}) => {
  return (
    <SettingsListItemWrapper>
      <SettingsListItemButton
        onClick={(event) => {
          event.stopPropagation()
          onSettingClick?.({ value, label })
        }}
      >
        <GridWrapper>
          {isOption && <StyledSvgActionCheck checked={checked} />}
          <Text variant="t200" as="span">
            {label}
          </Text>
        </GridWrapper>
        {!isOption && (
          <GridWrapper>
            <Text variant="t100" color="colorText" as="span">
              {value}
            </Text>
            {!toggleable && <SvgActionChevronR />}
          </GridWrapper>
        )}
      </SettingsListItemButton>
    </SettingsListItemWrapper>
  )
}
