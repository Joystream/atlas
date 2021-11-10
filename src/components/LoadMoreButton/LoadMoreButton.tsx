import styled from '@emotion/styled'
import React, { FC, MouseEvent } from 'react'

import { SvgGlyphChevronDown } from '@/components/_icons'
import { Button } from '@/components/_inputs/Button'

type LoadMoreButtonProps = {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  label?: string
}

export const LoadMoreButton: FC<LoadMoreButtonProps> = ({ onClick, label = 'Show more videos' }) => (
  <LoadMore
    variant="tertiary"
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
