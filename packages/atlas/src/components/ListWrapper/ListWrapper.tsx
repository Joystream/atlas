import { FC, ReactNode } from 'react'

import { Wrapper } from './ListWrapper.styles'

type ListWrapperProps = {
  children: ReactNode | ReactNode[]
  columns: string[]
}

export const ListWrapper: FC<ListWrapperProps> = ({ children, columns }) => {
  return <Wrapper columns={columns}>{children}</Wrapper>
}
