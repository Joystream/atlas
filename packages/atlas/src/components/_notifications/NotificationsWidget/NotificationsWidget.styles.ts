import styled from '@emotion/styled'

import { Button } from '@/components/_buttons/Button'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { cVar, media, sizes } from '@/styles'

export const Wrapper = styled.div`
  position: relative;
  left: -5px;
  width: 100vw;
  background-color: ${cVar('colorBackgroundStrong')};
  ${media.sm} {
    left: 0;
    width: 516px;
  }
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${sizes(4)};
  box-shadow: ${cVar('effectDividersBottom')};
`

export const Content = styled.div`
  overflow-y: auto;
  overscroll-behavior: contain;

  ${media.sm} {
    max-height: 336px;
  }
`

export const StyledButton = styled(Button)`
  box-shadow: ${cVar('effectDividersTop')};
`

export const StyledCompactNotificationLoader = styled(SkeletonLoader)`
  height: 56px;
  width: 100%;

  :first-of-type {
    margin-top: ${sizes(2 / 4)};
  }

  :not(:last-of-type) {
    margin-bottom: ${sizes(2 / 4)};
  }
`
