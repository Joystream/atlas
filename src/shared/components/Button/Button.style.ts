import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { colors, sizes, typography } from '../../theme'
import Icon from '../Icon'
import isPropValid from '@emotion/is-prop-valid'

export type ButtonSize = 'large' | 'medium' | 'small'

export type ButtonStyleProps = {
  variant?: 'primary' | 'secondary' | 'tertiary'
  size?: ButtonSize
  disabled?: boolean
  full?: boolean
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
        border-radius: ${circleRadius};
        &:hover {
          background-color: ${colors.gray[800]};
        }
        &:active {
          background-color: ${colors.gray[900]};
        }
      `
      break
    }
    case 'secondary': {
      styles = css`
        background-color: transparent;
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
        background-color: ${colors.blue[500]};
        border-color: ${colors.blue[500]};
        &:hover {
          background-color: ${colors.blue[700]};
          border-color: ${colors.blue[700]};
        }
        &:active {
          background-color: ${colors.blue[900]};
          border-color: ${colors.blue[900]};
        }
      `
      break
    }
  }
  return styles
}

const sizeFromProps = ({ size = 'medium', full, hasText }: ButtonStyleProps) => {
  let padding, buttonSizeWithoutText
  switch (size) {
    case 'small': {
      padding = hasText ? 'var(--vertical-padding-small) var(--horizontal-padding-small)' : '0'
      buttonSizeWithoutText = '32px'
      break
    }
    case 'medium': {
      padding = hasText ? `var(--vertical-padding-medium) var(--horizontal-padding-medium)` : '0'
      buttonSizeWithoutText = '40px'
      break
    }
    case 'large':
    default: {
      padding = hasText ? `var(--vertical-padding-large) var(--horizontal-padding-large)` : '0'
      buttonSizeWithoutText = '48px'
      break
    }
  }
  return css`
    min-width: ${hasText && '100px'};
    width: ${!hasText ? buttonSizeWithoutText : full ? '100%' : ''};
    height: ${!hasText && buttonSizeWithoutText};
    display: ${full ? 'flex' : 'inline-flex'};
    padding: ${padding};
  `
}

const disabled = ({ disabled, variant }: ButtonStyleProps) => {
  let bgColor, borderColor, opacity
  switch (variant) {
    case 'tertiary': {
      bgColor = colors.black
      borderColor = colors.transparent
      opacity = 0.32
      break
    }
    case 'secondary': {
      bgColor = colors.black
      borderColor = colors.white
      opacity = 0.32
      break
    }
    case 'primary':
    default: {
      bgColor = colors.blue[500]
      borderColor = colors.blue[500]
      opacity = 0.4
      break
    }
  }
  return disabled
    ? css`
        box-shadow: none;
        background-color: ${bgColor};
        border-color: ${borderColor};
        opacity: ${opacity};
        &:hover {
          background-color: ${bgColor};
          border-color: ${borderColor};
          opacity: ${opacity};
        }
        &:active {
          background-color: ${bgColor};
          border-color: ${borderColor};
          opacity: ${opacity};
        }
      `
    : null
}

export const StyledIcon = styled(Icon, { shouldForwardProp: isPropValid })<IconStyleProps>`
  display: block;
  flex-shrink: 0;
  width: ${typography.sizes.icon.small};
  height: ${typography.sizes.icon.small};

  margin: calc(-1 * var(--vertical-padding-small)) 0;
  margin-right: ${({ hasText }) => hasText && sizes(2)};

  filter: ${(props) => (props.disabled ? 'brightness(0.7)' : null)};
`
// shouldForwardProp fixes unknown prop warning https://reactjs.org/warnings/unknown-prop.html
export const StyledButton = styled('button', { shouldForwardProp: isPropValid })<ButtonStyleProps>`
  --vertical-padding-small: 9px;
  --vertical-padding-medium: 12px;
  --vertical-padding-large: 15px;

  --horizontal-padding-small: 12px;
  --horizontal-padding-medium: 16px;
  --horizontal-padding-large: 20px;

  border-width: 1px;
  color: ${colors.gray[50]};
  text-decoration: none;
  border-style: solid;
  display: inline-flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: ${(props) => (!props.disabled && props.clickable ? 'pointer' : '')};
  }

  ${colorsFromProps};
  ${sizeFromProps};
  ${disabled};
`
