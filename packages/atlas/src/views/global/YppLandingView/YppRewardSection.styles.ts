import styled from '@emotion/styled'

import { GridItem } from '@/components/LayoutGrid'
import { Button } from '@/components/_buttons/Button'
import { sizes } from '@/styles'

export const BenefitsCardButton = styled(Button)`
  border-radius: 999px;
`

export const BenefitsCardsButtonsGroup = styled.div`
  text-align: center;
  overflow-x: auto;
  white-space: nowrap;
  margin: ${sizes(16)} 0 ${sizes(8)} 0;

  ::-webkit-scrollbar {
    display: none;
  }

  ${BenefitsCardButton}:not(:last-child) {
    margin-right: ${sizes(2)};
  }
`

export const BenefitsCardsContainerGridItem = styled(GridItem)`
  display: grid;
  gap: ${sizes(4)};
`

export const RewardsSubtitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-top: ${sizes(8)};
`
