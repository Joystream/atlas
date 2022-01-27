import styled from '@emotion/styled'

import { Avatar } from '@/components/Avatar'
import { AvatarGroup } from '@/components/Avatar/AvatarGroup'
import { Text } from '@/components/Text'
import { cVar, media, sizes } from '@/styles'

export const Container = styled.div<{ fullWidth?: boolean }>`
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '360px')};
  background-color: ${cVar('colorBackground')};
`

export const Title = styled(Text)`
  margin-bottom: ${sizes(4)};

  ${media.sm} {
    margin-bottom: ${sizes(6)};
  }
`

export const Details = styled.div`
  padding: ${sizes(4)};

  ${media.sm} {
    padding: ${sizes(6)};
  }
`

export const Content = styled.div`
  display: grid;

  ${media.sm} {
    grid-template-columns: repeat(2, 1fr);
  }
`

export const MembersWrapper = styled.div`
  padding: ${sizes(4)} 0;
  grid-column: 1 / span 2;

  &:last-of-type {
    padding-bottom: 0;
  }

  &:first-of-type {
    padding-top: 0;
    padding-bottom: 0;
  }

  ${media.sm} {
    grid-column: unset;

    &:nth-of-type(even) {
      border: 0;
      padding-top: 0;
      text-align: right;
      justify-self: flex-end;
    }
  }
`

export const Separator = styled.hr`
  grid-column: 1 / span 2;
  background-color: ${cVar('colorBorderMutedAlpha')};
  border: 0;
  height: 1px;
  width: 100%;
`

export const Caption = styled(Text)`
  display: block;
  margin-bottom: ${sizes(2)};
`

export const AvatarGroupWrapper = styled.div`
  display: flex;
  align-items: center;

  ${media.sm} {
    justify-content: flex-end;
  }
`

export const AvatarWrapper = styled.div`
  display: flex;
`

export const StyledAvatarGroup = styled(AvatarGroup)`
  ${media.sm} {
    left: -8px;
  }
`

export const StyledAvatar = styled(Avatar)`
  margin-right: ${sizes(2)};
`
