import { css } from '@emotion/react'

import { cVar } from '@/styles'

export const MarkdownGlobalStyles = css`
  color: ${cVar('colorCoreNeutral50')};

  .markdown-preview h1 {
    font: ${cVar('typographyDesktopH400')};
  }

  .markdown-preview h2 {
    font: ${cVar('typographyDesktopH300')};
  }

  .markdown-preview h3 {
    font: ${cVar('typographyDesktopH100')};
  }

  .markdown-preview p,
  li {
    font: ${cVar('typographyDesktopT300')};
    color: ${cVar('colorCoreNeutral200')};
  }

  .markdown-preview a {
    font: ${cVar('typographyDesktopT300')};
    color: ${cVar('colorTextPrimary')}!important;
    text-decoration: underline !important;
  }

  .markdown-preview hr {
    border: 1px solid ${cVar('colorCoreNeutral600')};
  }
`
