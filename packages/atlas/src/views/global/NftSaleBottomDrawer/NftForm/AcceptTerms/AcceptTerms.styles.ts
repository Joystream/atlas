import styled from '@emotion/styled'

import { Information } from '@/components/Information'
import { MemberBadge } from '@/components/MemberBadge'
import { Text } from '@/components/Text'
import { cVar, media, sizes } from '@/styles'

export const Row = styled.div`
  margin-top: ${sizes(4)};

  ${media.md} {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`

export const Title = styled.div`
  display: flex;
  align-items: center;
`

export const Description = styled.div`
  display: flex;
`

export const WhiteListRow = styled(Row)`
  ${media.md} {
    align-items: flex-start;
    margin-bottom: -${sizes(2)};
  }
`

export const MembersList = styled.div`
  display: flex;
  flex-basis: 70%;
  flex-wrap: wrap;
  margin-top: ${sizes(2)};
  ${media.md} {
    margin-top: 0;
    justify-content: flex-end;
  }
`

export const StyledMemberBadge = styled(MemberBadge)`
  justify-content: flex-end;
  margin-bottom: ${sizes(2)};
  margin-right: ${sizes(2)};
  ${media.md} {
    margin-right: 0;
    margin-left: ${sizes(2)};
  }
`

export const Header = styled(Text)`
  margin-bottom: ${sizes(8)};
`

export const Divider = styled.hr`
  height: 1px;
  border: 0;
  box-shadow: ${cVar('effectDividersTop')};
  margin: ${sizes(10)} 0;
`

export const StyledInformation = styled(Information)`
  margin-left: ${sizes(1)};
`
