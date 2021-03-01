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

const colorsFromProps = ({ variant, hasText }: ButtonStyleProps) => {
  let styles
  switch (variant) {
    case 'tertiary': {
      const circleRadius = hasText ? '0' : '100%'
      styles = css`
        background-color: transparent;
        border-color: transparent;
        color: ${colors.white};
        &:hover {
          background-color: ${colors.gray[800]};
          border-radius: ${circleRadius};
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
  let padding, fontSize, buttonSizeWithoutText
  switch (size) {
    case 'small': {
      padding = '9.5px 12px'
      fontSize = typography.sizes.button.small
      buttonSizeWithoutText = '32px'
      break
    }
    case 'medium': {
      padding = hasText ? `12px 16px` : '12px'
      fontSize = typography.sizes.button.medium
      buttonSizeWithoutText = '40px'
      break
    }
    case 'large':
    default: {
      padding = hasText ? `15px 20px` : '14px'
      fontSize = typography.sizes.button.large
      buttonSizeWithoutText = '48px'
      break
    }
  }
  return css`
    width: ${!hasText ? buttonSizeWithoutText : full ? '100%' : ''};
    height: ${!hasText ? buttonSizeWithoutText : 'auto'};
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
  let size, margin
  if (!hasText) {
    size = 'auto'
  } else {
    switch (sizeProp) {
      case 'small': {
        size = typography.sizes.icon.small
        margin = '-8px 0'
        break
      }
      case 'medium': {
        size = typography.sizes.icon.medium
        margin = '-12px 0'
        break
      }
      case 'large':
      default: {
        size = typography.sizes.icon.large
        margin = '-14px 0'
        break
      }
    }
  }
  return css`
    width: ${size};
    height: ${size};
    margin: ${margin};
  `
}

export const StyledIcon = styled(Icon)<IconStyleProps>`
  display: block;
  flex-shrink: 0;
  & + * {
    margin-left: 10px;
  }
  filter: ${(props) => (props.disabled ? 'brightness(0.7)' : null)};
  ${iconSizeFromProps}
`
export const StyledButton = styled.button<ButtonStyleProps>`
  border-width: 1px;
  border-style: solid;
  font-family: ${typography.fonts.headers};
  font-weight: ${typography.weights.medium};
  line-height: 1;
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
