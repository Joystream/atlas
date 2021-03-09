import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Icon from '../Icon'
import { colors, typography } from '../../theme'
import { LinkProps, Link } from 'react-router-dom'
import React from 'react'

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
          background-color: ${colors.gray[900]};
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
      padding = hasText ? 'var(--vertical-padding-small) var(--horizontal-padding-small)' : '0'
      fontSize = typography.sizes.button.small
      buttonSizeWithoutText = '32px'
      break
    }
    case 'medium': {
      padding = hasText ? `var(--vertical-padding-medium) var(--horizontal-padding-medium)` : '0'
      fontSize = typography.sizes.button.medium
      buttonSizeWithoutText = '40px'
      break
    }
    case 'large':
    default: {
      padding = hasText ? `var(--vertical-padding-large) var(--horizontal-padding-large)` : '0'
      fontSize = typography.sizes.button.large
      buttonSizeWithoutText = '48px'
      break
    }
  }
  return css`
    min-width: ${hasText && '100px'};
    width: ${!hasText ? buttonSizeWithoutText : full ? '100%' : ''};
    height: ${!hasText && buttonSizeWithoutText};
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

export const StyledIcon = styled(Icon)<IconStyleProps>`
  display: block;
  flex-shrink: 0;
  width: ${typography.sizes.icon.small};
  height: ${typography.sizes.icon.small};
  margin: calc(-1 * var(--vertical-padding-small)) 0;
  & + * {
    margin-left: 10px;
  }
  filter: ${(props) => (props.disabled ? 'brightness(0.7)' : null)};
`
const sharedStyles = css`
  --vertical-padding-small: 9px;
  --vertical-padding-medium: 12px;
  --vertical-padding-large: 15px;

  --horizontal-padding-small: 12px;
  --horizontal-padding-medium: 16px;
  --horizontal-padding-large: 20px;

  border-width: 1px;
  border-style: solid;
  font-family: ${typography.fonts.headers};
  font-weight: ${typography.weights.medium};
  line-height: 1;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`

const LinkWithButtonProps = ({
  variant,
  full,
  size,
  disabled,
  hasText,
  clickable,
  ...props
}: ButtonStyleProps & LinkProps) => <Link {...props} />

export const StyledButton = styled.button<ButtonStyleProps>`
  ${sharedStyles}
  &:hover {
    cursor: ${(props) => (!props.disabled && props.clickable ? 'pointer' : '')};
  }

  ${colorsFromProps};
  ${sizeFromProps};
  ${disabled};
`

export const StyledLink = styled(LinkWithButtonProps)`
  ${sharedStyles}
  text-decoration: none;
  &:hover {
    cursor: ${(props) => (!props.disabled && props.clickable ? 'pointer' : '')};
  }

  ${colorsFromProps};
  ${sizeFromProps};
  ${disabled};
`
