import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Pill } from '@/components/Pill'
import { Text } from '@/components/Text'
import { SvgAlertsInformative24 } from '@/components/_icons'
import { cVar, sizes, transitions, zIndex } from '@/styles'

export type SelectSizes = 'regular' | 'small'

type SelectWrapperProps = {
  labelPosition?: 'top' | 'left'
}

export const SelectWrapper = styled.div<SelectWrapperProps>`
  width: 100%;
  position: relative;
  ${({ labelPosition }) =>
    labelPosition === 'left' &&
    css`
      display: flex;
      align-items: center;
    `};
`

export const SelectLabel = styled.label`
  flex-shrink: 0;
`
type LabelText = {
  labelPosition?: 'top' | 'left'
}

export const LabelText = styled(Text)<LabelText>`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  margin-bottom: ${sizes(2)};
  margin-bottom: ${({ labelPosition }) => (labelPosition === 'top' ? sizes(2) : 0)};
  margin-right: ${({ labelPosition }) => (labelPosition === 'left' ? sizes(2) : 0)};
`

export const SelectMenuWrapper = styled.div`
  position: relative;
  width: 100%;
`
type SelectButtonProps = {
  isOpen?: boolean
  filled?: boolean
  error?: boolean
  disabled?: boolean
  size?: SelectSizes
}
export const SelectButton = styled.button<SelectButtonProps>`
  cursor: pointer;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  background: none;
  color: ${({ filled }) => (filled ? cVar('colorCoreNeutral50') : cVar('colorCoreNeutral300'))};
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: ${({ isOpen, error, disabled }) =>
    `1px solid ${
      isOpen ? cVar('colorCoreBlue500') : error && !disabled ? cVar('colorCoreRed400') : cVar('colorCoreNeutral200')
    }`};
  font: ${cVar('typographyDesktopT200')} !important;
  letter-spacing: ${cVar('typographyDesktopT200LetterSpacing')} !important;
  text-transform: ${cVar('typographyDesktopT200TextTransform')} !important;
  min-height: ${sizes(10)};
  ${({ size }) => {
    switch (size) {
      case 'regular':
        return css`
          padding: ${sizes(3)} ${sizes(4)} !important;
        `
      case 'small':
        return css`
          padding: 0 ${sizes(4)} !important;
        `
    }
  }}

  .chevron-bottom {
    transition: all ${transitions.timings.regular} ${transitions.easing};
    transform: rotate(${({ isOpen }) => (isOpen ? 180 : 0)}deg);
    color: ${({ isOpen }) => (isOpen ? cVar('colorCoreBlue400') : 'inherit')};
    margin-left: auto;
  }
`

type SelectMenuProps = {
  isOpen?: boolean
}

export const SelectMenu = styled.ul<SelectMenuProps>`
  width: 100%;
  max-height: 300px;
  position: absolute;
  overflow-y: auto;
  z-index: ${zIndex.globalOverlay};
  padding: 0;
  margin-top: ${({ isOpen }) => (isOpen ? sizes(1) : 0)};
  background-color: ${cVar('colorCoreNeutral700')};
  color: ${cVar('colorCoreBaseWhite')};
  list-style: none;
`
type SelectOptionProps = {
  isSelected?: boolean
}

export const SelectOption = styled.li<SelectOptionProps>`
  display: flex;
  align-items: center;
  margin: 0;
  cursor: pointer;
  padding: ${sizes(2.5)};
  font: ${cVar('typographyDesktopT200')};
  letter-spacing: ${cVar('typographyDesktopT200LetterSpacing')};
  text-transform: ${cVar('typographyDesktopT200TextTransform')};
  background-color: ${({ isSelected }) => (isSelected ? cVar('colorCoreNeutral600') : 'none')};

  :hover {
    background-color: ${cVar('colorCoreNeutral600')};
  }

  *:first-of-type {
    margin-right: ${sizes(2)};
  }
`

export const StyledSvgGlyphInfo = styled(SvgAlertsInformative24)`
  opacity: 0.5;

  &:hover {
    opacity: 1;
  }
`
export const StyledPill = styled(Pill)`
  margin-left: ${sizes(3)};
`

export const NodeContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  z-index: 2;
  top: 0;
  bottom: 0;
`

export const ValueContainer = styled.span<{ hasIconLeft: boolean }>`
  /* padding + icon width */
  padding-left: ${({ hasIconLeft }) => (hasIconLeft ? sizes(2, true) + 24 : 0)}px;
`
