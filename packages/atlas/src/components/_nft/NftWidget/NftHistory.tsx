import { format } from 'date-fns'
import React from 'react'
import { useNavigate } from 'react-router'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { SvgActionChevronB } from '@/components/_icons'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { absoluteRoutes } from '@/config/routes'
import { useToggle } from '@/hooks/useToggle'
import { useTokenPrice } from '@/providers/joystream'
import { cVar, transitions } from '@/styles'
import { formatNumberShort } from '@/utils/number'

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
import { Size } from './NftWidget'
import { OwnerHandle } from './NftWidget.styles'

type HitoryProps = { size: Size; width: number }
export const NftHistory: React.FC<HitoryProps> = ({ size, width }) => {
  const [isOpen, toggleIsOpen] = useToggle()
  const { convertToUSD } = useTokenPrice()

  const dummyData: HistoryItemProps[] = [
    {
      date: new Date(),
      memberAvatarUri: 'https://picsum.photos/40/40',
      size,
      joyAmount: 12334,
      dollarValue: convertToUSD(12334),
      copy: 'Bid made by',
      memberHandle: 'Madness',
    },
    {
      date: new Date(),
      memberAvatarUri: 'https://picsum.photos/40/40',
      size,
      joyAmount: 12334,
      dollarValue: convertToUSD(12334),
      copy: 'Listed by',
      memberHandle: 'Madness',
    },
    {
      date: new Date(),
      memberAvatarUri: 'https://picsum.photos/40/40',
      size,
      copy: 'Auction settled by',
      memberHandle: 'Madness',
    },
    {
      date: new Date(),
      memberAvatarUri: 'https://picsum.photos/40/40',
      size,
      joyAmount: 12334,
      dollarValue: convertToUSD(12334),
      copy: 'Auction won by',
      memberHandle: 'Madness',
    },
    {
      date: new Date(),
      memberAvatarUri: 'https://picsum.photos/40/40',
      size,
      joyAmount: 12334,
      dollarValue: convertToUSD(12334),
      copy: 'Bid made by',
      memberHandle: 'Madness',
    },
    {
      date: new Date(),
      memberAvatarUri: 'https://picsum.photos/40/40',
      size,
      joyAmount: 12334,
      dollarValue: convertToUSD(12334),
      copy: 'Listed by',
      memberHandle: 'Madness',
    },
    {
      date: new Date(),
      memberAvatarUri: 'https://picsum.photos/40/40',
      size,
      copy: 'Auction settled by',
      memberHandle: 'Madness',
    },
    {
      date: new Date(),
      memberAvatarUri: 'https://picsum.photos/40/40',
      size,
      joyAmount: 12334,
      dollarValue: convertToUSD(12334),
      copy: 'Auction won by',
      memberHandle: 'Madness',
    },
  ]

  return (
    <>
      <NftHistoryHeader data-open={isOpen} data-size={size} onClick={toggleIsOpen}>
        <Text variant={size === 'small' ? 'h300' : 'h400'}>History</Text>
        <StyledChevronButton data-open={isOpen} iconOnly variant="tertiary" icon={<SvgActionChevronB />} />
      </NftHistoryHeader>
      {isOpen && (
        <HistoryPanelContainer>
          <FadingBlock data-size={size} width={width} />
          <HistoryPanel data-size={size} data-open={isOpen}>
            {/* TODO: remove dummy data */}
            {dummyData.map((props, index) => (
              <HistoryItem key={index} {...props} />
            ))}
          </HistoryPanel>
          <FadingBlock data-size={size} width={width} data-bottom />
        </HistoryPanelContainer>
      )}
    </>
  )
}

type HistoryItemProps = {
  size: Size
  memberAvatarUri: string
  date: Date
  joyAmount?: number
  dollarValue?: string | null
  copy: string
  memberHandle: string
}
export const HistoryItem: React.FC<HistoryItemProps> = ({
  size,
  memberAvatarUri,
  date,
  joyAmount,
  dollarValue,
  copy,
  memberHandle,
}) => {
  const navigate = useNavigate()
  return (
    <HistoryItemContainer data-size={size}>
      <Avatar
        onClick={() => navigate(absoluteRoutes.viewer.member(memberHandle))}
        assetUrl={memberAvatarUri}
        size={size === 'medium' ? 'small' : 'default'}
      />
      <TextContainer>
        <CopyContainer>
          <Text variant={size === 'medium' ? 'h300' : 'h200'} secondary>
            {copy}{' '}
            <OwnerHandle to={absoluteRoutes.viewer.member(memberHandle)} variant="secondary" textOnly>
              <Text variant={size === 'medium' ? 'h300' : 'h200'}>{memberHandle}</Text>
            </OwnerHandle>
          </Text>
        </CopyContainer>
        <Text variant="t100" secondary>
          {format(date, "MMM d yyyy 'at' HH:mm")}
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
