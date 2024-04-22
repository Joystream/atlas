import styled from '@emotion/styled'
import { ReactNode } from 'react'

import { SvgAlertsInformative24 } from '@/assets/icons'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import { CrtFormWrapper } from '@/components/_crt/CrtFormWrapper'
import { useMountEffect } from '@/hooks/useMountEffect'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { useFee, useJoystream } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { sizes, square } from '@/styles'
import { SentryLogger } from '@/utils/logs'
import { pluralizeNoun } from '@/utils/misc'
import { formatNumber } from '@/utils/number'

import { getDataBasedOnType } from './TokenIssuanceStep/TokenIssuanceStep.utils'
import { CommonStepProps } from './types'

const monthDurationToBlocks = (numberOfMonths: number) => numberOfMonths * 30 * 24 * 60 * 6
export type TokenSummaryStepProps = {
  onSuccess: () => void
} & CommonStepProps
export const TokenSummaryStep = ({ setPrimaryButtonProps, form, onSuccess }: TokenSummaryStepProps) => {
  const { joystream, proxyCallback } = useJoystream()
  const { channelId, memberId } = useUser()
  const { displaySnackbar } = useSnackbar()
  const handleTransaction = useTransaction()
  const { trackTokenMintingCompleted } = useSegmentAnalytics()
  const [cliff, vesting, payout] = getDataBasedOnType(form.assuranceType) ?? [
    form.cliff,
    form.vesting,
    form.firstPayout,
  ]

  const { fullFee } = useFee('issueCreatorTokenTx', [
    memberId ?? '1',
    channelId ?? '1',
    form.name,
    form.creatorReward,
    form.revenueShare,
    {
      amount: String(form.creatorIssueAmount ?? 0),
      cliffAmountPercentage: 100 - (payout ?? 0),
      blocksBeforeCliff: cliff ? monthDurationToBlocks(+cliff) : 0,
      vestingDuration: vesting ? monthDurationToBlocks(+vesting) : 0,
    },
  ])
  const handleSubmitTx = async () => {
    if (!joystream || !channelId || !memberId) {
      SentryLogger.error('Failed to submit create token', 'TokenSummaryStep', { joystream, channelId, memberId })
      return
    }
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
            cliffAmountPercentage: 100 - (payout ?? 0),
            vestingDuration: vesting ? monthDurationToBlocks(+vesting) : 0,
            blocksBeforeCliff: cliff ? monthDurationToBlocks(+cliff) : 0,
          },
          proxyCallback(handleUpdate)
        ),
      onTxSync: async ({ tokenId }) => {
        trackTokenMintingCompleted(channelId, tokenId, form.name, form.creatorIssueAmount ?? 0, form.assuranceType)
        onSuccess()
      },
      snackbarSuccessMessage: {
        title: `$${form.name} minted successfully.`,
      },
      onError: () => {
        SentryLogger.error('Failed to create token', 'TokenSummaryStep', { joystream, channelId, memberId })
        displaySnackbar({
          iconType: 'error',
          title: 'Something went wrong',
        })
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
    <CrtFormWrapper title="Token Summary" subtitle="" learnMoreLink="">
      <Section>
        <Text variant="h400" as="h4">
          Review token settings
        </Text>
        <SectionRow
          title="Name"
          tooltipText="Short name of your token, how it will be displayed in portfolio and marketplace."
        >
          <Text variant="h300" as="p" color="colorTextStrong">
            ${form.name}
          </Text>
        </SectionRow>
        <SectionRow
          title="Ownership permission"
          tooltipText="Token can be accessed and purchased by any member, or strictly limited to members added to your token whitelist."
        >
          <Text variant="h300" as="p" color="colorTextStrong">
            {form.isOpen ? 'Open' : 'Invite only'}
          </Text>
        </SectionRow>
        <SectionRow
          title="Revenue share"
          tooltipText={
            'Revenue share allows token holders to claim part of channels earnings proportionate to their ownership of channel tokens supply. ' +
            'Channel owner creates time-bound revenue claiming periods, and token holders stake creator tokens they have for the duration of such period in exchange of receiving JOY tokens, thereby receive portion of channel earnings. ' +
            'Here you set up the maximum % of the channel reward account balance that can be claimed by your token holders, the rest gets immediately moved to channel controller account and can be withdrawn.'
          }
        >
          <RowBox gap={2}>
            <RowBox gap={1}>
              <Text variant="h300" as="span" color="colorText">
                Holders:
              </Text>
              <Text variant="h300" as="p" color="colorTextStrong">
                {form.revenueShare}%
              </Text>
            </RowBox>
            <RowBox gap={1}>
              <Text variant="h300" as="span" color="colorText">
                Channel:
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
        {!!cliff && (
          <>
            <SectionRow
              title="Fully locked period"
              tooltipText="This signals to your investors that they can be 100% sure the token price on the market during this period will be exclusively impacted by market conditions. This is a strong signal of integrity."
            >
              <Text variant="h300" as="p" color="colorTextStrong">
                {Number(cliff) > 0 ? pluralizeNoun(Number(cliff), 'month') : 'No locked period'}
              </Text>
            </SectionRow>
            {/*{cliffBanner}*/}
          </>
        )}
        {typeof vesting !== 'object' && (
          <SectionRow
            title="Vesting period"
            tooltipText="Longer vesting periods signal longer term intentions and prevent from making mistakes with tokens pricing and transfers."
          >
            <Text variant="h300" as="p" color="colorTextStrong">
              {Number(vesting) === 0 ? 'No vesting' : pluralizeNoun(Number(vesting), 'month')}
            </Text>
          </SectionRow>
        )}
        {!!(form.creatorIssueAmount && payout !== undefined) && (
          <SectionRow
            title="First payout"
            tooltipText="A portion of your tokens that will be available for trading after locked period expires."
          >
            <RowBox gap={2}>
              <Text variant="h300" as="p" color="colorText">
                ({formatNumber((form.creatorIssueAmount * payout) / 100)} ${form.name})
              </Text>
              <Text variant="h300" as="p" color="colorTextStrong">
                {payout}%
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

  svg {
    ${square(18)};
  }
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
