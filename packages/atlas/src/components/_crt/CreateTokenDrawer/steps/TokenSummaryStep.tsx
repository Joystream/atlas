import styled from '@emotion/styled'
import { ReactNode } from 'react'

import { SvgAlertsInformative24 } from '@/assets/icons'
import { Banner } from '@/components/Banner'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import { CrtFormWrapper } from '@/components/_crt/CrtFormWrapper'
import { useMountEffect } from '@/hooks/useMountEffect'
import { useFee, useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { sizes } from '@/styles'
import { formatNumber } from '@/utils/number'

import { cliffOptions, getDataBasedOnType, vestingOptions } from './TokenIssuanceStep/TokenIssuanceStep.utils'
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

const monthDurationToBlocks = (numberOfMonths: number) => numberOfMonths * 30 * 24 * 60 * 6
export type TokenSummaryStepProps = {
  onSuccess: () => void
} & CommonStepProps
export const TokenSummaryStep = ({ setPrimaryButtonProps, form, onSuccess }: TokenSummaryStepProps) => {
  const { joystream, proxyCallback } = useJoystream()
  const { channelId, memberId } = useUser()
  const handleTransaction = useTransaction()
  const { fullFee } = useFee('issueCreatorTokenTx')
  const handleSubmitTx = async () => {
    if (!joystream || !channelId || !memberId) return
    const [cliff, vesting, payout] = getDataBasedOnType(form.assuranceType) ?? [
      form.cliff,
      form.vesting,
      form.firstPayout,
    ]
    return handleTransaction({
      fee: fullFee,
      txFactory: async (handleUpdate) =>
        (await joystream.extrinsics).issueCreatorToken(
          memberId,
          channelId,
          form.name,
          form.creatorReward,
          form.revenueShare,
          {
            amount: String(form.creatorIssueAmount ?? 0),
            cliffAmountPercentage: payout ?? 0,
            vestingDuration: vesting ? monthDurationToBlocks(+vesting) : 0,
            blocksBeforeCliff: cliff ? monthDurationToBlocks(+cliff) : 0,
          },
          proxyCallback(handleUpdate)
        ),
      onTxSync: async () => {
        onSuccess()
      },
      snackbarSuccessMessage: {
        title: `$${form.name} minted successfuly.`,
      },
    })
  }

  useMountEffect(() => {
    setPrimaryButtonProps({
      text: 'Create token',
      onClick: handleSubmitTx,
    })
  })

  return (
    <CrtFormWrapper title="Set up your token" subtitle="" learnMoreLink="">
      <Section>
        <Text variant="h400" as="h4">
          Token settings
        </Text>
        <SectionRow
          title="Name"
          tooltipText="3 letter name for your token, to be displayed on your token page, all tokens marketplace and in your buyer's portfolio."
        >
          <Text variant="h300" as="p" color="colorTextStrong">
            ${form.name}
          </Text>
        </SectionRow>
        <SectionRow title="Access" tooltipText="Define if everyone can buy your token or only selected memebers.">
          <Text variant="h300" as="p" color="colorTextStrong">
            {form.isOpen ? 'Anyone' : 'Invite only'}
          </Text>
        </SectionRow>
        <SectionRow
          title="Revenue share with holders"
          tooltipText="Define % of your channel revenue that you will keep and how much your token holders will earn. "
        >
          <RowBox gap={2}>
            <RowBox gap={1}>
              <Text variant="h300" as="span" color="colorText">
                Channel:
              </Text>
              <Text variant="h300" as="p" color="colorTextStrong">
                {form.revenueShare}%
              </Text>
            </RowBox>
            <RowBox gap={1}>
              <Text variant="h300" as="span" color="colorText">
                Holders:
              </Text>
              <Text variant="h300" as="p" color="colorTextStrong">
                {100 - form.revenueShare}%
              </Text>
            </RowBox>
          </RowBox>
        </SectionRow>
        <SectionRow
          title="Annual creator reward"
          tooltipText="Additional tokens you will be earning every year for managing your creator tokens defined as % from total token supply. If you and all your holders have 10,000 tokens, your annual reward will be 1000 tokens."
        >
          <Text variant="h300" as="p" color="colorTextStrong">
            {form.creatorReward}%
          </Text>
        </SectionRow>
        {form.creatorIssueAmount && (
          <SectionRow
            title="Tokens issued to your wallet"
            tooltipText="Decide how many tokens do you want to create for yourself. This amount cannot be changed. You will be able to sell these tokens to your audience directly or enable a public sale, where others can mint more of your channel tokens in exchange for JOYs."
          >
            <Text variant="h300" as="p" color="colorTextStrong">
              {formatNumber(form.creatorIssueAmount)} ${form.name}
            </Text>
          </SectionRow>
        )}
        {form.cliff && (
          <>
            <SectionRow
              title="Cliff"
              tooltipText="Cliff is a period of time that locks your channel tokens from being sold or transferred."
            >
              <Text variant="h300" as="p" color="colorTextStrong">
                {cliffOptions.find((opt) => opt.value === form.cliff)?.name}
              </Text>
            </SectionRow>
            {cliffBanner}
          </>
        )}
        {form.vesting && (
          <SectionRow
            title="Vesting period"
            tooltipText="All tokens minted that are not part of the first payout get unlocked gradually over the course of the vesting period. Vesting period starts after the cliff has passed."
          >
            <Text variant="h300" as="p" color="colorTextStrong">
              {vestingOptions.find((opt) => opt.value === form.vesting)?.name}
            </Text>
          </SectionRow>
        )}
        {!!(form.creatorIssueAmount && form.firstPayout) && (
          <SectionRow
            title="First payout"
            tooltipText="A portion of your own tokens that will be released to you right after cliff period."
          >
            <RowBox gap={2}>
              <Text variant="h300" as="p" color="colorText">
                ({formatNumber((form.creatorIssueAmount * form.firstPayout) / 100)} ${form.name})
              </Text>
              <Text variant="h300" as="p" color="colorTextStrong">
                {form.firstPayout}%
              </Text>
            </RowBox>
          </SectionRow>
        )}
      </Section>

      <Section>
        <Text variant="h400" as="h4">
          Transaction
        </Text>
        <SectionRow
          title="Transaction fee"
          tooltipText="This action requires a blockchain transaction, which comes with a fee."
        >
          <NumberFormat value={fullFee} format="short" variant="h300" as="p" withToken withDenomination="before" />
        </SectionRow>
      </Section>
    </CrtFormWrapper>
  )
}

const SectionRow = ({ tooltipText, children, title }: { title: string; tooltipText: string; children: ReactNode }) => {
  return (
    <SectionRowContainer>
      <RowBox gap={2}>
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

const RowBox = styled.div<{ gap: number }>`
  display: flex;
  gap: ${(props) => sizes(props.gap)};
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
