import { FC } from 'react'

import { Information } from '@/components/Information'
import { Text } from '@/components/Text'
import { JOY_CURRENCY_TICKER } from '@/config/joystream'

import { FeeWrapper } from './SendTransferDialogs.styles'

export const Fee: FC = () => {
  return (
    <FeeWrapper>
      <Text as="span" variant="h200">
        Fee: 0.00 {JOY_CURRENCY_TICKER}
      </Text>
      <Information
        text="This action requires a blockchain transaction, which comes with a fee."
        headerText="Blockchain transaction"
        multiline
        icon
        placement="top-start"
      />
    </FeeWrapper>
  )
}
