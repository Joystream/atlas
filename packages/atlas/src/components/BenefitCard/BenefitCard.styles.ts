import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import smPattern from '@/components/_illustrations/svgs/benefit-card-pattern-sm-1.svg'
import xxsPattern from '@/components/_illustrations/svgs/benefit-card-pattern-xxs-1.svg'
import { cVar, media, sizes, square } from '@/styles'

export type Variant = 'compact' | 'full'

export const Wrapper = styled.div<{ variant: Variant }>`
  background-color: ${({ variant }) => cVar(variant === 'full' ? 'colorBackgroundMuted' : 'colorBackground')};

  ${media.sm} {
    display: flex;
  }
`

export const Pattern = styled.div`
  position: relative;
  height: 72px;
  background-image: url(${xxsPattern});
  background-repeat: repeat-x;

  ::after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    width: 108px;
    height: 100%;
    background: linear-gradient(90deg, rgb(15 17 20 / 0) 0%, ${cVar('colorCoreNeutral900')} 100%);
  }

  ${media.sm} {
    width: 108px;
    height: unset;
    background-image: url(${smPattern});
    background-repeat: repeat-y;
    align-self: stretch;

    ::after {
      bottom: 0;
      left: 0;
      top: unset;
      right: unset;
      width: 100%;
      height: 56px;
      background: linear-gradient(180deg, rgb(15 17 20 / 0) 0%, ${cVar('colorCoreNeutral900')} 100%);
    }
  }
`

export const Content = styled.div<{ isCompact: boolean }>`
  padding: ${sizes(4)};

  ${media.sm} {
    padding: ${sizes(8)};
    display: grid;
    gap: ${sizes(8)};
    grid-template-columns: 1fr auto;
    flex: 1;
    align-items: ${({ isCompact }) => (isCompact ? 'center' : 'unset')};
  }
`

export const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${sizes(6)};
`

export const StyledList = styled.ul`
  padding-left: 0;
  counter-reset: list-number;
  display: grid;
  gap: ${sizes(2)};
  margin-top: ${sizes(4)};
  margin-bottom: 0;
`

export const ListElement = styled(Text)`
  list-style: none;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: flex-start;
  gap: inherit;

  ::before {
    ${square('20px')};

    counter-increment: list-number;
    content: counter(list-number);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font: ${cVar('typographyDesktopT100')};
    background-color: ${cVar('colorBackgroundStrong')};
    border-radius: 50%;
    color: ${cVar('colorTextStrong')};
  }
`

export const StyledButton = styled(Button)`
  ${media.sm} {
    align-self: flex-end;
    margin-top: auto;
  }
`

export const ActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${sizes(4)};

  ${media.sm} {
    margin-top: 0;
    text-align: right;
  }
`

export const RewardWrapper = styled.div<{ isCompact: boolean }>`
  display: ${({ isCompact }) => (isCompact ? 'flex' : 'block')};
  text-align: ${({ isCompact }) => (!isCompact ? 'right' : 'left')};

  ${media.sm} {
    display: block;
    text-align: right;
  }
`

export const TokenRewardWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

export const StyledJoyTokenIcon = styled(JoyTokenIcon)`
  margin-right: ${({ size }) => sizes(size === 16 ? 1 : 2)};
`
