import { FC, ReactNode } from 'react'

import { Information } from '@/components/Information'
import { Text } from '@/components/Text'
import { TooltipProps } from '@/components/Tooltip'
import { ButtonProps } from '@/components/_buttons/Button'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { Content, StyledButton, TextWrapper, Title, Wrapper } from './WidgetTile.styles'

export type WidgetTileProps = {
  loading?: boolean
  title: string | number
  text: string | number
  caption?: ReactNode
  icon?: ReactNode
  button: { text: string } & Omit<ButtonProps, 'children'>
  tooltip?: TooltipProps
  customNode?: ReactNode
}

export const WidgetTile: FC<WidgetTileProps> = ({
  loading,
  title,
  text,
  caption,
  icon,
  button,
  tooltip,
  customNode,
}) => {
  const mdMatch = useMediaMatch('md')
  const lgMatch = useMediaMatch('lg')
  return (
    <Wrapper>
      <Title hasTooltip={!!tooltip}>
        <Text variant="h100" as="p" color="colorText">
          {title}
        </Text>
        {tooltip && <Information {...tooltip} />}
      </Title>
      <Content>
        {loading && !customNode ? (
          <>
            <div>
              <SkeletonLoader height={mdMatch ? 32 : 24} width={128} bottomSpace={caption ? 4 : 0} />
              {caption && <SkeletonLoader width={56} height={16} />}
            </div>
            <SkeletonLoader height={40} width={lgMatch ? 120 : '100%'} />
          </>
        ) : customNode ? (
          customNode
        ) : (
          <div>
            <TextWrapper>
              {icon}
              <Text variant={mdMatch ? 'h500' : 'h400'} as="p">
                {text}
              </Text>
            </TextWrapper>
            {caption && (
              <Text variant="t100" as="p" color="colorText" margin={{ top: 1 }}>
                {caption}
              </Text>
            )}
          </div>
        )}
        {!loading && <StyledButton {...button}>{button.text}</StyledButton>}
      </Content>
    </Wrapper>
  )
}
