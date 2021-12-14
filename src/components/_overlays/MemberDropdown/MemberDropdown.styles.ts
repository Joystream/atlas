import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { SvgActionChevronL, SvgActionChevronR } from '@/components/_icons'
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
    filter: blur(32px);
    opacity: 0.2;
  }
`

export const MemberInfoContainer = styled.div`
  display: grid;
  gap: ${sizes(4)};
  ${paddingStyles}
`

export const SectionContainer = styled.div`
  border-top: 1px solid ${cVar('colorBorderMutedAlpha')};
  padding: ${sizes(2)} 0;
`

export const ChannelsSectionTitle = styled(Text)`
  padding: ${sizes(2)} ${sizes(4)};
  display: block;
`

export const StyledSvgActionChevronR = styled(SvgActionChevronR)`
  & > path {
    fill: ${cVar('colorCoreNeutral300')};
  }
`

export const StyledSvgActionChevronL = styled(SvgActionChevronL)`
  & > path {
    fill: ${cVar('colorCoreNeutral300')};
  }
`

export const SwitchMemberItemListContainer = styled.div`
  padding: ${sizes(2)} 0;
`
