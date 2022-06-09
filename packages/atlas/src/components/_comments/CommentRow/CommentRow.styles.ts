import styled from '@emotion/styled'

import { cVar, media, sizes } from '@/styles'

export const OutlineBox = styled.div<{ highlighted: boolean; isInput: boolean; processing?: boolean }>`
  padding: ${({ isInput }) => (isInput ? 0 : sizes(2))};
  margin: ${({ isInput }) => (isInput ? 0 : `-${sizes(2)}`)};
  width: ${({ isInput }) => (isInput ? '100%' : `calc(100% + ${sizes(4)}) `)};
  background-color: ${({ highlighted }) => (highlighted ? cVar('colorBackgroundAlpha') : 'transparent')};
  border: 1px solid ${({ highlighted }) => (highlighted ? cVar('colorBackgroundAlpha') : 'transparent')};
  border-radius: ${cVar('radiusLarge')};
  transition: background-color ${cVar('animationTransitionSlow')}, border ${cVar('animationTransitionSlow')},
    opacity ${cVar('animationTransitionFast')};

  ${media.sm} {
    padding: ${({ isInput }) => (isInput ? 0 : sizes(4))};
    margin: ${({ isInput }) => (isInput ? 0 : `-${sizes(4)}`)};
    width: ${({ isInput }) => (isInput ? '100%' : `calc(100% + ${sizes(8)}) `)};
  }

  opacity: ${({ processing, isInput }) => (processing && !isInput ? 0.5 : 1)};
  cursor: ${({ processing }) => (processing ? 'not-allowed' : 'unset')};
`

export const ContentWrapper = styled.div<{ indented: boolean }>`
  margin-left: ${({ indented }) => (indented ? sizes(8) : 0)};
  display: grid;
  gap: ${sizes(3)};

  /* avatar children */
  grid-template-columns: auto 1fr;

  ${media.sm} {
    gap: ${sizes(4)};
    margin-left: ${({ indented }) => (indented ? sizes(14) : 0)};
  }
`
