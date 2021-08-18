import React, { FC, ReactNode } from 'react'

import { SvgEmptyStateIllustration } from '@/shared/illustrations'

import { ButtonWrapper, Container, Message, Subtitle, Title } from './EmptyFallback.styles'

export type EmptyFallbackSizes = 'small' | 'large'

export type EmptyFallbackProps = {
  title: string
  subtitle?: string | null
  variant?: EmptyFallbackSizes
  button?: ReactNode
  className?: string
}

const ILLUSTRATION_SIZES = {
  small: {
    width: 180,
    height: 114,
  },
  large: {
    width: 240,
    height: 152,
  },
}

export const EmptyFallback: FC<EmptyFallbackProps> = ({ title, subtitle, variant = 'large', button, className }) => (
  <Container className={className} variant={variant}>
    <SvgEmptyStateIllustration width={ILLUSTRATION_SIZES[variant].width} height={ILLUSTRATION_SIZES[variant].height} />
    <Message>
      {title && <Title variant={variant === 'large' ? 'h4' : 'body1'}>{title}</Title>}
      {subtitle && (
        <Subtitle variant="body2" secondary>
          {subtitle}
        </Subtitle>
      )}
    </Message>
    <ButtonWrapper>{button}</ButtonWrapper>
  </Container>
)
