import BN from 'bn.js'
import { FC, ReactNode } from 'react'

import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { atlasConfig } from '@/config'
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

type JoyAmountRange = {
  type: 'range'
  max: BN | number
  min: BN | number
}
type JoyAmountNumber = {
  type: 'number'
  amount: BN | number
}

type DollarAmountRange = {
  type: 'range'
  max: number
  min: number
}
type DollarAmountNumber = {
  type: 'number'
  amount: number
}

export type BenefitCardProps = {
  variant?: Variant
  title: string
  description?: string
  steps?: ReactNode[]
  actionButton?: {
    text: string
    onClick?: () => void
    to?: string
  }
  joyAmount: JoyAmountNumber | JoyAmountRange | null
  dollarAmount?: DollarAmountNumber | DollarAmountRange | null
  className?: string
}

export const BenefitCard: FC<BenefitCardProps> = ({
  variant = 'full',
  title,
  description,
  steps,
  actionButton,
  joyAmount,
  dollarAmount,
  className,
}) => {
  const smMatch = useMediaMatch('sm')
  const isFullVariant = variant === 'full'

  const RewardAmount = () => {
    const isJoyTokenIconVisible =
      !(dollarAmount && !joyAmount) &&
      ((!smMatch && !isFullVariant && dollarAmount) || (!isFullVariant && dollarAmount) || isFullVariant)
    return (
      <RewardWrapper isCompact={!isFullVariant}>
        <TokenRewardWrapper>
          {!!dollarAmount && !isFullVariant && (
            <Text as="span" variant={smMatch ? 'h600' : 'h500'} color="colorText" margin={{ right: 1 }}>
              +
            </Text>
          )}
          {!!dollarAmount && dollarAmount.type === 'number' && (
            <NumberFormat
              as="p"
              format="dollar"
              variant={!smMatch ? 'h500' : 'h600'}
              value={dollarAmount.amount}
              margin={{ right: dollarAmount && !isFullVariant && !smMatch ? 2 : 0 }}
            />
          )}
          {!!dollarAmount && dollarAmount.type === 'range' && (
            <>
              <NumberFormat
                as="p"
                format="dollar"
                variant={!smMatch ? 'h500' : 'h600'}
                value={dollarAmount.min}
                margin={{ right: dollarAmount && !isFullVariant && !smMatch ? 2 : 0 }}
              />
              <Text as="span" variant={smMatch ? 'h600' : 'h500'} color="colorText" margin={{ right: 1 }}>
                -
              </Text>
              <NumberFormat
                as="p"
                format="dollar"
                variant={!smMatch ? 'h500' : 'h600'}
                value={dollarAmount.max}
                margin={{ right: dollarAmount && !isFullVariant && !smMatch ? 2 : 0 }}
              />
            </>
          )}
          {!!dollarAmount && !joyAmount && (
            <Text as="span" variant={smMatch ? 'h400' : 'h300'} color="colorText" margin={{ left: 1 }}>
              USD
            </Text>
          )}
        </TokenRewardWrapper>
        {joyAmount && (
          <>
            <TokenRewardWrapper>
              {isJoyTokenIconVisible ? (
                <StyledJoyTokenIcon variant="silver" size={smMatch && !dollarAmount ? 24 : 16} />
              ) : (
                <Text as="span" variant={smMatch ? 'h600' : 'h500'} color="colorText" margin={{ right: 1 }}>
                  +
                </Text>
              )}
              {joyAmount.type === 'number' && (
                <NumberFormat
                  as="span"
                  format="short"
                  color={!dollarAmount ? 'colorTextStrong' : 'colorText'}
                  variant={!dollarAmount ? (!smMatch ? 'h500' : 'h600') : !smMatch ? 'h300' : 'h400'}
                  value={joyAmount.amount}
                />
              )}
              {joyAmount.type === 'range' && (
                <>
                  <NumberFormat
                    as="span"
                    format="short"
                    color={!dollarAmount ? 'colorTextStrong' : 'colorText'}
                    variant={!dollarAmount ? (!smMatch ? 'h500' : 'h600') : !smMatch ? 'h300' : 'h400'}
                    value={joyAmount.min}
                  />
                  <Text as="span" variant={smMatch ? 'h600' : 'h500'} color="colorText" margin={{ right: 1 }}>
                    -
                  </Text>
                  <NumberFormat
                    as="span"
                    format="short"
                    color={!dollarAmount ? 'colorTextStrong' : 'colorText'}
                    variant={!dollarAmount ? (!smMatch ? 'h500' : 'h600') : !smMatch ? 'h300' : 'h400'}
                    value={joyAmount.max}
                  />
                </>
              )}
              {(!dollarAmount && !isFullVariant) ||
                (dollarAmount && !joyAmount && (
                  <Text as="span" variant={smMatch ? 'h400' : 'h300'} color="colorText" margin={{ left: 1 }}>
                    {dollarAmount ? 'USD' : atlasConfig.joystream.tokenTicker}
                  </Text>
                ))}
            </TokenRewardWrapper>
          </>
        )}
      </RewardWrapper>
    )
  }

  return (
    <Wrapper variant={variant} className={className}>
      <Pattern />
      <Content isCompact={!isFullVariant}>
        <div>
          <TitleWrapper>
            <div>
              <Text variant="h500" as="h2">
                {title}
              </Text>
              <Text variant="t200" color="colorText" as="p" margin={{ top: isFullVariant || smMatch ? 4 : 2 }}>
                {description}
              </Text>
            </div>
            {!smMatch && isFullVariant && <RewardAmount />}
          </TitleWrapper>
          {steps && isFullVariant && (
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
          {(smMatch || !isFullVariant) && <RewardAmount />}
          {actionButton && isFullVariant && (
            <StyledButton fullWidth={!smMatch} onClick={actionButton.onClick} to={actionButton.to}>
              {actionButton.text}
            </StyledButton>
          )}
        </ActionWrapper>
      </Content>
    </Wrapper>
  )
}
