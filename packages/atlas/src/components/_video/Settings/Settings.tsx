import { FC } from 'react'

import { ListItem } from '@/components/ListItem'
import { Text } from '@/components/Text'
import { SvgActionChevronL, SvgActionChevronR } from '@/components/_icons'

import { NodeEndWrapper, SettingsContainer, SettingsWrapper, StyledSvgActionCheck } from './Settings.styles'

export type SettingValue = string | number | boolean

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

  const selectedOptions = settings?.find((setting) => setting.label === openedOption)

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

type SettingsListItemProps = {
  label: string
  value: SettingValue
  isOption?: boolean
  checked?: boolean
  toggleable?: boolean
  onSettingClick?: (setting: { value: SettingValue; label: string }) => void
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
      <ListItem
        asButton={isOption}
        nodeStart={isOption ? <SvgActionChevronL /> : undefined}
        label={title}
        size="large"
        onClick={(event) => {
          event.stopPropagation()
          onHeaderClick?.()
        }}
      />
      <SettingsContainer>
        {settings?.map((setting, idx) => (
          <ListItem
            size="large"
            label={setting.label}
            nodeEnd={
              !isOption ? (
                <NodeEndWrapper>
                  <Text variant="t100" color="colorText" as="span">
                    {setting.value}
                  </Text>
                  <SvgActionChevronR />
                </NodeEndWrapper>
              ) : undefined
            }
            nodeStart={isOption ? <StyledSvgActionCheck checked={setting.checked} /> : undefined}
            asButton
            onClick={(event) => {
              event.stopPropagation()
              setting.onSettingClick?.({ value: setting.value, label: setting.label })
            }}
            key={idx}
          />
        ))}
      </SettingsContainer>
    </SettingsWrapper>
  )
}
