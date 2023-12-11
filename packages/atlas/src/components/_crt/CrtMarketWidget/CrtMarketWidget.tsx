import styled from '@emotion/styled'
import { ReactElement, useMemo } from 'react'

import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgActionChevronR } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import { TextButton } from '@/components/_buttons/Button'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useUser } from '@/providers/user/user.hooks'
import { sizes } from '@/styles'
import { calcBuyMarketPricePerToken } from '@/utils/crts'

import { CloseMarketButton } from '../CloseMarketButton'

type CrtMarketWidgetProps = {
  onTabSwitch?: () => void
  token: FullCreatorTokenFragment
}

export const CrtMarketWidget = ({ onTabSwitch, token }: CrtMarketWidgetProps) => {
  const smMatch = useMediaMatch('sm')
  const { channelId } = useUser()
  const tokenSymbol = token.symbol ?? 'N/A'
  const activeAmm = token.ammCurves.find((amm) => !amm.finalized)
  const pricePerUnit = useMemo(
    () => calcBuyMarketPricePerToken(activeAmm?.mintedByAmm, activeAmm?.ammSlopeParameter, activeAmm?.ammInitPrice),
    [activeAmm?.ammInitPrice, activeAmm?.ammSlopeParameter, activeAmm?.mintedByAmm]
  )
  return (
    <WidgetTile
      title="Market"
      titleVariant="h500"
      titleColor="colorTextStrong"
      customTopRightNode={
        <TextButton iconPlacement="right" onClick={onTabSwitch} icon={<SvgActionChevronR />}>
          Show sales
        </TextButton>
      }
      customNode={
        <FlexBox gap={4} equalChildren flow={smMatch ? 'row' : 'column'}>
          <Detail title="Price per unit">
            <NumberFormat variant="h400" value={pricePerUnit ?? 0} as="p" withToken />
          </Detail>
          <Detail title="Bought on market">
            <NumberFormat
              variant="h400"
              value={+(activeAmm?.mintedByAmm ?? 0)}
              as="p"
              withToken
              customTicker={`$${tokenSymbol}`}
            />
          </Detail>
          <Detail title="Sold to market">
            <NumberFormat
              variant="h400"
              value={+(activeAmm?.burnedByAmm ?? 0)}
              as="p"
              withToken
              customTicker={`$${tokenSymbol}`}
            />
          </Detail>
          <ButtonWrapper>
            <CloseMarketButton fullWidth={!smMatch} channelId={channelId ?? '-1'} />
          </ButtonWrapper>
        </FlexBox>
      }
    />
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

const ButtonWrapper = styled.span`
  width: 100%;
  display: flex;
  justify-content: end;
  margin-top: ${sizes(2)};
`
