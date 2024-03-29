import styled from '@emotion/styled'
import { FC, MouseEvent } from 'react'

import { SvgActionChevronB } from '@/assets/icons'
import { Button } from '@/components/_buttons/Button'

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
    icon={<SvgActionChevronB width={12} height={12} />}
  >
    {label}
  </LoadMore>
)

const LoadMore = styled(Button)`
  span {
    display: flex;
  }
`
