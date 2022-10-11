import { FC, ReactNode } from 'react'

import { SvgEmptyStateIllustration } from '@/assets/illustrations'

import { ButtonWrapper, Container, EmptyFallbackSizes, Message, Subtitle, Title } from './EmptyFallback.styles'

export type EmptyFallbackProps = {
  title: string
  subtitle?: string | null
  variant?: EmptyFallbackSizes
  button?: ReactNode
  className?: string
  verticalCentered?: boolean
}

export const EmptyFallback: FC<EmptyFallbackProps> = ({
  title,
  subtitle,
  variant = 'large',
  button,
  verticalCentered,
  className,
}) => (
  <Container className={className} variant={variant} verticalCentered={verticalCentered}>
    <SvgEmptyStateIllustration />
    <Message>
      {title && (
        <Title as="h1" variant={variant === 'large' ? 'h500' : 't300'}>
          {title}
        </Title>
      )}
      {variant === 'large' && subtitle && (
        <Subtitle as="p" variant="t200" color="colorText">
          {subtitle}
        </Subtitle>
      )}
    </Message>
    {variant === 'large' && button && <ButtonWrapper>{button}</ButtonWrapper>}
  </Container>
)
