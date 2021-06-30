import { Global, SerializedStyles, css } from '@emotion/react'
import emotionNormalize from 'emotion-normalize'
import React from 'react'

import { transitionStyles } from './transitionStyles'

import { colors, media, sizes, typography } from '../../theme'

const globalStyles = css`
  ${emotionNormalize};

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
    background: var(--scrollbarBG);
  }

  *::-webkit-scrollbar-thumb {
    background-color: var(--thumbBG);
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
    --scrollbarBG: ${colors.transparentPrimary[10]};
    --thumbBG: ${colors.transparentPrimary[18]};
    --global-horizontal-padding: ${sizes(4)};
    --sidenav-collapsed-width: 0;

    ${media.medium} {
      --global-horizontal-padding: ${sizes(8)};
      --sidenav-collapsed-width: 72px;
    }

    scrollbar-width: thin;
    scrollbar-color: var(--thumbBG) var(--scrollbarBG);
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
