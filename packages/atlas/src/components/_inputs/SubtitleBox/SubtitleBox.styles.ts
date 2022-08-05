import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { SvgActionCheck } from '@/components/_icons'
import { cVar, media, sizes } from '@/styles'

export const SubtitleBoxWrapper = styled.div`
  width: 100%;
  background: ${cVar('colorBackgroundMutedAlpha')};
  padding: ${sizes(2)};
  gap: ${sizes(2)};
  display: grid;
  grid-template-columns: 1fr auto auto;
`

export const SubtitlesFileName = styled(Text)`
  display: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${media.xs} {
    display: block;
  }
`

export const SubtitleDetails = styled.div`
  display: grid;
  grid-auto-flow: column;
  padding: ${sizes(2)};
  gap: ${sizes(4)};
  align-items: center;
  justify-content: start;
`

export const StyledSvgActionCheck = styled(SvgActionCheck)`
  path {
    fill: ${cVar('colorTextSuccess')};
  }
`
