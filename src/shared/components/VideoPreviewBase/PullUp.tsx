import React from 'react'
import styled from '@emotion/styled'
import { IconButton, Tooltip } from '..'
import { SvgGlyphNewTab } from '@/shared/icons'

type StateProps = {
  disabled: boolean
}
type PullUpProps = StateProps & {
  onClick: (e: React.MouseEvent<HTMLElement>) => void
}

export const PullUp: React.FC<PullUpProps> = ({ disabled, onClick }) => (
  <Tooltip above text={disabled ? 'Video already added to edit list' : 'Open in new tab'}>
    <Container disabled={disabled} onClick={onClick}>
      <IconButton disabled={disabled} variant="tertiary">
        <SvgGlyphNewTab />
      </IconButton>
    </Container>
  </Tooltip>
)

const Container = styled.div<StateProps>`
  display: flex;
  position: relative;
`
