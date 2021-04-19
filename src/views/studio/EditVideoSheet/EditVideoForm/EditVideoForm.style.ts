import styled from '@emotion/styled'
import { media, sizes } from '@/shared/theme'
import { HeaderTextField } from '@/shared/components'

export const StyledRadioContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  > * + * {
    margin-top: ${sizes(2)};
  }
`

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;

  padding: ${sizes(4)};
  margin-top: ${sizes(8)};
  ${media.medium} {
    padding: ${sizes(4)};
    margin-top: 0;
    overflow-y: auto;
  }
`

export const StyledHeaderTextField = styled(HeaderTextField)`
  margin-bottom: ${sizes(4)};
`
