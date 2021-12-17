import styled from '@emotion/styled'
import React from 'react'

import { cVar } from '@/styles'

import { Avatar, AvatarProps } from '.'

export type AvatarGroupProps = {
  avatars: AvatarProps[]
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ avatars }) => {
  return (
    <Container>
      <FirstBox />
      <SecondBox>
        <StyledAvatar size="small" assetUrl="https://picsum.photos/200/300" />
      </SecondBox>
    </Container>
  )
}

const FIRST_PATH4040 =
  'M0 0V5H0.0203552C0.0135803 5.00599 0.0067749 5.01199 0 5.01799C3.28506 9.12401 5.24948 14.3326 5.24948 20C5.24948 25.6674 3.28506 30.876 0 34.982L0.0203552 35H0V40H34V0H0Z" fill="black'

const FIRST_PATH4040_HOVER =
  'M0 31.6706C5.44014 27.2708 8.91867 20.5417 8.91867 13C8.91867 9.67146 8.22479 5.38161 7 2.5C9.91957 0.833009 13.316 1.00002 16.9187 1.00002C27.9644 1.00002 36.9187 9.95432 36.9187 21C36.9187 32.0457 27.9644 41 16.9187 41C9.79618 41 3.54329 37.2769 0 31.6706Z'

const SECOND_PATH4040 =
  'M 27.2 35 C 24 30.9 22 25.7 22 20 C 22 14.3 24 9.1 27.2 5 C 23.7 1.9 19.1 0 14 0 C 8.9 0 4.3 1.9 0.8 5 C 4 9.1 6 14.3 6 20 C 6 25.7 4 30.9 0.8 35 C 4.3 38.1 8.9 40 14 40 C 19.1 40 23.7 38.1 27.2 35 Z'

const SECOND_PATH4040_HOVER =
  'M 30.9 30.7 C 25.5 26.3 22 19.5 22 12 C 22 8.7 22.7 5.5 23.9 2.6 C 21 1 17.6 0 14 0 C 8.9 0 4.3 1.9 0.8 5 C 4 9.1 6 14.3 6 20 C 6 25.7 4 30.9 0.8 35 C 4.3 38.1 8.9 40 14 40 C 21.1 40 27.4 36.3 30.9 30.7 Z'

const FirstBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: red;
  transition: transform 200ms;

  :hover {
    transform: translateY(-8px);

    + div {
      clip-path: path('${FIRST_PATH4040_HOVER}');
    }
  }
`

const SecondBox = styled.div`
  width: 40px;
  height: 40px;
  position: absolute;
  z-index: 0;
  clip-path: path('${FIRST_PATH4040}');
  left: 40px;
  transition: clip-path 200ms;
`

const StyledAvatar = styled(Avatar)`
  left: -6px;
`

const Container = styled.div`
  position: relative;
  display: flex;
`
