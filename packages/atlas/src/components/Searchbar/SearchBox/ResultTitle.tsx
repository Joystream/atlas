import { FC, Fragment } from 'react'

import { SPECIAL_CHARACTERS } from '@/config/regex'

import { HighlightedWord } from './SearchBox.styles'

type ResultTitleProps = {
  title?: string | null
  query?: string
}

export const ResultTitle: FC<ResultTitleProps> = ({ title, query }) => {
  if (!title) {
    return null
  }
  if (!query) {
    return <>{title}</>
  }

  const filteredQuery = query.replace(SPECIAL_CHARACTERS, '\\$&').replace(/\s+/g, '|')
  const regex = new RegExp(`${filteredQuery}(?=$|\\s)`, 'ig')
  const groups = title?.split(/\s+/)
  const match = title.match(regex)

  if (!match || !match.length) {
    return <>{title}</>
  }

  return (
    <>
      {groups.map((word, idx) => {
        if (match.includes(word)) {
          return <HighlightedWord key={`${word}-${idx}`}>{word} </HighlightedWord>
        }
        return <Fragment key={`${word}-${idx}`}>{word} </Fragment>
      })}
    </>
  )
}
