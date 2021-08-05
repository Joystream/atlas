import styled from '@emotion/styled'
import React, { FC, MouseEvent } from 'react'

import { Button } from '@/shared/components'
import { SvgGlyphChevronDown } from '@/shared/icons'

type LoadMoreButtonProps = {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  label?: string
}

export const LoadMoreButton: FC<LoadMoreButtonProps> = ({ onClick, label = 'Show more videos' }) => (
  <LoadMore
    variant="secondary"
    size="large"
    fullWidth
    onClick={onClick}
    iconPlacement="right"
    icon={<SvgGlyphChevronDown width={12} height={12} />}
  >
    {label}
  </LoadMore>
)

const LoadMore = styled(Button)`
  span {
    display: flex;
  }
`
