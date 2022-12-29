import styled from '@emotion/styled'

import { Loader } from '@/components/_loaders/Loader'
import { cVar, sizes } from '@/styles'

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  gap: ${sizes(4)};
  height: 80px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  padding: ${sizes(3)} 0;
`

export const DetailsWrapper = styled.div`
  align-self: center;
  display: grid;
`

export const ThumbnailImage = styled.img`
  height: 100%;
  object-fit: contain;
`

export const ThumbnailBackground = styled.div`
  background: ${cVar('colorBackground')};
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
