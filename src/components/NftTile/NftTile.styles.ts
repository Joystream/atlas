import styled from '@emotion/styled'

import { Content, KebabMenuButtonIcon } from '@/components/NftTileDetails/NftTileDetails.styles'
import { cVar } from '@/styles'

type ContainerProps = {
  fullWidth?: boolean
}

export const Container = styled.div<ContainerProps>`
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '320px')};

  :hover {
    ${Content} {
      background-color: ${cVar('colorBackground')};
    }

    ${KebabMenuButtonIcon} {
      opacity: 1;
      pointer-events: auto;
    }
  }
`
