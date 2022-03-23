import styled from '@emotion/styled'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router'
import useResizeObserver from 'use-resize-observer'

import { Text } from '@/components/Text'
import { SvgAlertsWarning24 } from '@/components/_icons'
import { JOYSTREAM_DISCORD_URL } from '@/config/urls'
import { cVar, sizes } from '@/styles'

export const OlympiaBanner: React.FC = () => {
  const { ref, height } = useResizeObserver({ box: 'border-box' })
  const { pathname, search } = useLocation()
  const isVisible = pathname.includes('studio') || pathname.includes('member/edit') || search.includes('loginStep')

  useEffect(() => {
    const root = document.documentElement
    if (isVisible) {
      root.style.setProperty('--size-banner-height', `${height || 0}px`)
    } else {
      root.style.setProperty('--size-banner-height', '0px')
    }
  }, [isVisible, height])

  return (
    <Banner isVisible={isVisible} ref={ref}>
      <Icon />
      <Info variant="t100">
        On March 23rd the Olympia testnet was launched. We expect the full migration process to take up to 7 days. Until
        then, Atlas will continue using the old Giza testnet. This means that any{' '}
        <b>new membership/content created in this app will be lost</b>. Head over to our{' '}
        <a href={JOYSTREAM_DISCORD_URL}>Discord</a> for support.
      </Info>
    </Banner>
  )
}

const Banner = styled.div<{ isVisible: boolean }>`
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
  padding: ${sizes(3)};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${cVar('colorCoreYellow200')};
  z-index: 999999;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
`

const Icon = styled(SvgAlertsWarning24)`
  min-width: 24px;

  path {
    fill: ${cVar('colorCoreRed500')};
  }
`

const Info = styled(Text)`
  color: ${cVar('colorCoreNeutral700')};
  margin-left: ${sizes(2)};

  b {
    color: ${cVar('colorCoreRed500')};
    word-break: keep-all;
  }

  a {
    color: ${cVar('colorCoreBlue500')};
    font-weight: 700;
    text-decoration: none;
  }
`
