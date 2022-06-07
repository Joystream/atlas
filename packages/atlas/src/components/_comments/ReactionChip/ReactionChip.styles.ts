import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { EmojiWrapper } from '@/components/EmojiWrapper'
import { cVar, sizes } from '@/styles'

export type ReactionChipState = 'default' | 'disabled' | 'processing' | 'read-only'
type ReactionChipButtonProps = {
  state: ReactionChipState
  active: boolean
}

const getStaticBackground = (props: ReactionChipButtonProps) => {
  switch (props.state) {
    case 'processing':
      return props.active ? cVar('colorBackgroundStrongAlpha') : cVar('colorBackgroundAlpha')
    default:
    case 'default':
    case 'disabled':
      return props.active ? cVar('colorBackgroundStrongAlpha') : 'none'
  }
}

const getHoverStyles = (props: ReactionChipButtonProps) => css`
  :hover,
  :focus {
    background: ${cVar('colorBackgroundStrongAlpha')};
    box-shadow: ${props.active ? `inset 0 0 0 1px ${cVar('colorBorderStrongAlpha')}` : 'none'};
  }

  :active {
    background: ${cVar('colorBackgroundAlpha')};
    box-shadow: ${props.active ? `inset 0 0 0 1px ${cVar('colorBorderAlpha')}` : 'none'};
  }
`

export const ReactionChipButton = styled.button<ReactionChipButtonProps>`
  border: none;
  background: ${getStaticBackground};
  box-shadow: ${({ active }) => (active ? `inset 0 0 0 1px ${cVar('colorBackgroundStrongAlpha')}` : 'none')};
  cursor: ${({ state }) => (state === 'disabled' || state === 'read-only' ? 'not-allowed' : 'pointer')};
  opacity: ${({ state }) => (state === 'disabled' ? 0.5 : 1)};
  height: 32px;
  padding: ${sizes(2)};
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ state }) => state === 'default' && getHoverStyles};
`

const readOnlyStyles = css`
  filter: grayscale(100%);
  opacity: 0.85;
`

export const StyledEmojiWrapper = styled(EmojiWrapper)<{ readOnly: boolean }>`
  margin-right: ${sizes(2)};
  ${({ readOnly }) => readOnly && readOnlyStyles};
`
