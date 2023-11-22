import { ReactNode } from 'react'

import { FlexBox } from '@/components/FlexBox'
import { Information } from '@/components/Information'
import { Text } from '@/components/Text'

type AmmModalSummaryTemplateProps = {
  details?: {
    title: string
    content: ReactNode
    tooltipText?: string
  }[]
}

export const AmmModalSummaryTemplate = ({ details }: AmmModalSummaryTemplateProps) => {
  return (
    <FlexBox flow="column" gap={5}>
      {details?.map((row, i) => (
        <FlexBox key={row.title} alignItems="center" justifyContent="space-between">
          <FlexBox width="auto" alignItems="center">
            <Text variant={i + 1 === details.length ? 'h300' : 't200'} as="span" color="colorText">
              {row.title}
            </Text>
            {row.tooltipText ? <Information text={row.tooltipText} /> : null}
          </FlexBox>
          {row.content}
        </FlexBox>
      ))}
    </FlexBox>
  )
}
