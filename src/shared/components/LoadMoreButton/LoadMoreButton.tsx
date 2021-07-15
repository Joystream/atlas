import styled from '@emotion/styled'
import React, { FC, MouseEvent } from 'react'

import { Button } from '@/shared/components'
import { SvgGlyphChevronDown } from '@/shared/icons'

type LoadMoreButtonProps = {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
}

export const LoadMoreButton: FC<LoadMoreButtonProps> = ({ onClick }) => (
  <LoadMore
    variant="secondary"
    size="large"
    fullWidth
    onClick={onClick}
    iconPlacement="right"
    icon={<SvgGlyphChevronDown width={12} height={12} />}
  >
    Show more videos
  </LoadMore>
)

const LoadMore = styled(Button)`
  span {
    display: flex;
  }
`
