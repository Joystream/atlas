import { ReactElement, ReactNode } from 'react'

import { SvgActionMember } from '@/assets/icons'
import {
  Description,
  TextContainer,
  Title,
  UnclickableWrapper,
  Wrapper,
} from '@/components/_auth/ProtectedActionWrapper/ProtectedActionWrapper.styles'
import { Button } from '@/components/_buttons/Button'
import { Popover } from '@/components/_overlays/Popover'

type ProtectedActionWrapperProps = {
  title: string
  description: string
  children: ReactNode | ReactNode[]
  className?: string
}

const useAuthUser = () => ({ isLogged: false })
export const ProtectedActionWrapper = ({
  children,
  title,
  description,
  className,
}: ProtectedActionWrapperProps): ReactElement => {
  const { isLogged } = useAuthUser()

  if (!isLogged) {
    return (
      <Popover
        boundariesElement={document.body}
        trigger={<UnclickableWrapper className={className}>{children}</UnclickableWrapper>}
      >
        <Wrapper>
          <TextContainer>
            <Title as="h3" variant="h300">
              {title}
            </Title>
            <Description as="p" variant="t200" color="colorText">
              {description}
            </Description>
          </TextContainer>
          <Button size="small" icon={<SvgActionMember />} variant="primary">
            Log in
          </Button>
        </Wrapper>
      </Popover>
    )
  }

  return <>{children}</>
}
