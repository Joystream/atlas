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
  hasText?: boolean
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

const disabled = ({ disabled, variant }: ButtonStyleProps) => {
  let bgColor, color, borderColor, opacity
  switch (variant) {
    case 'tertiary': {
      bgColor = colors.black
      color = colors.white
      borderColor = colors.transparent
      opacity = 0.32
      break
    }
    case 'secondary': {
      bgColor = colors.black
      color = colors.white
      borderColor = colors.white
      opacity = 0.32
      break
    }
    case 'primary':
    default: {
      bgColor = colors.blue[500]
      color = colors.white
      borderColor = colors.blue[500]
      opacity = 0.4
      break
    }
  }
  return disabled
    ? css`
        box-shadow: none;
        color: ${color};
        background-color: ${bgColor};
        border-color: ${borderColor};
        opacity: ${opacity};
        &:hover {
          color: ${color};
          background-color: ${bgColor};
          border-color: ${borderColor};
          opacity: ${opacity};
        }
        &:active {
          color: ${color};
          background-color: ${bgColor};
          border-color: ${borderColor};
          opacity: ${opacity};
        }
      `
    : null
}
const iconSizeFromProps = ({ size: sizeProp = 'medium', hasText }: IconStyleProps) => {
  let size
  if (!hasText) {
    size = 'auto'
  } else {
    switch (sizeProp) {
      case 'small': {
        size = 'var(--small-icon)'
        break
      }
      case 'medium': {
        size = 'var(--medium-icon)'
        break
      }
      case 'large':
      default: {
        size = 'var(--large-icon)'
        break
      }
    }
  }
  return css`
    width: ${size};
    height: ${size};
  `
}

export const StyledIcon = styled(Icon)<IconStyleProps>`
  display: block;
  flex-shrink: 0;
  ${iconSizeFromProps}
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
