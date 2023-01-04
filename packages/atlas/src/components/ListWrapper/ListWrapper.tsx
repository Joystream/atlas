import { ReactNode } from 'react'

import { Wrapper } from './ListWrapper.styles'

type ListWrapperProps = {
  children: ReactNode | ReactNode[]
  columns: string[]
}

export const ListWrapper = ({ children, columns }: ListWrapperProps) => {
  return <Wrapper columns={columns}>{children}</Wrapper>
}
