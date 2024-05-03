import { FC, ReactNode } from 'react'

import { FlexBox } from '@/components/FlexBox'
import { Information } from '@/components/Information'
import { FlexGridItem } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { ContenBox, Pattern, Wrapper } from './BenefitCard.styles'

export type BenefitCardProps = {
  title: string
  description?: ReactNode
  rewardNode?: ReactNode
  rewardTooltip?: ReactNode
  className?: string
  actionNode?: ReactNode
}

export const BenefitCard: FC<BenefitCardProps> = ({
  title,
  description,
  rewardNode,
  className,
  actionNode,
  rewardTooltip,
}) => {
  const smMatch = useMediaMatch('sm')
  const lgMatch = useMediaMatch('lg')

  const rewardContent = (
    <FlexBox justifyContent={lgMatch ? 'end' : 'unset'} alignItems="center">
      <Text variant="h400" as="span">
        {rewardNode}
      </Text>
      {rewardTooltip && (
        <Information interactive appendTo={document.body} customContent={rewardTooltip} placement="top-start" />
      )}
    </FlexBox>
  )

  return (
    <Wrapper variant="full" className={className}>
      <Pattern />
      <ContenBox>
        <FlexGridItem flow="column" colSpan={{ xxs: 12, lg: 8 }}>
          <Text variant={lgMatch ? 'h500' : 'h400'} as="h2">
            {title}
          </Text>
          <Text variant="t200" color="colorText" as="p">
            {description}
          </Text>
        </FlexGridItem>
        {lgMatch ? (
          <>
            <FlexGridItem colSpan={{ lg: 2 }} alignItems="center">
              {rewardContent}
            </FlexGridItem>
            <FlexGridItem colSpan={{ lg: 2 }} alignItems="center" justifyContent="end">
              {actionNode}
            </FlexGridItem>
          </>
        ) : (
          <FlexGridItem
            colSpan={{ xxs: 12, lg: 4 }}
            gap={smMatch ? 8 : 4}
            alignItems={smMatch ? 'center' : 'start'}
            flow={smMatch ? (lgMatch ? 'row' : 'row-reverse') : 'column'}
          >
            {rewardContent}
            {actionNode}
          </FlexGridItem>
        )}
      </ContenBox>
    </Wrapper>
  )
}
