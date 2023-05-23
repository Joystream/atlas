import { Global, SerializedStyles, css } from '@emotion/react'
import { FC } from 'react'

import { cVar, variables } from './generated/variables'
import { media } from './media'
import { normalize } from './normalize'
import { sizes } from './sizes'
import { transitionStyles } from './transitions'

export const SCROLLBAR_WIDTH = 8

const scrollbarBackgroundColor = cVar('colorCoreNeutral800Lighten')
const scrollbarThumbColor = cVar('colorCoreNeutral700Lighten')

const globalStyles = css`
  ${normalize};
  ${variables};

  html,
  body,
  #root {
    height: 100%;
  }

  *,
  *::after,
  *::before {
    scrollbar-width: thin;
    box-sizing: border-box;
  }

  *::-webkit-scrollbar {
    width: ${SCROLLBAR_WIDTH}px;
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
    font-family: ${cVar('typographyFontsSecondary')};
    background: ${cVar('colorCoreBaseBlack')};
    color: ${cVar('colorCoreNeutral50')};
    overflow-x: hidden;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: ${cVar('typographyFontsPrimary')};
    color: ${cVar('colorCoreBaseWhite')};
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

  /* global easing settings for aos library */

  [data-aos] {
    &[data-aos][data-aos-easing='atlas-easing'] {
      transition-timing-function: cubic-bezier(0.09, 0.43, 0.3, 0.99);
    }
  }

  [data-popper-escaped='true'],
  [data-popper-reference-hidden='true'] {
    visibility: hidden;
    pointer-events: none;
  }
`

type GlobalStyleProps = {
  additionalStyles?: SerializedStyles[] | SerializedStyles
}

export const GlobalStyles: FC<GlobalStyleProps> = ({ additionalStyles }) => {
  const additionalStylesArray = additionalStyles
    ? Array.isArray(additionalStyles)
      ? additionalStyles
      : [additionalStyles]
    : []
  return <Global styles={[globalStyles, transitionStyles, ...additionalStylesArray]} />
}
