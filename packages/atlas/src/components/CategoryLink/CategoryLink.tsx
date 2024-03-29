import { FC, MouseEvent } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { CategoryIcon } from '@/components/CategoryIcon'
import { Text, TextVariant } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { CircleDefaultBackground } from '@/components/_video/VideoCategoryCard/VideoCategoryCard.style'
import { displayCategoriesLookup } from '@/config/categories'
import { absoluteRoutes } from '@/config/routes'
import { transitions } from '@/styles'

import { Container, IconWrapper, StyledSkeletonLoader } from './CategoryLink.styles'

type CategoryLinkProps = {
  id?: string | null
  name?: string | null
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
  categoryName?: string
  hideHandle?: boolean
  hideIcon?: boolean
  noLink?: boolean
  className?: string
  textVariant?: TextVariant
  textSecondary?: boolean
}

export const CategoryLink: FC<CategoryLinkProps> = ({
  id,
  name,
  onClick,
  hideIcon,
  hideHandle,
  noLink,
  className,
  textVariant,
  textSecondary,
}) => {
  const _textVariant = textVariant || 't200-strong'
  const category = id ? displayCategoriesLookup[id] : null
  return (
    <Container
      onClick={onClick}
      to={absoluteRoutes.viewer.category(id || '')}
      disabled={!id || noLink}
      className={className}
    >
      {!hideIcon && id ? (
        <IconWrapper withHandle={!hideHandle} color={category?.color}>
          <CircleDefaultBackground color={category?.color} />
          <CategoryIcon url={category?.iconUrl} color={category?.color} />
        </IconWrapper>
      ) : (
        <StyledSkeletonLoader width={40} height={40} rounded withHandle={!hideHandle} />
      )}
      {!hideHandle && (
        <SwitchTransition>
          <CSSTransition
            key={id ? 'data' : 'placeholder'}
            classNames={transitions.names.fade}
            timeout={parseInt(transitions.timings.regular)}
          >
            {id ? (
              <Text as="span" variant={_textVariant} color={textSecondary ? 'colorText' : undefined}>
                More in {name}
              </Text>
            ) : (
              <SkeletonLoader height={16} width={150} />
            )}
          </CSSTransition>
        </SwitchTransition>
      )}
    </Container>
  )
}
