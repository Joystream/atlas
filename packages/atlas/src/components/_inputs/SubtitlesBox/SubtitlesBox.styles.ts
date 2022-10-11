import styled from '@emotion/styled'

import { SvgActionCheck } from '@/assets/icons'
import { Text } from '@/components/Text'
import { cVar, media, sizes } from '@/styles'

export const SubtitleBoxWrapper = styled.div`
  width: 100%;
  background: ${cVar('colorBackgroundMutedAlpha')};
  padding: ${sizes(2)};
  gap: ${sizes(2)};
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
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

export const InvisibleInput = styled.input`
  display: none;
`

export const StyledSvgActionCheck = styled(SvgActionCheck)`
  path {
    fill: ${cVar('colorTextSuccess')};
  }
`

export const LoaderWrapper = styled.div`
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`
