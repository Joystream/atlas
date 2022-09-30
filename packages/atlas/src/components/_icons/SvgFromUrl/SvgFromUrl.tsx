import axios from 'axios'
import parse, { Element, HTMLReactParserOptions } from 'html-react-parser'
import { FC, useEffect, useState } from 'react'

type SvgIconProps = {
  path?: string
  className?: string
}

export const SvgFromUrl: FC<SvgIconProps> = ({ path, className }) => {
  const [svg, setSvg] = useState<string>()
  useEffect(() => {
    if (!path) {
      return
    }
    const init = async () => {
      const { data } = await axios.get(path)
      setSvg(data)
    }

    init()
  }, [path])

  const parserOptions: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.attribs && className) {
        domNode.attribs.class = className
      }
      return domNode
    },
  }

  if (!svg) {
    return null
  }

  return <>{parse(svg, parserOptions)}</>
}
