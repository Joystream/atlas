import BN from 'bn.js'
import { FC, PropsWithChildren } from 'react'

import { SvgActionInformative } from '@/assets/icons'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'

import {
  StyledSvgActionLock,
  TextWithIcon,
  TooltipDivider,
  TooltipFooter,
  TooltipRow,
  TooltipWrapper,
  UpperRow,
} from './BalanceTooltip.styles'

type BalanceTooltipProps = PropsWithChildren<{
  accountBalance: BN | undefined
  lockedAccountBalance: BN | undefined
  containerRefElement: Element | null
}>

export const BalanceTooltip: FC<BalanceTooltipProps> = ({
  accountBalance,
  lockedAccountBalance = new BN(0),
  containerRefElement,
  children,
}) => {
  if (accountBalance === undefined) {
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
                Transferable
              </Text>
              <TextWithIcon>
                <JoyTokenIcon size={16} variant="gray" />
                <NumberFormat as="span" variant="t200-strong" value={accountBalance} format="full" color="colorText" />
              </TextWithIcon>
            </TooltipRow>
            <TooltipRow>
              <TextWithIcon>
                <StyledSvgActionLock />
                <Text as="span" variant="t100" color="colorText">
                  Invitation lock
                </Text>
              </TextWithIcon>
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
          <TooltipDivider />
          <TooltipRow>
            <Text as="span" variant="t100">
              Total
            </Text>
            <TextWithIcon>
              <JoyTokenIcon size={16} variant="regular" />
              <NumberFormat
                as="span"
                variant="t200-strong"
                value={lockedAccountBalance?.add(accountBalance)}
                format="full"
              />
            </TextWithIcon>
          </TooltipRow>
          <TooltipFooter>
            <SvgActionInformative />
            <Text as="span" variant="t100" color="colorText">
              Locked tokens can only be spent on transaction fees and cannot be transfered.
            </Text>
          </TooltipFooter>
        </TooltipWrapper>
      }
    >
      {children}
    </Tooltip>
  )
}
