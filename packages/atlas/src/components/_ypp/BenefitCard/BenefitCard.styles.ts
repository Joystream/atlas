import styled from '@emotion/styled'

import pattern1 from '@/assets/illustrations/svgs/other-benefit-card-pattern-1.svg'
import pattern2 from '@/assets/illustrations/svgs/other-benefit-card-pattern-2.svg'
import pattern3 from '@/assets/illustrations/svgs/other-benefit-card-pattern-3.svg'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { LayoutGrid } from '@/components/LayoutGrid'
import { Button } from '@/components/_buttons/Button'
import { cVar, media, sizes } from '@/styles'

export type Variant = 'compact' | 'full'

export const Pattern = styled.div`
  position: relative;
  height: 72px;
  background-repeat: repeat-x;

  ::after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    width: 108px;
    height: 100%;
    background: linear-gradient(180deg, rgb(15 17 20 / 0) 0%, ${cVar('colorCoreNeutral900')} 100%);
  }

  ${media.sm} {
    width: 108px;
    height: unset;
    background-repeat: repeat-y;
    align-self: stretch;

    ::after {
      bottom: 0;
      left: 0;
      top: unset;
      right: unset;
      width: 100%;
      height: 56px;
      background: linear-gradient(180deg, rgb(15 17 20 / 0) 0%, ${cVar('colorCoreNeutral800')} 100%);
    }
  }
`

export const Wrapper = styled.div<{ variant: Variant }>`
  background-color: ${({ variant }) => cVar(variant === 'full' ? 'colorBackgroundMuted' : 'colorBackground')};
  width: 100%;
  display: grid;
  ${media.sm} {
    grid-template-columns: auto 1fr;
  }

  ${Pattern} {
    background-size: 144px;

    ${media.sm} {
      background-size: unset;
    }
  }

  /* the following nth-of-type pseudo classes sets different patterns depending on the BenefitCard order */

  &:nth-of-type(3n - 2) {
    ${Pattern} {
      background-image: url(${pattern1});
    }
  }

  &:nth-of-type(3n - 1) {
    ${Pattern} {
      background-image: url(${pattern2});
    }
  }

  &:nth-of-type(3n - 3) {
    ${Pattern} {
      background-image: url(${pattern3});
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

export const StyledList = styled.ul`
  padding-left: 0;
  counter-reset: list-number;
  display: grid;
  gap: ${sizes(2)};
  margin-top: ${sizes(4)};
  margin-bottom: 0;
`

export const StyledButton = styled(Button)`
  ${media.sm} {
    align-self: flex-end;
    margin-top: auto;
  }
`

export const StyledJoyTokenIcon = styled(JoyTokenIcon)`
  margin-right: ${({ size }) => sizes(size === 16 ? 1 : 2)};
`

export const ContenBox = styled(LayoutGrid)`
  padding: ${sizes(6)};
`
