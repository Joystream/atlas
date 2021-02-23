import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Icon from '../Icon'
import { colors, typography } from '../../theme'

export type ButtonStyleProps = {
  variant?: 'primary' | 'secondary' | 'tertiary'
  full?: boolean
  size?: 'large' | 'medium' | 'small'
  disabled?: boolean
  hasText?: boolean
  clickable?: boolean
}

export type IconStyleProps = {
  disabled?: boolean
  size?: 'large' | 'medium' | 'small'
}

const colorsFromProps = ({ variant }: ButtonStyleProps) => {
  let styles
  switch (variant) {
    case 'tertiary': {
      styles = css`
        background-color: transparent;
        border-color: transparent;
        color: ${colors.white};
        &:hover {
          background-color: ${colors.gray[900]};
        }
        &:active {
          background-color: transparent;
        }
      `
      break
    }
    case 'secondary': {
      styles = css`
        color: ${colors.white};
        background-color: ${colors.black};
        border-color: ${colors.gray[500]};
        &:hover {
          border-color: ${colors.white};
        }
        &:active {
          background-color: ${colors.blue[700]};
          border-color: ${colors.white};
        }
      `
      break
    }
    case 'primary':
    default: {
      styles = css`
        color: ${colors.white};
        background-color: ${colors.blue[500]};
        border-color: ${colors.blue[500]};
        &:hover {
          background-color: ${colors.blue[700]};
          border-color: ${colors.blue[700]};
          color: ${colors.white};
        }
        &:active {
          background-color: ${colors.blue[900]};
          border-color: ${colors.blue[900]};
          color: ${colors.white};
        }
      `
      break
    }
  }
  return styles
}

const sizeFromProps = ({ size = 'medium', full, hasText }: ButtonStyleProps) => {
  let padding, fontSize
  switch (size) {
    case 'small': {
      padding = '8px 12px'
      fontSize = typography.sizes.button.small
      break
    }
    case 'medium': {
      padding = hasText ? `12px 16px` : '12px'
      fontSize = typography.sizes.button.medium
      break
    }
    case 'large':
    default: {
      padding = hasText ? `14px 20px` : '14px'
      fontSize = typography.sizes.button.large
      break
    }
  }
  return css`
    width: ${full ? '100%' : ''};
    display: ${full ? 'flex' : 'inline-flex'};
    font-size: ${fontSize};
    padding: ${padding};
  `
}

const disabled = ({ disabled }: ButtonStyleProps) =>
  disabled
    ? css`
        filter: brightness(50%);
        pointer-events: none;
      `
    : null

export const StyledIcon = styled(Icon)<IconStyleProps>`
  display: block;
  flex-shrink: 0;
  position: relative;
  top: 0.1em;
  width: ${({ size }) => (size === 'large' ? '24px' : '14px')};
  height: ${({ size }) => (size === 'large' ? '24px' : '14px')};
  & + * {
    margin-left: 10px;
  }
  filter: ${(props) => (props.disabled ? 'brightness(0.7)' : null)};
`
export const StyledButton = styled.button<ButtonStyleProps>`
  border-width: 1px;
  border-style: solid;
  font-family: ${typography.fonts.headers};
  font-weight: ${typography.weights.bold};
  display: inline-flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: ${(props) => (!props.disabled && props.clickable ? 'pointer' : '')};
  }

  ${colorsFromProps};
  ${sizeFromProps};
  ${disabled};
`
