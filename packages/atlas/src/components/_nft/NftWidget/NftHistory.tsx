import React from 'react'
import { useNavigate } from 'react-router'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { BasicMembershipFieldsFragment } from '@/api/queries'
import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { SvgActionChevronB } from '@/components/_icons'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { absoluteRoutes } from '@/config/routes'
import { useToggle } from '@/hooks/useToggle'
import { useMemberAvatar } from '@/providers/assets'
import { useTokenPrice } from '@/providers/joystream'
import { cVar, transitions } from '@/styles'
import { formatNumberShort } from '@/utils/number'
import { formatDateTime } from '@/utils/time'

import {
  CopyContainer,
  DollarValue,
  FadingBlock,
  HistoryItemContainer,
  HistoryPanel,
  HistoryPanelContainer,
  JoyPlusIcon,
  NftHistoryHeader,
  StyledChevronButton,
  TextContainer,
  ValueContainer,
} from './NftHistory.styles'
import { OwnerHandle, Size } from './NftWidget.styles'

type NftHistoryProps = { size: Size; width: number; historyItems: NftHistoryEntry[] }
export const NftHistory: React.FC<NftHistoryProps> = ({ size, width, historyItems }) => {
  const [isOpen, toggleIsOpen] = useToggle()

  return (
    <>
      <NftHistoryHeader data-open={isOpen} data-size={size} onClick={toggleIsOpen}>
        <Text variant={size === 'small' ? 'h300' : 'h400'}>History</Text>
        <StyledChevronButton data-open={isOpen} variant="tertiary" icon={<SvgActionChevronB />} />
      </NftHistoryHeader>
      {isOpen && (
        <HistoryPanelContainer>
          <FadingBlock data-size={size} width={width} />
          <HistoryPanel data-size={size} data-open={isOpen}>
            {historyItems.map((props, index) => (
              <HistoryItem key={index} {...props} size={size} />
            ))}
          </HistoryPanel>
          <FadingBlock data-size={size} width={width} data-bottom />
        </HistoryPanelContainer>
      )}
    </>
  )
}

export type NftHistoryEntry = {
  member: BasicMembershipFieldsFragment | undefined | null
  date: Date
  joyAmount?: number
  text: string
}
type HistoryItemProps = {
  size: Size
} & NftHistoryEntry
export const HistoryItem: React.FC<HistoryItemProps> = ({ size, member, date, joyAmount, text }) => {
  const navigate = useNavigate()
  const { url, isLoadingAsset } = useMemberAvatar(member)
  const { convertToUSD } = useTokenPrice()

  const dollarValue = joyAmount ? convertToUSD(joyAmount) : null

  return (
    <HistoryItemContainer data-size={size}>
      <Avatar
        onClick={() => navigate(absoluteRoutes.viewer.member(member?.handle))}
        assetUrl={url}
        loading={isLoadingAsset}
        size={size === 'medium' ? 'small' : 'default'}
      />
      <TextContainer>
        <CopyContainer>
          <Text variant={size === 'medium' ? 'h300' : 'h200'} secondary>
            {text}
            {' by '}
            <OwnerHandle to={absoluteRoutes.viewer.member(member?.handle)}>
              <Text as="span" variant={size === 'medium' ? 'h300' : 'h200'}>
                {member?.handle}
              </Text>
            </OwnerHandle>
          </Text>
        </CopyContainer>
        <Text variant="t100" secondary>
          {formatDateTime(date)}
        </Text>
      </TextContainer>
      {!!joyAmount && (
        <ValueContainer>
          <JoyPlusIcon>
            <JoyTokenIcon size={16} variant="silver" />
            <Text variant={size === 'medium' ? 'h300' : 'h200'}>{formatNumberShort(joyAmount)}</Text>
          </JoyPlusIcon>
          <SwitchTransition>
            <CSSTransition
              key={dollarValue ? 'placeholder' : 'content'}
              timeout={parseInt(cVar('animationTransitionFast', true))}
              classNames={transitions.names.fade}
            >
              <DollarValue variant="t100" secondary>
                {dollarValue ?? '‌'}
              </DollarValue>
            </CSSTransition>
          </SwitchTransition>
        </ValueContainer>
      )}
    </HistoryItemContainer>
  )
}
