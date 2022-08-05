import { FC } from 'react'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgActionMore } from '@/components/_icons'

import { StyledSvgActionCheck, SubtitleBoxWrapper, SubtitleDetails, SubtitlesFileName } from './SubtitleBox.styles'

export type SubtitleBoxProps = {
  className?: string
  language: string
  subtitles?: string
}

export const SubtitleBox: FC<SubtitleBoxProps> = ({ className, language, subtitles }) => {
  return (
    <SubtitleBoxWrapper className={className}>
      <SubtitleDetails>
        <Text variant="t100-strong" as="p">
          {language}
        </Text>
        <SubtitlesFileName variant="t100" as="p" color="colorText">
          {subtitles ? subtitles : 'Add subtitles file'}
        </SubtitlesFileName>
        {subtitles ? <StyledSvgActionCheck /> : null}
      </SubtitleDetails>
      <Button size="small" variant={subtitles ? 'secondary' : 'primary'}>
        Select file
      </Button>
      <Button icon={<SvgActionMore />} variant="tertiary" size="small" />
    </SubtitleBoxWrapper>
  )
}
