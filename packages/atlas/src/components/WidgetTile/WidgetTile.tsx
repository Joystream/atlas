import { FC, ReactNode } from 'react'

import { Text, TextVariant } from '@/components/Text'
import { Color } from '@/components/Text/Text.styles'
import { TooltipProps } from '@/components/Tooltip'
import { ButtonProps } from '@/components/_buttons/Button'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { ConsoleLogger } from '@/utils/logs'

import { Content, StyledButton, TextWrapper, Title, Wrapper } from './WidgetTile.styles'

import { Information } from '../Information'

export type WidgetTileProps = {
  loading?: boolean
  title: string | number | JSX.Element
  button?: { text: string } & Omit<ButtonProps, 'children'>
  text?: string | number
  customNode?: ReactNode
  caption?: ReactNode
  icon?: ReactNode
  customTopRightNode?: ReactNode
  tooltip?: TooltipProps
  className?: string
  titleVariant?: TextVariant
  titleColor?: Color
}

export const WidgetTile: FC<WidgetTileProps> = ({
  loading,
  title,
  button,
  customNode,
  tooltip,
  customTopRightNode,
  text,
  caption,
  icon,
  className,
  titleVariant,
  titleColor,
}) => {
  const mdMatch = useMediaMatch('md')
  const lgMatch = useMediaMatch('lg')
  const withCustomNode = customNode && !text && !loading
  const withText = !customNode && text !== undefined && !loading
  const withCustomTopRightNode = customTopRightNode && !tooltip
  const withTooltip = !customTopRightNode && tooltip

  if (customNode && text) {
    ConsoleLogger.error('WidgetTile: text and customNode are mutually exclusive. customNode will be ignored.')
  }

  if (tooltip && customTopRightNode) {
    ConsoleLogger.error(
      'WidgetTile: tooltip and customTopRightNode are mutually exclusive. customTopRightNode will be ignored.'
    )
  }

  return (
    <Wrapper className={className}>
      <Title hasTooltip={!!tooltip}>
        <Text variant={titleVariant ?? 'h100'} as="p" color={titleColor ?? 'colorText'}>
          {title}
        </Text>
        {withTooltip && <Information {...tooltip} />}
        {withCustomTopRightNode && customTopRightNode}
      </Title>
      <Content withButton={!!button}>
        {withCustomNode && customNode}
        {loading && (
          <>
            <div>
              <SkeletonLoader height={mdMatch ? 32 : 24} width={128} bottomSpace={caption ? 4 : 0} />
              {caption && <SkeletonLoader width={56} height={16} />}
            </div>
            <SkeletonLoader height={40} width={lgMatch ? 120 : '100%'} />
          </>
        )}
        {withText && (
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
        {!loading && button && <StyledButton {...button}>{button.text}</StyledButton>}
      </Content>
    </Wrapper>
  )
}
