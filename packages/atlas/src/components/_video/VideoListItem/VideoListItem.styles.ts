import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { ListItem } from '@/components/ListItem'
import { cVar, media, sizes } from '@/styles'

export const DetailsWrapper = styled.div<{ variant: 'small' | 'large' }>`
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

export const ThumbnailContainer = styled.div<{ variant: 'small' | 'large' }>`
  > *:first-of-type {
    min-width: ${({ variant }) => (variant === 'small' ? '80px' : '197px')};
  }
`

export const StyledListItem = styled(ListItem)<{ ignoreRWD?: boolean }>`
  :hover {
    .video-list-item-kebab {
      align-self: flex-start;
      opacity: 1;
    }
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
