import { css, Global, SerializedStyles } from '@emotion/core'
import emotionNormalize from 'emotion-normalize'
import { breakpoints, colors, sizes, typography } from '../../theme'
import React from 'react'

const globalStyles = css`
  ${emotionNormalize};

  body {
    font-family: ${typography.fonts.base};
    background: ${colors.black};
    color: ${colors.gray[500]};
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

  :root {
    --global-horizontal-padding: ${sizes(4)};
  }
  @media screen and (min-width: ${breakpoints.medium}) {
    :root {
      --global-horizontal-padding: ${sizes(8)};
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
  return <Global styles={[globalStyles, ...additionalStylesArray]} />
}

export default GlobalStyle
