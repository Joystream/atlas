import { ReactElement, useCallback } from 'react'

import { SvgActionCalendar, SvgJoyTokenMonochrome16 } from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { FlexBox } from '@/components/FlexBox'
import { Information } from '@/components/Information'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { InfoBox, Wrapper } from '@/components/_crt/RevenueShareWidget/RevenueShareWidget.styles'
import { useJoystream } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { formatDateTime } from '@/utils/time'

export type RevenueShareWidgetProps = {
  tokenId: string
  tokenName: string
  userShare: number
  userTokens: number
  shareEndDate: Date
  onClaimShare?: () => void
  status: 'active' | 'upcoming' | 'locked' | 'unlocked'
}
export const RevenueShareWidget = ({
  userShare,
  userTokens,
  tokenName,
  onClaimShare,
  shareEndDate,
  status,
  tokenId,
}: RevenueShareWidgetProps) => {
  const { joystream } = useJoystream()
  const handleTransaction = useTransaction()
  const { memberId } = useUser()
  const { displaySnackbar } = useSnackbar()
  const unlockStake = useCallback(async () => {
    if (!joystream || !memberId) {
      return
    }
    handleTransaction({
      txFactory: async (updateStatus) => (await joystream.extrinsics).exitRevenueSplit(tokenId, memberId, updateStatus),
      onTxSync: async (data) => {
        displaySnackbar({
          title: `${data.amount} $${tokenName} unlocked`,
          iconType: 'success',
        })
      },
      onError: () => {
        displaySnackbar({
          title: `Something went wrong`,
          iconType: 'error',
        })
      },
    })
  }, [joystream, memberId, tokenName, tokenId])

  const actionNode = () => {
    switch (status) {
      case 'active':
        return (
          <Button fullWidth onClick={onClaimShare}>
            Claim your share
          </Button>
        )
      case 'unlocked':
        return (
          <Button fullWidth onClick={unlockStake}>
            Unlock tokens
          </Button>
        )
      case 'upcoming':
        return (
          <FlexBox alignItems="center">
            <SvgActionCalendar />
            <Text variant="t200-strong" as="p">
              Upcoming
            </Text>
            <Information text="lorem ipsum" />
          </FlexBox>
        )
      case 'locked':
        return (
          <FlexBox alignItems="center">
            <SvgActionCalendar />
            <Text variant="t200-strong" as="p">
              Locked
            </Text>
            <Information text="lorem ipsum" />
          </FlexBox>
        )
    }
  }
  return (
    <Wrapper isActive={['active', 'unlocked'].includes(status)} gap={2} alignItems="center">
      <InfoBox>
        <Detail title="TOKEN NAME">
          <FlexBox>
            <Avatar size={24} />
            <Text variant="h300" as="h3">
              ${tokenName}
            </Text>
          </FlexBox>
        </Detail>

        <Detail title="YOUR SHARE">
          <NumberFormat
            value={userShare}
            as="p"
            variant="t300"
            withDenomination="after"
            icon={<SvgJoyTokenMonochrome16 />}
          />
        </Detail>

        <Detail title="YOUR TOKENS">
          <NumberFormat value={userTokens} as="p" variant="t300" withToken customTicker={`$${tokenName}`} />
        </Detail>

        <Detail title="SHARE ENDS ON">
          <Text variant="t300" as="p">
            {formatDateTime(shareEndDate).replace(',', ' at')}
          </Text>
        </Detail>
      </InfoBox>
      {actionNode()}
    </Wrapper>
  )
}

export const Detail = ({ title, children }: { title: string; children: ReactElement }) => {
  return (
    <FlexBox flow="column">
      <Text variant="h100" as="h1" color="colorText">
        {title}
      </Text>
      {children}
    </FlexBox>
  )
}
