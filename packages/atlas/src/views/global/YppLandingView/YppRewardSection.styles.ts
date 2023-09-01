import styled from '@emotion/styled'

import { GridItem } from '@/components/LayoutGrid'
import { Button } from '@/components/_buttons/Button'
import { cVar, media, sizes } from '@/styles'
import { Anchor } from '@/views/global/YppLandingView/YppAuthorizationModal/YppAuthorizationModal.styles'

export const BenefitsCardButton = styled(Button)`
  border-radius: 999px;
`

export const BenefitsCardsButtonsGroup = styled.div`
  text-align: center;
  display: grid;
  overflow-x: auto;
  white-space: nowrap;
  margin: ${sizes(16)} 0 ${sizes(8)} 0;

  ::-webkit-scrollbar {
    display: none;
  }

  ${media.sm} {
    grid-template-columns: repeat(2, 1fr);
    ${BenefitsCardButton}:not(:nth-child(2n)) {
      margin-right: ${sizes(2)};
    }
  }

  ${media.md} {
    grid-template-columns: repeat(3, 1fr);

    ${BenefitsCardButton}:not(:nth-child(3n)) {
      margin-right: ${sizes(2)};
    }
  }

  ${media.lg} {
    grid-template-columns: repeat(auto-fill, 1fr);
    grid-auto-flow: column;
    ${BenefitsCardButton}:not(:last-child) {
      margin-right: ${sizes(2)};
    }
  }
`

export const BenefitsCardsContainerGridItem = styled(GridItem)`
  display: grid;
  gap: ${sizes(2)};
`

export const ColorAnchor = styled(Anchor)`
  color: ${cVar('colorTextPrimary')};
`

export const RewardsSubtitleGridItem = styled(GridItem)`
  display: grid;
  gap: ${sizes(4)};
  margin-top: ${sizes(8)};
`

export const RewardsSubtitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`
