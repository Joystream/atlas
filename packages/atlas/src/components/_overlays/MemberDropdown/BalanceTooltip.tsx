import BN from 'bn.js'
import { FC, PropsWithChildren } from 'react'

import { SvgActionInformative } from '@/assets/icons'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'

import { TextWithIcon, TooltipFooter, TooltipRow, TooltipWrapper, UpperRow } from './BalanceTooltip.styles'

type BalanceTooltipProps = PropsWithChildren<{
  accountBalance: BN | undefined
  lockedAccountBalance: BN | undefined
  containerRefElement: Element | null
  isInDebt?: boolean
}>

export const BalanceTooltip: FC<BalanceTooltipProps> = ({
  accountBalance,
  lockedAccountBalance = new BN(0),
  containerRefElement,
  isInDebt,
  children,
}) => {
  if (accountBalance === undefined || !isInDebt) {
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
        <TooltipWrapper>
          <UpperRow>
            <TooltipRow>
              <Text as="span" variant="t100" color="colorText">
                Spendable
              </Text>
              <TextWithIcon>
                <JoyTokenIcon size={16} variant="gray" />
                <NumberFormat
                  as="span"
                  variant="t200-strong"
                  value={lockedAccountBalance}
                  format="full"
                  color="colorText"
                />
              </TextWithIcon>
            </TooltipRow>
          </UpperRow>
          <TooltipFooter>
            <SvgActionInformative />
            <Text as="span" variant="t100" color="colorText">
              You don't have any tokens to spend on NFTs or transfer, but there is a balance you can spend on paying of
              transaction fees for creating channels, posting videos, adding comments and reactions. This balance needs
              to be repaid before accumulating transferable balance.
            </Text>
          </TooltipFooter>
        </TooltipWrapper>
      }
    >
      {children}
    </Tooltip>
  )
}
