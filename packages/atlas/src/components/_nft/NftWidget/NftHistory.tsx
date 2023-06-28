import BN from 'bn.js'
import { FC } from 'react'
import { useNavigate } from 'react-router'

import { BasicMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { Avatar } from '@/components/Avatar'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { absoluteRoutes } from '@/config/routes'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { useTokenPrice } from '@/providers/joystream/joystream.hooks'
import { formatDateTime } from '@/utils/time'

import {
  CopyContainer,
  HistoryItemContainer,
  HistoryPanel,
  HistoryPanelContainer,
  JoyPlusIcon,
  NftHistoryHeader,
  TextContainer,
  ValueContainer,
} from './NftHistory.styles'
import { OwnerHandle, Size } from './NftWidget.styles'

type NftHistoryProps = { size: Size; width: number; historyItems: NftHistoryEntry[] }
export const NftHistory: FC<NftHistoryProps> = ({ size, historyItems }) => {
  return (
    <>
      <NftHistoryHeader data-size={size}>
        <Text as="h3" variant={size === 'small' ? 'h300' : 'h400'}>
          History
        </Text>
      </NftHistoryHeader>
      <HistoryPanelContainer>
        <HistoryPanel data-size={size}>
          {historyItems.map((props, index) => (
            <HistoryItem key={index} {...props} size={size} />
          ))}
        </HistoryPanel>
      </HistoryPanelContainer>
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
  const { url, isLoadingAsset } = getMemberAvatar(member)
  const { convertHapiToUSD } = useTokenPrice()

  const dollarValue = joyAmount ? convertHapiToUSD(joyAmount) : null

  return (
    <HistoryItemContainer data-size={size}>
      <Avatar
        onClick={() => navigate(absoluteRoutes.viewer.member(member?.handle))}
        assetUrl={url}
        loading={isLoadingAsset}
        size={size === 'medium' ? 40 : 32}
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
          {dollarValue !== null && (
            <NumberFormat
              as="span"
              format="dollar"
              variant="t100"
              color="colorText"
              value={dollarValue || 0}
              align="end"
            />
          )}
        </ValueContainer>
      )}
    </HistoryItemContainer>
  )
}
