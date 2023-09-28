import { FC, ReactNode } from 'react'

import { FlexBox } from '@/components/FlexBox'
import { Information } from '@/components/Information'
import { FlexGridItem } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { ContenBox, Pattern, Wrapper } from './BenefitCard.styles'

export type BenefitCardProps = {
  title: string
  description?: string
  dollarAmount?: number
  isRangeAmount?: boolean
  className?: string
  actionNode?: ReactNode
}

export const BenefitCard: FC<BenefitCardProps> = ({
  title,
  description,
  dollarAmount,
  className,
  actionNode,
  isRangeAmount,
}) => {
  const smMatch = useMediaMatch('sm')
  const lgMatch = useMediaMatch('lg')

  return (
    <Wrapper variant="full" className={className}>
      <Pattern />
      <ContenBox>
        <FlexGridItem flow="column" colSpan={{ xxs: 12, lg: 8 }}>
          <Text variant="h500" as="h2">
            {title}
          </Text>
          <Text variant="t200" color="colorText" as="p">
            {description}
          </Text>
        </FlexGridItem>
        <FlexGridItem
          colSpan={{ xxs: 12, lg: 4 }}
          gap={4}
          alignItems={smMatch ? 'center' : 'start'}
          flow={smMatch ? (lgMatch ? 'row' : 'row-reverse') : 'column'}
        >
          {typeof dollarAmount === 'number' && (
            <FlexBox justifyContent={lgMatch ? 'end' : 'unset'} alignItems="center">
              {isRangeAmount ? (
                <FlexBox width="fit-content" flow="column" alignItems="center">
                  <Text variant="h400" as="h1">
                    Up to +{dollarAmount} USD
                  </Text>
                  <Text variant="t200" as="p" color="colorText">
                    Depending on tier
                  </Text>
                </FlexBox>
              ) : (
                <Text variant="h400" as="h1">
                  {dollarAmount > 0 ? `+${dollarAmount} USD` : 'Not paid'}
                </Text>
              )}

              <Information text="hahahah" />
            </FlexBox>
          )}
          {actionNode}
        </FlexGridItem>
      </ContenBox>
    </Wrapper>
  )
}
