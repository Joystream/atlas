import BN from 'bn.js'
import { FC } from 'react'
import { useNavigate } from 'react-router'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { BasicMembershipFieldsFragment } from '@/api/queries'
import { Avatar } from '@/components/Avatar'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { SvgActionChevronB } from '@/components/_icons'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { absoluteRoutes } from '@/config/routes'
import { useToggle } from '@/hooks/useToggle'
import { useMemberAvatar } from '@/providers/assets'
import { useTokenPrice } from '@/providers/joystream'
import { cVar, transitions } from '@/styles'
import { formatDateTime } from '@/utils/time'

import {
  CopyContainer,
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
export const NftHistory: FC<NftHistoryProps> = ({ size, width, historyItems }) => {
  const [isOpen, toggleIsOpen] = useToggle()

  return (
    <>
      <NftHistoryHeader data-open={isOpen} data-size={size} onClick={toggleIsOpen}>
        <Text as="h3" variant={size === 'small' ? 'h300' : 'h400'}>
          History
        </Text>
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
  joyAmount?: BN
  text: string
}
type HistoryItemProps = {
  size: Size
} & NftHistoryEntry
export const HistoryItem: FC<HistoryItemProps> = ({ size, member, date, joyAmount, text }) => {
  const navigate = useNavigate()
  const { url, isLoadingAsset } = useMemberAvatar(member)
  const { convertHapiToUSD } = useTokenPrice()

  const dollarValue = joyAmount ? convertHapiToUSD(joyAmount) : null

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
          <Text as="span" variant={size === 'medium' ? 'h300' : 'h200'} color="colorText">
            {text}
            {' by '}
            <OwnerHandle to={absoluteRoutes.viewer.member(member?.handle)}>
              <Text as="span" variant={size === 'medium' ? 'h300' : 'h200'}>
                {member?.handle}
              </Text>
            </OwnerHandle>
          </Text>
        </CopyContainer>
        <Text as="span" variant="t100" color="colorText">
          {formatDateTime(date)}
        </Text>
      </TextContainer>
      {!!joyAmount && (
        <ValueContainer>
          <JoyPlusIcon>
            <JoyTokenIcon size={16} variant="silver" />
            <NumberFormat as="span" format="short" value={joyAmount} variant={size === 'medium' ? 'h300' : 'h200'} />
          </JoyPlusIcon>
          <SwitchTransition>
            <CSSTransition
              key={dollarValue ? 'placeholder' : 'content'}
              timeout={parseInt(cVar('animationTransitionFast', true))}
              classNames={transitions.names.fade}
            >
              {dollarValue ? (
                <NumberFormat
                  as="span"
                  format="dollar"
                  variant="t100"
                  color="colorText"
                  value={dollarValue}
                  align="end"
                />
              ) : (
                '‌'
              )}
            </CSSTransition>
          </SwitchTransition>
        </ValueContainer>
      )}
    </HistoryItemContainer>
  )
}
