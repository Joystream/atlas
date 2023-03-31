import { FC, ReactNode } from 'react'

import { Avatar, AvatarProps } from '@/components/Avatar'
import { IconWrapper, IconWrapperProps } from '@/components/IconWrapper'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { HeaderTitle, HeaderTitleWrapper } from './SectionTitle.styles'

type TitleNodeStart =
  | {
      type: 'icon'
      iconWrapperProps: IconWrapperProps
    }
  | {
      type: 'avatar'
      avatarProps: AvatarProps
    }
  | {
      type: 'custom'
      node: ReactNode
    }

type SectionTitleComponentProps = {
  nodeStart?: TitleNodeStart
  title: string
}

export const SectionTitleComponent: FC<SectionTitleComponentProps> = ({ nodeStart, title }) => {
  const smMatch = useMediaMatch('sm')

  const renderNodeStart = () => {
    if (nodeStart?.type === 'avatar') {
      return <Avatar {...nodeStart.avatarProps} size={smMatch ? 'default' : 'bid'} />
    }
    if (nodeStart?.type === 'icon') {
      return <IconWrapper {...nodeStart?.iconWrapperProps} size="medium" />
    }
    if (nodeStart?.type === 'custom') {
      return <>{nodeStart.node}</>
    }
  }

  return (
    <HeaderTitleWrapper>
      {nodeStart && renderNodeStart()}
      <HeaderTitle variant={smMatch ? 'h500' : 'h400'} as="h3">
        {title}
      </HeaderTitle>
    </HeaderTitleWrapper>
  )
}
