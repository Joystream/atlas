import { FC, ReactNode, useState } from 'react'

import { SvgActionClose, SvgActionSearch } from '@/assets/icons'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  SearchInput,
  SectionHeaderWrapper,
  SectionSearchWrapper,
  SectionTitle,
  TabsWrapper,
} from './SectionHeader.styles'

import { AvatarProps } from '../Avatar'
import { Tabs, TabsProps } from '../Tabs'
import { Button } from '../_buttons/Button'
import { ToggleButtonGroup } from '../_inputs/ToggleButtonGroup'

type TitleNodeStart =
  | {
      type: 'icon'
      icon: ReactNode
    }
  | {
      type: 'avatar'
      avatarProps: AvatarProps
    }
  | {
      type: 'custom'
      node: ReactNode
    }

type SectionHeaderStart =
  | {
      type: 'title'
      title: string
      nodeStart?: TitleNodeStart
    }
  | {
      type: 'tabs'
      tabsProps: TabsProps
    }

export type SectionHeaderProps = {
  start: SectionHeaderStart
}

export const SectionHeader: FC<SectionHeaderProps> = ({ start }) => {
  const [isSearchInputOpen, setIsSearchInputOpen] = useState(false)
  const smMatch = useMediaMatch('sm')
  return (
    <SectionHeaderWrapper underline={start.type === 'tabs'}>
      {start.type === 'title' && (
        <SectionTitle variant={smMatch ? 'h500' : 'h400'} as="h3">
          {start.title}
        </SectionTitle>
      )}
      {start.type === 'tabs' && (
        <TabsWrapper>
          <Tabs {...start.tabsProps} />
        </TabsWrapper>
      )}
      <SectionSearchWrapper>
        {!isSearchInputOpen ? (
          <Button
            icon={<SvgActionSearch />}
            onClick={() => {
              setIsSearchInputOpen((isOpen) => !isOpen)
            }}
            variant="tertiary"
          />
        ) : (
          <SearchInput
            nodeStart={<Button icon={<SvgActionSearch />} variant="tertiary" />}
            size="medium"
            actionButton={{
              onClick: () => setIsSearchInputOpen(false),
              icon: <SvgActionClose />,
            }}
            placeholder="Search"
            type="search"
          />
        )}
      </SectionSearchWrapper>
      <ToggleButtonGroup options={['Newest', 'Oldest']} onChange={() => null} />
    </SectionHeaderWrapper>
  )
}
