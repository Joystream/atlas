import styled from '@emotion/styled'

import { Table } from '@/components/Table'
import { cVar, sizes } from '@/styles'

export const StyledTable = styled(Table)`
  th:nth-child(n + 3) {
    justify-content: end;
  }

  td:nth-child(n + 3) {
    align-items: end;

    > div {
      align-items: end;
    }
  }
`

export const Badge = styled.div`
  background-color: ${cVar('colorBackgroundStrong')};
  border-radius: ${sizes(0.5)};
  padding: ${sizes(1)} ${sizes(1.5)};
  display: flex;
  align-items: center;
  gap: ${sizes(1)};
`

export const MemberRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${sizes(2.5)};
`
