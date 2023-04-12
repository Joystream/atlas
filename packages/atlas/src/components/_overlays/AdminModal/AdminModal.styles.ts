import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { sizes } from '@/styles'

export const HorizontalSpacedContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  > * + * {
    margin-left: ${sizes(4)};
  }
`

export const VerticalSpacedContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${sizes(4)};

  > * + * {
    margin-top: ${sizes(4)};
  }
`

export const CustomNodeUrlWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  > * + * {
    margin-left: ${sizes(4)};
  }
`

export const VersionText = styled(Text)`
  padding-top: ${sizes(4)};
`
