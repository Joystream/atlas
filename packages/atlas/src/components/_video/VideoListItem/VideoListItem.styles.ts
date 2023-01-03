import styled from '@emotion/styled'

import { Loader } from '@/components/_loaders/Loader'
import { cVar, media, sizes } from '@/styles'

export const Wrapper = styled.div<{ variant: 'small' | 'large' }>`
  width: 100%;
  display: grid;
  gap: ${sizes(4)};
  height: fit-content;
  grid-template-rows: 140px auto;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  margin: ${sizes(3)} 0;

  ${media.xs} {
    grid-template-rows: ${({ variant }) => (variant === 'small' ? '50px' : '111px')};
    grid-template-columns: auto 1fr;
  }
`

export const DetailsWrapper = styled.div<{ variant: 'small' | 'large' }>`
  align-self: ${({ variant }) => (variant === 'small' ? 'center' : 'start')};
  gap: ${({ variant }) => (variant === 'small' ? 'unset' : sizes(2))};
  display: grid;
`

export const ThumbnailImage = styled.img`
  height: 100%;
  object-fit: contain;
`

export const ThumbnailBackground = styled.div`
  background: ${cVar('colorBackground')};
  width: fit-content;
  position: relative;
`

export const PillContainer = styled.div`
  position: absolute;
  display: flex;
  gap: ${sizes(1)};
  bottom: ${sizes(1)};
  right: ${sizes(1)};
`

export const EndNodeWrapper = styled.div`
  align-self: center;
  margin-left: auto;
`

export const SkeletonTextWrapper = styled.div<{ variant: 'small' | 'large' }>`
  width: 100%;
  display: grid;
  gap: ${sizes(1)};
  align-self: ${(props) => (props.variant === 'large' ? 'start' : 'center')};
`

export const StyledLoader = styled(Loader)`
  margin: ${sizes(4)};
  justify-self: center;
`
