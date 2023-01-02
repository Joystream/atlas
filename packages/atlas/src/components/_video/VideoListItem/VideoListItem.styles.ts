import styled from '@emotion/styled'

import { Loader } from '@/components/_loaders/Loader'
import { cVar, sizes } from '@/styles'

export const Wrapper = styled.div<{ variant: 'small' | 'large' }>`
  width: 100%;
  display: flex;
  gap: ${sizes(4)};
  height: ${({ variant }) => (variant === 'small' ? '80px' : '111px')};
  position: relative;
  overflow: hidden;
  cursor: pointer;
  padding: ${sizes(3)} 0;
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

export const SkeletonTextWrapper = styled.div`
  width: 100%;
  display: grid;
  gap: ${sizes(1)};
  align-self: center;
`

export const StyledLoader = styled(Loader)`
  margin: ${sizes(4)};
  justify-self: center;
`
