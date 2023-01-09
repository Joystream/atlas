import styled from '@emotion/styled'

import { Loader } from '@/components/_loaders/Loader'
import { cVar, media, sizes } from '@/styles'

export const Wrapper = styled.div<{ variant: 'small' | 'large'; clickable?: boolean }>`
  width: 100%;
  display: flex;
  gap: ${sizes(4)};
  flex-direction: column;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  padding: ${sizes(3)} ${sizes(4)};

  ${media.xs} {
    flex-direction: row;

    > *:first-child {
      min-width: ${({ variant }) => (variant === 'small' ? '80px' : '197px')};
    }

    ${(props) =>
      props.clickable &&
      `
      :hover {
        background-color: ${cVar('colorBackgroundAlpha')};
      }
  `}
  }
`

export const DetailsWrapper = styled.div<{ variant: 'small' | 'large' }>`
  align-self: ${({ variant }) => (variant === 'small' ? 'center' : 'start')};
  gap: ${({ variant }) => (variant === 'small' ? 'unset' : sizes(2))};
  display: grid;
`

export const EndNodeWrapper = styled.div`
  align-self: center;
  margin-left: auto;

  path {
    fill: ${cVar('colorTextPrimary')};
  }
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
