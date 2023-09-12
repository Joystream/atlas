import { ReactElement } from 'react'

import { SvgJoyTokenMonochrome16 } from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { FlexBox } from '@/components/FlexBox'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { InfoBox, Wrapper } from '@/components/_crt/RevenueShareWidget/RevenueShareWidget.styles'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { formatDateTime } from '@/utils/time'

export type RevenueShareWidgetProps = {
  tokenName: string
  userShare: number
  userTokens: number
  shareEndDate: Date
  onClaim: () => void
}
export const RevenueShareWidget = ({
  userShare,
  userTokens,
  tokenName,
  onClaim,
  shareEndDate,
}: RevenueShareWidgetProps) => {
  const smMatch = useMediaMatch('sm')
  return (
    <Wrapper gap={2} alignItems="center">
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
      <Button fullWidth onClick={onClaim}>
        Claim your share
      </Button>
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
