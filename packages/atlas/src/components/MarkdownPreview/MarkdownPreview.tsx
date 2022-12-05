import { Global } from '@emotion/react'
import { FC } from 'react'
import ReactMarkdown from 'react-markdown'

import { MarkdownGlobalStyles } from '@/components/MarkdownPreview/MarkdownPreview.styles'

type MarkdownPreviewProps = {
  markdown: string
}

export const MarkdownPreview: FC<MarkdownPreviewProps> = ({ markdown }) => {
  return (
    <>
      <ReactMarkdown className="markdown-preview">{markdown}</ReactMarkdown>
      <Global styles={MarkdownGlobalStyles} />
    </>
  )
}
