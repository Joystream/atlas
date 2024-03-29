import { ReactElement } from 'react'

import { SvgActionChevronL, SvgActionNewTab } from '@/assets/icons'
import { OutputPill } from '@/components/OutputPill'
import { Text } from '@/components/Text'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  FirstColumn,
  HeaderButton,
  HeaderContainer,
  HeaderInnerContainer,
  Placeholder,
  SecondColumn,
  Wrapper,
} from './CrtPreviewLayout.styles'

type CrtPreviewViewProps = {
  mode: 'edit' | 'preview'
  videoTrailerComponent?: ReactElement
  benefitsComponent?: ReactElement
  aboutComponent?: ReactElement
}
export const CrtPreviewLayout = ({
  videoTrailerComponent = <Placeholder height={400}>Video trailer</Placeholder>,
  benefitsComponent = <Placeholder height={400}>Benefits</Placeholder>,
  aboutComponent = <Placeholder height={400}>About</Placeholder>,
  mode,
}: CrtPreviewViewProps) => {
  const lgMatch = useMediaMatch('lg')
  return (
    <Wrapper>
      <HeaderContainer>
        <SvgActionChevronL />
        <HeaderInnerContainer>
          <Text variant="h400" as="p">
            Token page preview
          </Text>
          <OutputPill handle={mode === 'edit' ? 'Edit mode' : 'Preview mode'} />
        </HeaderInnerContainer>
        {lgMatch && (
          <HeaderButton variant="tertiary" icon={<SvgActionNewTab />} iconPlacement="right">
            See your token
          </HeaderButton>
        )}
      </HeaderContainer>
      <FirstColumn>
        {videoTrailerComponent}
        {benefitsComponent}
        {aboutComponent}
      </FirstColumn>
      <SecondColumn>
        {/* these components are the same for each mode */}
        <Placeholder height={192}>Token details</Placeholder>
        <Placeholder height={248}>Token status</Placeholder>
        <Placeholder height={368}>Token holders</Placeholder>
      </SecondColumn>
    </Wrapper>
  )
}
