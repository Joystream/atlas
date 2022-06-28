import styled from '@emotion/styled'

import { Banner } from '@/components/Banner'
import { ListItem } from '@/components/ListItem'
import { sizes } from '@/styles'

export const ListItemsWrapper = styled.div`
  margin: 0 calc(-1 * var(--local-size-dialog-padding));
`

export const StyledListItem = styled(ListItem)`
  padding-left: var(--local-size-dialog-padding);
  padding-right: var(--local-size-dialog-padding);
`

export const WalletLogo = styled.img`
  width: 24px;
  height: 24px;
`

export const StyledTopBanner = styled(Banner)`
  margin-bottom: ${sizes(6)};
`

export const StyledBottomBanner = styled(Banner)`
  margin-top: ${sizes(6)};
`

export const StyledForm = styled.form`
  display: grid;
  grid-template-rows: auto auto;
  gap: ${sizes(6)};
`
