import { Global, SerializedStyles, css } from '@emotion/react'
import emotionNormalize from 'emotion-normalize'
import React from 'react'

import { oldColors } from './deprecated/colors'
import { oldTypography } from './deprecated/typography'
import { variables } from './generated/variables'
import { media } from './media'
import { sizes } from './sizes'
import { transitionStyles } from './transitions'

const scrollbarBackgroundColor = oldColors.transparentPrimary[10]
const scrollbarThumbColor = oldColors.transparentPrimary[18]

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
    font-family: ${oldTypography.fonts.base};
    background: ${oldColors.black};
    color: ${oldColors.gray[50]};
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: ${oldTypography.fonts.headers};
    color: ${oldColors.white};
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

export const GlobalStyles: React.FC<GlobalStyleProps> = ({ additionalStyles }) => {
  const additionalStylesArray = additionalStyles
    ? Array.isArray(additionalStyles)
      ? additionalStyles
      : [additionalStyles]
    : []
  return <Global styles={[globalStyles, transitionStyles, ...additionalStylesArray]} />
}
