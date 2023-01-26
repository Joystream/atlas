import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { ListItem } from '@/components/ListItem'
import { cVar, media, sizes } from '@/styles'

export type VideoListItemVariants = 'small' | 'medium' | 'large'

export const getVideoVariantDimensions = (variant: VideoListItemVariants): { width: number; height: number } => {
  switch (variant) {
    case 'small':
      return {
        width: 80,
        height: 50,
      }
    case 'medium':
      return {
        width: 143,
        height: 80,
      }
    case 'large':
      return {
        width: 197,
        height: 111,
      }
  }
}

export const DetailsWrapper = styled.div<{ variant?: VideoListItemVariants }>`
  align-self: ${({ variant }) => (variant === 'small' ? 'center' : 'start')};
  gap: ${({ variant }) => (variant === 'small' ? 'unset' : sizes(2))};
  display: grid;
  position: relative;
  width: 100%;
`

export const ContextMenuWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  opacity: 1;
  transition: opacity ${cVar('animationTransitionFast')};

  ${media.sm} {
    opacity: 0;
  }
`

export const ThumbnailContainer = styled.div<{ variant: VideoListItemVariants }>`
  > *:first-of-type {
    min-width: ${({ variant }) => {
      const { width } = getVideoVariantDimensions(variant)
      return `${width}px`
    }};
  }
`

export const StyledListItem = styled(ListItem)<{ ignoreRWD?: boolean }>`
  :hover {
    .video-list-item-kebab {
      align-self: flex-start;
      opacity: 1;
    }
  }

  .li-caption {
    align-self: start;
    row-gap: ${sizes(1)};
  }

  ${(props) =>
    !props.ignoreRWD
      ? css`
          > *:first-of-type {
            grid-column: 1/3;
            width: 100%;
          }

          grid-template-columns: 1fr;
          grid-template-rows: auto auto;

          ${media.sm} {
            grid-template-columns: auto 1fr;
            grid-template-rows: auto;

            > *:first-of-type {
              grid-column: unset;
            }
          }
        `
      : ''}
`
