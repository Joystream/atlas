import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

import { DialogModal } from '../_overlays/DialogModal'

export const StyledDialogModal = styled(DialogModal)`
  .welcome-content {
    padding: 0;
  }
`

export const Wrapper = styled.div`
  display: grid;
  gap: ${sizes(2)};

  > * {
    margin: 0 ${sizes(4)};
  }

  > *:last-child {
    margin-bottom: ${sizes(4)};
  }

  > :nth-child(1) {
    margin: 0;
  }

  > :nth-child(2),
  > :nth-child(5) {
    margin: ${sizes(4)} 0;
  }
`

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${cVar('colorBackgroundAlpha')};
`

export const StyledText = styled(Text)`
  max-width: 360px;
  margin: 0 auto;
  text-align: center;
  justify-self: center;

  :first-child {
    margin-bottom: ${sizes(2)};
  }
`
export const StyledAnchor = styled(Link)`
  text-decoration: none;
  color: ${cVar('colorTextPrimary')};
`
