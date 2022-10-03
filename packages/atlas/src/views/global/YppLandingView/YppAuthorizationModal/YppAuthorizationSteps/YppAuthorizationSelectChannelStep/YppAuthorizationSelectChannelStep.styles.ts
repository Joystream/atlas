import styled from '@emotion/styled'

import { ListItem } from '@/components/ListItem'
import { sizes } from '@/styles'

export const ListItemsWrapper = styled.div`
  margin: 0 calc(-1 * var(--local-size-dialog-padding));
`

export const StyledListItem = styled(ListItem)`
  padding: ${sizes(2)} var(--local-size-dialog-padding);
`
