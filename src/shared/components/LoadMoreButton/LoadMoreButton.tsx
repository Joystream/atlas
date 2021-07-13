import styled from '@emotion/styled'
import React, { FC, MouseEvent } from 'react'

import { Button } from '@/shared/components'
import { ButtonIconWrapper } from '@/shared/components/Button/Button.style'
import { SvgGlyphChevronDown } from '@/shared/icons'
import { sizes } from '@/shared/theme'

type LoadMoreButtonProps = {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
}

export const LoadMoreButton: FC<LoadMoreButtonProps> = ({ onClick }) => (
  <LoadMore variant="secondary" size="large" fullWidth onClick={onClick}>
    Show more videos
    <StyledButtonIconWrapper>
      <SvgGlyphChevronDown width={12} height={12} />
    </StyledButtonIconWrapper>
  </LoadMore>
)

const LoadMore = styled(Button)`
  span {
    display: flex;
  }
`

const StyledButtonIconWrapper = styled(ButtonIconWrapper)`
  padding-top: ${sizes(1)};
  margin-left: ${sizes(2)};
`
