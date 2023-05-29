import styled from '@emotion/styled'

import { Avatar } from '@/components/Avatar'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { cVar, media, sizes } from '@/styles'

export const StyledDialogModal = styled(DialogModal)`
  max-height: calc(100vh - 80px);
  ${media.sm} {
    max-height: 576px;
  }
`

export const StyledAvatar = styled(Avatar)`
  position: absolute;
  transform: translateY(-50%);
  top: 0;
`

export const StyledForm = styled.form`
  position: relative;
  padding-top: ${sizes(17)};
  display: grid;
  gap: ${sizes(6)};
  margin-bottom: ${sizes(6)};
`

export const Anchor = styled.a`
  display: inline-block;
  text-decoration: none;
  margin-top: ${sizes(2)};
  margin-bottom: ${sizes(11)};
  cursor: pointer;
  color: ${cVar('colorTextPrimary')};
`
