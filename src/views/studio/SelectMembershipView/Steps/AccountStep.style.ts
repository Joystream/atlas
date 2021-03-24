import Spinner from '@/shared/components/Spinner/Spinner'
import { sizes } from '@/shared/theme'
import styled from '@emotion/styled'

export const AccountStepImg = styled.img`
  object-fit: cover;
  max-width: 100%;
`

export const StyledSpinner = styled(Spinner)`
  margin-top: ${sizes(8)};
  margin-bottom: ${sizes(5)};
`
export const AccountsWrapper = styled.div`
  width: 100%;
  max-height: 300px;
  padding-right: 24px;
  overflow-y: auto;
  margin-bottom: 30px;
`
