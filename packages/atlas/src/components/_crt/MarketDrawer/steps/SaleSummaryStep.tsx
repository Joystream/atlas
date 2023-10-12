import { FC, useEffect } from 'react'

import { SvgAlertsInformative24 } from '@/assets/icons'
import { ActionDialogButtonProps } from '@/components/ActionBar'
import { FlexBox } from '@/components/FlexBox'
import { NumberFormat } from '@/components/NumberFormat'
import { ColumnBox } from '@/components/ProgressWidget/ProgressWidget.styles'
import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import { HDivider } from '@/components/_crt/MarketDrawer/MarketDrawer.styles'
import { SummaryRow } from '@/components/_overlays/SendTransferDialogs/SendTransferDialogs.styles'

type SaleSummaryProps = {
  price: number
  tnc: string
  setPrimaryButtonProps: (props: ActionDialogButtonProps) => void
  setSecondaryButtonProps: (props: ActionDialogButtonProps) => void
  handleBackClick: () => void
}

export const SaleSummaryStep: FC<SaleSummaryProps> = ({
  price,
  setSecondaryButtonProps,
  setPrimaryButtonProps,
  handleBackClick,
}) => {
  // TODO: include fee
  // const {fullFee, loading: feeLoading} = useFee('startMarketTx')

  useEffect(() => {
    setPrimaryButtonProps({
      text: 'Start sale',
      onClick: () => {
        // token sale tx
      },
    })
    setSecondaryButtonProps({
      text: 'Back',
      onClick: () => {
        handleBackClick()
      },
    })
  }, [handleBackClick, setPrimaryButtonProps, setSecondaryButtonProps])

  return (
    <ColumnBox gap={2}>
      <Text variant="h500" as="h2" margin={{ bottom: 2 }}>
        Market summary
      </Text>
      <Text variant="h400" as="h2" margin={{ bottom: 2 }}>
        Sale settings
      </Text>
      <SummaryRow>
        <FlexBox alignItems="center">
          <Text as="span" variant="h300" color="colorText">
            Starting price
          </Text>
          <Tooltip text="Tooltip placeholder" placement="top" offsetY={4} delay={[1000, null]}>
            <SvgAlertsInformative24 width={16} height={16} />
          </Tooltip>
        </FlexBox>
        <NumberFormat variant="h300" value={price} withToken as="span" />
      </SummaryRow>
      <HDivider />
      <SummaryRow>
        <FlexBox alignItems="center">
          <Text as="span" variant="h300" color="colorText">
            Transaction Fee
          </Text>
          <Tooltip text="Tooltip placeholder" placement="top" offsetY={4} delay={[1000, null]}>
            <SvgAlertsInformative24 width={16} height={16} />
          </Tooltip>
        </FlexBox>
        <NumberFormat variant="h300" withDenomination="before" value={0} withToken as="span" />
      </SummaryRow>
    </ColumnBox>
  )
}
