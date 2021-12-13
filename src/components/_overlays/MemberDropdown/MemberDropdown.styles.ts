import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Avatar } from '@/components/Avatar'
import { cVar, sizes } from '@/styles'

const paddingStyles = css`
  padding: ${sizes(6)} ${sizes(4)};
`

export const Container = styled.div`
  width: 280px;
  background-color: ${cVar('colorCoreNeutral700')};
`

export const StyledAvatar = styled(Avatar)`
  width: 48px;
  height: 48px;
`

export const BlurredBG = styled.div<{ url?: string | null }>`
  position: relative;
  width: 280px;
  height: 100%;

  &::before {
    position: absolute;
    width: inherit;
    height: inherit;
    background-image: url(${({ url }) => url});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    content: '';
    filter: blur(8px);
    opacity: 0.2;
  }
`

export const MemberInfoContainer = styled.div`
  display: grid;
  gap: ${sizes(4)};
  ${paddingStyles}
`

export const ActionsContainer = styled.div`
  border-top: 1px solid ${cVar('colorBorderMutedAlpha')};
  height: 100px;
`

export const ChannelsContainer = styled.div`
  border-top: 1px solid ${cVar('colorBorderMutedAlpha')};
`
