import styled from '@emotion/styled'
import { ReactNode, useEffect } from 'react'

import { SvgAlertsInformative24 } from '@/assets/icons'
import { Banner } from '@/components/Banner'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import { CrtFormWrapper } from '@/components/_crt/CrtFormWrapper'
import { sizes } from '@/styles'

import { CommonStepProps } from './types'

const cliffBanner = (
  <Banner
    icon={<SvgAlertsInformative24 />}
    title="You will not be able to start a sale before the cliff ends"
    description="On sale you can sell your own preminted tokens for your own price and receive revenue right after the sale. By putting your tokens under the cliff you won’t be able to use sale until cliff ends. "
    actionButton={{
      text: 'Learn more',
      _textOnly: true,
      onClick: () => undefined,
    }}
  />
)

export const TokenSummaryStep = ({ setPrimaryButtonProps }: CommonStepProps) => {
  useEffect(() => {
    setPrimaryButtonProps({
      text: 'Create token',
    })
  }, [setPrimaryButtonProps])

  return (
    <CrtFormWrapper title="Set up your token" subtitle="" titleLink="">
      <Section>
        <Text variant="h400" as="h4">
          Token settings
        </Text>
        <SectionRow title="Name" tooltipText="XD">
          <Text variant="h300" as="p" color="colorTextStrong">
            $ABC
          </Text>
        </SectionRow>
        <SectionRow title="Access" tooltipText="XD">
          <Text variant="h300" as="p" color="colorTextStrong">
            Anyone
          </Text>
        </SectionRow>
        <SectionRow title="Revenue share with holders" tooltipText="XD">
          <Text variant="h300" as="p" color="colorTextStrong">
            Channel: 50% Holders: 50%
          </Text>
        </SectionRow>
        <SectionRow title="Annual creator reward" tooltipText="XD">
          <Text variant="h300" as="p" color="colorTextStrong">
            30%
          </Text>
        </SectionRow>
        <SectionRow title="Tokens issued to your wallet" tooltipText="XD">
          <Text variant="h300" as="p" color="colorTextStrong">
            5 000 $ABC
          </Text>
        </SectionRow>
        <SectionRow title="Cliff" tooltipText="XD">
          <Text variant="h300" as="p" color="colorTextStrong">
            6 months
          </Text>
        </SectionRow>
        {cliffBanner}
        <SectionRow title="Vesting period" tooltipText="XD">
          <Text variant="h300" as="p" color="colorTextStrong">
            1 year
          </Text>
        </SectionRow>
        <SectionRow title="First payout" tooltipText="XD">
          <Text variant="h300" as="p" color="colorTextStrong">
            50%
          </Text>
        </SectionRow>
      </Section>

      <Section>
        <Text variant="h400" as="h4">
          Transaction
        </Text>
        <SectionRow title="Transaction fee" tooltipText="XD">
          <NumberFormat value={9120332} as="p" withDenomination="before" />
        </SectionRow>
      </Section>
    </CrtFormWrapper>
  )
}

const SectionRow = ({ tooltipText, children, title }: { title: string; tooltipText: string; children: ReactNode }) => {
  return (
    <SectionRowContainer>
      <RowBox>
        <Text variant="t300" as="p" color="colorText">
          {title}
        </Text>
        <Tooltip text={tooltipText}>
          <SvgAlertsInformative24 />
        </Tooltip>
      </RowBox>
      {children}
    </SectionRowContainer>
  )
}

const RowBox = styled.div`
  display: flex;
  gap: ${sizes(2)};
  align-items: center;
`

const SectionRowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizes(5)};
`
