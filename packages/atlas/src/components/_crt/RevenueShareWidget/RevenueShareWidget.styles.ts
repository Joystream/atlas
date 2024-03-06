import styled from '@emotion/styled'

import { FlexBox } from '@/components/FlexBox'
import { cVar, media, sizes } from '@/styles'

export const Wrapper = styled(FlexBox)<{ isActive: boolean }>`
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  background-color: ${(props) => cVar(props.isActive ? 'colorBackgroundAlpha' : 'colorBackgroundMuted')};
  box-shadow: ${(props) => (props.isActive ? `-4px 0 0 0 ${cVar('colorBorderPrimary')}` : 'none')};
  gap: ${sizes(4)};
  padding: ${sizes(6)};
  ${media.sm} {
    grid-template-columns: 5fr minmax(150px, 1fr);
  }
`

export const InfoBox = styled.div`
  width: 100%;
  display: grid;
  gap: ${sizes(4)};

  ${media.sm} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.md} {
    grid-template-columns: repeat(4, 1fr);
  }
`
