import { FC, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { Options } from 'react-markdown/lib/ast-to-react'

import { MarkdownHr, MarkdownLink } from '@/components/MarkdownPreview/MarkdownPreview.styles'
import { Text } from '@/components/Text'

type MarkdownPreviewProps = {
  markdown: string
}

export const MarkdownPreview: FC<MarkdownPreviewProps> = ({ markdown }) => {
  const components = useMemo(
    (): Options['components'] => ({
      h1: ({ children }) => (
        <Text variant="h500" as="h1" margin={{ bottom: 4 }}>
          {children}
        </Text>
      ),
      h2: ({ children }) => (
        <Text variant="h300" as="h2" margin={{ bottom: 2 }}>
          {children}
        </Text>
      ),
      h3: ({ children }) => (
        <Text variant="h100" as="h3" margin={{ bottom: 2 }}>
          {children}
        </Text>
      ),
      p: ({ children }) => (
        <Text variant="t300" color="colorCoreNeutral200" as="p" margin={{ bottom: 4 }}>
          {children}
        </Text>
      ),
      a: ({ children, href }) => (
        <MarkdownLink href={href} target="_blank">
          {children}
        </MarkdownLink>
      ),
      li: ({ children }) => (
        <li>
          <Text variant="t300" color="colorCoreNeutral200" as="p" margin={{ bottom: 1 }}>
            {children}
          </Text>
        </li>
      ),
      hr: () => <MarkdownHr />,
    }),
    []
  )

  return <ReactMarkdown components={components}>{markdown}</ReactMarkdown>
}
