import { css, Global, SerializedStyles } from '@emotion/react'
import emotionNormalize from 'emotion-normalize'
import React from 'react'
import { media, colors, sizes, typography } from '../../theme'
import { transitionStyles } from './transitionStyles'

const globalStyles = css`
  ${emotionNormalize};

  body {
    font-family: ${typography.fonts.base};
    background: ${colors.black};
    color: ${colors.gray[50]};
  }

  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }

  *:focus {
    outline: 0;
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
    --global-horizontal-padding: ${sizes(4)};
    --sidenav-collapsed-width: 0;

    ${media.medium} {
      --global-horizontal-padding: ${sizes(8)};
      --sidenav-collapsed-width: 72px;
    }
  }
`

type GlobalStyleProps = {
  additionalStyles?: SerializedStyles[] | SerializedStyles
}

const GlobalStyle: React.FC<GlobalStyleProps> = ({ additionalStyles }) => {
  const additionalStylesArray = additionalStyles
    ? Array.isArray(additionalStyles)
      ? additionalStyles
      : [additionalStyles]
    : []
  return <Global styles={[globalStyles, transitionStyles, ...additionalStylesArray]} />
}

export default GlobalStyle
