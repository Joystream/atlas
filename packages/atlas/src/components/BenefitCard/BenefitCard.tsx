import BN from 'bn.js'
import { FC, ReactNode } from 'react'

import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { JOY_CURRENCY_TICKER } from '@/config/joystream'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  ActionWrapper,
  Content,
  ListElement,
  Pattern,
  RewardWrapper,
  StyledButton,
  StyledJoyTokenIcon,
  StyledList,
  TitleWrapper,
  TokenRewardWrapper,
  Variant,
  Wrapper,
} from './BenefitCard.styles'

export type BenefitCardProps = {
  variant?: Variant
  title: string
  description?: string
  steps?: ReactNode[]
  actionButton?: {
    text: string
    onClick?: () => void
  }
  joyAmount: BN | number
  dollarAmount: number
}

export const BenefitCard: FC<BenefitCardProps> = ({
  variant = 'full',
  title,
  description,
  steps,
  actionButton,
  joyAmount,
  dollarAmount,
}) => {
  const smMatch = useMediaMatch('sm')
  const fullVariant = variant === 'full'

  const RewardAmount = () => (
    <RewardWrapper isCompact={!fullVariant}>
      {!!dollarAmount && (
        <NumberFormat
          as="p"
          format="dollar"
          variant={!smMatch ? 'h500' : 'h600'}
          value={dollarAmount}
          margin={{ right: dollarAmount && !fullVariant && !smMatch ? 2 : 0 }}
        />
      )}
      <TokenRewardWrapper>
        {(!smMatch && !fullVariant && dollarAmount) || (!fullVariant && dollarAmount) || fullVariant ? (
          <StyledJoyTokenIcon variant="silver" size={smMatch && !dollarAmount ? 24 : 16} />
        ) : (
          <Text as="span" variant={smMatch ? 'h600' : 'h500'} color="colorText" margin={{ right: 1 }}>
            +
          </Text>
        )}
        <NumberFormat
          as="span"
          format="short"
          color={!dollarAmount ? 'colorTextStrong' : 'colorText'}
          variant={!dollarAmount ? (!smMatch ? 'h500' : 'h600') : !smMatch ? 'h300' : 'h400'}
          value={joyAmount}
        />
        {!dollarAmount && !fullVariant && (
          <Text as="span" variant={smMatch ? 'h400' : 'h300'} color="colorText" margin={{ left: 1 }}>
            {JOY_CURRENCY_TICKER}
          </Text>
        )}
      </TokenRewardWrapper>
    </RewardWrapper>
  )

  return (
    <Wrapper variant={variant}>
      <Pattern />
      <Content isCompact={!fullVariant}>
        <div>
          <TitleWrapper>
            <div>
              <Text variant="h500" as="h2">
                {title}
              </Text>
              <Text variant="t200" color="colorText" as="p" margin={{ top: fullVariant || smMatch ? 4 : 2 }}>
                {description}
              </Text>
            </div>
            {!smMatch && fullVariant && <RewardAmount />}
          </TitleWrapper>
          {steps && fullVariant && (
            <StyledList>
              {steps?.map((step, idx) => (
                <ListElement key={idx} variant="t200" color="colorText" as="li">
                  <span>{step}</span>
                </ListElement>
              ))}
            </StyledList>
          )}
        </div>
        <ActionWrapper>
          {(smMatch || !fullVariant) && <RewardAmount />}
          {actionButton && fullVariant && (
            <StyledButton fullWidth={!smMatch} onClick={actionButton.onClick}>
              {actionButton.text}
            </StyledButton>
          )}
        </ActionWrapper>
      </Content>
    </Wrapper>
  )
}
