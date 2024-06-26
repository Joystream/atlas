import BN from 'bn.js'
import { FC, PropsWithChildren } from 'react'

import { Tooltip } from '@/components/Tooltip'
import { TooltipText } from '@/components/Tooltip/Tooltip.styles'
import { atlasConfig } from '@/config'
import { ColorAnchor } from '@/views/global/YppLandingView/sections/YppRewardSection.styles'

type BalanceTooltipProps = PropsWithChildren<{
  accountBalance: BN | undefined
  lockedAccountBalance: BN | undefined
  containerRefElement: Element | null
}>

export const BalanceTooltip: FC<BalanceTooltipProps> = ({
  accountBalance,
  // lockedAccountBalance = new BN(0),
  containerRefElement,
  children,
}) => {
  if (accountBalance === undefined || accountBalance.gtn(0)) {
    return <>{children}</>
  }
  return (
    <Tooltip
      interactive
      multiline
      appendTo={containerRefElement || document.body}
      hideOnClick="toggle"
      placement="bottom"
      delay={[250, 0]}
      customContent={
        <TooltipText as="span" variant="t100">
          {atlasConfig.joystream.tokenTicker} token is a native crypto asset of Joystream blockchain which powers
          {atlasConfig.general.appName}. It is used for trading Creator Tokens, NFTs and covering blockchain processing
          fees. It is also used for voting on proposals and partaking in council elections.{' '}
          <ColorAnchor href="https://www.joystream.org/token/" target="_blank">
            Purchase {atlasConfig.joystream.tokenTicker}
          </ColorAnchor>
        </TooltipText>

        // <TooltipWrapper>
        //   <UpperRow>
        //     <TooltipRow>
        //       <Text as="span" variant="t100" color="colorText">
        //         Spendable
        //       </Text>
        //       <TextWithIcon>
        //         <JoyTokenIcon size={16} variant="gray" />
        //         <NumberFormat
        //           as="span"
        //           variant="t200-strong"
        //           value={lockedAccountBalance}
        //           format="full"
        //           color="colorText"
        //         />
        //       </TextWithIcon>
        //     </TooltipRow>
        //   </UpperRow>
        //   <TooltipFooter>
        //     <SvgActionInformative />
        //     <Text as="span" variant="t100" color="colorText">
        //       Your transferable balance is zero, meaning you cannot buy NFTs or transfer tokens. There is a spendable
        //       balance from faucet, which you can still spend on paying transaction fees for creating channels, posting
        //       videos, adding comments and reactions. This balance needs to be repaid before accumulating transferable
        //       balance.
        //     </Text>
        //   </TooltipFooter>
        // </TooltipWrapper>
      }
    >
      {children}
    </Tooltip>
  )
}
