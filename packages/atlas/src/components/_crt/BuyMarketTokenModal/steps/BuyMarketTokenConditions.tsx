import styled from '@emotion/styled'
import { useEffect, useState } from 'react'

import { FlexBox } from '@/components/FlexBox/FlexBox'
import { Text } from '@/components/Text'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { atlasConfig } from '@/config'
import { cVar, media, sizes } from '@/styles'

import { CommonProps } from './types'

const DETAILS = [
  {
    title: '',
    content: `These Terms and Conditions ("Terms") govern your use of the Creator Token feature on ${atlasConfig.general.appName} platform ("Platform"). By accessing or using this feature, you agree to these Terms. If you do not agree to these Terms, you may not purchase or sell any creator tokens.`,
  },
  {
    title: 'Liability Limitation',
    content: `- ${atlasConfig.general.appName} shall not be liable for any claims, including loss of value, arising from the minting, sale, or ownership of tokens on the platform.
- ${atlasConfig.general.appName} shall not be liable for any disputes between creators, token holders, and the platform regarding token ownership, revenue sharing, or any other related matters.
- Specific risks and scenarios that ${atlasConfig.general.appName} seeks to limit liability for include Joystream native token JOY value fluctuations, platform downtime, disputes over token sales, and scenarios where creators or holders get diluted above their expectations.`,
  },
  {
    title: 'Dispute Resolution',
    content: `Any disputes between creators, token holders, and ${atlasConfig.general.appName} shall be resolved through arbitration, in accordance with the rules and procedures set forth by the Joystream DAO.`,
  },
  {
    title: 'General Provisions',
    content: `- Users of ${atlasConfig.general.appName} acknowledge that the platform and services are provided "as is" and "as available" without warranties of any kind.
- The platform is not liable or obliged to make payments and, in case of errors, will seek to provide support in reconciliation of payments but is not obliged for channel rewards.
- In case of disputes over content quality and qualification for rewards, the platform has no liability to compensate the channels, and payouts are made at the total discretion of the ${atlasConfig.general.appName} App operator and the JS Genesis AS team.
    `,
  },
]

type BuySaleTokenTermsProps = {
  onSubmit: () => void
} & CommonProps

export const CONDITIONS_ACTION_ID = 'buy-amm-conditions'

export const BuyMarketTokenConditions = ({ setPrimaryButtonProps, onSubmit }: BuySaleTokenTermsProps) => {
  const [isChecked, setIsChecked] = useState(false)
  const [checkboxError, setCheckboxError] = useState('')

  useEffect(() => {
    setPrimaryButtonProps({
      text: 'Continue',
      onClick: () => {
        if (isChecked) {
          onSubmit()
        } else {
          setCheckboxError('Terms & Conditions have to be accepted to continue')
        }
      },
    })
  }, [isChecked, onSubmit, setPrimaryButtonProps])

  return (
    <Container>
      <FlexBox flow="column" gap={6} style={{ position: 'relative' }}>
        <FlexBox flow="column" gap={2}>
          {DETAILS.map((row) => (
            <FlexBox key={row.title} flow="column">
              <Text variant="t200-strong" as="p" color="colorText">
                {row.title}
              </Text>

              <Text variant="t100" as="p" color="colorTextMuted">
                {row.content}
              </Text>
            </FlexBox>
          ))}
        </FlexBox>
      </FlexBox>
      <CheckboxWrapper isAccepted={isChecked}>
        <Checkbox
          onChange={(val) => {
            setIsChecked(val)
            setCheckboxError('')
          }}
          caption={checkboxError}
          error={!!checkboxError}
          value={isChecked}
          label="I accept the Terms & Conditions"
        />
      </CheckboxWrapper>
    </Container>
  )
}

export const CheckboxWrapper = styled.div<{ isAccepted: boolean }>`
  position: fixed;
  bottom: 80px;
  left: 0;
  right: 1px;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: ${({ isAccepted }) => (isAccepted ? cVar('colorBackground') : cVar('colorBackgroundElevated'))};
  padding: ${sizes(4)} var(--local-size-dialog-padding);

  ${media.sm} {
    bottom: 87px;
  }
`

const Container = styled.div`
  display: flex;
  max-height: calc(100% - 55px);
  overflow-x: hidden;
  overflow-y: auto;
  padding: var(--local-size-dialog-padding);
  padding-bottom: 0;
  margin-bottom: 55px;
`
