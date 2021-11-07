import { Global, SerializedStyles, css } from '@emotion/react'
import emotionNormalize from 'emotion-normalize'
import React from 'react'

import { variables } from '@/styles'
import { colors, media, sizes, typography } from '@/theme'

import { transitionStyles } from './transitionStyles'

const scrollbarBackgroundColor = colors.transparentPrimary[10]
const scrollbarThumbColor = colors.transparentPrimary[18]

const globalStyles = css`
  ${emotionNormalize};
  ${variables};

  html,
  body,
  #root {
    scroll-behavior: smooth;
    height: 100%;
  }

  *,
  *::after,
  *::before {
    scrollbar-width: thin;
    box-sizing: border-box;
  }

  *::-webkit-scrollbar {
    width: 8px;
  }

  *::-webkit-scrollbar-track {
    background: ${scrollbarBackgroundColor};
  }

  *::-webkit-scrollbar-thumb {
    background-color: ${scrollbarThumbColor};
    border-radius: 20px;
  }

  *:focus {
    outline: 0;
  }

  body {
    font-family: ${typography.fonts.base};
    background: ${colors.black};
    color: ${colors.gray[50]};
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: ${typography.fonts.headers};
    color: ${colors.white};
  }

  svg {
    display: block;
  }

  :root {
    --size-global-horizontal-padding: ${sizes(4)};
    --size-sidenav-width-collapsed: 0;
    --size-topbar-height: 64px;

    ${media.md} {
      --size-global-horizontal-padding: ${sizes(8)};
      --size-sidenav-width-collapsed: 72px;
      --size-topbar-height: 80px;
    }

    scrollbar-width: thin;
    scrollbar-color: ${scrollbarThumbColor} ${scrollbarBackgroundColor};
  }
`

type GlobalStyleProps = {
  additionalStyles?: SerializedStyles[] | SerializedStyles
}

export const GlobalStyle: React.FC<GlobalStyleProps> = ({ additionalStyles }) => {
  const additionalStylesArray = additionalStyles
    ? Array.isArray(additionalStyles)
      ? additionalStyles
      : [additionalStyles]
    : []
  return <Global styles={[globalStyles, transitionStyles, ...additionalStylesArray]} />
}
