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
  className?: string
  actionNode?: ReactNode
}

export const BenefitCard: FC<BenefitCardProps> = ({ title, description, dollarAmount, className, actionNode }) => {
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
          {dollarAmount && (
            <FlexBox justifyContent={lgMatch ? 'end' : 'unset'} alignItems="center">
              <Text variant="h400" as="h1">
                +{dollarAmount} USD
              </Text>
              <Information text="hahahah" />
            </FlexBox>
          )}
          {actionNode}
        </FlexGridItem>
      </ContenBox>
    </Wrapper>
  )
}
