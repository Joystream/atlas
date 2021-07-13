import styled from '@emotion/styled'

import { colors, sizes, typography } from '@/shared/theme'

import { Avatar } from '../Avatar'

export const Container = styled.div`
  display: flex;
  align-items: center;
`

export const StyledAvatar = styled(Avatar)`
  width: 32px;
  height: 32px;
  margin-right: ${sizes(2)};
`

export const Name = styled.span`
  display: inline-block;
  font-family: ${typography.fonts.headers};
  font-size: 1rem;
  line-height: 1;
  font-weight: bold;
  color: ${colors.white};
`
