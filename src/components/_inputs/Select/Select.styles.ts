import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { SvgGlyphInfo } from '@/components/_icons'
import { oldColors, oldTypography, sizes, transitions } from '@/styles'

import { SelectSizes } from '.'
import { LabelText } from '../InputBase'

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
type SelectButtonProps = {
  isOpen?: boolean
  filled?: boolean
  error?: boolean
  disabled?: boolean
  size?: SelectSizes
}

export const SelectLabel = styled.label`
  flex-shrink: 0;
`
type StyledLabelTextProps = {
  labelPosition?: 'top' | 'left'
}
export const StyledLabelText = styled(LabelText)<StyledLabelTextProps>`
  margin-bottom: ${({ labelPosition }) => (labelPosition === 'top' ? sizes(2) : 0)};
  margin-right: ${({ labelPosition }) => (labelPosition === 'left' ? sizes(2) : 0)};
`

export const SelectMenuWrapper = styled.div`
  position: relative;
  width: 100%;
`

export const SelectButton = styled.button<SelectButtonProps>`
  cursor: pointer;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  background: none;
  color: ${({ filled }) => (filled ? oldColors.gray[50] : oldColors.gray[300])};
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: ${({ isOpen, error, disabled }) =>
    `1px solid ${
      isOpen ? oldColors.blue[500] : error && !disabled ? oldColors.secondary.alert[100] : oldColors.gray[200]
    }`};

  ${({ size }) => {
    switch (size) {
      case 'regular':
        return css`
          min-height: ${sizes(10)};
        `
      case 'small':
        return css`
          min-height: ${sizes(10)};
          padding: 0 ${sizes(4)} !important;
          font-size: ${oldTypography.sizes.body2} !important;
          line-height: ${oldTypography.lineHeights.body2} !important;
        `
    }
  }}

  svg {
    transition: all ${transitions.timings.regular} ${transitions.easing};
    transform: rotate(${({ isOpen }) => (isOpen ? 180 : 0)}deg);
    color: ${({ isOpen }) => (isOpen ? oldColors.blue[400] : 'inherit')};
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
  z-index: 1;
  padding: 0;
  margin-top: ${({ isOpen }) => (isOpen ? sizes(1) : 0)};
  background-color: ${oldColors.gray[700]};
  color: ${oldColors.white};
  list-style: none;
`
type SelectOptionProps = {
  isSelected?: boolean
}

export const SelectOption = styled.li<SelectOptionProps>`
  display: flex;
  margin: 0;
  cursor: pointer;
  padding: ${sizes(3)} ${sizes(3)};
  font-size: ${oldTypography.sizes.subtitle2};
  background-color: ${({ isSelected }) => (isSelected ? oldColors.gray[600] : 'none')};

  :hover {
    background-color: ${oldColors.gray[600]};
  }

  *:first-of-type {
    margin-right: ${sizes(2)};
  }
`

export const StyledSvgGlyphInfo = styled(SvgGlyphInfo)`
  opacity: 0.5;

  &:hover {
    opacity: 1;
  }
`
