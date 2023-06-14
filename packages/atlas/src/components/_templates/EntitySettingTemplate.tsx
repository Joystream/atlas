import styled from '@emotion/styled'
import { FC, PropsWithChildren } from 'react'

import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { cVar, media, sizes } from '@/styles'

type EntitySettingTemplateProps = PropsWithChildren<{
  title: string
  description?: string
  isFirst?: boolean
  isLast?: boolean
}>

export const EntitySettingTemplate: FC<EntitySettingTemplateProps> = ({
  children,
  title,
  description,
  isLast,
  isFirst,
}) => {
  return (
    <StyledLayoutGrid isFirst={isFirst} isLast={isLast}>
      <GridItem colStart={{ base: 1 }} colSpan={{ base: 12, sm: 5, lg: 4 }} rowStart={{ base: 1 }}>
        <Text variant="h400" as="h3" margin={{ bottom: 4 }}>
          {title}
        </Text>
        <Text variant="t300" as="p" color="colorText">
          {description}
        </Text>
      </GridItem>
      <GridItem colStart={{ base: 1, sm: 7, lg: 6 }} colSpan={{ base: 12, sm: 6, lg: 8 }} rowStart={{ base: 2, sm: 1 }}>
        {children}
      </GridItem>
    </StyledLayoutGrid>
  )
}

export const StyledLayoutGrid = styled(LayoutGrid)<{ isFirst?: boolean; isLast?: boolean }>`
  row-gap: ${sizes(8)};
  padding: ${({ isFirst }) => (isFirst ? `0 0 ${sizes(10)} 0` : `${sizes(10)} 0`)};
  box-shadow: ${({ isLast }) => (isLast ? 'unset' : cVar('effectDividersBottom'))};

  ${media.sm} {
    padding: ${({ isFirst }) => (isFirst ? `0 0 ${sizes(6)} 0` : `${sizes(6)} 0`)};
  }
`
