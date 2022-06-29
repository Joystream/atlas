import { FC, forwardRef } from 'react'

import { ListItem, ListItemProps } from '@/components/ListItem'
import { Text } from '@/components/Text'
import { SvgActionChevronL, SvgActionChevronR } from '@/components/_icons'
import { Switch } from '@/components/_inputs/Switch'
import { DialogModal } from '@/components/_overlays/DialogModal'

import {
  Header,
  NodeEndWrapper,
  OptionsWrapper,
  SettingsContainer,
  SettingsWrapper,
  StyledListItem,
  StyledSvgActionCheck,
} from './Settings.styles'

export type SettingsProps = {
  settings: Setting[]
  maxHeight?: number
  openedSetting: string | null
  onSettingClick: (value: string | null) => void
  isFullScreen?: boolean
}

type MultiValueOption = {
  value: string | number
  options?: never
  onOptionClick?: (value: string | number) => void
} & ListItemProps

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

const LIST_ITEM_HEIGHT = 48

export const Settings = forwardRef<HTMLDivElement, SettingsProps>(
  ({ settings, openedSetting = null, onSettingClick, isFullScreen, maxHeight }, ref) => {
    const selectedOption = settings.find((setting) => setting.label === openedSetting)
    const optionsMaxHeight = (maxHeight || 0) - LIST_ITEM_HEIGHT

    return (
      <SettingsContainer isFullScreen={isFullScreen} ref={ref}>
        <SettingsWrapper>
          {openedSetting === null ? (
            <BaseMenu maxHeight={maxHeight} onSettingClick={onSettingClick} settings={settings} />
          ) : (
            <Options
              onSettingClick={onSettingClick}
              options={selectedOption?.options}
              openedSetting={openedSetting}
              maxHeight={optionsMaxHeight}
            />
          )}
        </SettingsWrapper>
      </SettingsContainer>
    )
  }
)
Settings.displayName = 'Settings'

type MobileSettingsProps = {
  settings: Setting[]
  openedSetting: string | null
  onSettingClick: (value: string | null) => void
  onClose: () => void
  show: boolean
}

export const MobileSettings: FC<MobileSettingsProps> = ({ onSettingClick, openedSetting, settings, show, onClose }) => {
  const selectedOption = settings.find((setting) => setting.label === openedSetting)

  return (
    <DialogModal
      show={show}
      dividers
      onClickOutside={(event) => {
        event?.stopPropagation()
        onClose?.()
      }}
      secondaryButton={{
        text: 'Close',
        onClick: (event) => {
          event.stopPropagation()
          onClose()
        },
      }}
    >
      <SettingsContainer isModal>
        {openedSetting === null ? (
          <BaseMenu onSettingClick={onSettingClick} settings={settings} />
        ) : (
          <Options onSettingClick={onSettingClick} options={selectedOption?.options} openedSetting={openedSetting} />
        )}
      </SettingsContainer>
    </DialogModal>
  )
}

type BaseMenuProps = {
  maxHeight?: number
  settings: Setting[]
  onSettingClick: (value: string | null) => void
}

const BaseMenu: FC<BaseMenuProps> = ({ maxHeight, settings, onSettingClick }) => {
  return (
    <OptionsWrapper maxHeight={maxHeight}>
      {settings?.map((setting, idx) =>
        setting.type === 'multi-value' ? (
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
        ) : (
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
                  <Switch value={setting.value} onChange={(e) => setting.onSwitchClick?.(!!e?.currentTarget.checked)} />
                </NodeEndWrapper>
              }
            />
          </label>
        )
      )}
    </OptionsWrapper>
  )
}
type OptionsProps = {
  openedSetting: string
  maxHeight?: number
  options?: MultiValueOption[]
  onSettingClick: (value: string | null) => void
}

const Options: FC<OptionsProps> = ({ openedSetting, onSettingClick, maxHeight, options }) => {
  return (
    <div>
      <Header>
        <ListItem
          asButton
          nodeStart={<SvgActionChevronL />}
          label={openedSetting}
          size="large"
          onClick={(event) => {
            event.stopPropagation()
            onSettingClick(null)
          }}
        />
      </Header>
      <OptionsWrapper withBorder maxHeight={maxHeight}>
        {options?.map((setting, idx) => {
          return (
            <StyledListItem
              asButton
              key={idx}
              onClick={(event) => {
                event.stopPropagation()
                onSettingClick(null)
                setting.onOptionClick?.(setting.value)
              }}
              label={setting.label}
              size="large"
              nodeStart={<StyledSvgActionCheck checked={setting.selected} />}
            />
          )
        })}
      </OptionsWrapper>
    </div>
  )
}
