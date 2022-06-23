import { FC } from 'react'

import { ListItem, ListItemProps } from '@/components/ListItem'
import { Text } from '@/components/Text'
import { SvgActionChevronL, SvgActionChevronR } from '@/components/_icons'
import { Switch } from '@/components/_inputs/Switch'

import {
  NodeEndWrapper,
  SettingsContainer,
  SettingsWrapper,
  StyledListItem,
  StyledSvgActionCheck,
} from './Settings.styles'

export type SettingValue = string | number | boolean

export type SettingsProps = {
  settings: Setting[]
  openedSetting: string | null
  onSettingClick: (value: string | null) => void
}

type MulitValueSetting = {
  type: 'multi-value'
  value: string | number
  options: MultiValueOption[]
} & ListItemProps

type BooleanSetting = {
  type: 'boolean'
  value: boolean
  options?: never
  onSwitchClick?: (value: boolean) => void
} & ListItemProps

export type Setting = MulitValueSetting | BooleanSetting

export const Settings: FC<SettingsProps> = ({ settings, openedSetting = null, onSettingClick }) => {
  const selectedOption = settings.find((setting) => setting.label === openedSetting)

  return (
    <>
      {openedSetting === null ? (
        <SettingList title="Settings" settings={settings} onSettingClick={onSettingClick} />
      ) : (
        <SettingOptionsList
          title={openedSetting || ''}
          onClose={() => onSettingClick(null)}
          settings={selectedOption?.options}
        />
      )}
    </>
  )
}

type SettingsListProps = {
  title: string
  settings?: Setting[]
  onSettingClick?: (value: string | null) => void
}

export const SettingList: FC<SettingsListProps> = ({ settings, onSettingClick }) => {
  return (
    <SettingsWrapper>
      <SettingsContainer>
        {settings?.map((setting, idx) => {
          switch (setting.type) {
            case 'multi-value':
              return (
                <ListItem
                  key={idx}
                  label={setting.label}
                  size="large"
                  asButton
                  onClick={(event) => {
                    event.stopPropagation()
                    onSettingClick?.(String(setting.label))
                  }}
                  nodeEnd={
                    <NodeEndWrapper gap={3}>
                      <Text variant="t100" color="colorText" as="span">
                        {setting.value}
                      </Text>
                      <SvgActionChevronR />
                    </NodeEndWrapper>
                  }
                />
              )
            case 'boolean':
              return (
                <label key={idx}>
                  <StyledListItem
                    label={setting.label}
                    size="large"
                    onClick={(event) => event.stopPropagation()}
                    nodeEnd={
                      <NodeEndWrapper gap={2}>
                        <Text as="span" variant="t100" color="colorText">
                          {setting.value ? 'On' : 'Off'}
                        </Text>
                        <Switch
                          value={setting.value}
                          onChange={(e) => setting.onSwitchClick?.(!!e?.currentTarget.checked)}
                        />
                      </NodeEndWrapper>
                    }
                  />
                </label>
              )
          }
        })}
      </SettingsContainer>
    </SettingsWrapper>
  )
}

type MultiValueOption = {
  value: string | number
  options?: never
  onOptionClick?: (value: string | number) => void
} & Omit<ListItemProps, ''>

type SettingOptionsListProps = {
  title: string
  settings?: MultiValueOption[]
  onClose?: () => void
  value?: string | number
}

export const SettingOptionsList: FC<SettingOptionsListProps> = ({ title, onClose, settings }) => {
  return (
    <SettingsWrapper>
      <ListItem
        asButton
        nodeStart={<SvgActionChevronL />}
        label={title}
        size="large"
        onClick={(event) => {
          event.stopPropagation()
          onClose?.()
        }}
      />
      <SettingsContainer withBorder>
        {settings?.map((setting, idx) => {
          return (
            <StyledListItem
              asButton
              key={idx}
              onClick={(event) => {
                event.stopPropagation()
                onClose?.()
                setting.onOptionClick?.(setting.value)
              }}
              label={setting.label}
              size="large"
              nodeStart={<StyledSvgActionCheck checked={setting.selected} />}
            />
          )
        })}
      </SettingsContainer>
    </SettingsWrapper>
  )
}
