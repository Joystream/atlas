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
import { formatDateTime } from '@/utils/time'

import {
  CopyContainer,
  HistoryItemContainer,
  HistoryPanel,
  HistoryPanelContainer,
  NftHistoryHeader,
  TextContainer,
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
  const { urls, isLoadingAsset } = getMemberAvatar(member)

  return (
    <HistoryItemContainer data-size={size}>
      <Avatar
        onClick={() => navigate(absoluteRoutes.viewer.member(member?.handle))}
        assetUrls={urls}
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
        <NumberFormat
          as="span"
          icon={<JoyTokenIcon size={16} variant="silver" />}
          format="short"
          value={joyAmount}
          variant={size === 'medium' ? 'h300' : 'h200'}
          withDenomination
          denominationAlign="right"
        />
      )}
    </HistoryItemContainer>
  )
}
