import styled from '@emotion/styled'

import { media, sizes } from '@/shared/theme'

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;

  > * + * {
    margin-top: ${sizes(2)};
  }

  ${media.small} {
    flex-direction: row-reverse;
    margin-left: auto;

    > * + * {
      margin-top: 0;
      margin-right: ${sizes(2)};
    }

    * + & {
      margin-top: 0;
    }
  }
`

export const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: ${sizes(6)};

  ${media.small} {
    flex-direction: row;
    align-items: center;
  }
`

export const AdditionalActionsContainer = styled.div`
  width: 100%;
  margin-bottom: ${sizes(6)};

  ${media.small} {
    margin-bottom: 0;
    margin-right: ${sizes(6)};
  }
`
